const DEFAULT_API_BASE_URL = "https://skg-backenf.onrender.com/api/v1";
const DEFAULT_TIMEOUT_MS = 7000;

const cleanText = (value) => {
  if (value === undefined || value === null) return "";
  return String(value).trim();
};

const readValue = (input, aliases) => {
  for (const alias of aliases) {
    const value = typeof input?.get === "function" ? input.get(alias) : input?.[alias];
    if (value !== undefined && value !== null && cleanText(value)) return value;
  }
  return "";
};

function normalizePhone(value) {
  let digits = cleanText(value).replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return digits;
}

function addOptional(payload, key, value) {
  const normalized = cleanText(value);
  if (normalized) payload[key] = normalized;
}

export class LeadValidationError extends Error {
  constructor(message, details = []) {
    super(message);
    this.name = "LeadValidationError";
    this.code = "LEAD_VALIDATION_ERROR";
    this.details = details;
  }
}

export class LeadApiError extends Error {
  constructor(message, { status = 0, code = "LEAD_API_ERROR", details = [], cause } = {}) {
    super(message, cause ? { cause } : undefined);
    this.name = "LeadApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function normalizeLeadPayload(input = {}) {
  const name = cleanText(readValue(input, ["name"]));
  const phone = normalizePhone(readValue(input, ["phone", "mobile"]));
  const errors = [];

  if (!name) errors.push({ field: "name", message: "Name is required." });
  if (name.length > 120) errors.push({ field: "name", message: "Name must be 120 characters or fewer." });
  if (!/^\d{10}$/.test(phone)) {
    errors.push({ field: "phone", message: "Enter a valid 10-digit Indian mobile number." });
  }

  if (errors.length) {
    throw new LeadValidationError("Please check the lead details and try again.", errors);
  }

  const payload = {
    name,
    phone,
    service: cleanText(readValue(input, ["service"])) || "Website Enquiry",
    source: cleanText(readValue(input, ["source"])) || "skg-website",
    formType: cleanText(readValue(input, ["formType"])) || "general",
  };

  addOptional(payload, "email", readValue(input, ["email"]));
  addOptional(payload, "pickup", readValue(input, ["pickup", "from"]));
  addOptional(payload, "destination", readValue(input, ["destination", "to"]));
  addOptional(payload, "travelDate", readValue(input, ["travelDate", "pickupDate", "date"]));
  addOptional(payload, "returnDate", readValue(input, ["returnDate"]));
  addOptional(payload, "tripType", readValue(input, ["tripType"]));
  addOptional(payload, "passengers", readValue(input, ["passengers"]));
  addOptional(payload, "vehiclePreference", readValue(input, ["vehiclePreference", "carName"]));
  addOptional(payload, "message", readValue(input, ["message", "note"]));

  return payload;
}

export function getLeadEndpoint(apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_BASE_URL) {
  return `${cleanText(apiBaseUrl).replace(/\/+$/, "")}/public/leads`;
}

async function parseResponseBody(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function requestSignal(signal, timeoutMs) {
  const controller = new AbortController();
  const abortFromParent = () => controller.abort(signal?.reason);
  const timer = setTimeout(() => controller.abort(new Error("Lead request timed out.")), timeoutMs);

  if (signal?.aborted) abortFromParent();
  else signal?.addEventListener("abort", abortFromParent, { once: true });

  return {
    signal: controller.signal,
    cleanup() {
      clearTimeout(timer);
      signal?.removeEventListener("abort", abortFromParent);
    },
  };
}

export async function createLead(input, options = {}) {
  const payload = normalizeLeadPayload(input);
  const fetchImpl = options.fetchImpl || globalThis.fetch;
  if (typeof fetchImpl !== "function") {
    throw new LeadApiError("Lead service is unavailable in this browser.");
  }

  const timeoutMs = Number.isFinite(options.timeoutMs) ? options.timeoutMs : DEFAULT_TIMEOUT_MS;
  const request = requestSignal(options.signal, timeoutMs);

  try {
    const response = await fetchImpl(getLeadEndpoint(options.apiBaseUrl), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: request.signal,
    });
    const body = await parseResponseBody(response);

    if (!response.ok) {
      throw new LeadApiError(body?.error?.message || "The lead could not be saved.", {
        status: response.status,
        code: body?.error?.code || "LEAD_API_ERROR",
        details: body?.error?.details || [],
      });
    }

    return body?.data ?? body;
  } catch (error) {
    if (error instanceof LeadApiError) throw error;
    throw new LeadApiError(
      request.signal.aborted ? "The lead service took too long to respond." : "The lead service is temporarily unavailable.",
      { code: request.signal.aborted ? "LEAD_TIMEOUT" : "LEAD_NETWORK_ERROR", cause: error }
    );
  } finally {
    request.cleanup();
  }
}

export async function submitLeadWithFallback(input, options = {}) {
  try {
    return { ok: true, data: await createLead(input, options), error: null };
  } catch (error) {
    return { ok: false, data: null, error };
  }
}

