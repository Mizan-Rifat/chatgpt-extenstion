import reloadOnUpdate from "virtual:reload-on-update-in-background-script";
reloadOnUpdate("pages/background");
reloadOnUpdate("pages/content/style.scss");

console.log("background loaded");
chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
  if (info.title && tab.url && tab.url.includes("chat.openai.com")) {
    const chatId = tab.url.split("/").pop();
    if (chatId) {
      chrome.tabs.sendMessage(tabId, { chatId });
    }
  }
});

export {};
