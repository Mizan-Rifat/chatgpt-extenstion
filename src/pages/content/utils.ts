export const getStorageValue = async (key: string) => {
  const result = await chrome.storage.local.get(key);
  return result[key];
};
export const setStorageValue = (value: { [key: string]: any }) =>
  chrome.storage.local.set(value);
