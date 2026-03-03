import React from 'react';
import { useGetCollegeConnects } from '../hooks/useQueries';
import { GraduationCap } from 'lucide-react';

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

export default function CollegeConnectList() {
  const { data: connects, isLoading } = useGetCollegeConnects();

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

  if (!connects || connects.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-card text-center">
        <GraduationCap size={28} className="text-neutral-300 mx-auto mb-2" />
        <p className="text-neutral-400 text-sm">No college tips yet. Be the first!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-card overflow-hidden">
      <div className="max-h-72 overflow-y-auto divide-y divide-neutral-100">
        {connects.map((c) => {
          const yearStyle = YEAR_STYLES[c.year] ?? 'bg-neutral-100 text-neutral-600';
          return (
            <div key={String(c.id)} className="p-4 hover:bg-neutral-50 transition-colors">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-sm font-semibold text-neutral-800">{c.collegeName}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${yearStyle}`}>
                  {c.year}
                </span>
                <span className="text-xs text-neutral-400 ml-auto">{timeAgo(c.createdAt)}</span>
              </div>
              <p className="text-sm text-neutral-600 leading-relaxed">{c.tip}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
