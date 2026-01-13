/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,html}",
  ],
  theme: {
    extend: {
      colors: {
        'tactical': {
          'bg': '#18181b', // zinc-950
          'surface': '#27272a', // zinc-800
          'border': '#3f3f46', // zinc-700
          'accent': '#10b981', // emerald-500
          'accent-dark': '#059669', // emerald-600
          'text': '#f4f4f5', // zinc-100
          'text-muted': '#a1a1aa', // zinc-400
        }
      },
      fontFamily: {
        'mono': ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      borderWidth: {
        '3': '3px',
      },
      boxShadow: {
        'tactical': '0 0 10px rgba(16, 185, 129, 0.3)',
        'tactical-lg': '0 0 20px rgba(16, 185, 129, 0.5)',
      }
    },
  },
  plugins: [],
}

