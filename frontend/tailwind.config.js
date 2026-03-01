/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        brand: ["Dancing Script", "cursive"],
        heading: ["Bricolage Grotesque", "sans-serif"],
        sans: ["DM Sans", "sans-serif"],
      },
      colors: {
        background: "oklch(var(--background) / <alpha-value>)",
        foreground: "oklch(var(--foreground) / <alpha-value>)",
        card: {
          DEFAULT: "oklch(var(--card) / <alpha-value>)",
          foreground: "oklch(var(--card-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "oklch(var(--popover) / <alpha-value>)",
          foreground: "oklch(var(--popover-foreground) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "oklch(var(--primary) / <alpha-value>)",
          foreground: "oklch(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "oklch(var(--secondary) / <alpha-value>)",
          foreground: "oklch(var(--secondary-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "oklch(var(--muted) / <alpha-value>)",
          foreground: "oklch(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "oklch(var(--accent) / <alpha-value>)",
          foreground: "oklch(var(--accent-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive) / <alpha-value>)",
          foreground: "oklch(var(--destructive-foreground) / <alpha-value>)",
        },
        border: "oklch(var(--border) / <alpha-value>)",
        input: "oklch(var(--input) / <alpha-value>)",
        ring: "oklch(var(--ring) / <alpha-value>)",
        sidebar: {
          DEFAULT: "oklch(var(--sidebar-background) / <alpha-value>)",
          foreground: "oklch(var(--sidebar-foreground) / <alpha-value>)",
          primary: "oklch(var(--sidebar-primary) / <alpha-value>)",
          "primary-foreground": "oklch(var(--sidebar-primary-foreground) / <alpha-value>)",
          accent: "oklch(var(--sidebar-accent) / <alpha-value>)",
          "accent-foreground": "oklch(var(--sidebar-accent-foreground) / <alpha-value>)",
          border: "oklch(var(--sidebar-border) / <alpha-value>)",
          ring: "oklch(var(--sidebar-ring) / <alpha-value>)",
        },
        warm: {
          sand: "var(--warm-sand)",
          terracotta: "var(--warm-terracotta)",
          peach: "var(--warm-peach)",
          cream: "var(--warm-cream)",
          brown: "var(--warm-brown)",
          sienna: "var(--warm-sienna)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "spark-float-1": "spark-float-1 var(--duration, 4s) ease-in-out infinite",
        "spark-float-2": "spark-float-2 var(--duration, 4.5s) ease-in-out infinite",
        "spark-float-3": "spark-float-3 var(--duration, 3.8s) ease-in-out infinite",
        "spark-float-4": "spark-float-4 var(--duration, 5s) ease-in-out infinite",
      },
      keyframes: {
        "spark-float-1": {
          "0%": { transform: "translateY(0px) translateX(0px) scale(0.8)", opacity: "0" },
          "10%": { transform: "translateY(-8px) translateX(4px) scale(1.3)", opacity: "1" },
          "20%": { transform: "translateY(-15px) translateX(2px) scale(1.0)", opacity: "0.9" },
          "80%": { transform: "translateY(-80px) translateX(-6px) scale(0.95)", opacity: "0.7" },
          "100%": { transform: "translateY(-120px) translateX(8px) scale(0.85)", opacity: "0" },
        },
        "spark-float-2": {
          "0%": { transform: "translateY(0px) translateX(0px) scale(0.8)", opacity: "0" },
          "10%": { transform: "translateY(-6px) translateX(-5px) scale(1.3)", opacity: "1" },
          "20%": { transform: "translateY(-12px) translateX(-3px) scale(1.0)", opacity: "0.9" },
          "80%": { transform: "translateY(-90px) translateX(8px) scale(0.95)", opacity: "0.7" },
          "100%": { transform: "translateY(-130px) translateX(-4px) scale(0.85)", opacity: "0" },
        },
        "spark-float-3": {
          "0%": { transform: "translateY(0px) translateX(0px) scale(0.8)", opacity: "0" },
          "10%": { transform: "translateY(-10px) translateX(6px) scale(1.3)", opacity: "1" },
          "20%": { transform: "translateY(-18px) translateX(4px) scale(1.0)", opacity: "0.9" },
          "80%": { transform: "translateY(-70px) translateX(-10px) scale(0.95)", opacity: "0.7" },
          "100%": { transform: "translateY(-110px) translateX(6px) scale(0.85)", opacity: "0" },
        },
        "spark-float-4": {
          "0%": { transform: "translateY(0px) translateX(0px) scale(0.8)", opacity: "0" },
          "10%": { transform: "translateY(-7px) translateX(-4px) scale(1.3)", opacity: "1" },
          "20%": { transform: "translateY(-14px) translateX(-2px) scale(1.0)", opacity: "0.9" },
          "80%": { transform: "translateY(-85px) translateX(5px) scale(0.95)", opacity: "0.7" },
          "100%": { transform: "translateY(-125px) translateX(-8px) scale(0.85)", opacity: "0" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
