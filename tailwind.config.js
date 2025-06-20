    /** @type {import('tailwindcss').Config} */
    export default {
      content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
      ],
      theme: {
        extend: {
          // Custom color palette for your app
          colors: {
            primary: '#4F46E5', // A vibrant indigo for primary actions/branding
            secondary: '#10B981', // A complementary emerald green
            darkBg: '#1F2937',   // Dark background color
            lightBg: '#F3F4F6',  // Light background color
            textDark: '#111827', // Dark text color
            textLight: '#F9FAFB', // Light text color
          },
        },
      },
      plugins: [],
    }
    