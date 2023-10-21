import { createRoot } from "react-dom/client";
import MicButton from "@root/src/pages/content/components/app/MicButton";
import SpeakarButton from "@root/src/pages/content/components/app/SpeakarButton";
import SettingsButton from "@root/src/pages/content/components/app/SettingsButton";
import refreshOnUpdate from "virtual:reload-on-update-in-view";
import { attachTwindStyle } from "@src/shared/style/twind";
refreshOnUpdate("pages/content");
import "../../style.scss";
import { classNames, elements, getElements, selectors } from "../../elements";
import { getStorageValue, setStorageValue } from "../../utils";

const { groupContainer } = elements();

let initializedChatId = "";

chrome.runtime.onMessage.addListener(({ chatId }) => {
  addMicBtn();
  if (initializedChatId !== chatId) {
    const groups = getElements(selectors.groups);

    if (groups.length > 0) {
      groups.forEach((group) => {
        addSpeakarButton(group);
      });
      initializedChatId = chatId;
    }
  }
});

const addSpeakarButton = (containerEl) => {
  window.speechSynthesis.cancel();
  const els = containerEl.querySelectorAll(selectors.actionButtons);

  const speakerBtnContainer = document.createElement("div");
  speakerBtnContainer.classList.add(classNames.speakerBtnContainer);
  els[els.length - 1].parentNode.append(speakerBtnContainer);

  createRoot(speakerBtnContainer).render(<SpeakarButton />);
};

const addMicBtn = () => {
  const { micBtnContainer, sendButton, textarea } = elements();

  if (textarea && !micBtnContainer) {
    const micBtnContainerDiv = document.createElement("div");
    micBtnContainerDiv.classList.add(classNames.micBtnContainer);
    textarea.parentNode.insertBefore(micBtnContainerDiv, sendButton);

    attachTwindStyle(micBtnContainerDiv, document);

    createRoot(micBtnContainerDiv).render(<MicButton />);
  }
};

const mutationObserver = new MutationObserver((entries) => {
  entries.forEach((entry) => {
    const addedNodes = Array.from(entry.addedNodes) as HTMLElement[];
    if (addedNodes.length > 0 && addedNodes[0]?.classList?.contains("group")) {
      addSpeakarButton(addedNodes[0]);
    }
    if (
      addedNodes.length > 0 &&
      addedNodes[0]?.classList?.contains("markdown")
    ) {
      const containerEl = addedNodes[0].closest(".group");
      if (containerEl.querySelector(selectors.speakerBtnContainer)) {
        containerEl.querySelector(selectors.speakerBtnContainer).remove();
      }
      addSpeakarButton(containerEl);
    }
  });
});

mutationObserver.observe(groupContainer, {
  childList: true,
  subtree: true,
});

addMicBtn();

const modalContainer = document.createElement("div");
document.body.append(modalContainer);
// attachTwindStyle(modalContainer, document);
createRoot(modalContainer).render(<SettingsButton />);

(async () => {
  // const speechLang = await getStorageValue("speech_lang");
  const voiceLang = await getStorageValue("voice_lang");
  const speechLang = await getStorageValue("speech_lang");
  if (!voiceLang) {
    setStorageValue({ voice_lang: "en-US" });
  }
  if (!speechLang) {
    setStorageValue({ speech_lang: "en-US" });
  }
})();
