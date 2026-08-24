/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        canvas: {
          light: '#F5F6F8',
          dark: '#0A0A0F',
        },
        panel: {
          light: '#FFFFFF',
          dark: '#12131A',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#181924',
        },
        ink: {
          light: '#1A1D26',
          dark: '#ECEDF2',
        },
        muted: {
          light: '#6B7280',
          dark: '#8A8D9C',
        },
        line: {
          light: '#E4E6EB',
          dark: '#252732',
        },
        accent: {
          DEFAULT: '#7C5CFC',
          hover: '#6B46F0',
          soft: '#EDE9FE',
        },
        stage: {
          wishlist: '#8B90A0',
          applied: '#3B82F6',
          followup: '#E8A23D',
          interview: '#8B5CF6',
          offer: '#22C55E',
          rejected: '#E5566D',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 18, 25, 0.06), 0 1px 1px rgba(15,18,25,0.04)',
        cardHover: '0 8px 20px rgba(15, 18, 25, 0.10)',
        modal: '0 20px 60px rgba(0,0,0,0.25)',
      },
      keyframes: {
        popIn: {
          '0%': { opacity: 0, transform: 'translateY(6px) scale(0.98)' },
          '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
        },
        slideOver: {
          '0%': { transform: 'translateX(24px)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
      },
      animation: {
        popIn: 'popIn 0.16s ease-out',
        slideOver: 'slideOver 0.22s ease-out',
      },
    },
  },
  plugins: [],
};
