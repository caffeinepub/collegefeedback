import React, { useState } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import {
  Home,
  Share2,
  LayoutGrid,
  Info,
  Users,
  MessageCircle,
  Volume2,
  VolumeX,
  BookmarkIcon,
  BarChart2,
  Menu,
  X,
} from 'lucide-react';
import SparkParticles from './SparkParticles';
import { getMuted, setMuted } from '../utils/sounds';

const NAV_LINKS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/share', label: 'Share', icon: Share2 },
  { to: '/feed', label: 'Feed', icon: LayoutGrid },
  { to: '/about', label: 'About', icon: Info },
  { to: '/available-students', label: 'Students', icon: Users },
  { to: '/community-chat', label: 'Chat', icon: MessageCircle },
  { to: '/wishlist', label: 'Saved', icon: BookmarkIcon },
  { to: '/dashboard', label: 'Stats', icon: BarChart2 },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [muted, setMutedState] = useState(getMuted());
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
  };

  return (
    <div className="min-h-screen app-grid-bg flex flex-col relative">
      <SparkParticles />

      {/* Header */}
      <header className="relative z-20 pt-5 pb-2 flex flex-col items-center">
        {/* Floating pill nav */}
        <nav className="nav-pill px-2 py-2 flex items-center gap-1">
          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-violet-600 text-white shadow-sm'
                      : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
                  }`}
                >
                  <Icon size={15} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile: hamburger */}
          <div className="flex md:hidden items-center gap-2 px-2">
            <span className="font-heading font-bold text-sm text-neutral-900">
              <span className="italic text-violet-600">MEMU</span>
              <span className="font-black">NERCHUKNNAVI</span>
            </span>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-700"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          {/* Mute toggle */}
          <button
            onClick={toggleMute}
            className="ml-1 p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-neutral-700 transition-colors"
            aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
            title={muted ? 'Unmute sounds' : 'Mute sounds'}
          >
            {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
        </nav>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="md:hidden mt-2 nav-pill px-3 py-3 flex flex-col gap-1 w-72">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-violet-600 text-white'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <Icon size={15} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-16 border-t border-neutral-200 bg-white/70 backdrop-blur-sm py-8">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center gap-3 text-center">
          <div className="text-lg font-heading font-bold">
            <span className="italic text-violet-600">MEMU</span>
            <span className="text-neutral-900 font-black">NERCHUKNNAVI</span>
          </div>
          <p className="text-sm text-neutral-500">మేము నేర్చుకున్నవి — Collective wisdom for college students</p>
          <p className="text-xs text-neutral-400">
            Built with{' '}
            <span className="text-violet-500">♥</span>
            {' '}using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'memu-nerchuknnavi')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-600 hover:underline font-medium"
            >
              caffeine.ai
            </a>
            {' '}· © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
