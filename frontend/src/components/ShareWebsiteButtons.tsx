import React, { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

const ShareWebsiteButtons: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const siteUrl = window.location.origin;
  const siteName = "Memu Nerchukunnam";
  const shareText = `🎓 Check out ${siteName} — a free platform where students share real college experiences (internships, hackathons, courses & more). No sign-in needed!\n${siteUrl}`;

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(siteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
      const el = document.createElement("textarea");
      el.value = siteUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: siteName,
          text: "Real experiences from real students — no sign-in required!",
          url: siteUrl,
        });
      } catch {
        // user cancelled or not supported
      }
    }
  };

  return (
    <div
      className="rounded-2xl border p-5"
      style={{
        background: "oklch(0.96 0.022 58)",
        borderColor: "oklch(0.86 0.030 55)",
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1">
          <p
            className="font-heading font-bold text-base mb-0.5"
            style={{ color: "oklch(0.38 0.08 48)" }}
          >
            📢 Share Memu Nerchukunnam
          </p>
          <p className="text-xs" style={{ color: "oklch(0.52 0.05 50)" }}>
            Help more students discover this free platform — share it with your friends!
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* WhatsApp */}
          <button
            onClick={handleWhatsApp}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold transition-all duration-200"
            style={{
              background: "oklch(0.52 0.14 145)",
              color: "oklch(0.99 0.005 58)",
            }}
            title="Share on WhatsApp"
          >
            <SiWhatsapp size={15} />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>

          {/* Copy Link */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold border transition-all duration-200"
            style={
              copied
                ? {
                    background: "oklch(0.55 0.12 145)",
                    color: "oklch(0.99 0.005 58)",
                    borderColor: "oklch(0.55 0.12 145)",
                  }
                : {
                    background: "oklch(0.97 0.012 60)",
                    color: "oklch(0.42 0.06 50)",
                    borderColor: "oklch(0.88 0.025 55)",
                  }
            }
            title="Copy link"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? "Copied!" : "Copy Link"}</span>
          </button>

          {/* Native Share (only shown if supported) */}
          {typeof navigator !== "undefined" && !!navigator.share && (
            <button
              onClick={handleNativeShare}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold border transition-all duration-200"
              style={{
                background: "oklch(0.94 0.020 200)",
                color: "oklch(0.32 0.10 200)",
                borderColor: "oklch(0.82 0.030 200)",
              }}
              title="Share"
            >
              <Share2 size={14} />
              <span>Share</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareWebsiteButtons;
