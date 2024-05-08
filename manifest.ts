import packageJson from "./package.json";

/**
 * After changing, please reload the extension at `chrome://extensions`
 */
const manifest: chrome.runtime.ManifestV3 = {
  manifest_version: 3,
  name: "VoiceGPT",
  version: packageJson.version,
  description: packageJson.description,
  permissions: ["storage", "tabs"],
  background: {
    service_worker: "src/pages/background/index.js",
    type: "module",
  },
  action: {
    default_icon: "icons/48x48.png",
  },

  icons: {
    "16": "icons/16x16.png",
    "32": "icons/32x32.png",
    "48": "icons/48x48.png",
    "128": "icons/128x128.png",
  },
  content_scripts: [
    {
      matches: ["https://chatgpt.com/*", "http://chatgpt.com/*"],
      js: ["src/pages/content/index.js"],
      // KEY for cache invalidation
      css: ["assets/css/contentStyle<KEY>.chunk.css"],
    },
  ],
  web_accessible_resources: [
    {
      resources: ["assets/js/*.js", "assets/css/*.css", "icons/*.png"],
      matches: ["*://*/*"],
    },
  ],
};

export default manifest;
