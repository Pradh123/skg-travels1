"use client";

import { useCallback, useState } from "react";
import { createLead } from "@/lib/api/leads";

const idleStatus = { phase: "idle", message: "" };

export default function useLeadSubmission() {
  const [status, setStatus] = useState(idleStatus);

  const submitLead = useCallback(async (payload) => {
    setStatus({ phase: "pending", message: "Saving your enquiry..." });
    try {
      const data = await createLead(payload);
      setStatus({
        phase: "success",
        message: "Enquiry submitted successfully. Our team will contact you shortly.",
      });
      return { ok: true, data, error: null };
    } catch (error) {
      setStatus({
        phase: "error",
        message:
          error.code === "LEAD_VALIDATION_ERROR" || error.status === 422
            ? error.message
            : "Your enquiry could not be submitted. Please try again.",
      });
      return { ok: false, data: null, error };
    }
  }, []);

  return {
    isSubmitting: status.phase === "pending",
    status,
    submitLead,
    clearStatus: () => setStatus(idleStatus),
  };
}
