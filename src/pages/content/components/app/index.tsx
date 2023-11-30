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
import { ReactNode } from "react";

const { groupContainer } = elements();

let initializedChatId = "";

chrome.runtime.onMessage.addListener(({ chatId }) => {
  addMicBtn();
  if (chatId !== "home" && initializedChatId !== chatId) {
    const groups = getElements(selectors.groups);

    if (groups.length > 0) {
      groups.forEach((group) => {
        addSpeakarButton(group);
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

const addSpeakarButton = (containerEl) => {
  window.speechSynthesis.cancel();
  const els = containerEl.querySelectorAll(selectors.actionButtons);

  console.log({ containerEl, els });

  if (els.length > 0) {
    const speakerBtnContainer = document.createElement("div");
    speakerBtnContainer.classList.add(classNames.speakerBtnContainer);
    els[els.length - 1].append(speakerBtnContainer);
    createRoot(speakerBtnContainer).render(<SpeakarButton />);
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
    if (entry.type === "attributes" && entry.attributeName === "class") {
      console.log({ entry });
    }

    const addedNodes = Array.from(entry.addedNodes) as HTMLElement[];

    if (addedNodes.length > 0 && addedNodes[0]?.getAttribute("data-testid")) {
      addSpeakarButton(addedNodes[0]);
    }
  });
});

mutationObserver.observe(groupContainer, {
  childList: true,
  subtree: true,
  attributes: true,
});

addMicBtn();

const { root: modalContainer } = attchShadowDom(<SettingsButton />);
document.body.append(modalContainer);

(async () => {
  const voiceLang = await getStorageValue("voice_lang");
  const speechLang = await getStorageValue("speech_lang");
  if (!voiceLang) {
    setStorageValue({ voice_lang: "en-US" });
  }
  if (!speechLang) {
    setStorageValue({ speech_lang: "en-US" });
  }
})();
