import { ChangeEvent, useEffect, useState } from "react";
import { Xmark } from "./Icons";
import classNames from "classnames";
import { getStorageValue, setStorageValue } from "../../utils";
import Portal from "./Portal";
import ShortCuts from "./ShortCuts";

const speechRecognitionLanguages = {
  af: "Afrikaans",
  eu: "Basque",
  bg: "Bulgarian",
  ca: "Catalan",
  "ar-EG": "Arabic (Egypt)",
  "ar-JO": "Arabic (Jordan)",
  "ar-KW": "Arabic (Kuwait)",
  "ar-LB": "Arabic (Lebanon)",
  "ar-QA": "Arabic (Qatar)",
  "ar-AE": "Arabic (UAE)",
  "ar-MA": "Arabic (Morocco)",
  "ar-IQ": "Arabic (Iraq)",
  "ar-DZ": "Arabic (Algeria)",
  "ar-BH": "Arabic (Bahrain)",
  "ar-LY": "Arabic (Lybia)",
  "ar-OM": "Arabic (Oman)",
  "ar-SA": "Arabic (Saudi Arabia)",
  "ar-TN": "Arabic (Tunisia)",
  "ar-YE": "Arabic (Yemen)",
  cs: "Czech",
  "nl-NL": "Dutch",
  "en-AU": "English (Australia)",
  "en-CA": "English (Canada)",
  "en-IN": "English (India)",
  "en-NZ": "English (New Zealand)",
  "en-ZA": "English (South Africa)",
  "en-GB": "English(UK)",
  "en-US": "English(US)",
  fi: "Finnish",
  "fr-FR": "French",
  gl: "Galician",
  "de-DE": "German",
  "el-GR": "Greek",
  he: "Hebrew",
  hu: "Hungarian",
  is: "Icelandic",
  "it-IT": "Italian",
  id: "Indonesian",
  ja: "Japanese",
  ko: "Korean",
  la: "Latin",
  "zh-CN": "Mandarin Chinese",
  "zh-TW": "Taiwanese",
  "zh-HK": "Cantonese",
  "ms-MY": "Malaysian",
  "no-NO": "Norwegian",
  pl: "Polish",
  "xx-piglatin": "Pig Latin",
  "pt-PT": "Portuguese",
  "pt-br": "Portuguese (Brasil)",
  "ro-RO": "Romanian",
  ru: "Russian",
  "sr-SP": "Serbian",
  sk: "Slovak",
  "es-AR": "Spanish (Argentina)",
  "es-BO": "Spanish (Bolivia)",
  "es-CL": "Spanish (Chile)",
  "es-CO": "Spanish (Colombia)",
  "es-CR": "Spanish (Costa Rica)",
  "es-DO": "Spanish (Dominican Republic)",
  "es-EC": "Spanish (Ecuador)",
  "es-SV": "Spanish (El Salvador)",
  "es-GT": "Spanish (Guatemala)",
  "es-HN": "Spanish (Honduras)",
  "es-MX": "Spanish (Mexico)",
  "es-NI": "Spanish (Nicaragua)",
  "es-PA": "Spanish (Panama)",
  "es-PY": "Spanish (Paraguay)",
  "es-PE": "Spanish (Peru)",
  "es-PR": "Spanish (Puerto Rico)",
  "es-ES": "Spanish (Spain)",
  "es-US": "Spanish (US)",
  "es-UY": "Spanish (Uruguay)",
  "es-VE": "Spanish (Venezuela)",
  "sv-SE": "Swedish",
  tr: "Turkish",
  zu: "Zulu",
};

const autoSubmitDelayValues = {
  "1": 1,
  "2": 2,
  "3": 2,
  "4": 4,
  "5": 5,
};

const SettingsModal = ({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) => {
  const [voiceLang, setVoiceLang] = useState("");
  const [autoSubmit, setAutoSubmit] = useState(false);
  const [autoSubmitDelay, setAutoSubmitDelay] = useState(3);

  useEffect(() => {
    (async () => {
      const voice_lang = (await getStorageValue("voice_lang")) || "en-US";
      const auto_submit = await getStorageValue("auto_submit");
      const auto_submit_delay = await getStorageValue("auto_submit_delay");
      setVoiceLang(voice_lang);
      setAutoSubmit(auto_submit);
      setAutoSubmitDelay(auto_submit_delay);
    })();
  }, []);

  return (
    <Portal>
      <div
        data-state="open"
        className={classNames(
          "bg-black/50 dark:bg-gray-600/70 fixed inset-0 z-50",
          {
            hidden: !open,
          }
        )}
        style={{ pointerEvents: "auto" }}
      >
        <div className="grid grid-cols-[10px_1fr_10px] grid-rows-[minmax(10px,_1fr)_auto_minmax(10px,_1fr)] h-full md:grid-rows-[minmax(20px,_1fr)_auto_minmax(20px,_1fr)] overflow-y-auto w-full">
          <div
            role="dialog"
            className="-translate-x-1/2 bg-white col-auto col-start-2 dark:bg-gray-900 left-1/2  relative rounded-lg row-auto row-start-2 shadow-xl text-left transition-all max-w-lg lg:max-w-[896px]"
            style={{ pointerEvents: "auto" }}
          >
            <div className="px-4 pb-4 pt-5 sm:p-6 flex items-center justify-between border-b border-black/10 dark:border-white/10">
              <div className="flex">
                <div className="flex items-center">
                  <div className="flex flex-col gap-1 text-center sm:text-left">
                    <h2 className="text-lg font-semibold leading-6 text-token-text-primary">
                      VoiceGPT
                    </h2>
                  </div>
                </div>
              </div>
              <button
                className="text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={handleClose}
              >
                <Xmark />
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-6 sm:pt-4">
              <div className="">
                <div
                  dir="ltr"
                  data-orientation="vertical"
                  className="flex flex-col gap-6 md:flex-row"
                >
                  <div
                    data-state="active"
                    data-orientation="vertical"
                    role="tabpanel"
                    aria-labelledby="radix-:rf:-trigger-General"
                    id="radix-:rf:-content-General"
                    tabIndex={0}
                    className="w-full"
                    style={{}}
                  >
                    <div className="flex flex-col gap-3 text-sm text-token-text-primary">
                      {/* ------------------------------------ */}
                      <div className="border-b border-token-border-light pb-3 last-of-type:border-b-0">
                        <div className="flex items-center justify-between">
                          <div>Auto Submit</div>
                          <button
                            type="button"
                            role="switch"
                            aria-checked={autoSubmit ? "true" : "false"}
                            data-state={autoSubmit ? "checked" : "unchecked"}
                            value="on"
                            aria-label="Always show code when using data analyst"
                            className="cursor-pointer bg-gray-200 radix-state-checked:!bg-green-600 dark:border dark:border-token-border-medium dark:bg-transparent relative shrink-0 rounded-full dark:radix-state-checked:border-green-600 h-[20px] w-[32px]"
                            onClick={() => {
                              setAutoSubmit(!autoSubmit);
                              setStorageValue({ auto_submit: !autoSubmit });
                            }}
                          >
                            <span
                              data-state={autoSubmit ? "checked" : "unchecked"}
                              className="flex items-center justify-center rounded-full transition-transform duration-100 will-change-transform ltr:translate-x-0.5 rtl:-translate-x-0.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.45)] h-[16px] w-[16px] ltr:radix-state-checked:translate-x-[14px] rtl:radix-state-checked:translate-x-[-14px]"
                            />
                          </button>
                        </div>
                        <div className="text-xs text-token-text-secondary pr-12">
                          The auto-submit feature in VoiceGPT is
                          context-sensitive. It's disabled while typing and
                          activates when you switch to voice input. If you
                          return to typing, auto-submit stays inactive until you
                          start talking again,
                        </div>
                      </div>

                      <SelectBox
                        label="Auto-Submit Delay (seconds)"
                        options={autoSubmitDelayValues}
                        value={autoSubmitDelay}
                        varint="seconadry"
                        onChange={(e) => {
                          const val = e.target.value;
                          setAutoSubmitDelay(Number(val));
                          setStorageValue({ auto_submit_delay: Number(val) });
                        }}
                      />

                      <SelectBox
                        label="Speech-to-Text Language"
                        options={speechRecognitionLanguages}
                        value={voiceLang}
                        onChange={(e) => {
                          const val = e.target.value;
                          setVoiceLang(val);
                          setStorageValue({ voice_lang: val });
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-r border-black/10 dark:border-white/10 hidden lg:flex"></div>

              <ShortCuts />
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

const SelectBox = ({
  label,
  options,
  value,
  onChange,
  varint = "primary",
}: {
  label: string;
  options: { [key: string]: string | number };
  value: string | number;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  varint?: "primary" | "seconadry";
}) => {
  return (
    <div className="border-b border-token-border-light pb-3">
      <div className="flex items-center justify-between">
        <div>{label}</div>
        <select
          value={value}
          onChange={onChange}
          className="w-40 pr-8 charttext-gray-700 border border-transparent inline-flex h-9 items-center justify-center gap-4 rounded-md bg-white px-3 text-sm dark:text-gray-200 dark:transparent dark:bg-transparent leading-none outline-none cursor-pointer hover:bg-gray-50 dark:hover:bg-[#494A54] focus-visible:border-blue-500 dark:focus-visible:border-blue-500 radix-state-active:text-gray-600 dark:radix-state-active::text-gray-400 radix-disabled:cursor-auto radix-disabled:bg-transparent radix-disabled:text-gray-500 dark:radix-disabled:bg-transparent dark:radix-disabled:text-gray-500"
        >
          {Object.keys(options).map((option) => (
            <option value={option} key={option}>
              {varint === "primary" && options[option]} <code>{option}</code>
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SettingsModal;
