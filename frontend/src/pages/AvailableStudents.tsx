import React, { useState } from "react";
import { Users, Plus, X } from "lucide-react";
import { useAvailableStudents } from "../hooks/useQueries";
import { StudentProfile } from "../backend";
import { Skeleton } from "@/components/ui/skeleton";
import StudentCard from "../components/StudentCard";
import DMConversationPanel from "../components/DMConversationPanel";
import StudentRegistrationForm from "../components/StudentRegistrationForm";

const AvailableStudents: React.FC = () => {
  const { data: students = [], isLoading, isError } = useAvailableStudents();
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  const [senderName, setSenderName] = useState("");
  const [showSenderPrompt, setShowSenderPrompt] = useState(false);
  const [pendingStudent, setPendingStudent] = useState<StudentProfile | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [tempSenderName, setTempSenderName] = useState("");

  const handleSendDM = (student: StudentProfile) => {
    if (senderName.trim()) {
      setSelectedStudent(student);
    } else {
      setPendingStudent(student);
      setShowSenderPrompt(true);
    }
  };

  const handleConfirmSender = () => {
    if (!tempSenderName.trim()) return;
    setSenderName(tempSenderName.trim());
    setShowSenderPrompt(false);
    if (pendingStudent) {
      setSelectedStudent(pendingStudent);
      setPendingStudent(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1
            className="font-heading text-2xl font-bold flex items-center gap-2"
            style={{ color: "oklch(0.35 0.08 48)" }}
          >
            <Users size={24} style={{ color: "oklch(0.55 0.12 42)" }} />
            Available Students
          </h1>
          <p className="text-sm mt-1" style={{ color: "oklch(0.55 0.05 50)" }}>
            Connect directly with students who are open to DMs and peer mentoring.
          </p>
        </div>
        <button
          onClick={() => setShowRegisterModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex-shrink-0"
          style={{
            background: "oklch(0.55 0.12 42)",
            color: "oklch(0.99 0.005 58)",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "oklch(0.48 0.12 42)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "oklch(0.55 0.12 42)"; }}
        >
          <Plus size={16} />
          Mark Me Available
        </button>
      </div>

      {/* Current sender badge */}
      {senderName && (
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-6"
          style={{
            background: "oklch(0.92 0.06 145)",
            color: "oklch(0.35 0.10 145)",
            border: "1px solid oklch(0.78 0.08 145)",
          }}
        >
          <span className="w-2 h-2 rounded-full bg-current" />
          Messaging as: <strong>{senderName}</strong>
          <button
            onClick={() => setSenderName("")}
            className="ml-1 opacity-70 hover:opacity-100"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Students Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-xl border p-4 flex flex-col gap-3"
              style={{
                background: "oklch(0.98 0.015 60)",
                borderColor: "oklch(0.88 0.025 55)",
              }}
            >
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-28 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div
          className="rounded-xl border p-8 text-center"
          style={{
            background: "oklch(0.97 0.012 60)",
            borderColor: "oklch(0.88 0.025 55)",
          }}
        >
          <p className="text-sm" style={{ color: "oklch(0.55 0.18 25)" }}>
            Failed to load students. Please try again.
          </p>
        </div>
      ) : students.length === 0 ? (
        <div
          className="rounded-2xl border p-12 text-center flex flex-col items-center gap-4"
          style={{
            background: "oklch(0.97 0.012 60)",
            borderColor: "oklch(0.88 0.025 55)",
          }}
        >
          <Users size={40} style={{ color: "oklch(0.75 0.05 50)" }} />
          <div>
            <p className="font-semibold text-base mb-1" style={{ color: "oklch(0.40 0.06 48)" }}>
              No students available yet
            </p>
            <p className="text-sm" style={{ color: "oklch(0.62 0.04 50)" }}>
              Be the first to mark yourself available for peer DMs! 🌟
            </p>
          </div>
          <button
            onClick={() => setShowRegisterModal(true)}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
            style={{
              background: "oklch(0.55 0.12 42)",
              color: "oklch(0.99 0.005 58)",
            }}
          >
            Mark Me Available
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((student) => (
            <StudentCard
              key={student.name}
              student={student}
              onSendDM={handleSendDM}
            />
          ))}
        </div>
      )}

      {/* DM Conversation Panel */}
      {selectedStudent && senderName && (
        <DMConversationPanel
          student={selectedStudent}
          senderName={senderName}
          onClose={() => setSelectedStudent(null)}
        />
      )}

      {/* Sender Name Prompt Modal */}
      {showSenderPrompt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "oklch(0.15 0.02 50 / 0.6)" }}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-6 shadow-2xl"
            style={{
              background: "oklch(0.98 0.015 60)",
              border: "1.5px solid oklch(0.88 0.025 55)",
            }}
          >
            <h3
              className="font-heading text-lg font-bold mb-1"
              style={{ color: "oklch(0.35 0.08 48)" }}
            >
              What's your name?
            </h3>
            <p className="text-sm mb-4" style={{ color: "oklch(0.55 0.04 50)" }}>
              Enter your name so the recipient knows who's messaging them.
            </p>
            <input
              type="text"
              value={tempSenderName}
              onChange={(e) => setTempSenderName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleConfirmSender(); }}
              placeholder="Your name…"
              autoFocus
              className="w-full px-3 py-2 rounded-lg text-sm outline-none mb-4"
              style={{
                background: "oklch(0.97 0.012 60)",
                border: "1.5px solid oklch(0.88 0.025 55)",
                color: "oklch(0.30 0.04 50)",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "oklch(0.62 0.10 42)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "oklch(0.88 0.025 55)"; }}
            />
            <div className="flex gap-2">
              <button
                onClick={() => { setShowSenderPrompt(false); setPendingStudent(null); }}
                className="flex-1 py-2 rounded-xl text-sm font-medium"
                style={{
                  background: "oklch(0.93 0.025 58)",
                  color: "oklch(0.40 0.06 50)",
                  border: "1px solid oklch(0.88 0.025 55)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSender}
                disabled={!tempSenderName.trim()}
                className="flex-1 py-2 rounded-xl text-sm font-bold transition-all duration-200"
                style={{
                  background: tempSenderName.trim() ? "oklch(0.55 0.12 42)" : "oklch(0.80 0.04 52)",
                  color: "oklch(0.99 0.005 58)",
                  cursor: tempSenderName.trim() ? "pointer" : "not-allowed",
                }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegisterModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "oklch(0.15 0.02 50 / 0.6)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowRegisterModal(false); }}
        >
          <div
            className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
            style={{
              background: "oklch(0.98 0.015 60)",
              border: "1.5px solid oklch(0.88 0.025 55)",
            }}
          >
            <div
              className="flex items-center justify-between px-5 py-4 border-b"
              style={{
                background: "oklch(0.96 0.022 58)",
                borderColor: "oklch(0.88 0.025 55)",
              }}
            >
              <h2 className="font-heading text-lg font-bold" style={{ color: "oklch(0.35 0.08 48)" }}>
                🎓 Register as Available
              </h2>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="p-1.5 rounded-full"
                style={{ color: "oklch(0.52 0.05 50)" }}
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-5">
              <StudentRegistrationForm onSuccess={() => setShowRegisterModal(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailableStudents;
