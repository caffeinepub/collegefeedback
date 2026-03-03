import React, { useState } from 'react';
import { Users, UserPlus } from 'lucide-react';
import { useAvailableStudents } from '../hooks/useQueries';
import StudentCard from '../components/StudentCard';
import StudentRegistrationForm from '../components/StudentRegistrationForm';
import DMConversationPanel from '../components/DMConversationPanel';

export default function AvailableStudents() {
  const { data: students, isLoading } = useAvailableStudents();
  const [showRegister, setShowRegister] = useState(false);
  const [dmTarget, setDmTarget] = useState<string | null>(null);
  const [senderName, setSenderName] = useState('');
  const [senderNameInput, setSenderNameInput] = useState('');
  const [showSenderPrompt, setShowSenderPrompt] = useState(false);
  const [pendingDmTarget, setPendingDmTarget] = useState<string | null>(null);

  const handleDMClick = (studentName: string) => {
    if (senderName) {
      setDmTarget(studentName);
    } else {
      setPendingDmTarget(studentName);
      setShowSenderPrompt(true);
    }
  };

  const handleSenderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderNameInput.trim()) return;
    setSenderName(senderNameInput.trim());
    setShowSenderPrompt(false);
    if (pendingDmTarget) {
      setDmTarget(pendingDmTarget);
      setPendingDmTarget(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-heading font-black text-neutral-900 mb-1">
            <span className="italic text-violet-600">Available</span> Students
          </h1>
          <p className="text-neutral-500">Connect with peers open to DMs and mentorship.</p>
        </div>
        <button
          onClick={() => setShowRegister(!showRegister)}
          className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-colors shadow-violet text-sm"
        >
          <UserPlus size={16} />
          Mark Me Available
        </button>
      </div>

      {/* Registration form */}
      {showRegister && (
        <div className="mb-8">
          <StudentRegistrationForm onSuccess={() => setShowRegister(false)} />
        </div>
      )}

      {/* Sender name prompt */}
      {showSenderPrompt && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 w-full max-w-sm shadow-xl">
            <h3 className="font-heading font-bold text-neutral-900 mb-1">What's your name?</h3>
            <p className="text-sm text-neutral-500 mb-4">So the student knows who's messaging them.</p>
            <form onSubmit={handleSenderSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Your name"
                value={senderNameInput}
                onChange={(e) => setSenderNameInput(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 placeholder:text-neutral-400"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowSenderPrompt(false)}
                  className="flex-1 px-4 py-2 border border-neutral-200 text-neutral-600 rounded-xl text-sm font-medium hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!senderNameInput.trim()}
                  className="flex-1 px-4 py-2 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 disabled:opacity-50 transition-colors"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Students grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-neutral-200 p-5 animate-pulse">
              <div className="w-12 h-12 bg-neutral-100 rounded-full mb-3" />
              <div className="h-4 bg-neutral-100 rounded-full w-2/3 mb-2" />
              <div className="h-3 bg-neutral-100 rounded-full w-1/2" />
            </div>
          ))}
        </div>
      ) : !students || students.length === 0 ? (
        <div className="text-center py-16">
          <Users size={40} className="text-neutral-300 mx-auto mb-3" />
          <p className="text-neutral-500 font-medium">No students available yet.</p>
          <p className="text-neutral-400 text-sm mt-1">Be the first to mark yourself available!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {students.map((student) => (
            <StudentCard
              key={student.name}
              student={student}
              onDMClick={() => handleDMClick(student.name)}
            />
          ))}
        </div>
      )}

      {/* DM Panel */}
      {dmTarget && senderName && (
        <DMConversationPanel
          senderName={senderName}
          recipientName={dmTarget}
          onClose={() => setDmTarget(null)}
        />
      )}
    </div>
  );
}
