import React, { useMemo } from 'react';

interface Particle {
  id: number;
  top: string;
  left: string;
  width: string;
  height: string;
  color: string;
  shadow: string;
  animation: string;
  delay: string;
  opacity: number;
}

const VIOLET_NEUTRAL_COLORS = [
  // Violet shades
  '#5B4EE8',
  '#7C6FF0',
  '#9B8FF5',
  '#C4B5FD',
  '#DDD6FE',
  // Neutral grays
  '#D4D4D4',
  '#A3A3A3',
  '#E5E5E5',
  '#F5F5F5',
  // Light violet tints
  '#EDE9FE',
  '#F3F0FF',
];

const ANIMATIONS = [
  'spark-float-1',
  'spark-float-2',
  'spark-float-3',
  'spark-float-4',
];

function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

export default function SparkParticles() {
  const particles = useMemo<Particle[]>(() => {
    const result: Particle[] = [];
    const gridCols = 4;
    const gridRows = 4;
    const cellW = 100 / gridCols;
    const cellH = 100 / gridRows;

    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridCols; col++) {
        const idx = row * gridCols + col;
        const r1 = seededRandom(idx * 7 + 1);
        const r2 = seededRandom(idx * 7 + 2);
        const r3 = seededRandom(idx * 7 + 3);
        const r4 = seededRandom(idx * 7 + 4);
        const r5 = seededRandom(idx * 7 + 5);
        const r6 = seededRandom(idx * 7 + 6);

        const topPct = cellH * row + r1 * cellH * 0.8 + cellH * 0.1;
        const leftPct = cellW * col + r2 * cellW * 0.8 + cellW * 0.1;

        const colorIdx = Math.floor(r3 * VIOLET_NEUTRAL_COLORS.length);
        const color = VIOLET_NEUTRAL_COLORS[colorIdx];

        const animIdx = Math.floor(r4 * ANIMATIONS.length);
        const animation = ANIMATIONS[animIdx];

        const width = Math.floor(r5 * 40 + 20);
        const height = Math.floor(r6 * 10 + 6);

        // Violet particles get a violet glow, neutrals get a subtle shadow
        const isViolet = colorIdx < 5;
        const shadow = isViolet
          ? `0 0 8px 2px #5B4EE840`
          : `0 0 4px 1px #00000010`;

        const delay = `${(seededRandom(idx * 3 + 99) * 5).toFixed(2)}s`;
        const opacity = 0.35 + seededRandom(idx * 2 + 55) * 0.45;

        result.push({
          id: idx,
          top: `${topPct.toFixed(2)}%`,
          left: `${leftPct.toFixed(2)}%`,
          width: `${width}px`,
          height: `${height}px`,
          color,
          shadow,
          animation,
          delay,
          opacity,
        });
      }
    }
    return result;
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            top: p.top,
            left: p.left,
            width: p.width,
            height: p.height,
            borderRadius: '9999px',
            backgroundColor: p.color,
            boxShadow: p.shadow,
            opacity: p.opacity,
            animationName: p.animation,
            animationDuration: p.animation === 'spark-float-1' ? '6s'
              : p.animation === 'spark-float-2' ? '8s'
              : p.animation === 'spark-float-3' ? '7s'
              : '9s',
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
}
