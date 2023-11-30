import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { Speaker, SpeakerOff } from "./Icons";
import { getStorageValue } from "../../utils";

const SpeakarButton = () => {
  const btnRef = useRef(null);
  const synthesisRef = useRef(null);
  const utteranceRef = useRef(null);
  const timerRef = useRef(null);
  const [speaking, setSpeaking] = useState(false);

  const resumeInfinity = (target) => {
    if (!target && timerRef.current) {
      clearTimeout(timerRef.current);
      return;
    }
    synthesisRef.current.pause();
    synthesisRef.current.resume();

    timerRef.current = setTimeout(() => {
      resumeInfinity(target);
    }, 14000);
  };

  const setSpeechText = async () => {
    const speechLang = await getStorageValue("speech_lang");
    if (!utteranceRef.current || utteranceRef.current?.lang !== speechLang) {
      const group = btnRef.current?.closest(".group");
      let speechText = group?.querySelector(".markdown")?.innerText;

      if (!speechText) {
        speechText = group?.querySelector(
          ".whitespace-pre-wrap.break-words"
        )?.innerText;
      }

      if (speechText) {
        utteranceRef.current = new SpeechSynthesisUtterance(speechText);

        utteranceRef.current.lang = speechLang;

        utteranceRef.current.onstart = () => {
          setSpeaking(true);
          resumeInfinity(utteranceRef.current);
        };
        utteranceRef.current.onend = () => {
          setSpeaking(false);
          clearTimeout(timerRef.current);
        };
        utteranceRef.current.onerror = () => {
          setSpeaking(false);
          clearTimeout(timerRef.current);
        };
      }
    }
  };

  const handleClick = async () => {
    if (!synthesisRef.current) return;

    if (speaking) {
      synthesisRef.current.cancel();
      setSpeaking(false);
    } else {
      await setSpeechText();
      synthesisRef.current.cancel();
      synthesisRef.current.speak(utteranceRef.current);
    }
  };

  useEffect(() => {
    if (!synthesisRef.current) {
      const synthesisObj = window.speechSynthesis;
      if (synthesisObj) {
        synthesisRef.current = synthesisObj;
      }
    }
    return () => {
      synthesisRef.current.cancel();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // p-1 pl-0 rounded-md disabled:dark:hover:text-gray-400 dark:hover:text-gray-200 dark:text-gray-400 text-gray-400 hover:text-gray-950 md:invisible md:group-hover:visible md:group-[.final-completion]:visible
  return (
    <button
      ref={btnRef}
      type="button"
      className={classNames(
        "p-1 pl-0 rounded-md disabled:dark:hover:text-gray-400 dark:hover:text-gray-200 dark:text-gray-400 text-gray-400 hover:text-gray-950 md:invisible md:group-hover:visible md:group-[.final-completion]:visible"
      )}
      onClick={handleClick}
    >
      {speaking ? <SpeakerOff /> : <Speaker />}
    </button>
  );
};

export default SpeakarButton;
