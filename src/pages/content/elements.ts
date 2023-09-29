type Selectors = {
  textarea: string;
  groupContainer: string;
  groups: string;
};

type Elements = {
  [K in keyof Selectors]: HTMLElement | null;
};

export const selectors: Selectors = {
  textarea: "#prompt-textarea",
  groupContainer: `div[role="presentation"] > div`,
  groups: '[data-testid^="conversation-turn-"]',
};

export const classNames = {};

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
