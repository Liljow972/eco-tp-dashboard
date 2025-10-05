import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      colors: {
        // Palette Eco TP strictement définie
        ecotp: {
          green: '#0B3D2E',
          beige: '#F5F0E8',
          white: '#FFFFFF',
          gray: {
            50: '#F2F2F2',
            200: '#E5E7EB',
            400: '#9CA3AF',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config