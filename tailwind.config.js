import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                display: ['Archivo', 'system-ui', 'sans-serif'],
                sans: ['Barlow', 'system-ui', 'sans-serif'],
                mono: ['ui-monospace', 'Menlo', 'monospace'],
            },
            colors: {
                green: {
                    DEFAULT: '#2FAA22',
                    dark: '#26901B',
                    light: '#EAF7E7',
                    bright: '#7FE06F',
                },
                navy: {
                    DEFAULT: '#0D0D5B',
                    deep: '#080842',
                    700: '#3B3C63',
                    600: '#4A4C72',
                    500: '#6E7091',
                },
                ink: {
                    300: '#B4B6CB',
                    400: '#9A9CB4',
                    500: '#8A8CA8',
                },
                mist: {
                    50: '#F4F5FA',
                    100: '#F1F2F8',
                    200: '#EEF0F6',
                    300: '#E4E5F0',
                    400: '#E0E2EE',
                    border: '#D9DBE9',
                    tile: '#DFE2EE',
                    tile2: '#EDEFF6',
                },
                alert: '#C4462F',
            },
        },
    },

    plugins: [forms],
};
