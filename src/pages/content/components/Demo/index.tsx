import { createRoot } from "react-dom/client";
import App from "@src/pages/content/components/Demo/app";
import refreshOnUpdate from "virtual:reload-on-update-in-view";
import { attachTwindStyle } from "@src/shared/style/twind";

refreshOnUpdate("pages/content");

const textArea = document.querySelector("#prompt-textarea");

if (textArea) {
  const micBtnContainer = document.createElement("div");

  textArea.parentNode.insertBefore(micBtnContainer, textArea.nextSibling);

  console.log({ textArea });

  attachTwindStyle(micBtnContainer, document);

  createRoot(micBtnContainer).render(<App />);
}
