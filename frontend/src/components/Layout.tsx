import { useState } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { GraduationCap, Heart, Globe, Bell, BellOff } from 'lucide-react';
import { useYearSelection } from '../hooks/useYearSelection';
import { useLanguage } from '../contexts/LanguageContext';
import { getMuted, setMuted } from '../utils/sounds';
import SparkParticles from './SparkParticles';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { year, collegeName } = useYearSelection();
  const { t, toggleLanguage, language } = useLanguage();
  const [muted, setMutedState] = useState<boolean>(() => getMuted());

  const handleMuteToggle = () => {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
  };

  const navLinks = [
    { to: '/', label: t('navFeed'), short: t('navFeedShort'), exact: true },
    { to: '/dashboard', label: t('navDashboard'), short: t('navDashboardShort'), exact: false },
    { to: '/share', label: t('navShare'), short: t('navShareShort'), exact: false },
    { to: '/about', label: t('navAbout'), short: t('navAboutShort'), exact: false },
  ];

  const isActive = (to: string, exact: boolean) => {
    if (exact) return location.pathname === to;
    return location.pathname.startsWith(to);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Spark particles — rendered below all content */}
      <SparkParticles />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-xs">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="w-9 h-9 rounded-2xl bg-primary flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-brand text-xl text-foreground tracking-tight">
                  Memu <span className="text-primary">Nerchukunnavi</span>
                </span>
                {collegeName ? (
                  <span className="text-xs text-primary font-heading font-semibold hidden sm:block">
                    {collegeName}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground font-body hidden sm:block">
                    {t('appTagline')}
                  </span>
                )}
              </div>
            </Link>

            {/* Nav + controls */}
            <div className="flex items-center gap-2">
              {/* Mute toggle */}
              <button
                onClick={handleMuteToggle}
                title={muted ? 'Unmute sounds' : 'Mute sounds'}
                aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
                className="inline-flex items-center justify-center w-8 h-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-150"
              >
                {muted ? (
                  <BellOff className="w-4 h-4" />
                ) : (
                  <Bell className="w-4 h-4" />
                )}
              </button>

              {/* Language toggle */}
              <button
                onClick={toggleLanguage}
                title={t('langToggleLabel')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-heading font-bold border border-primary/30 bg-primary/8 text-primary hover:bg-primary/15 transition-all duration-150"
              >
                <Globe className="w-3.5 h-3.5" />
                {t('langToggle')}
              </button>

              {/* Pill nav desktop */}
              <nav className="hidden md:flex items-center gap-1 bg-muted/60 rounded-full px-1.5 py-1">
                {navLinks.map(link => (
                  <Link key={link.to} to={link.to}>
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-heading font-bold transition-all duration-150 cursor-pointer
                        ${isActive(link.to, link.exact)
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-background/80'
                        }`}
                    >
                      {link.label}
                    </span>
                  </Link>
                ))}
              </nav>

              {/* Mobile nav */}
              <nav className="flex md:hidden items-center gap-1">
                {navLinks.map(link => (
                  <Link key={link.to} to={link.to}>
                    <span
                      className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-heading font-bold transition-all duration-150 cursor-pointer
                        ${isActive(link.to, link.exact)
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                    >
                      {link.short}
                    </span>
                  </Link>
                ))}
              </nav>

              {/* Year badge */}
              {year && (
                <div className="hidden sm:flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-heading font-bold px-3 py-1.5 rounded-full border border-primary/20">
                  <span>{year}</span>
                  <span>🎓</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-16 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-xl bg-primary flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-brand text-xl text-foreground">
                  Memu <span className="text-primary">Nerchukunnavi</span>
                </span>
              </div>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">
                {t('footerTagline')}
              </p>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="font-heading font-bold text-foreground mb-3 text-sm">{t('footerQuickLinks')}</h4>
              <ul className="space-y-2">
                {[
                  { to: '/', label: t('navFeed') },
                  { to: '/dashboard', label: t('navDashboard') },
                  { to: '/share', label: t('footerShareExp') },
                  { to: '/about', label: t('navAbout') },
                ].map(link => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-sm text-muted-foreground hover:text-primary transition-colors font-body">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Attribution */}
            <div>
              <h4 className="font-heading font-bold text-foreground mb-3 text-sm">{t('footerAbout')}</h4>
              <p className="text-sm text-muted-foreground font-body leading-relaxed mb-3">
                {t('footerAboutDesc')}
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-1 flex-wrap">
                Built with{' '}
                <Heart className="w-3.5 h-3.5 fill-primary text-primary" />{' '}
                using{' '}
                <a
                  href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'memu-nerchukunnavi')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  caffeine.ai
                </a>
              </p>
            </div>
          </div>

          <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} {t('footerCopyright')}
            </p>
            <p className="text-xs text-muted-foreground">
              {t('footerNoSignIn')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
