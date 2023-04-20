/** @type {import('tailwindcss').Config} */
const config = {
  content: ["node_modules/daisyui/**/*", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xxs: "425px",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      "dark",
      {
        light: {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          ...require("daisyui/src/colors/themes")["[data-theme=light]"],
          "base-100": "#e2e8f0",
          "base-200": "#cbd5e1",
          "base-300": "#94a3b8",
        },
      },
    ],
  },
};

module.exports = config;
