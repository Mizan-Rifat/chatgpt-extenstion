import { defineConfig } from "@twind/core";
import presetTailwind from "@twind/preset-tailwind";
import presetAutoprefix from "@twind/preset-autoprefix";

export default defineConfig({
  presets: [presetAutoprefix(), presetTailwind()],
  darkMode: "class",
  theme: {
    colors: {
      "ext-primary": "#215253",
      "ext-primary-dark": "#0D2E2F",
      "ext-secondary": "#FFFFDF",
    },
    animation: {
      woong: "woong 1.5s infinite",
    },
    keyframes: {
      woong: {
        "0%": { transform: "scale(1.2)" },
        "50%": { transform: "scale(1.8)", opacity: 0.5 },
        "100%": { transform: "scale(2.4)", opacity: 0 },
      },
    },
  },
});

// @-webkit-keyframes woong {
//   0% {
//     -webkit-trasform: scale(1.2);
//   }

//   50% {
//     -webkit-transform: scale(1.8);
//     opacity: 0.5;
//   }

//   100% {
//     -webkit-transform: scale(2.4);
//     opacity: 0;
//   }
// }
