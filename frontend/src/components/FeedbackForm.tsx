import React, { useState } from "react";
import { useSubmitFeedback } from "../hooks/useQueries";
import { playBubblePop } from "../utils/sounds";
import { useToast } from "../hooks/useToast";

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

const FeedbackForm: React.FC = () => {
  const [authorName, setAuthorName] = useState("");
  const [year, setYear] = useState("");
  const [feedback, setFeedback] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { showToast } = useToast();

  const { mutate, isPending } = useSubmitFeedback();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!authorName.trim()) e.authorName = "Name is required.";
    if (!year) e.year = "Please select your year.";
    if (!feedback.trim()) e.feedback = "Feedback cannot be empty.";
    if (feedback.length > 500) e.feedback = "Feedback must be 500 characters or less.";
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
      { author: authorName.trim(), year, feedback: feedback.trim() },
      {
        onSuccess: () => {
          playBubblePop();
          showToast("🙏 Thank you for your feedback!", "success");
          setAuthorName("");
          setYear("");
          setFeedback("");
        },
        onError: () => {
          showToast("Failed to submit feedback. Please try again.", "error");
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Name */}
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: "oklch(0.38 0.06 48)" }}>
            Your Name *
          </label>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="e.g. Ananya Reddy"
            className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-colors"
            style={{
              background: "oklch(0.97 0.012 60)",
              border: `1.5px solid ${errors.authorName ? "oklch(0.55 0.18 25)" : "oklch(0.88 0.025 55)"}`,
              color: "oklch(0.30 0.04 50)",
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "oklch(0.62 0.10 42)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = errors.authorName ? "oklch(0.55 0.18 25)" : "oklch(0.88 0.025 55)"; }}
          />
          {errors.authorName && (
            <p className="text-xs mt-1" style={{ color: "oklch(0.55 0.18 25)" }}>{errors.authorName}</p>
          )}
        </div>

        {/* Year */}
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: "oklch(0.38 0.06 48)" }}>
            Year *
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
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          {errors.year && (
            <p className="text-xs mt-1" style={{ color: "oklch(0.55 0.18 25)" }}>{errors.year}</p>
          )}
        </div>
      </div>

      {/* Feedback */}
      <div>
        <label className="block text-xs font-semibold mb-1" style={{ color: "oklch(0.38 0.06 48)" }}>
          Your Feedback *
        </label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Share your thoughts about the platform, suggestions, or anything you'd like us to know…"
          rows={4}
          maxLength={500}
          className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-colors resize-none"
          style={{
            background: "oklch(0.97 0.012 60)",
            border: `1.5px solid ${errors.feedback ? "oklch(0.55 0.18 25)" : "oklch(0.88 0.025 55)"}`,
            color: "oklch(0.30 0.04 50)",
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "oklch(0.62 0.10 42)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = errors.feedback ? "oklch(0.55 0.18 25)" : "oklch(0.88 0.025 55)"; }}
        />
        <div className="flex justify-between items-center mt-0.5">
          {errors.feedback ? (
            <p className="text-xs" style={{ color: "oklch(0.55 0.18 25)" }}>{errors.feedback}</p>
          ) : <span />}
          <span className="text-xs" style={{ color: "oklch(0.62 0.04 50)" }}>
            {feedback.length}/500
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
            Submitting…
          </>
        ) : (
          "Submit Feedback 🙏"
        )}
      </button>
    </form>
  );
};

export default FeedbackForm;
