import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useSubmitFeedback } from '../hooks/useQueries';
import { useToast } from '../hooks/useToast';

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

export default function FeedbackForm() {
  const [name, setName] = useState('');
  const [year, setYear] = useState('1st Year');
  const [feedback, setFeedback] = useState('');
  const { mutateAsync: submitFeedback, isPending } = useSubmitFeedback();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !feedback.trim()) return;
    try {
      await submitFeedback({ author: name.trim(), year, feedback: feedback.trim() });
      showToast('Feedback submitted! Thank you 🙏', 'success');
      setName('');
      setFeedback('');
    } catch {
      showToast('Failed to submit feedback. Please try again.', 'error');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-card">
      <h3 className="font-heading font-bold text-neutral-900 mb-4">Share Your Feedback</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 placeholder:text-neutral-400"
        />
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400"
        >
          {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <textarea
          placeholder="Your feedback about the platform (max 500 chars)"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value.slice(0, 500))}
          rows={4}
          className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 resize-none placeholder:text-neutral-400"
        />
        <button
          type="submit"
          disabled={isPending || !name.trim() || !feedback.trim()}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 disabled:opacity-50 transition-colors"
        >
          {isPending ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send size={14} />
          )}
          Submit Feedback
        </button>
      </form>
    </div>
  );
}
