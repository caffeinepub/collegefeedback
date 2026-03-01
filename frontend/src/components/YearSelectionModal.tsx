import React, { useState } from "react";
import { useYearSelection, type CollegeYear } from "../hooks/useYearSelection";
import { playBubblePop } from "../utils/sounds";

const YEARS: CollegeYear[] = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

interface YearSelectionModalProps {
  onClose?: () => void;
}

const YearSelectionModal: React.FC<YearSelectionModalProps> = ({ onClose }) => {
  const { setYear, setCollegeName } = useYearSelection();
  const [collegeName, setCollegeNameLocal] = useState("");
  const [selectedYear, setSelectedYear] = useState<CollegeYear | null>(null);
  const [error, setError] = useState("");

  const handleYearSelect = (year: CollegeYear) => {
    playBubblePop();
    setSelectedYear(year);
    setError("");
  };

  const handleSubmit = () => {
    if (!selectedYear) {
      setError("Please select your year.");
      return;
    }
    playBubblePop();
    setYear(selectedYear);
    setCollegeName(collegeName);
    onClose?.();
  };

  return (
    /* Full-screen overlay */
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "oklch(0.28 0.04 50 / 0.55)", backdropFilter: "blur(6px)" }}
    >
      <div
        className="w-full max-w-md rounded-2xl shadow-2xl p-8 flex flex-col gap-6"
        style={{
          background: "oklch(0.98 0.018 60)",
          border: "1.5px solid oklch(0.88 0.025 55)",
        }}
      >
        {/* Brand heading */}
        <div className="text-center">
          <h1
            className="font-brand text-3xl mb-1"
            style={{ color: "oklch(0.45 0.10 42)" }}
          >
            Memu నేర్చుకున్నవి
          </h1>
          <p className="text-sm" style={{ color: "oklch(0.52 0.05 50)" }}>
            Share what you've learned in college
          </p>
        </div>

        {/* Year selection */}
        <div>
          <p
            className="text-sm font-semibold mb-3 text-center"
            style={{ color: "oklch(0.35 0.06 48)" }}
          >
            Which year are you in?
          </p>
          <div className="grid grid-cols-2 gap-3">
            {YEARS.map((year) => (
              <button
                key={year}
                onClick={() => handleYearSelect(year)}
                className="py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 border-2"
                style={
                  selectedYear === year
                    ? {
                        background: "oklch(0.55 0.12 42)",
                        color: "oklch(0.99 0.005 58)",
                        borderColor: "oklch(0.55 0.12 42)",
                        boxShadow: "0 4px 12px oklch(0.55 0.12 42 / 0.3)",
                      }
                    : {
                        background: "oklch(0.95 0.020 58)",
                        color: "oklch(0.38 0.07 48)",
                        borderColor: "oklch(0.88 0.025 55)",
                      }
                }
              >
                {year}
              </button>
            ))}
          </div>
          {error && (
            <p className="text-xs mt-2 text-center" style={{ color: "oklch(0.55 0.18 25)" }}>
              {error}
            </p>
          )}
        </div>

        {/* College name (optional) */}
        <div>
          <label
            className="block text-sm font-medium mb-1.5"
            style={{ color: "oklch(0.38 0.06 48)" }}
          >
            College name{" "}
            <span style={{ color: "oklch(0.62 0.04 50)" }}>(optional)</span>
          </label>
          <input
            type="text"
            value={collegeName}
            onChange={(e) => setCollegeNameLocal(e.target.value)}
            placeholder="e.g. JNTU, Osmania University…"
            className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-colors"
            style={{
              background: "oklch(0.96 0.015 58)",
              border: "1.5px solid oklch(0.88 0.025 55)",
              color: "oklch(0.30 0.04 50)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "oklch(0.62 0.10 42)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "oklch(0.88 0.025 55)";
            }}
          />
        </div>

        {/* Motivational quote */}
        <p
          className="text-center text-sm italic"
          style={{ color: "oklch(0.55 0.06 50)" }}
        >
          "నేర్చుకోవడం ఆగిపోకు — మీ అనుభవాలు ఇతరులకు దారి చూపిస్తాయి"
        </p>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl text-sm font-bold transition-all duration-200"
          style={{
            background: "oklch(0.55 0.12 42)",
            color: "oklch(0.99 0.005 58)",
            boxShadow: "0 4px 14px oklch(0.55 0.12 42 / 0.35)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "oklch(0.50 0.13 42)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "oklch(0.55 0.12 42)";
          }}
        >
          Let's Go! 🚀
        </button>
      </div>
    </div>
  );
};

export default YearSelectionModal;
