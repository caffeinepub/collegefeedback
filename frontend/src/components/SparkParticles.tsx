import { useMemo } from 'react';

const YEAR_LABELS = [
  "✦ I'm 1st Year",
  "✦ I'm 2nd Year",
  "✦ I'm 3rd Year",
  "✦ I'm 4th Year",
];

const SPARK_COLORS = [
  'bg-purple-200/60 text-purple-700 border-purple-300/50',
  'bg-violet-200/60 text-violet-700 border-violet-300/50',
  'bg-fuchsia-200/55 text-fuchsia-700 border-fuchsia-300/50',
  'bg-indigo-200/55 text-indigo-700 border-indigo-300/50',
  'bg-pink-200/55 text-pink-700 border-pink-300/50',
  'bg-sky-200/55 text-sky-700 border-sky-300/50',
  'bg-teal-200/55 text-teal-700 border-teal-300/50',
  'bg-emerald-200/55 text-emerald-700 border-emerald-300/50',
];

const ANIMATIONS = [
  'spark-float',
  'spark-float-sway',
  'spark-float-fast',
  'spark-float-slow',
];

interface SparkConfig {
  id: number;
  label: string;
  left: number;
  bottom: number;
  animationName: string;
  duration: number;
  delay: number;
  colorClass: string;
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

export default function SparkParticles() {
  const sparks = useMemo<SparkConfig[]>(() => {
    const rand = seededRandom(42);
    const count = 16;
    return Array.from({ length: count }, (_, i) => {
      const label = YEAR_LABELS[i % YEAR_LABELS.length];
      const left = Math.floor(rand() * 92) + 2; // 2% to 94%
      const bottom = Math.floor(rand() * 30) + 2; // start near bottom, 2% to 32%
      const animIdx = Math.floor(rand() * ANIMATIONS.length);
      const duration = 7 + Math.floor(rand() * 9); // 7s to 15s
      const delay = Math.floor(rand() * 14); // 0s to 13s
      const colorIdx = Math.floor(rand() * SPARK_COLORS.length);
      return {
        id: i,
        label,
        left,
        bottom,
        animationName: ANIMATIONS[animIdx],
        duration,
        delay,
        colorClass: SPARK_COLORS[colorIdx],
      };
    });
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 1 }}
    >
      {sparks.map(spark => (
        <div
          key={spark.id}
          className={`absolute pointer-events-none select-none inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-heading font-semibold whitespace-nowrap ${spark.colorClass}`}
          style={{
            left: `${spark.left}%`,
            bottom: `${spark.bottom}%`,
            animationName: spark.animationName,
            animationDuration: `${spark.duration}s`,
            animationDelay: `${spark.delay}s`,
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
            animationFillMode: 'both',
          }}
        >
          {spark.label}
        </div>
      ))}
    </div>
  );
}
