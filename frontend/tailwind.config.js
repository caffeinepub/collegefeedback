/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Sora', 'Inter', 'sans-serif'],
        brand: ['Sora', 'Inter', 'sans-serif'],
      },
      colors: {
        background: 'oklch(var(--background) / <alpha-value>)',
        foreground: 'oklch(var(--foreground) / <alpha-value>)',
        card: {
          DEFAULT: 'oklch(var(--card) / <alpha-value>)',
          foreground: 'oklch(var(--card-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'oklch(var(--popover) / <alpha-value>)',
          foreground: 'oklch(var(--popover-foreground) / <alpha-value>)',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        violet: {
          50: '#f3f0ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#5B4EE8',
          700: '#4c3bc7',
          800: '#3d2fa0',
          900: '#2e2278',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        pill: '9999px',
      },
      boxShadow: {
        'card': '0 1px 4px oklch(0 0 0 / 0.06), 0 4px 16px oklch(0 0 0 / 0.04)',
        'nav': '0 2px 12px oklch(0.52 0.22 270 / 0.08), 0 1px 3px oklch(0 0 0 / 0.06)',
        'violet': '0 4px 20px oklch(0.52 0.22 270 / 0.25)',
      },
      animation: {
        'spark-float-1': 'spark-float-1 6s ease-in-out infinite',
        'spark-float-2': 'spark-float-2 8s ease-in-out infinite',
        'spark-float-3': 'spark-float-3 7s ease-in-out infinite',
        'spark-float-4': 'spark-float-4 9s ease-in-out infinite',
      },
      keyframes: {
        'spark-float-1': {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px) rotate(0deg)', opacity: '0.6' },
          '25%': { transform: 'translateY(-18px) translateX(8px) rotate(5deg)', opacity: '0.9' },
          '50%': { transform: 'translateY(-8px) translateX(-6px) rotate(-3deg)', opacity: '0.7' },
          '75%': { transform: 'translateY(-22px) translateX(4px) rotate(8deg)', opacity: '0.85' },
        },
        'spark-float-2': {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px) rotate(0deg)', opacity: '0.5' },
          '33%': { transform: 'translateY(-14px) translateX(-10px) rotate(-6deg)', opacity: '0.8' },
          '66%': { transform: 'translateY(-20px) translateX(12px) rotate(4deg)', opacity: '0.65' },
        },
        'spark-float-3': {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px) rotate(0deg)', opacity: '0.55' },
          '20%': { transform: 'translateY(-10px) translateX(6px) rotate(3deg)', opacity: '0.75' },
          '60%': { transform: 'translateY(-24px) translateX(-8px) rotate(-5deg)', opacity: '0.9' },
          '80%': { transform: 'translateY(-16px) translateX(10px) rotate(7deg)', opacity: '0.6' },
        },
        'spark-float-4': {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px) rotate(0deg)', opacity: '0.6' },
          '40%': { transform: 'translateY(-20px) translateX(-12px) rotate(-8deg)', opacity: '0.85' },
          '70%': { transform: 'translateY(-12px) translateX(8px) rotate(4deg)', opacity: '0.7' },
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
  ],
}
