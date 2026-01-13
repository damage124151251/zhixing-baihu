/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Backgrounds (Noite/Montanhas)
                'bg-primary': '#0a0a0f',
                'bg-secondary': '#12121a',
                'bg-card': '#1a1a25',
                'bg-mountain': '#0d0d12',

                // Brancos (Tigre)
                'tiger-white': '#f5f5f5',
                'tiger-glow': 'rgba(255, 255, 255, 0.3)',

                // Dourados (Poder/Riqueza)
                'gold': '#FFD700',
                'gold-light': '#FFEC8B',
                'gold-dark': '#B8860B',

                // Vermelhos (Chinês tradicional)
                'chinese-red': '#DC143C',
                'chinese-red-dark': '#8B0000',

                // Accent
                'jade': '#00A86B',
                'celestial-blue': '#4169E1',

                // Status
                'profit': '#00FF7F',
                'loss': '#FF4444',
            },
            fontFamily: {
                'chinese': ['Noto Serif SC', 'SimSun', 'serif'],
                'display': ['Cinzel', 'Times New Roman', 'serif'],
                'body': ['Inter', 'Arial', 'sans-serif'],
                'mono': ['JetBrains Mono', 'monospace'],
            },
            animation: {
                'breathe': 'breathe 4s ease-in-out infinite',
                'float': 'float 6s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite',
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
            },
            keyframes: {
                breathe: {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.02)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                glow: {
                    '0%, 100%': { filter: 'drop-shadow(0 0 5px rgba(255, 215, 0, 0.5))' },
                    '50%': { filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))' },
                },
                'pulse-glow': {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)' },
                    '50%': { boxShadow: '0 0 40px rgba(255, 215, 0, 0.6)' },
                },
            },
        },
    },
    plugins: [],
};
