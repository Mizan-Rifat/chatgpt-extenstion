type Selectors = {
  textarea: string;
  micBtnContainer: string;
  sendButton: string;
  stopGenerating: string;
};

type Elements = {
  [K in keyof Selectors]: HTMLElement | null;
};

export const selectors: Selectors = {
  textarea: "#prompt-textarea",
  micBtnContainer: ".mic-btn-container",
  sendButton: "[data-testid='fruitjuice-send-button']",
  stopGenerating: `[aria-label="Stop generating"]`,
};

export const classNames = {
  micBtnContainer: "mic-btn-container",
};

export const ids = {};

export const getElement: (selector: string) => HTMLElement | null = (
  selector
) => document.querySelector(selector);

export const getElements = (selector: string) =>
  document.querySelectorAll(selector);

export const elements: () => Elements = () =>
  Object.keys(selectors).reduce((acc, selector) => {
    const key = selector as keyof Selectors;
    acc[key] = getElement(selectors[key]);
    return acc;
  }, {} as Elements);
