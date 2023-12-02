import { ChangeEvent, useEffect, useState } from "react";
import { Xmark } from "./Icons";
import classNames from "classnames";
import { getStorageValue, setStorageValue } from "../../utils";
import Portal from "./Portal";

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

const speechSynthesisLanguages = {
  af: "Afrikaans",
  "af-ZA": "Afrikaans (South Africa)",
  ar: "Arabic",
  "ar-AE": "Arabic (U.A.E.)",
  "ar-BH": "Arabic (Bahrain)",
  "ar-DZ": "Arabic (Algeria)",
  "ar-EG": "Arabic (Egypt)",
  "ar-IQ": "Arabic (Iraq)",
  "ar-JO": "Arabic (Jordan)",
  "ar-KW": "Arabic (Kuwait)",
  "ar-LB": "Arabic (Lebanon)",
  "ar-LY": "Arabic (Libya)",
  "ar-MA": "Arabic (Morocco)",
  "ar-OM": "Arabic (Oman)",
  "ar-QA": "Arabic (Qatar)",
  "ar-SA": "Arabic (Saudi Arabia)",
  "ar-SY": "Arabic (Syria)",
  "ar-TN": "Arabic (Tunisia)",
  "ar-YE": "Arabic (Yemen)",
  az: "Azeri (Latin)",
  "az-AZ": "Azeri (Cyrillic) (Azerbaijan)",
  be: "Belarusian",
  "be-BY": "Belarusian (Belarus)",
  bg: "Bulgarian",
  "bg-BG": "Bulgarian (Bulgaria)",
  "bs-BA": "Bosnian (Bosnia and Herzegovina)",
  ca: "Catalan",
  "ca-ES": "Catalan (Spain)",
  cs: "Czech",
  "cs-CZ": "Czech (Czech Republic)",
  cy: "Welsh",
  "cy-GB": "Welsh (United Kingdom)",
  da: "Danish",
  "da-DK": "Danish (Denmark)",
  de: "German",
  "de-AT": "German (Austria)",
  "de-CH": "German (Switzerland)",
  "de-DE": "German (Germany)",
  "de-LI": "German (Liechtenstein)",
  "de-LU": "German (Luxembourg)",
  dv: "Divehi",
  "dv-MV": "Divehi (Maldives)",
  el: "Greek",
  "el-GR": "Greek (Greece)",
  en: "English",
  "en-AU": "English (Australia)",
  "en-BZ": "English (Belize)",
  "en-CA": "English (Canada)",
  "en-CB": "English (Caribbean)",
  "en-GB": "English (UK)",
  "en-IE": "English (Ireland)",
  "en-JM": "English (Jamaica)",
  "en-NZ": "English (New Zealand)",
  "en-PH": "English (Republic of the Philippines)",
  "en-TT": "English (Trinidad and Tobago)",
  "en-US": "English (US)",
  "en-ZA": "English (South Africa)",
  "en-ZW": "English (Zimbabwe)",
  eo: "Esperanto",
  es: "Spanish",
  "es-AR": "Spanish (Argentina)",
  "es-BO": "Spanish (Bolivia)",
  "es-CL": "Spanish (Chile)",
  "es-CO": "Spanish (Colombia)",
  "es-CR": "Spanish (Costa Rica)",
  "es-DO": "Spanish (Dominican Republic)",
  "es-EC": "Spanish (Ecuador)",
  "es-ES": "Spanish (Spain)",
  "es-GT": "Spanish (Guatemala)",
  "es-HN": "Spanish (Honduras)",
  "es-MX": "Spanish (Mexico)",
  "es-NI": "Spanish (Nicaragua)",
  "es-PA": "Spanish (Panama)",
  "es-PE": "Spanish (Peru)",
  "es-PR": "Spanish (Puerto Rico)",
  "es-PY": "Spanish (Paraguay)",
  "es-SV": "Spanish (El Salvador)",
  "es-UY": "Spanish (Uruguay)",
  "es-VE": "Spanish (Venezuela)",
  et: "Estonian",
  "et-EE": "Estonian (Estonia)",
  eu: "Basque",
  "eu-ES": "Basque (Spain)",
  fa: "Farsi",
  "fa-IR": "Farsi (Iran)",
  fi: "Finnish",
  "fi-FI": "Finnish (Finland)",
  fo: "Faroese",
  "fo-FO": "Faroese (Faroe Islands)",
  fr: "French",
  "fr-BE": "French (Belgium)",
  "fr-CA": "French (Canada)",
  "fr-CH": "French (Switzerland)",
  "fr-FR": "French (France)",
  "fr-LU": "French (Luxembourg)",
  "fr-MC": "French (Principality of Monaco)",
  gl: "Galician",
  "gl-ES": "Galician (Spain)",
  gu: "Gujarati",
  "gu-IN": "Gujarati (India)",
  he: "Hebrew",
  "he-IL": "Hebrew (Israel)",
  hi: "Hindi",
  "hi-IN": "Hindi (India)",
  hr: "Croatian",
  "hr-BA": "Croatian (Bosnia and Herzegovina)",
  "hr-HR": "Croatian (Croatia)",
  hu: "Hungarian",
  "hu-HU": "Hungarian (Hungary)",
  hy: "Armenian",
  "hy-AM": "Armenian (Armenia)",
  id: "Indonesian",
  "id-ID": "Indonesian (Indonesia)",
  is: "Icelandic",
  "is-IS": "Icelandic (Iceland)",
  it: "Italian",
  "it-CH": "Italian (Switzerland)",
  "it-IT": "Italian (Italy)",
  ja: "Japanese",
  "ja-JP": "Japanese (Japan)",
  ka: "Georgian",
  "ka-GE": "Georgian (Georgia)",
  kk: "Kazakh",
  "kk-KZ": "Kazakh (Kazakhstan)",
  kn: "Kannada",
  "kn-IN": "Kannada (India)",
  ko: "Korean",
  "ko-KR": "Korean (Korea)",
  kok: "Konkani",
  "kok-IN": "Konkani (India)",
  ky: "Kyrgyz",
  "ky-KG": "Kyrgyz (Kyrgyzstan)",
  lt: "Lithuanian",
  "lt-LT": "Lithuanian (Lithuania)",
  lv: "Latvian",
  "lv-LV": "Latvian (Latvia)",
  mi: "Maori",
  "mi-NZ": "Maori (New Zealand)",
  mk: "FYRO Macedonian",
  "mk-MK": "FYRO Macedonian (Former Yugoslav Republic of Macedonia)",
  mn: "Mongolian",
  "mn-MN": "Mongolian (Mongolia)",
  mr: "Marathi",
  "mr-IN": "Marathi (India)",
  ms: "Malay",
  "ms-BN": "Malay (Brunei Darussalam)",
  "ms-MY": "Malay (Malaysia)",
  mt: "Maltese",
  "mt-MT": "Maltese (Malta)",
  nb: "Norwegian (Bokm?l)",
  "nb-NO": "Norwegian (Bokm?l) (Norway)",
  nl: "Dutch",
  "nl-BE": "Dutch (Belgium)",
  "nl-NL": "Dutch (Netherlands)",
  "nn-NO": "Norwegian (Nynorsk) (Norway)",
  ns: "Northern Sotho",
  "ns-ZA": "Northern Sotho (South Africa)",
  pa: "Punjabi",
  "pa-IN": "Punjabi (India)",
  pl: "Polish",
  "pl-PL": "Polish (Poland)",
  ps: "Pashto",
  "ps-AR": "Pashto (Afghanistan)",
  pt: "Portuguese",
  "pt-BR": "Portuguese (Brazil)",
  "pt-PT": "Portuguese (Portugal)",
  qu: "Quechua",
  "qu-BO": "Quechua (Bolivia)",
  "qu-EC": "Quechua (Ecuador)",
  "qu-PE": "Quechua (Peru)",
  ro: "Romanian",
  "ro-RO": "Romanian (Romania)",
  ru: "Russian",
  "ru-RU": "Russian (Russia)",
  sa: "Sanskrit",
  "sa-IN": "Sanskrit (India)",
  se: "Sami (Northern)",
  "se-FI": "Sami (Inari) (Finland)",
  "se-NO": "Sami (Southern) (Norway)",
  "se-SE": "Sami (Southern) (Sweden)",
  sk: "Slovak",
  "sk-SK": "Slovak (Slovakia)",
  sl: "Slovenian",
  "sl-SI": "Slovenian (Slovenia)",
  sq: "Albanian",
  "sq-AL": "Albanian (Albania)",
  "sr-BA": "Serbian (Cyrillic) (Bosnia and Herzegovina)",
  "sr-SP": "Serbian (Cyrillic) (Serbia and Montenegro)",
  sv: "Swedish",
  "sv-FI": "Swedish (Finland)",
  "sv-SE": "Swedish (Sweden)",
  sw: "Swahili",
  "sw-KE": "Swahili (Kenya)",
  syr: "Syriac",
  "syr-SY": "Syriac (Syria)",
  ta: "Tamil",
  "ta-IN": "Tamil (India)",
  te: "Telugu",
  "te-IN": "Telugu (India)",
  th: "Thai",
  "th-TH": "Thai (Thailand)",
  tl: "Tagalog",
  "tl-PH": "Tagalog (Philippines)",
  tn: "Tswana",
  "tn-ZA": "Tswana (South Africa)",
  tr: "Turkish",
  "tr-TR": "Turkish (Turkey)",
  tt: "Tatar",
  "tt-RU": "Tatar (Russia)",
  ts: "Tsonga",
  uk: "Ukrainian",
  "uk-UA": "Ukrainian (Ukraine)",
  ur: "Urdu",
  "ur-PK": "Urdu (Islamic Republic of Pakistan)",
  uz: "Uzbek (Latin)",
  "uz-UZ": "Uzbek (Cyrillic) (Uzbekistan)",
  vi: "Vietnamese",
  "vi-VN": "Vietnamese (Viet Nam)",
  xh: "Xhosa",
  "xh-ZA": "Xhosa (South Africa)",
  zh: "Chinese",
  "zh-CN": "Chinese (S)",
  "zh-HK": "Chinese (Hong Kong)",
  "zh-MO": "Chinese (Macau)",
  "zh-SG": "Chinese (Singapore)",
  "zh-TW": "Chinese (T)",
  zu: "Zulu",
  "zu-ZA": "Zulu (South Africa)",
};

const Modal = ({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) => {
  const [voiceLang, setVoiceLang] = useState("");
  const [speechLang, setSpeechLang] = useState("");

  useEffect(() => {
    (async () => {
      const voice_lang = await getStorageValue("voice_lang");
      const speech_lang = await getStorageValue("speech_lang");
      setVoiceLang(voice_lang);
      setSpeechLang(speech_lang);
    })();
  }, []);

  return (
    <Portal>
      <div
        data-state="open"
        className={classNames("bg-black/50 dark:bg-gray-600/70 fixed inset-0", {
          hidden: !open,
        })}
        style={{ pointerEvents: "auto" }}
      >
        <div className="grid grid-cols-[10px_1fr_10px] grid-rows-[minmax(10px,_1fr)_auto_minmax(10px,_1fr)] h-full md:grid-rows-[minmax(20px,_1fr)_auto_minmax(20px,_1fr)] overflow-y-auto w-full">
          <div
            role="dialog"
            className="-translate-x-1/2 bg-white col-auto col-start-2 dark:bg-gray-900 left-1/2 md:max-w-[400px] relative rounded-lg row-auto row-start-2 shadow-xl text-left transition-all w-full"
            style={{ pointerEvents: "auto", maxWidth: 430 }}
          >
            <div className="px-4 pb-4 pt-5 sm:p-6 flex items-center justify-between border-b border-black/10 dark:border-white/10">
              <div className="flex">
                <div className="flex items-center">
                  <div className="flex flex-col gap-1 text-center sm:text-left">
                    <h2 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-200">
                      VoiceGPT Settings
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
            <div className="p-4 sm:p-6 sm:pt-4">
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
                    <SelectBox
                      label="Text-to-Speech Language"
                      options={speechSynthesisLanguages}
                      value={speechLang}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSpeechLang(val);
                        setStorageValue({ speech_lang: val });
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
}: {
  label: string;
  options: { [key: string]: string };
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
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
              {options[option]} <code>{option}</code>
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Modal;
