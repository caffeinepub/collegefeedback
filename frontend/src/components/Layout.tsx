import React, { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, X, Volume2, VolumeX, Heart } from "lucide-react";
import SparkParticles from "./SparkParticles";
import { useYearSelection } from "../hooks/useYearSelection";
import { getMuted, setMuted } from "../utils/sounds";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/share", label: "Share" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/available-students", label: "Students" },
  { to: "/community-chat", label: "Chat" },
  { to: "/wishlist", label: "Wishlist" },
  { to: "/about", label: "About" },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mutedState, setMutedState] = useState(getMuted());
  const { year, hasSelected } = useYearSelection();

  const toggleMute = () => {
    const next = !mutedState;
    setMuted(next);
    setMutedState(next);
  };

  const appId = encodeURIComponent(
    typeof window !== "undefined" ? window.location.hostname : "memu-nerchukunnavi"
  );

  return (
    <div className="min-h-screen flex flex-col app-grid-bg">
      <SparkParticles />

      {/* Header */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          background: "oklch(0.97 0.022 58 / 0.95)",
          borderColor: "oklch(0.88 0.025 55)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/assets/generated/memu-logo.dim_256x256.png"
              alt="Memu Nerchukunnavi logo"
              className="w-8 h-8 rounded-full object-cover"
              style={{ border: "1.5px solid oklch(0.82 0.06 52)" }}
            />
            <span
              className="font-brand text-xl leading-none"
              style={{ color: "oklch(0.45 0.10 42)" }}
            >
              Memu Nerchukunnavi
            </span>
            {hasSelected && year && (
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full hidden sm:inline"
                style={{
                  background: "oklch(0.88 0.06 55)",
                  color: "oklch(0.35 0.08 48)",
                  border: "1px solid oklch(0.78 0.08 52)",
                }}
              >
                {year}
              </span>
            )}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
                  style={
                    isActive
                      ? {
                          background: "oklch(0.55 0.12 42)",
                          color: "oklch(0.99 0.005 58)",
                        }
                      : {
                          color: "oklch(0.40 0.06 50)",
                        }
                  }
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="p-2 rounded-full transition-colors"
              style={{ color: "oklch(0.52 0.05 50)" }}
              title={mutedState ? "Unmute sounds" : "Mute sounds"}
            >
              {mutedState ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-full transition-colors"
              style={{ color: "oklch(0.40 0.06 50)" }}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div
            className="md:hidden border-t px-4 py-3 flex flex-col gap-1"
            style={{
              background: "oklch(0.97 0.022 58)",
              borderColor: "oklch(0.88 0.025 55)",
            }}
          >
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={
                    isActive
                      ? {
                          background: "oklch(0.55 0.12 42)",
                          color: "oklch(0.99 0.005 58)",
                        }
                      : {
                          color: "oklch(0.40 0.06 50)",
                        }
                  }
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 relative z-10">{children}</main>

      {/* Footer */}
      <footer
        className="border-t mt-auto"
        style={{
          background: "oklch(0.95 0.022 58)",
          borderColor: "oklch(0.88 0.025 55)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <img
              src="/assets/generated/memu-logo.dim_256x256.png"
              alt="logo"
              className="w-6 h-6 rounded-full object-cover"
            />
            <span
              className="font-brand text-base"
              style={{ color: "oklch(0.45 0.10 42)" }}
            >
              Memu Nerchukunnavi
            </span>
            <span className="text-xs" style={{ color: "oklch(0.55 0.05 50)" }}>
              © {new Date().getFullYear()}
            </span>
          </div>
          <p className="text-xs flex items-center gap-1" style={{ color: "oklch(0.55 0.05 50)" }}>
            Built with{" "}
            <Heart
              size={12}
              className="inline"
              style={{ color: "oklch(0.62 0.14 42)", fill: "oklch(0.62 0.14 42)" }}
            />{" "}
            using{" "}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:underline"
              style={{ color: "oklch(0.50 0.10 42)" }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
