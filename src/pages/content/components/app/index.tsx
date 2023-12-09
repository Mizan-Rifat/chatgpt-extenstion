import { createRoot } from "react-dom/client";
import MicButton from "@root/src/pages/content/components/app/MicButton";
import SpeakerButton from "@root/src/pages/content/components/app/SpeakerButton";
import SettingsButton from "@root/src/pages/content/components/app/SettingsButton";
import refreshOnUpdate from "virtual:reload-on-update-in-view";
import { attachTwindStyle } from "@src/shared/style/twind";
refreshOnUpdate("pages/content");
import "../../style.scss";
import { classNames, elements, getElements, selectors } from "../../elements";
import { getStorageValue, setStorageValue } from "../../utils";
import { ReactNode } from "react";

let initializedChatId = "";

chrome.runtime.onMessage.addListener(({ chatId }) => {
  addMicBtn();
  if (chatId !== "home" && initializedChatId !== chatId) {
    const groups = getElements(selectors.groups);

    if (groups.length > 0) {
      groups.forEach((group) => {
        addSpeakerButton(group);
      });
      initializedChatId = chatId;
    }
  }
});

const attchShadowDom = (node: ReactNode) => {
  const root = document.createElement("div");
  const shadowRoot = root.attachShadow({ mode: "open" });

  const rootIntoShadow = document.createElement("div");
  shadowRoot.appendChild(rootIntoShadow);

  attachTwindStyle(rootIntoShadow, shadowRoot);
  createRoot(rootIntoShadow).render(node);

  return { root, shadowRoot };
};

const addSpeakerButton = (containerEl) => {
  window.speechSynthesis.cancel();
  const els = containerEl.querySelector(selectors.actionButtons);

  if (els && !els.querySelector(selectors.speakerBtnContainer)) {
    const speakerBtnContainer = document.createElement("div");
    speakerBtnContainer.classList.add(classNames.speakerBtnContainer);
    els.append(speakerBtnContainer);
    createRoot(speakerBtnContainer).render(<SpeakerButton />);
  }
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
    const removedNodes = entry.removedNodes[0] as HTMLElement;

    if (
      removedNodes?.nodeType === 1 &&
      removedNodes?.querySelector(selectors.stopGenerating)
    ) {
      const groups = getElements(selectors.groups);
      if (groups.length > 0) {
        groups.forEach((group) => {
          addSpeakerButton(group);
        });
      }
    }
  });
});

const { main } = elements();
mutationObserver.observe(main, {
  childList: true,
  subtree: true,
});

addMicBtn();

const { root: modalContainer } = attchShadowDom(<SettingsButton />);
document.body.append(modalContainer);

(async () => {
  const voiceLang = await getStorageValue("voice_lang");
  const speechLang = await getStorageValue("speech_lang");
  const autoSubmit = await getStorageValue("auto_submit");
  const autoSubmitDelay = await getStorageValue("auto_submit_delay");

  if (!voiceLang) {
    setStorageValue({ voice_lang: "en-US" });
  }
  if (!speechLang) {
    setStorageValue({ speech_lang: "en-US" });
  }
  if (!autoSubmit) {
    setStorageValue({ auto_submit: false });
  }
  if (!autoSubmitDelay) {
    setStorageValue({ auto_submit_delay: 2 });
  }
})();
