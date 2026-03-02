import React, { useMemo } from "react";

const YEAR_LABELS = [
  "I'm 1st Year",
  "I'm 2nd Year",
  "I'm 3rd Year",
  "I'm 4th Year",
];

interface ColorScheme {
  bg: string;
  text: string;
  border: string;
}

// Violet / Pink / Yellow pill colors
const PILL_COLORS: ColorScheme[] = [
  { bg: "#EDE0FF", text: "#4B0082", border: "#9B59B6" },   // light violet
  { bg: "#FFD6EC", text: "#7B0050", border: "#E91E8C" },   // pink
  { bg: "#FFF9C4", text: "#5A4000", border: "#F4C430" },   // yellow
  { bg: "#D8B4FE", text: "#3B0764", border: "#7C3AED" },   // medium violet
  { bg: "#FECDD3", text: "#881337", border: "#F43F5E" },   // rose pink
  { bg: "#FEF08A", text: "#713F12", border: "#EAB308" },   // bright yellow
  { bg: "#F3E8FF", text: "#581C87", border: "#A855F7" },   // soft violet
  { bg: "#FCE7F3", text: "#831843", border: "#EC4899" },   // hot pink
];

interface Particle {
  id: number;
  left: number;
  top: number;
  yearLabel: string;
  colorScheme: ColorScheme;
  animVariant: number;
  duration: number;
  delay: number;
}

// Stratified grid: divide viewport into a 4x4 grid, place one particle per cell
function generateStratifiedParticles(): Particle[] {
  const COLS = 4;
  const ROWS = 4;
  const TOTAL = COLS * ROWS; // 16 particles

  const particles: Particle[] = [];

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const index = row * COLS + col;

      // Cell boundaries (in %)
      const cellW = 100 / COLS;
      const cellH = 100 / ROWS;

      // Add jitter within the cell (keep 15% margin from edges)
      const jitterX = 0.15 + Math.random() * 0.70;
      const jitterY = 0.15 + Math.random() * 0.70;

      const left = col * cellW + jitterX * cellW;
      const top = row * cellH + jitterY * cellH;

      // Clamp to safe viewport range
      const safeLeft = Math.min(Math.max(left, 2), 92);
      const safeTop = Math.min(Math.max(top, 2), 88);

      const yearLabel = YEAR_LABELS[index % YEAR_LABELS.length];
      const colorScheme = PILL_COLORS[index % PILL_COLORS.length];
      const animVariant = (index % 4) + 1;
      const duration = 3.5 + (index % 7) * 0.4;
      const delay = (index * 0.45) % 6;

      particles.push({
        id: index,
        left: safeLeft,
        top: safeTop,
        yearLabel,
        colorScheme,
        animVariant,
        duration,
        delay,
      });
    }
  }

  return particles;
}

const SparkParticles: React.FC = () => {
  const particles = useMemo(() => generateStratifiedParticles(), []);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <div
          key={p.id}
          className={`animate-spark-float-${p.animVariant}`}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            top: `${p.top}%`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            ["--duration" as string]: `${p.duration}s`,
          }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "3px 10px",
              borderRadius: "999px",
              fontSize: "11px",
              fontWeight: 600,
              fontFamily: "DM Sans, sans-serif",
              backgroundColor: p.colorScheme.bg,
              color: p.colorScheme.text,
              border: `1.5px solid ${p.colorScheme.border}`,
              whiteSpace: "nowrap",
              boxShadow: "0 2px 8px rgba(75,0,130,0.15)",
              letterSpacing: "0.01em",
            }}
          >
            {p.yearLabel}
          </span>
        </div>
      ))}
    </div>
  );
};

export default SparkParticles;
