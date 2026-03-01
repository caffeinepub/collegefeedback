import { useState } from 'react';
import { GraduationCap, BookOpen } from 'lucide-react';
import { useYearSelection, type CollegeYear } from '../hooks/useYearSelection';
import { useLanguage } from '../contexts/LanguageContext';

const yearConfig: { year: CollegeYear; emoji: string; descKey: 'year1Desc' | 'year2Desc' | 'year3Desc' | 'year4Desc'; labelKey: 'year1' | 'year2' | 'year3' | 'year4' }[] = [
  { year: '1st Year', emoji: '🌱', descKey: 'year1Desc', labelKey: 'year1' },
  { year: '2nd Year', emoji: '📖', descKey: 'year2Desc', labelKey: 'year2' },
  { year: '3rd Year', emoji: '🚀', descKey: 'year3Desc', labelKey: 'year3' },
  { year: '4th Year', emoji: '🎓', descKey: 'year4Desc', labelKey: 'year4' },
];

interface YearSelectionModalProps {
  onYearSelected: () => void;
}

export default function YearSelectionModal({ onYearSelected }: YearSelectionModalProps) {
  const { setYear, setCollegeName } = useYearSelection();
  const { t, toggleLanguage, language } = useLanguage();
  const [selecting, setSelecting] = useState<CollegeYear | null>(null);
  const [collegeInput, setCollegeInput] = useState('');

  const handleSelect = (year: CollegeYear) => {
    setSelecting(year);
    setTimeout(() => {
      setYear(year);
      setCollegeName(collegeInput);
      onYearSelected();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 animate-fade-in">
        {/* Language toggle at top */}
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleLanguage}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-heading font-bold border border-primary/30 bg-primary/8 text-primary hover:bg-primary/15 transition-all"
          >
            🌐 {t('langToggle')}
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-primary/15 mb-4">
            <GraduationCap className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-foreground mb-2">
            {t('yearModalWelcome')}
          </h1>
          <p className="text-muted-foreground font-body text-sm sm:text-base leading-relaxed">
            {t('yearModalSubtitle')}
          </p>
        </div>

        {/* Year buttons */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {yearConfig.map(({ year, emoji, descKey, labelKey }) => (
            <button
              key={year}
              onClick={() => handleSelect(year)}
              disabled={selecting !== null}
              className={`group relative flex flex-col items-center justify-center gap-2 p-5 rounded-3xl border-2 transition-all duration-200 font-heading
                ${selecting === year
                  ? 'border-primary bg-primary text-primary-foreground scale-95'
                  : selecting !== null
                  ? 'border-border bg-card text-muted-foreground opacity-50 cursor-not-allowed'
                  : 'border-border bg-card text-foreground hover:border-primary hover:bg-primary/5 hover:scale-[1.02] cursor-pointer shadow-card hover:shadow-card-hover'
                }`}
            >
              <span className="text-3xl">{emoji}</span>
              <div className="text-center">
                <div className="font-extrabold text-base">{t(labelKey)}</div>
                <div className={`text-xs mt-0.5 ${selecting === year ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                  {t(descKey)}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* College name input — beneath year buttons */}
        <div className="mb-2">
          <label className="block text-xs font-heading font-bold text-muted-foreground mb-1.5 text-center">
            {t('yearModalCollegeLabel')}
          </label>
          <input
            type="text"
            value={collegeInput}
            onChange={e => setCollegeInput(e.target.value)}
            placeholder={t('yearModalCollegePlaceholder')}
            maxLength={80}
            className="w-full px-4 py-2.5 rounded-2xl border border-border bg-background text-foreground text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
          />
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground mt-5 font-body">
          <BookOpen className="w-3 h-3 inline mr-1" />
          {t('yearModalNoSignIn')}
        </p>
      </div>
    </div>
  );
}
