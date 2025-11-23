import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#3498db',
        secondary: '#95a5a6',
        success: '#27ae60',
        warning: '#e67e22',
        danger: '#e74c3c',
      },
    },
  },
  plugins: [],
}
export default config
