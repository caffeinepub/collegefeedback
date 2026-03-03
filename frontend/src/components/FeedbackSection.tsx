import React from 'react';
import { useFeedback } from '../hooks/useQueries';
import { MessageSquare } from 'lucide-react';

const YEAR_STYLES: Record<string, string> = {
  '1st Year': 'bg-violet-100 text-violet-700',
  '2nd Year': 'bg-violet-200 text-violet-800',
  '3rd Year': 'bg-neutral-100 text-neutral-700',
  '4th Year': 'bg-neutral-200 text-neutral-800',
};

function timeAgo(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function FeedbackSection() {
  const { data: entries, isLoading, isError } = useFeedback();

  if (isError) {
    return (
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-card text-center">
        <p className="text-neutral-400 text-sm">Feedback visible to admins only.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-card space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-3 bg-neutral-100 rounded-full w-1/3 mb-2" />
            <div className="h-3 bg-neutral-100 rounded-full w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-card text-center">
        <MessageSquare size={28} className="text-neutral-300 mx-auto mb-2" />
        <p className="text-neutral-400 text-sm">No feedback yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-card overflow-hidden">
      <div className="max-h-72 overflow-y-auto divide-y divide-neutral-100">
        {entries.map((entry, i) => {
          const yearStyle = YEAR_STYLES[entry.collegeYear] ?? 'bg-neutral-100 text-neutral-600';
          const initial = entry.authorName.charAt(0).toUpperCase();
          return (
            <div key={i} className="p-4 hover:bg-neutral-50 transition-colors">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <div className="w-7 h-7 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs font-bold">
                  {initial}
                </div>
                <span className="text-sm font-semibold text-neutral-800">{entry.authorName}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${yearStyle}`}>
                  {entry.collegeYear}
                </span>
                <span className="text-xs text-neutral-400 ml-auto">{timeAgo(entry.timestamp)}</span>
              </div>
              <p className="text-sm text-neutral-600 leading-relaxed">{entry.feedback}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
