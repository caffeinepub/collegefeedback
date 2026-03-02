import React, { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { useToast } from "../hooks/useToast";
import { playBubblePop } from "../utils/sounds";

interface ShareButtonsProps {
  postId: bigint;
  content: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ postId, content }) => {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const url = `${window.location.origin}/post/${postId}`;
  const text = `Check out this experience: "${content.slice(0, 80)}…" ${url}`;

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    playBubblePop();
    setCopied(true);
    showToast("🔗 Link copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: "College Experience", text: content.slice(0, 100), url });
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={handleWhatsApp}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
        style={{
          background: "oklch(0.88 0.10 145)",
          color: "oklch(0.28 0.10 145)",
          border: "1px solid oklch(0.75 0.10 145)",
        }}
      >
        <SiWhatsapp size={13} />
        WhatsApp
      </button>

      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
        style={{
          background: "oklch(0.92 0.025 55)",
          color: "oklch(0.38 0.06 48)",
          border: "1px solid oklch(0.82 0.030 55)",
        }}
      >
        {copied ? <Check size={13} /> : <Copy size={13} />}
        {copied ? "Copied!" : "Copy Link"}
      </button>

      {typeof navigator !== "undefined" && "share" in navigator && (
        <button
          onClick={handleNativeShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
          style={{
            background: "oklch(0.90 0.04 200)",
            color: "oklch(0.35 0.10 200)",
            border: "1px solid oklch(0.78 0.08 200)",
          }}
        >
          <Share2 size={13} />
          Share
        </button>
      )}
    </div>
  );
};

export default ShareButtons;
