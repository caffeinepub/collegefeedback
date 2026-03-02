import React, { useState } from "react";
import { useRegisterStudent } from "../hooks/useQueries";
import { playBubblePop } from "../utils/sounds";
import { useToast } from "../hooks/useToast";

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

interface StudentRegistrationFormProps {
  onSuccess?: () => void;
}

const StudentRegistrationForm: React.FC<StudentRegistrationFormProps> = ({ onSuccess }) => {
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [college, setCollege] = useState("");
  const [available, setAvailable] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { showToast } = useToast();

  const { mutate, isPending } = useRegisterStudent();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required.";
    if (!year) e.year = "Please select your year.";
    if (!college.trim()) e.college = "College name is required.";
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
      { name: name.trim(), year, college: college.trim(), available },
      {
        onSuccess: () => {
          playBubblePop();
          showToast(
            available
              ? "🎉 You're now listed as available for DMs!"
              : "✅ Profile saved successfully!",
            "success"
          );
          onSuccess?.();
        },
        onError: () => {
          showToast("Failed to save profile. Please try again.", "error");
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Name */}
      <div>
        <label className="block text-xs font-semibold mb-1" style={{ color: "oklch(0.38 0.06 48)" }}>
          Your Name *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Priya Sharma"
          className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-colors"
          style={{
            background: "oklch(0.97 0.012 60)",
            border: `1.5px solid ${errors.name ? "oklch(0.55 0.18 25)" : "oklch(0.88 0.025 55)"}`,
            color: "oklch(0.30 0.04 50)",
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "oklch(0.62 0.10 42)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = errors.name ? "oklch(0.55 0.18 25)" : "oklch(0.88 0.025 55)"; }}
        />
        {errors.name && (
          <p className="text-xs mt-1" style={{ color: "oklch(0.55 0.18 25)" }}>{errors.name}</p>
        )}
      </div>

      {/* Year */}
      <div>
        <label className="block text-xs font-semibold mb-1" style={{ color: "oklch(0.38 0.06 48)" }}>
          College Year *
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

      {/* College */}
      <div>
        <label className="block text-xs font-semibold mb-1" style={{ color: "oklch(0.38 0.06 48)" }}>
          College Name *
        </label>
        <input
          type="text"
          value={college}
          onChange={(e) => setCollege(e.target.value)}
          placeholder="e.g. JNTU Hyderabad"
          className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-colors"
          style={{
            background: "oklch(0.97 0.012 60)",
            border: `1.5px solid ${errors.college ? "oklch(0.55 0.18 25)" : "oklch(0.88 0.025 55)"}`,
            color: "oklch(0.30 0.04 50)",
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "oklch(0.62 0.10 42)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = errors.college ? "oklch(0.55 0.18 25)" : "oklch(0.88 0.025 55)"; }}
        />
        {errors.college && (
          <p className="text-xs mt-1" style={{ color: "oklch(0.55 0.18 25)" }}>{errors.college}</p>
        )}
      </div>

      {/* Availability toggle */}
      <div
        className="flex items-center justify-between px-3 py-2.5 rounded-lg"
        style={{
          background: "oklch(0.95 0.025 58)",
          border: "1px solid oklch(0.88 0.025 55)",
        }}
      >
        <div>
          <p className="text-sm font-semibold" style={{ color: "oklch(0.35 0.06 48)" }}>
            Available for DMs
          </p>
          <p className="text-xs" style={{ color: "oklch(0.55 0.04 50)" }}>
            Let other students message you directly
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAvailable(!available)}
          className="relative w-11 h-6 rounded-full transition-all duration-200 flex-shrink-0"
          style={{
            background: available ? "oklch(0.55 0.12 42)" : "oklch(0.78 0.04 52)",
          }}
          aria-checked={available}
          role="switch"
        >
          <span
            className="absolute top-0.5 w-5 h-5 rounded-full transition-all duration-200"
            style={{
              background: "oklch(0.99 0.005 58)",
              left: available ? "calc(100% - 1.375rem)" : "0.125rem",
              boxShadow: "0 1px 3px oklch(0.30 0.04 50 / 0.3)",
            }}
          />
        </button>
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
            Saving…
          </>
        ) : (
          "Save Profile 🎓"
        )}
      </button>
    </form>
  );
};

export default StudentRegistrationForm;
