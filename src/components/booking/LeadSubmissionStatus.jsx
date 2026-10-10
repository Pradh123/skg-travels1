const toneClasses = {
  pending: "text-slate-600",
  success: "text-emerald-700",
  warning: "text-amber-700",
  error: "text-red-700",
};

export default function LeadSubmissionStatus({ status, className = "" }) {
  if (!status?.message) return null;

  return (
    <p
      role={status.phase === "error" ? "alert" : "status"}
      aria-live="polite"
      className={`text-sm ${toneClasses[status.phase] || toneClasses.pending} ${className}`.trim()}
    >
      {status.message}
    </p>
  );
}
