import React from 'react';
import { MessageCircle, CheckCircle } from 'lucide-react';
import { StudentProfile } from '../backend';

interface StudentCardProps {
  student: StudentProfile;
  onDMClick: () => void;
}

const YEAR_STYLES: Record<string, string> = {
  '1st Year': 'bg-violet-100 text-violet-700',
  '2nd Year': 'bg-violet-200 text-violet-800',
  '3rd Year': 'bg-neutral-100 text-neutral-700',
  '4th Year': 'bg-neutral-200 text-neutral-800',
};

export default function StudentCard({ student, onDMClick }: StudentCardProps) {
  const yearStyle = YEAR_STYLES[student.collegeYear] ?? 'bg-neutral-100 text-neutral-600';
  const initial = student.name.charAt(0).toUpperCase();

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-card hover:border-violet-200 transition-colors">
      {/* Avatar + name */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-full bg-violet-600 text-white flex items-center justify-center text-lg font-bold">
          {initial}
        </div>
        <div>
          <p className="font-semibold text-neutral-900 text-sm">{student.name}</p>
          <p className="text-xs text-neutral-500">{student.collegeName}</p>
        </div>
      </div>

      {/* Year badge + availability */}
      <div className="flex items-center gap-2 mb-4">
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${yearStyle}`}>
          {student.collegeYear}
        </span>
        {student.availableForDM && (
          <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
            <CheckCircle size={12} />
            Available
          </span>
        )}
      </div>

      {/* DM button */}
      <button
        onClick={onDMClick}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors"
      >
        <MessageCircle size={14} />
        Send DM
      </button>
    </div>
  );
}
