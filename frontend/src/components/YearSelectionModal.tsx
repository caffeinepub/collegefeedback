import React from 'react';
import { useYearSelection } from '../hooks/useYearSelection';
import type { CollegeYear } from '../hooks/useYearSelection';
import { X } from 'lucide-react';

const YEAR_CARDS: { year: CollegeYear; emoji: string; subtitle: string; color: string }[] = [
  {
    year: '1st Year',
    emoji: '🌱',
    subtitle: 'Just getting started',
    color: 'from-emerald-50 to-emerald-100 border-emerald-200 hover:border-emerald-400',
  },
  {
    year: '2nd Year',
    emoji: '📚',
    subtitle: 'Building foundations',
    color: 'from-sky-50 to-sky-100 border-sky-200 hover:border-sky-400',
  },
  {
    year: '3rd Year',
    emoji: '🚀',
    subtitle: 'Leveling up fast',
    color: 'from-violet-50 to-violet-100 border-violet-200 hover:border-violet-400',
  },
  {
    year: '4th Year',
    emoji: '🎓',
    subtitle: 'Almost there!',
    color: 'from-amber-50 to-amber-100 border-amber-200 hover:border-amber-400',
  },
];

interface YearSelectionModalProps {
  onClose: () => void;
}

export default function YearSelectionModal({ onClose }: YearSelectionModalProps) {
  const { setYear, year: currentYear } = useYearSelection();

  const handleSelect = (y: CollegeYear) => {
    setYear(y);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl border border-neutral-200 p-8 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="text-center mb-7">
          <div className="text-4xl mb-3">🎓</div>
          <h2 className="text-2xl font-heading font-black text-neutral-900 mb-1.5">
            Which year are you in?
          </h2>
          <p className="text-neutral-500 text-sm leading-relaxed">
            We'll show you the most relevant tips and experiences for your college year.
          </p>
        </div>

        {/* Year option cards */}
        <div className="grid grid-cols-2 gap-3">
          {YEAR_CARDS.map(({ year, emoji, subtitle, color }) => {
            const isSelected = currentYear === year;
            return (
              <button
                key={year}
                onClick={() => handleSelect(year)}
                className={`
                  relative flex flex-col items-center justify-center gap-1.5
                  px-4 py-5 rounded-2xl border-2 bg-gradient-to-br
                  font-semibold transition-all duration-200 group
                  ${color}
                  ${isSelected
                    ? 'border-violet-600 bg-gradient-to-br from-violet-50 to-violet-100 ring-2 ring-violet-300 ring-offset-1'
                    : ''
                  }
                  hover:scale-[1.03] hover:shadow-md active:scale-[0.98]
                `}
              >
                {isSelected && (
                  <span className="absolute top-2 right-2 w-4 h-4 bg-violet-600 rounded-full flex items-center justify-center">
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1.5 4L3 5.5L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                )}
                <span className="text-3xl">{emoji}</span>
                <span className={`text-base font-black ${isSelected ? 'text-violet-700' : 'text-neutral-800'}`}>
                  {year}
                </span>
                <span className={`text-xs font-medium ${isSelected ? 'text-violet-500' : 'text-neutral-500'}`}>
                  {subtitle}
                </span>
              </button>
            );
          })}
        </div>

        {/* Skip */}
        <div className="mt-5 text-center">
          <button
            onClick={onClose}
            className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors underline-offset-2 hover:underline"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
