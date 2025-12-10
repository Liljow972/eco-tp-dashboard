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
        ecotp: {
          green: {
            DEFAULT: '#0B3D2E',
            50: '#E8F5F1',
            100: '#CBEBE3',
            200: '#9ED8C9',
            300: '#6FC4B0',
            400: '#45AD96',
            500: '#0B3D2E', // Base
            600: '#083226',
            700: '#06281E',
            800: '#041D16',
            900: '#02120E',
          },
          beige: {
            DEFAULT: '#F5F0E8',
            50: '#FDFBF9',
            100: '#FAF6F2',
            200: '#F5F0E8', // Base
            300: '#EBE0D1',
            400: '#E0CEB5',
            500: '#D6BC99',
          },
          brown: {
             DEFAULT: '#8D6E63', // Complementary earth tone
             500: '#8D6E63',
          },
          white: '#FFFFFF',
          gray: {
            50: '#F9FAFB',
            100: '#F3F4F6',
            200: '#E5E7EB',
            300: '#D1D5DB',
            400: '#9CA3AF',
            500: '#6B7280',
            600: '#4B5563',
            700: '#374151',
            800: '#1F2937',
            900: '#111827',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.7s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass': 'linear-gradient(145deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.2) 100%)',
      },
    },
  },
  plugins: [],
}
export default config