import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { translations, type Language, type TranslationKey } from '../translations';

const LANG_KEY = 'app_language';

interface LanguageContextValue {
  language: Language;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = sessionStorage.getItem(LANG_KEY);
    return (stored === 'en' || stored === 'te') ? stored : 'en';
  });

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => {
      const next: Language = prev === 'en' ? 'te' : 'en';
      sessionStorage.setItem(LANG_KEY, next);
      return next;
    });
  }, []);

  const t = useCallback((key: TranslationKey): string => {
    return translations[language][key] as string;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
