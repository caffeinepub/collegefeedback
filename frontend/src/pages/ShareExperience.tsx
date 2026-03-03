import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Send, ChevronDown } from 'lucide-react';
import { useCreatePost } from '../hooks/useQueries';
import { Category } from '../backend';
import YearSelectionModal from '../components/YearSelectionModal';
import { useYearSelection } from '../hooks/useYearSelection';
import { useToast } from '../hooks/useToast';
import { playBubblePop } from '../utils/sounds';

const CATEGORIES = [
  { key: Category.internships, label: '💼 Internships' },
  { key: Category.hackathons, label: '🏆 Hackathons' },
  { key: Category.courses, label: '📚 Courses' },
  { key: Category.general, label: '💬 General' },
];

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'] as const;
type YearOption = typeof YEARS[number];

export default function ShareExperience() {
  const navigate = useNavigate();
  const { year, hasSelected } = useYearSelection();
  const [showYearModal, setShowYearModal] = useState(!hasSelected);
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>(Category.general);
  const [selectedYear, setSelectedYear] = useState<YearOption>((year as YearOption) || '1st Year');
  const { mutateAsync: createPost, isPending } = useCreatePost();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      await createPost({
        content: content.trim(),
        authorYear: selectedYear,
        category: selectedCategory,
      });
      playBubblePop();
      showToast('Experience shared successfully! 🎉', 'success');
      setContent('');
      navigate({ to: '/' });
    } catch {
      showToast('Failed to share. Please try again.', 'error');
    }
  };

  return (
    <>
      {showYearModal && <YearSelectionModal onClose={() => setShowYearModal(false)} />}

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-heading font-black text-neutral-900 mb-2">
            Share Your <span className="italic text-violet-600">Experience</span>
          </h1>
          <p className="text-neutral-500">Help fellow students by sharing what you've learned.</p>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-3">Category</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      playBubblePop();
                      setSelectedCategory(key);
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                      selectedCategory === key
                        ? 'bg-violet-600 text-white border-violet-600'
                        : 'bg-white text-neutral-600 border-neutral-200 hover:border-violet-300 hover:text-violet-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">College Year</label>
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value as YearOption)}
                  className="w-full appearance-none bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-neutral-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 pr-10"
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">Your Experience</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share what you learned — an internship tip, hackathon advice, course recommendation, or general wisdom..."
                rows={6}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-neutral-800 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 resize-none placeholder:text-neutral-400"
              />
              <p className="text-xs text-neutral-400 mt-1 text-right">{content.length} characters</p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending || !content.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sharing...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Share Experience
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
