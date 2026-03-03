import React from 'react';
import { ChatMessage } from '../backend';

interface ChatMessageCardProps {
  message: ChatMessage;
}

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

export default function ChatMessageCard({ message }: ChatMessageCardProps) {
  const yearStyle = YEAR_STYLES[message.collegeYear] ?? 'bg-neutral-100 text-neutral-600';
  const initial = message.authorName.charAt(0).toUpperCase();

  return (
    <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
        {initial}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-sm font-semibold text-neutral-800">{message.authorName}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${yearStyle}`}>
            {message.collegeYear}
          </span>
          <span className="text-xs text-neutral-400 ml-auto">{timeAgo(message.timestamp)}</span>
        </div>
        <p className="text-sm text-neutral-700 leading-relaxed">{message.message}</p>
      </div>
    </div>
  );
}
