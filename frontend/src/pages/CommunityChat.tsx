import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { useChatMessages, usePostChatMessage } from '../hooks/useQueries';
import ChatMessageCard from '../components/ChatMessageCard';

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

export default function CommunityChat() {
  const { data: messages, isLoading } = useChatMessages();
  const { mutateAsync: postMessage, isPending } = usePostChatMessage();
  const [name, setName] = useState('');
  const [year, setYear] = useState('1st Year');
  const [message, setMessage] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    await postMessage({ author: name.trim(), year, message: message.trim() });
    setMessage('');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-heading font-black text-neutral-900 mb-2">
          <span className="italic text-violet-600">Community</span> Chat
        </h1>
        <p className="text-neutral-500">A public space to connect, ask, and share with fellow students.</p>
      </div>

      {/* Messages */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-card mb-4 overflow-hidden">
        <div className="h-[420px] overflow-y-auto p-4 space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-6 h-6 border-2 border-violet-300 border-t-violet-600 rounded-full animate-spin" />
            </div>
          ) : !messages || messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <MessageCircle size={32} className="text-neutral-300 mb-2" />
              <p className="text-neutral-400 font-medium">No messages yet.</p>
              <p className="text-neutral-300 text-sm">Be the first to say something!</p>
            </div>
          ) : (
            messages.map((msg, i) => <ChatMessageCard key={i} message={msg} />)
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Post form */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-card">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 placeholder:text-neutral-400"
            />
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400"
            >
              {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type a message... (max 200 chars)"
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 200))}
              className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 placeholder:text-neutral-400"
            />
            <button
              type="submit"
              disabled={isPending || !name.trim() || !message.trim()}
              className="px-4 py-2 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 disabled:opacity-50 transition-colors flex items-center gap-1.5"
            >
              {isPending ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send size={15} />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
