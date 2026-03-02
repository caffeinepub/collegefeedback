import React from "react";
import { MessageCircle } from "lucide-react";
import { StudentProfile } from "../backend";

const YEAR_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "1st Year": { bg: "oklch(0.92 0.06 145)", text: "oklch(0.35 0.10 145)", border: "oklch(0.78 0.08 145)" },
  "2nd Year": { bg: "oklch(0.92 0.06 200)", text: "oklch(0.35 0.10 200)", border: "oklch(0.78 0.08 200)" },
  "3rd Year": { bg: "oklch(0.94 0.06 55)", text: "oklch(0.42 0.10 52)", border: "oklch(0.80 0.08 55)" },
  "4th Year": { bg: "oklch(0.92 0.06 280)", text: "oklch(0.38 0.10 280)", border: "oklch(0.78 0.08 280)" },
};

interface StudentCardProps {
  student: StudentProfile;
  onSendDM: (student: StudentProfile) => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, onSendDM }) => {
  const yearColor = YEAR_COLORS[student.collegeYear] ?? YEAR_COLORS["1st Year"];

  return (
    <div
      className="rounded-xl border p-4 flex flex-col gap-3 transition-all duration-200 hover:shadow-md"
      style={{
        background: "oklch(0.98 0.015 60)",
        borderColor: "oklch(0.88 0.025 55)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "oklch(0.72 0.08 52)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "oklch(0.88 0.025 55)";
      }}
    >
      {/* Avatar + Name */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0"
          style={{
            background: "oklch(0.88 0.06 55)",
            color: "oklch(0.40 0.10 42)",
          }}
        >
          {student.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="font-semibold text-sm truncate"
            style={{ color: "oklch(0.30 0.06 48)" }}
          >
            {student.name}
          </p>
          <p
            className="text-xs truncate"
            style={{ color: "oklch(0.55 0.04 50)" }}
          >
            {student.collegeName}
          </p>
        </div>
      </div>

      {/* Year badge + availability */}
      <div className="flex items-center justify-between gap-2">
        <span
          className="text-xs px-2 py-0.5 rounded-full font-semibold"
          style={{
            background: yearColor.bg,
            color: yearColor.text,
            border: `1px solid ${yearColor.border}`,
          }}
        >
          {student.collegeYear}
        </span>
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1"
          style={{
            background: "oklch(0.92 0.06 145)",
            color: "oklch(0.35 0.10 145)",
            border: "1px solid oklch(0.78 0.08 145)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />
          Available
        </span>
      </div>

      {/* DM Button */}
      <button
        onClick={() => onSendDM(student)}
        className="w-full py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200"
        style={{
          background: "oklch(0.55 0.12 42)",
          color: "oklch(0.99 0.005 58)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = "oklch(0.48 0.12 42)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = "oklch(0.55 0.12 42)";
        }}
      >
        <MessageCircle size={15} />
        Send DM
      </button>
    </div>
  );
};

export default StudentCard;
