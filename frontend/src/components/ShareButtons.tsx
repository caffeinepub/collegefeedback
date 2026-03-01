import { useState } from 'react';
import { Share2, Copy, MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ShareButtonsProps {
  postId: string;
  postContent: string;
  postUrl: string;
  compact?: boolean;
}

export default function ShareButtons({ postId, postContent, postUrl, compact = false }: ShareButtonsProps) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const snippet = postContent.length > 100
    ? postContent.slice(0, 100).trimEnd() + '…'
    : postContent;

  const shareText = `${t('shareVia')}\n"${snippet}"\n${postUrl}`;

  const handleWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const el = document.createElement('textarea');
      el.value = postUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (!navigator.share) return;
    try {
      await navigator.share({
        title: 'Memu Nerchunnavi | మేము నేర్చున్నవి',
        text: snippet,
        url: postUrl,
      });
    } catch {
      // User cancelled or error
    }
  };

  const hasNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  const btnBase = compact
    ? 'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-heading font-bold transition-all duration-150 border'
    : 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-heading font-bold transition-all duration-150 border';

  return (
    <div className="flex items-center gap-2 flex-wrap" onClick={e => e.preventDefault()}>
      {/* WhatsApp */}
      <button
        onClick={handleWhatsApp}
        title={t('shareWhatsApp')}
        className={`${btnBase} bg-green-50 text-green-700 border-green-200 hover:bg-green-100`}
      >
        <MessageCircle className={compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
        {!compact && <span>WhatsApp</span>}
      </button>

      {/* Copy Link */}
      <button
        onClick={handleCopyLink}
        title={copied ? t('shareCopied') : t('shareCopyLink')}
        className={`${btnBase} ${
          copied
            ? 'bg-accent/15 text-accent border-accent/30'
            : 'bg-muted text-muted-foreground border-border hover:bg-primary/10 hover:text-primary hover:border-primary/30'
        }`}
      >
        <Copy className={compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
        {!compact && <span>{copied ? t('shareCopied') : t('shareCopyLink')}</span>}
        {compact && copied && <span>{t('shareCopied')}</span>}
      </button>

      {/* Native Share */}
      {hasNativeShare && (
        <button
          onClick={handleNativeShare}
          title={t('shareNative')}
          className={`${btnBase} bg-primary/10 text-primary border-primary/20 hover:bg-primary/20`}
        >
          <Share2 className={compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          {!compact && <span>{t('shareNative')}</span>}
        </button>
      )}
    </div>
  );
}
