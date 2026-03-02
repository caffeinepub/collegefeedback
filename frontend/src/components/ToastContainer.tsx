import React, { useEffect, useState } from "react";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { useToast, Toast, ToastType } from "../hooks/useToast";

const typeConfig: Record<
  ToastType,
  { icon: React.ReactNode; bg: string; border: string; color: string; iconColor: string }
> = {
  success: {
    icon: React.createElement(CheckCircle2, { size: 16 }),
    bg: "oklch(0.95 0.04 145)",
    border: "oklch(0.78 0.08 145)",
    color: "oklch(0.28 0.10 145)",
    iconColor: "oklch(0.45 0.14 145)",
  },
  error: {
    icon: React.createElement(AlertCircle, { size: 16 }),
    bg: "oklch(0.96 0.04 25)",
    border: "oklch(0.78 0.10 25)",
    color: "oklch(0.35 0.14 25)",
    iconColor: "oklch(0.50 0.18 25)",
  },
  info: {
    icon: React.createElement(Info, { size: 16 }),
    bg: "oklch(0.96 0.025 58)",
    border: "oklch(0.82 0.040 55)",
    color: "oklch(0.35 0.08 48)",
    iconColor: "oklch(0.52 0.10 42)",
  },
};

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const cfg = typeConfig[toast.type];

  return (
    <div
      role="alert"
      style={{
        background: cfg.bg,
        border: `1.5px solid ${cfg.border}`,
        color: cfg.color,
        transform: visible ? "translateX(0)" : "translateX(110%)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.28s cubic-bezier(0.34,1.56,0.64,1), opacity 0.22s ease",
        boxShadow: "0 4px 18px oklch(0.55 0.08 50 / 0.14)",
      }}
      className="flex items-start gap-2.5 px-4 py-3 rounded-xl min-w-[220px] max-w-[340px] pointer-events-auto"
    >
      <span style={{ color: cfg.iconColor, flexShrink: 0, marginTop: "1px" }}>
        {cfg.icon}
      </span>
      <p className="text-sm font-medium flex-1 leading-snug">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 rounded-full p-0.5 transition-opacity hover:opacity-60"
        style={{ color: cfg.color }}
        aria-label="Dismiss"
      >
        <X size={13} />
      </button>
    </div>
  );
};

const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-5 right-4 z-[9999] flex flex-col gap-2.5 items-end pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
      ))}
    </div>
  );
};

export default ToastContainer;
