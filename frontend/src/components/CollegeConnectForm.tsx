import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useSubmitCollegeConnect } from '../hooks/useQueries';
import { useToast } from '../hooks/useToast';
import { playBubblePop } from '../utils/sounds';

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

export default function CollegeConnectForm() {
  const [collegeName, setCollegeName] = useState('');
  const [year, setYear] = useState('1st Year');
  const [tip, setTip] = useState('');
  const { mutateAsync: submitConnect, isPending } = useSubmitCollegeConnect();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collegeName.trim() || !tip.trim()) return;
    try {
      await submitConnect({ collegeName: collegeName.trim(), year, tip: tip.trim() });
      playBubblePop();
      showToast('College tip shared! 🎓', 'success');
      setCollegeName('');
      setTip('');
    } catch {
      showToast('Failed to submit. Please try again.', 'error');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-card">
      <h3 className="font-heading font-bold text-neutral-900 mb-4">Share a College Tip</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="College name"
          value={collegeName}
          onChange={(e) => setCollegeName(e.target.value)}
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
          placeholder="Your tip (max 200 chars)"
          value={tip}
          onChange={(e) => setTip(e.target.value.slice(0, 200))}
          rows={3}
          className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 resize-none placeholder:text-neutral-400"
        />
        <button
          type="submit"
          disabled={isPending || !collegeName.trim() || !tip.trim()}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 disabled:opacity-50 transition-colors"
        >
          {isPending ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send size={14} />
          )}
          Share Tip
        </button>
      </form>
    </div>
  );
}
