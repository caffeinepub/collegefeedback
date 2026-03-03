import React from 'react';
import { Copy, Share2 } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { playBubblePop } from '../utils/sounds';

export default function ShareWebsiteButtons() {
  const { showToast } = useToast();
  const url = window.location.origin;
  const text = 'Check out Memu Nerchukunnavi — a collective wisdom hub for college students! మేము నేర్చుకున్నవి';

  const handleCopy = async () => {
    playBubblePop();
    await navigator.clipboard.writeText(url);
    showToast('Link copied! 🔗', 'success');
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
  };

  const handleNativeShare = async () => {
    if ('share' in navigator) {
      await (navigator as Navigator & { share: (data: ShareData) => Promise<void> }).share({ title: 'Memu Nerchukunnavi', text, url });
    }
  };

  const canShare = 'share' in navigator;

  return (
    <div className="flex items-center gap-2 flex-wrap justify-center">
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 px-4 py-2 bg-white border border-neutral-200 text-neutral-600 rounded-full text-sm font-medium hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700 transition-colors shadow-card"
      >
        <Copy size={14} /> Copy link
      </button>
      <button
        onClick={handleWhatsApp}
        className="flex items-center gap-1.5 px-4 py-2 bg-white border border-neutral-200 text-neutral-600 rounded-full text-sm font-medium hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700 transition-colors shadow-card"
      >
        Share on WhatsApp
      </button>
      {canShare && (
        <button
          onClick={handleNativeShare}
          className="flex items-center gap-1.5 px-4 py-2 bg-white border border-neutral-200 text-neutral-600 rounded-full text-sm font-medium hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700 transition-colors shadow-card"
        >
          <Share2 size={14} /> Share
        </button>
      )}
    </div>
  );
}
