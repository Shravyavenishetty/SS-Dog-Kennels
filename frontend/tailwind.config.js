/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                champagne: {
                    gold: '#F7E7CE',
                    DEFAULT: '#F7E7CE',
                },
                forest: {
                    green: '#2D5A2D',
                    DEFAULT: '#2D5A2D',
                },
                ivory: {
                    white: '#FAF9F6',
                    DEFAULT: '#FAF9F6',
                },
            },
            fontFamily: {
                playfair: ['"Playfair Display"', 'serif'],
                inter: ['Inter', 'sans-serif'],
            },
            width: {
                '1200': '1200px',
                '1440': '1440px',
            },
            maxWidth: {
                '1440': '1440px',
            },
            borderRadius: {
                '24': '24px',
            }
        },
    },
    plugins: [],
}
