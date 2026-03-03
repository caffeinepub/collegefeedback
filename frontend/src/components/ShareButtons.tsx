import React from 'react';
import { Share2, Copy, MessageCircle } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { playBubblePop } from '../utils/sounds';

interface ShareButtonsProps {
  postId: string;
  content: string;
}

export default function ShareButtons({ postId, content }: ShareButtonsProps) {
  const { showToast } = useToast();
  const url = `${window.location.origin}/post/${postId}`;
  const text = `Check out this experience on Memu Nerchukunnavi: "${content.slice(0, 80)}..."`;

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
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-neutral-400 font-medium">Share:</span>
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 text-neutral-600 rounded-full text-xs font-medium hover:bg-violet-100 hover:text-violet-700 transition-colors"
      >
        <Copy size={12} /> Copy link
      </button>
      <button
        onClick={handleWhatsApp}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 text-neutral-600 rounded-full text-xs font-medium hover:bg-violet-100 hover:text-violet-700 transition-colors"
      >
        <MessageCircle size={12} /> WhatsApp
      </button>
      {canShare && (
        <button
          onClick={handleNativeShare}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 text-neutral-600 rounded-full text-xs font-medium hover:bg-violet-100 hover:text-violet-700 transition-colors"
        >
          <Share2 size={12} /> Share
        </button>
      )}
    </div>
  );
}
