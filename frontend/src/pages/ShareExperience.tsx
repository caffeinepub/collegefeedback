import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Loader2, GraduationCap } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useCreatePost } from '../hooks/useQueries';
import { useYearSelection } from '../hooks/useYearSelection';
import { Category } from '../backend';
import { useLanguage } from '../contexts/LanguageContext';
import { playBubblePop, playTypingTick } from '../utils/sounds';

interface FormState {
  category: string;
  content: string;
}

interface FormErrors {
  category?: string;
  content?: string;
}

const MAX_CHARS = 500;

export default function ShareExperience() {
  const navigate = useNavigate();
  const createPost = useCreatePost();
  const { year } = useYearSelection();
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [submittedCategory, setSubmittedCategory] = useState('');

  const [form, setForm] = useState<FormState>({
    category: '',
    content: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const categoryOptions = [
    {
      value: Category.internships,
      label: `💼 ${t('catInternships')}`,
      helper: t('catHelperInternships'),
    },
    {
      value: Category.hackathons,
      label: `💡 ${t('catHackathons')}`,
      helper: t('catHelperHackathons'),
    },
    {
      value: Category.courses,
      label: `📚 ${t('catCourses')}`,
      helper: t('catHelperCourses'),
    },
    {
      value: Category.general,
      label: `🎓 ${t('catGeneral')}`,
      helper: t('catHelperGeneral'),
    },
  ];

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.category) newErrors.category = t('shareErrCategory');
    if (!form.content.trim()) newErrors.content = t('shareErrContent');
    else if (form.content.trim().length < 20) newErrors.content = t('shareErrContentMin');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createPost.mutateAsync({
        content: form.content.trim(),
        authorYear: year ?? 'Unknown',
        category: form.category as Category,
      });
      playBubblePop();
      setSubmittedCategory(form.category);
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to create post:', err);
    }
  };

  const updateField = (field: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleShareAnother = () => {
    setForm({ category: '', content: '' });
    setErrors({});
    setSubmitted(false);
    setSubmittedCategory('');
  };

  const selectedCategoryOption = categoryOptions.find(o => o.value === form.category);
  const submittedCategoryOption = categoryOptions.find(o => o.value === submittedCategory);
  const charCount = form.content.length;
  const isOverLimit = charCount > MAX_CHARS;

  if (submitted) {
    return (
      <div className="container mx-auto px-4 max-w-lg py-16 flex flex-col items-center text-center gap-6 animate-fade-in">
        <div className="text-7xl">🎉</div>
        <div>
          <h2 className="font-heading font-extrabold text-3xl text-foreground mb-3">
            {t('shareSuccessTitle')}
          </h2>
          <p className="text-muted-foreground font-body text-base leading-relaxed max-w-sm mx-auto">
            {t('shareSuccessDesc')}
          </p>
        </div>

        {/* Submitted details */}
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <div className="flex items-center gap-1.5 bg-primary/10 text-primary text-sm font-heading font-bold px-3 py-1.5 rounded-full border border-primary/20">
            <GraduationCap className="w-4 h-4" />
            {year ?? 'Unknown'} 🎓
          </div>
          {submittedCategoryOption && (
            <div className="text-sm font-heading font-bold px-3 py-1.5 rounded-full border border-border bg-muted">
              {submittedCategoryOption.label}
            </div>
          )}
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
          <Link to="/" className="flex-1">
            <Button
              size="lg"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-heading font-bold rounded-full"
            >
              {t('shareGoFeed')}
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            onClick={handleShareAnother}
            className="flex-1 font-heading font-bold rounded-full border-primary/30 text-primary hover:bg-primary/5"
          >
            {t('shareAnother')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 max-w-2xl py-10">
      {/* Page header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-heading font-bold px-3 py-1.5 rounded-full mb-3">
          ✍️ {t('sharePageTitle')}
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-foreground mb-2">
          {t('sharePageTitle')} ✍️
        </h1>
        <p className="text-muted-foreground font-body text-base">
          {t('sharePageSubtitle')}
        </p>
      </div>

      <Card className="border border-border shadow-card">
        <CardHeader className="pb-0 pt-6 px-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-2xl bg-primary/15 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="font-heading font-bold text-sm text-foreground">
                {year ?? 'Unknown'} 🎓
              </p>
              <p className="text-xs text-muted-foreground font-body">Sharing anonymously</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-6 pb-6 pt-5">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Category */}
            <div className="space-y-1.5">
              <Label className="font-heading font-bold text-sm text-foreground">
                {t('shareCategory')} <span className="text-destructive">*</span>
              </Label>
              <Select value={form.category} onValueChange={v => updateField('category', v)}>
                <SelectTrigger className={`rounded-2xl font-body ${errors.category ? 'border-destructive' : ''}`}>
                  <SelectValue placeholder={t('shareCategoryPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value} className="font-body">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-xs text-destructive font-body">{errors.category}</p>
              )}
              {selectedCategoryOption && !errors.category && (
                <p className="text-xs text-muted-foreground font-body">{selectedCategoryOption.helper}</p>
              )}
            </div>

            {/* Content */}
            <div className="space-y-1.5">
              <Label className="font-heading font-bold text-sm text-foreground">
                {t('shareContent')} <span className="text-destructive">*</span>
              </Label>
              <Textarea
                value={form.content}
                onChange={e => updateField('content', e.target.value)}
                onKeyDown={() => playTypingTick()}
                placeholder={t('shareContentPlaceholder')}
                rows={6}
                className={`resize-none font-body rounded-2xl ${errors.content ? 'border-destructive' : ''}`}
              />
              <div className="flex items-center justify-between">
                {errors.content ? (
                  <p className="text-xs text-destructive font-body">{errors.content}</p>
                ) : (
                  <span />
                )}
                <span className={`text-xs font-heading font-bold ml-auto ${isOverLimit ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {charCount}/{MAX_CHARS} {t('shareCharLimit')}
                </span>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={createPost.isPending || isOverLimit}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-heading font-extrabold rounded-full"
              >
                {createPost.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('shareSubmitting')}
                  </>
                ) : (
                  t('shareSubmit')
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: '/' })}
                className="font-heading font-bold rounded-full border-border hover:bg-muted"
              >
                {t('shareCancel')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
