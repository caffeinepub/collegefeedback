const YEAR_KEY = 'college_year_selection';
const COLLEGE_NAME_KEY = 'college_name';

const YEAR_OPTIONS = ['1st Year', '2nd Year', '3rd Year', '4th Year'] as const;
export type CollegeYear = typeof YEAR_OPTIONS[number];

export function useYearSelection() {
  const stored = sessionStorage.getItem(YEAR_KEY) as CollegeYear | null;
  const hasSelected = stored !== null && (YEAR_OPTIONS as readonly string[]).includes(stored);

  const setYear = (year: CollegeYear) => {
    sessionStorage.setItem(YEAR_KEY, year);
    window.dispatchEvent(new Event('year-selected'));
  };

  const getCollegeName = (): string | null => {
    return sessionStorage.getItem(COLLEGE_NAME_KEY);
  };

  const setCollegeName = (name: string) => {
    if (name.trim()) {
      sessionStorage.setItem(COLLEGE_NAME_KEY, name.trim());
    } else {
      sessionStorage.removeItem(COLLEGE_NAME_KEY);
    }
  };

  return {
    year: hasSelected ? (stored as CollegeYear) : null,
    hasSelected,
    setYear,
    yearOptions: YEAR_OPTIONS,
    collegeName: getCollegeName(),
    setCollegeName,
  };
}
