import assert from "node:assert/strict";
import test from "node:test";
import {
  LeadApiError,
  LeadValidationError,
  createLead,
  getLeadEndpoint,
  normalizeLeadPayload,
  submitLeadWithFallback,
} from "../src/lib/api/leads.js";

test("normalizeLeadPayload canonicalizes aliases and removes empty optional values", () => {
  const payload = normalizeLeadPayload({
    name: "  Asha Mehta  ",
    mobile: "+91 98765-43210",
    from: "  Mumbai  ",
    to: "Pune",
    pickupDate: "2026-10-20",
    carName: "Innova Crysta",
    note: "  Four passengers  ",
    email: "",
  });

  assert.deepEqual(payload, {
    name: "Asha Mehta",
    phone: "9876543210",
    service: "Website Enquiry",
    source: "skg-website",
    formType: "general",
    pickup: "Mumbai",
    destination: "Pune",
    travelDate: "2026-10-20",
    vehiclePreference: "Innova Crysta",
    message: "Four passengers",
  });
});

test("normalizeLeadPayload supports FormData and explicit metadata", () => {
  const data = new FormData();
  data.set("name", "Ravi Kumar");
  data.set("phone", "09876543210");
  data.set("service", "Quick Quote");
  data.set("source", "campaign-page");
  data.set("formType", "quote");

  assert.deepEqual(normalizeLeadPayload(data), {
    name: "Ravi Kumar",
    phone: "9876543210",
    service: "Quick Quote",
    source: "campaign-page",
    formType: "quote",
  });
});

test("normalizeLeadPayload rejects missing names and invalid phone numbers", () => {
  assert.throws(
    () => normalizeLeadPayload({ name: "", phone: "123" }),
    (error) => {
      assert.ok(error instanceof LeadValidationError);
      assert.deepEqual(error.details.map((detail) => detail.field), ["name", "phone"]);
      return true;
    }
  );
});

test("getLeadEndpoint handles a trailing slash", () => {
  assert.equal(getLeadEndpoint("https://api.example.com/api/v1/"), "https://api.example.com/api/v1/public/leads");
});

test("createLead posts normalized JSON and returns the response data", async () => {
  let request;
  const fetchImpl = async (url, options) => {
    request = { url, options };
    return {
      ok: true,
      status: 201,
      async json() {
        return { data: { id: "lead-123", status: "New" } };
      },
    };
  };

  const lead = await createLead(
    { name: "Asha", mobile: "9876543210", from: "Mumbai", to: "Pune" },
    { apiBaseUrl: "https://api.example.com/api/v1", fetchImpl }
  );

  assert.deepEqual(lead, { id: "lead-123", status: "New" });
  assert.equal(request.url, "https://api.example.com/api/v1/public/leads");
  assert.equal(request.options.method, "POST");
  assert.equal(request.options.headers["Content-Type"], "application/json");
  assert.ok(request.options.signal instanceof AbortSignal);
  assert.deepEqual(JSON.parse(request.options.body), {
    name: "Asha",
    phone: "9876543210",
    service: "Website Enquiry",
    source: "skg-website",
    formType: "general",
    pickup: "Mumbai",
    destination: "Pune",
  });
});

test("createLead exposes backend validation details", async () => {
  const fetchImpl = async () => ({
    ok: false,
    status: 422,
    async json() {
      return {
        error: {
          code: "VALIDATION_ERROR",
          message: "Travel date is invalid.",
          details: [{ field: "travelDate" }],
        },
      };
    },
  });

  await assert.rejects(
    createLead(
      { name: "Asha", phone: "9876543210" },
      { apiBaseUrl: "https://api.example.com/api/v1", fetchImpl }
    ),
    (error) => {
      assert.ok(error instanceof LeadApiError);
      assert.equal(error.status, 422);
      assert.equal(error.code, "VALIDATION_ERROR");
      assert.deepEqual(error.details, [{ field: "travelDate" }]);
      return true;
    }
  );
});

test("submitLeadWithFallback converts network failures into a non-throwing result", async () => {
  const result = await submitLeadWithFallback(
    { name: "Asha", phone: "9876543210" },
    {
      apiBaseUrl: "https://api.example.com/api/v1",
      fetchImpl: async () => {
        throw new TypeError("offline");
      },
    }
  );

  assert.equal(result.ok, false);
  assert.equal(result.data, null);
  assert.ok(result.error instanceof LeadApiError);
  assert.equal(result.error.code, "LEAD_NETWORK_ERROR");
});

test("submitLeadWithFallback also preserves validation failures for the UI fallback", async () => {
  let requested = false;
  const result = await submitLeadWithFallback(
    { name: "", phone: "bad" },
    { fetchImpl: async () => { requested = true; } }
  );

  assert.equal(result.ok, false);
  assert.ok(result.error instanceof LeadValidationError);
  assert.equal(requested, false);
});

test("createLead times out stalled requests", async () => {
  const fetchImpl = async (_url, { signal }) => new Promise((resolve, reject) => {
    signal.addEventListener("abort", () => reject(signal.reason), { once: true });
  });

  await assert.rejects(
    createLead(
      { name: "Asha", phone: "9876543210" },
      { fetchImpl, timeoutMs: 5 }
    ),
    (error) => {
      assert.ok(error instanceof LeadApiError);
      assert.equal(error.code, "LEAD_TIMEOUT");
      return true;
    }
  );
});

