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
  },
});
