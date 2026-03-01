import React, { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useCreatePost } from "../hooks/useQueries";
import { useYearSelection } from "../hooks/useYearSelection";
import YearSelectionModal from "../components/YearSelectionModal";
import { Category } from "../backend";
import { playBubblePop, playTypingTick } from "../utils/sounds";

const CATEGORIES = [
  { value: Category.internships, label: "💼 Internships" },
  { value: Category.hackathons, label: "⚡ Hackathons" },
  { value: Category.courses, label: "📚 Courses" },
  { value: Category.general, label: "💬 General" },
];

const MAX_CHARS = 1000;

const ShareExperience: React.FC = () => {
  const navigate = useNavigate();
  // useYearSelection returns { year, hasSelected, setYear, ... }
  const { year, hasSelected } = useYearSelection();
  const [showYearModal, setShowYearModal] = useState(!hasSelected);

  const [category, setCategory] = useState<Category>(Category.general);
  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate, isPending } = useCreatePost();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!content.trim()) e.content = "Please write something before sharing.";
    if (content.length > MAX_CHARS) e.content = `Max ${MAX_CHARS} characters allowed.`;
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    mutate(
      {
        content: content.trim(),
        authorYear: year ?? "Unknown",
        category,
      },
      {
        onSuccess: () => {
          playBubblePop();
          setSubmitted(true);
          setContent("");
        },
      }
    );
  };

  if (showYearModal) {
    return (
      <YearSelectionModal
        onClose={() => setShowYearModal(false)}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1
        className="font-heading text-2xl font-bold mb-2"
        style={{ color: "oklch(0.35 0.08 48)" }}
      >
        Share Your Experience ✍️
      </h1>
      <p className="text-sm mb-6" style={{ color: "oklch(0.52 0.05 50)" }}>
        Help fellow students by sharing what you've learned.
      </p>

      {submitted ? (
        <div
          className="rounded-2xl border p-8 text-center"
          style={{
            background: "oklch(0.96 0.025 58)",
            borderColor: "oklch(0.88 0.025 55)",
          }}
        >
          <p className="text-4xl mb-3">🎉</p>
          <p
            className="text-lg font-bold mb-1"
            style={{ color: "oklch(0.38 0.07 48)" }}
          >
            Experience Shared!
          </p>
          <p className="text-sm mb-5" style={{ color: "oklch(0.52 0.05 50)" }}>
            Your experience has been posted to the feed.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => setSubmitted(false)}
              className="px-4 py-2 rounded-full text-sm font-semibold border transition-all"
              style={{
                background: "oklch(0.97 0.012 60)",
                color: "oklch(0.42 0.06 50)",
                borderColor: "oklch(0.88 0.025 55)",
              }}
            >
              Share Another
            </button>
            <button
              onClick={() => navigate({ to: "/" })}
              className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
              style={{
                background: "oklch(0.55 0.12 42)",
                color: "oklch(0.99 0.005 58)",
              }}
            >
              Go to Feed →
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border p-6 flex flex-col gap-5"
          style={{
            background: "oklch(0.98 0.015 60)",
            borderColor: "oklch(0.88 0.025 55)",
          }}
        >
          {/* Category */}
          <div>
            <label
              className="block text-sm font-semibold mb-2"
              style={{ color: "oklch(0.38 0.06 48)" }}
            >
              Category
            </label>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className="px-3 py-1.5 rounded-full text-sm font-semibold border transition-all"
                  style={
                    category === cat.value
                      ? {
                          background: "oklch(0.55 0.12 42)",
                          color: "oklch(0.99 0.005 58)",
                          borderColor: "oklch(0.55 0.12 42)",
                        }
                      : {
                          background: "oklch(0.96 0.015 58)",
                          color: "oklch(0.42 0.06 50)",
                          borderColor: "oklch(0.88 0.025 55)",
                        }
                  }
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div>
            <label
              className="block text-sm font-semibold mb-2"
              style={{ color: "oklch(0.38 0.06 48)" }}
            >
              Your Experience
            </label>
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                playTypingTick();
              }}
              placeholder="Share what you learned — an internship tip, a hackathon story, a course recommendation…"
              rows={6}
              maxLength={MAX_CHARS}
              className="w-full px-4 py-3 rounded-xl text-sm leading-relaxed outline-none transition-colors resize-none"
              style={{
                background: "oklch(0.97 0.012 60)",
                border: `1.5px solid ${errors.content ? "oklch(0.55 0.18 25)" : "oklch(0.88 0.025 55)"}`,
                color: "oklch(0.30 0.04 50)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "oklch(0.62 0.10 42)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = errors.content
                  ? "oklch(0.55 0.18 25)"
                  : "oklch(0.88 0.025 55)";
              }}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.content ? (
                <p className="text-xs" style={{ color: "oklch(0.55 0.18 25)" }}>
                  {errors.content}
                </p>
              ) : (
                <span />
              )}
              <span
                className="text-xs"
                style={{
                  color:
                    content.length > MAX_CHARS * 0.9
                      ? "oklch(0.55 0.18 25)"
                      : "oklch(0.62 0.04 50)",
                }}
              >
                {content.length}/{MAX_CHARS}
              </span>
            </div>
          </div>

          {/* Year display */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
            style={{
              background: "oklch(0.93 0.025 55)",
              color: "oklch(0.42 0.06 50)",
            }}
          >
            <span>📅</span>
            <span>
              Posting as <strong>{year ?? "Unknown"}</strong>
            </span>
            <button
              type="button"
              onClick={() => setShowYearModal(true)}
              className="ml-auto text-xs underline"
              style={{ color: "oklch(0.50 0.08 48)" }}
            >
              Change
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2"
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
              "Share Experience 🚀"
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default ShareExperience;
