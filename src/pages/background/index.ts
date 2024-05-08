import reloadOnUpdate from "virtual:reload-on-update-in-background-script";
reloadOnUpdate("pages/background");
reloadOnUpdate("pages/content/style.scss");

chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
  if (info.title && tab.url && tab.url.includes("chatgpt.com")) {
    let chatId = tab.url.split("/").pop();
    if (!chatId) {
      chatId = "home";
    }

    if (chatId) {
      chrome.tabs.sendMessage(tabId, { chatId });
    }
  }
});

export {};
