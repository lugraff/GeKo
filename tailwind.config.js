/** @type {import('tailwindcss').Config} */
module.exports = {
  //darkMode: 'class',
  content: ["./src/**/*.{html,ts}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      textA: "#ffffff",
      textB: "#000000",
      primary: "#82b74b",
      secondary: "#d9d9d9",
      tertiary: "#b4b4b4",
      warning: "#b2cc22",
      danger: "#cc9022",
      selection: "#405d27",
      bgA: "#303442",
      bgB: "#282b31",
    },
    extend: {
      keyframes: {
        wave: {
          "0%": { transform: "rotate(0.0deg)" },
          "10%": { transform: "rotate(14deg)" },
          "20%": { transform: "rotate(-8deg)" },
          "30%": { transform: "rotate(14deg)" },
          "40%": { transform: "rotate(-4deg)" },
          "50%": { transform: "rotate(10.0deg)" },
          "60%": { transform: "rotate(0.0deg)" },
          "100%": { transform: "rotate(0.0deg)" },
        },
        hover: {
          "0%": { transform: "none" },
          "50%": { transform: "translateY(-5%) translateX(2%) rotate(0.5deg)" },
        },
        move: {
          "0%": { transform: "none" },
          "50%": { transform: "translateX(-10%) rotate(0.5deg)" },
        },
      },
      animation: {
        waving: "wave 2s linear infinite",
        hover: "hover 3s linear infinite",
        move: "move 1s linear 1",
      },
    },
  },
  plugins: [require("tailwind-scrollbar"), require("tw-elements/dist/plugin")],
};

/*@keyframes bounce {
    0%, 100% {
        transform: translateY(-25%);
        animation-timing-function: cubic-bezier(0.8,0,1,1);
    }
    50% {
        transform: none;
        animation-timing-function: cubic-bezier(0,0,0.2,1);
    }
}
.animate-bounce {
    animation: bounce 1s infinite;
}*/
