import { createRoot } from "react-dom/client";
import App from "@src/pages/content/components/Demo/app";
import refreshOnUpdate from "virtual:reload-on-update-in-view";
import { attachTwindStyle } from "@src/shared/style/twind";
refreshOnUpdate("pages/content");
import "../../style.scss";
import { elements, getElements, selectors } from "../../elements";
import SpeakarButton from "./SpeakarButton";

const { textarea, groupContainer } = elements();
let initialBtnsAdded = false;

const addSpeakarButton = (containerEl, isNew) => {
  const els = containerEl.querySelectorAll("button[class*='gizmo']");
  const speakerBtnContainer = document.createElement("div");
  els[els.length - 1].parentNode.append(speakerBtnContainer);

  // attachTwindStyle(speakerBtnContainer, document);
  createRoot(speakerBtnContainer).render(<SpeakarButton newItem={isNew} />);
};

const mutationObserver = new MutationObserver((entries) => {
  entries.forEach((entry) => {
    if (!initialBtnsAdded) {
      const groups = getElements(selectors.groups);
      groups.forEach((group) => {
        addSpeakarButton(group, false);
      });
      initialBtnsAdded = true;
    }

    if (
      entry.addedNodes.length > 0 &&
      entry.addedNodes[0]?.classList?.contains("group")
    ) {
      addSpeakarButton(entry.addedNodes[0], true);
    }
  });
});

mutationObserver.observe(groupContainer, {
  childList: true,
  subtree: true,
});

if (textarea) {
  const micBtnContainer = document.createElement("div");

  textarea.parentNode.insertBefore(micBtnContainer, textarea.nextSibling);

  attachTwindStyle(micBtnContainer, document);

  createRoot(micBtnContainer).render(<App />);
}
