import React, { useState } from "react";
import { useSubmitCollegeConnect } from "../hooks/useQueries";
import { playBubblePop } from "../utils/sounds";
import { useToast } from "../hooks/useToast";

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

const CollegeConnectForm: React.FC = () => {
  const [collegeName, setCollegeName] = useState("");
  const [year, setYear] = useState("");
  const [tip, setTip] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useToast();

  const { mutate, isPending } = useSubmitCollegeConnect();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!collegeName.trim()) e.collegeName = "College name is required.";
    if (!year) e.year = "Please select your year.";
    if (!tip.trim()) e.tip = "Tip cannot be empty.";
    if (tip.length > 200) e.tip = "Tip must be 200 characters or less.";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      showToast("Please fix the errors before submitting.", "error");
      return;
    }
    setErrors({});
    mutate(
      { collegeName: collegeName.trim(), year, tip: tip.trim() },
      {
        onSuccess: () => {
          playBubblePop();
          showToast("🤝 Tip shared successfully!", "success");
          setSubmitted(true);
          setCollegeName("");
          setYear("");
          setTip("");
          setTimeout(() => setSubmitted(false), 3000);
        },
        onError: () => {
          showToast("Failed to share tip. Please try again.", "error");
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {submitted && (
        <div
          className="text-sm px-3 py-2 rounded-lg font-medium"
          style={{
            background: "oklch(0.92 0.06 145)",
            color: "oklch(0.35 0.10 145)",
            border: "1px solid oklch(0.78 0.08 145)",
          }}
        >
          ✅ Tip shared successfully!
        </div>
      )}

      {/* College Name */}
      <div>
        <label
          className="block text-xs font-semibold mb-1"
          style={{ color: "oklch(0.38 0.06 48)" }}
        >
          College Name
        </label>
        <input
          type="text"
          value={collegeName}
          onChange={(e) => setCollegeName(e.target.value)}
          placeholder="e.g. JNTU Hyderabad"
          className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-colors"
          style={{
            background: "oklch(0.97 0.012 60)",
            border: `1.5px solid ${errors.collegeName ? "oklch(0.55 0.18 25)" : "oklch(0.88 0.025 55)"}`,
            color: "oklch(0.30 0.04 50)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "oklch(0.62 0.10 42)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = errors.collegeName
              ? "oklch(0.55 0.18 25)"
              : "oklch(0.88 0.025 55)";
          }}
        />
        {errors.collegeName && (
          <p className="text-xs mt-1" style={{ color: "oklch(0.55 0.18 25)" }}>
            {errors.collegeName}
          </p>
        )}
      </div>

      {/* Year */}
      <div>
        <label
          className="block text-xs font-semibold mb-1"
          style={{ color: "oklch(0.38 0.06 48)" }}
        >
          Year
        </label>
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-colors"
          style={{
            background: "oklch(0.97 0.012 60)",
            border: `1.5px solid ${errors.year ? "oklch(0.55 0.18 25)" : "oklch(0.88 0.025 55)"}`,
            color: year ? "oklch(0.30 0.04 50)" : "oklch(0.62 0.04 50)",
          }}
        >
          <option value="">Select year…</option>
          {YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        {errors.year && (
          <p className="text-xs mt-1" style={{ color: "oklch(0.55 0.18 25)" }}>
            {errors.year}
          </p>
        )}
      </div>

      {/* Tip */}
      <div>
        <label
          className="block text-xs font-semibold mb-1"
          style={{ color: "oklch(0.38 0.06 48)" }}
        >
          Your Tip
        </label>
        <textarea
          value={tip}
          onChange={(e) => setTip(e.target.value)}
          placeholder="Share a tip for students at other colleges…"
          rows={3}
          maxLength={200}
          className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-colors resize-none"
          style={{
            background: "oklch(0.97 0.012 60)",
            border: `1.5px solid ${errors.tip ? "oklch(0.55 0.18 25)" : "oklch(0.88 0.025 55)"}`,
            color: "oklch(0.30 0.04 50)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "oklch(0.62 0.10 42)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = errors.tip
              ? "oklch(0.55 0.18 25)"
              : "oklch(0.88 0.025 55)";
          }}
        />
        <div className="flex justify-between items-center mt-0.5">
          {errors.tip ? (
            <p className="text-xs" style={{ color: "oklch(0.55 0.18 25)" }}>
              {errors.tip}
            </p>
          ) : (
            <span />
          )}
          <span className="text-xs" style={{ color: "oklch(0.62 0.04 50)" }}>
            {tip.length}/200
          </span>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2"
        style={{
          background: isPending ? "oklch(0.75 0.06 52)" : "oklch(0.55 0.12 42)",
          color: "oklch(0.99 0.005 58)",
          cursor: isPending ? "not-allowed" : "pointer",
        }}
      >
        {isPending ? (
          <>
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Sharing…
          </>
        ) : (
          "Share Tip 🤝"
        )}
      </button>
    </form>
  );
};

export default CollegeConnectForm;
