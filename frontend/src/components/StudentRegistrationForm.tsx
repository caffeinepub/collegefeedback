import React, { useState } from 'react';
import { useRegisterStudent } from '../hooks/useQueries';
import { useToast } from '../hooks/useToast';

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

interface StudentRegistrationFormProps {
  onSuccess?: () => void;
}

export default function StudentRegistrationForm({ onSuccess }: StudentRegistrationFormProps) {
  const [name, setName] = useState('');
  const [year, setYear] = useState('1st Year');
  const [college, setCollege] = useState('');
  const [available, setAvailable] = useState(true);
  const { mutateAsync: register, isPending } = useRegisterStudent();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !college.trim()) return;
    try {
      await register({ name: name.trim(), year, college: college.trim(), available });
      showToast('Profile registered! 🎉', 'success');
      onSuccess?.();
    } catch {
      showToast('Failed to register. Please try again.', 'error');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-card">
      <h3 className="font-heading font-bold text-neutral-900 mb-4">Register as Available</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 placeholder:text-neutral-400"
        />
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400"
        >
          {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <input
          type="text"
          placeholder="College name"
          value={college}
          onChange={(e) => setCollege(e.target.value)}
          className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 placeholder:text-neutral-400"
        />
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() => setAvailable(!available)}
            className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${available ? 'bg-violet-600' : 'bg-neutral-200'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${available ? 'translate-x-5' : 'translate-x-1'}`} />
          </div>
          <span className="text-sm text-neutral-700 font-medium">Available for DMs</span>
        </label>
        <button
          type="submit"
          disabled={isPending || !name.trim() || !college.trim()}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 disabled:opacity-50 transition-colors"
        >
          {isPending ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : null}
          Register
        </button>
      </form>
    </div>
  );
}
