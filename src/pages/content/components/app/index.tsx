import { createRoot } from "react-dom/client";
import MicButton from "@root/src/pages/content/components/app/MicButton";
import SettingsButton from "@root/src/pages/content/components/app/SettingsButton";
import refreshOnUpdate from "virtual:reload-on-update-in-view";
import { attachTwindStyle } from "@src/shared/style/twind";
refreshOnUpdate("pages/content");
import "../../style.scss";
import { classNames, elements } from "../../elements";
import { getStorageValue, setStorageValue } from "../../utils";
import { ReactNode } from "react";

chrome.runtime.onMessage.addListener(() => {
  addMicBtn();
});

const attchShadowDom = (node: ReactNode, rootClass?: string[]) => {
  const root = document.createElement("div");
  if (rootClass) {
    rootClass.forEach((className) => {
      root.classList.add(className);
    });
  }
  const shadowRoot = root.attachShadow({ mode: "open" });

  const rootIntoShadow = document.createElement("div");
  shadowRoot.appendChild(rootIntoShadow);

  attachTwindStyle(rootIntoShadow, shadowRoot);
  createRoot(rootIntoShadow).render(node);

  return { root, shadowRoot };
};

const addMicBtn = () => {
  const { micBtnContainer, sendButton, textarea } = elements();

  if (textarea && !micBtnContainer) {
    const { root: modalContainer } = attchShadowDom(<MicButton />, [
      classNames.micBtnContainer,
      "relative",
    ]);
    sendButton.parentNode.insertBefore(modalContainer, sendButton);
  }
};

addMicBtn();

const { root: modalContainer } = attchShadowDom(<SettingsButton />);
document.body.append(modalContainer);

(async () => {
  const voiceLang = await getStorageValue("voice_lang");
  const autoSubmit = await getStorageValue("auto_submit");
  const autoSubmitDelay = await getStorageValue("auto_submit_delay");

  if (!voiceLang) {
    setStorageValue({ voice_lang: "en-US" });
  }
  if (!autoSubmit) {
    setStorageValue({ auto_submit: false });
  }
  if (!autoSubmitDelay) {
    setStorageValue({ auto_submit_delay: 2 });
  }
})();
