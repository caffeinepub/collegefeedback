import React, { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { useDMConversation, useSendDM } from '../hooks/useQueries';

interface DMConversationPanelProps {
  senderName: string;
  recipientName: string;
  onClose: () => void;
}

export default function DMConversationPanel({ senderName, recipientName, onClose }: DMConversationPanelProps) {
  const { data: messages, isLoading } = useDMConversation(senderName, recipientName, true);
  const { mutateAsync: sendDM, isPending } = useSendDM();
  const [text, setText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    await sendDM({ sender: senderName, recipient: recipientName, message: text.trim() });
    setText('');
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl border border-neutral-200 w-full max-w-md shadow-xl flex flex-col" style={{ height: '520px' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <div>
            <p className="font-heading font-bold text-neutral-900 text-sm">DM with {recipientName}</p>
            <p className="text-xs text-neutral-400">as {senderName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-5 h-5 border-2 border-violet-300 border-t-violet-600 rounded-full animate-spin" />
            </div>
          ) : !messages || messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center">
              <p className="text-neutral-400 text-sm">No messages yet. Say hello!</p>
            </div>
          ) : (
            messages.map((msg, i) => {
              const isSender = msg.sender === senderName;
              return (
                <div key={i} className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
                    isSender
                      ? 'bg-violet-600 text-white rounded-br-sm'
                      : 'bg-neutral-100 text-neutral-800 rounded-bl-sm'
                  }`}>
                    {msg.message}
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="px-4 py-3 border-t border-neutral-100 flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 200))}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(e as unknown as React.FormEvent);
              }
            }}
            className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 placeholder:text-neutral-400"
          />
          <button
            type="submit"
            disabled={isPending || !text.trim()}
            className="px-3 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 disabled:opacity-50 transition-colors"
          >
            {isPending ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send size={15} />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
