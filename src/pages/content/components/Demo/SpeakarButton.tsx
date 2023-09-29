import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { Speaker, SpeakerOff } from "./Icons";

const SpeakarButton = ({ newItem }: { newItem?: boolean }) => {
  const btnRef = useRef(null);
  const synthesisRef = useRef(null);
  const utteranceRef = useRef(null);
  const timerRef = useRef(null);
  const [speech, setSpeech] = useState("");
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

  const setSpeechText = () => {
    if (!utteranceRef.current) {
      const group = btnRef.current?.closest(".group");
      let speechText = group?.querySelector(".markdown")?.innerText;

      if (!speechText) {
        speechText = group?.querySelector(
          ".whitespace-pre-wrap.break-words"
        )?.innerText;
      }

      if (speechText) {
        setSpeech(speechText || "");
        utteranceRef.current = new SpeechSynthesisUtterance(speechText);
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

  const handleClick = () => {
    if (!synthesisRef.current) return;

    if (speaking) {
      synthesisRef.current.cancel();
      setSpeaking(false);
    } else {
      setSpeechText();
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
    setSpeechText();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <button
      ref={btnRef}
      type="button"
      className={classNames(
        "p-1 gizmo:pl-0 rounded-md disabled:dark:hover:text-gray-400 dark:hover:text-gray-200 dark:text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700",
        {
          hidden: !speech && !newItem,
        }
      )}
      onClick={handleClick}
    >
      {speaking ? <SpeakerOff /> : <Speaker />}
    </button>
  );
};

export default SpeakarButton;
