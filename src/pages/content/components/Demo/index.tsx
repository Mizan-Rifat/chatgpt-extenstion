import { createRoot } from "react-dom/client";
import App from "@src/pages/content/components/Demo/app";
import refreshOnUpdate from "virtual:reload-on-update-in-view";
import { attachTwindStyle } from "@src/shared/style/twind";
refreshOnUpdate("pages/content");
import "../../style.scss";
import { elements, getElements, selectors } from "../../elements";

const { textarea, groupContainer } = elements();

// const groupContainer = getElements(selectors.groupContainer);
console.log({ groupContainer });

const mutationObserver = new MutationObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.addedNodes.length > 0) {
      console.log({ entries: entry.addedNodes[0] });
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
