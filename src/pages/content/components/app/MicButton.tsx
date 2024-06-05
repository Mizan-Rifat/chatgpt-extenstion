import "regenerator-runtime/runtime";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Microphone } from "./Icons";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import classNames from "classnames";
import { elements } from "../../elements";
import { getStorageValue } from "../../utils";

declare global {
  interface Window {
    keydownEventListenerAdded: boolean;
    keyupEventListenerAdded: boolean;
  }
}

const isMac = window.navigator.userAgent.includes("Mac");

const getTextArea = () => elements().textarea as HTMLInputElement;

export default function MicButton() {
  const textAreaValue = useRef("");
  const cursorPosition = useRef(0);
  const listeningRef = useRef(false);
  const [transcriptValue, setTranscriptValue] = useState("");
  const [disable, setDisable] = useState(false);
  const autoSubmitTimeout = useRef(null);

  const { sendButton } = elements();

  const clearAutoSubmitTimeout = useCallback(() => {
    if (autoSubmitTimeout.current) {
      clearTimeout(autoSubmitTimeout.current);
      autoSubmitTimeout.current = null;
    }
  }, []);

  const startListening = async () => {
    const voiceLang = await getStorageValue("voice_lang");
    SpeechRecognition.startListening({ language: voiceLang, continuous: true });
  };

  const stopListening = () => {
    clearAutoSubmitTimeout();
    const recognition = SpeechRecognition.getRecognition();

    if (recognition) {
      recognition.continuous = false;
    }
    SpeechRecognition.abortListening();
    resetTranscript();
    SpeechRecognition.stopListening();
  };

  const commands = useMemo(
    () => [
      {
        command: "clear all",
        callback: ({ resetTranscript }) => {
          getTextArea().value = "";
          textAreaValue.current = "";
          setTranscriptValue("");
          resetTranscript();
        },
      },
      {
        command: "clear",
        callback: ({ resetTranscript }) => {
          getTextArea().value = textAreaValue.current;
          setTranscriptValue("");
          resetTranscript();
        },
      },
      {
        command: "stop listening",
        callback: () => {
          setTranscriptValue(transcriptValue.replace("stop listening", ""));
          stopListening();
        },
      },
      {
        command: "submit",
        callback: () => {
          setTranscriptValue(transcriptValue.replace("submit", ""));
          setTimeout(() => {
            stopListening();
            sendButton.click();
            getTextArea().value = "";
          }, 1);
        },
      },
    ],
    [transcriptValue]
  );

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition({ commands });

  if (!browserSupportsSpeechRecognition) {
    setDisable(true);
  }

  const initAutoSubmitTimeout = useCallback(async () => {
    const auto_submit = await getStorageValue("auto_submit");
    const auto_submit_delay = await getStorageValue("auto_submit_delay");

    if (listening && auto_submit) {
      clearAutoSubmitTimeout();
      autoSubmitTimeout.current = setTimeout(() => {
        const textArea = getTextArea();
        if (textArea.value.trim()) {
          const { sendButton } = elements();
          if (sendButton) {
            resetTranscript();
            sendButton.click();
          }
        }
      }, auto_submit_delay * 1000);
    }
  }, [listening]);

  const handleClick = () => {
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleKeyDown = (event) => {
    clearAutoSubmitTimeout();

    if (!event.shiftKey && event.key === "Enter") {
      stopListening();
    }

    if (event.ctrlKey && event.key === "s") {
      event.preventDefault();
      startListening();
    }

    if (event.ctrlKey && ((isMac && event.key === "b") || event.key === " ")) {
      event.preventDefault();
      if (listeningRef.current) {
        stopListening();
      } else {
        startListening();
      }
    }
  };

  const handleKeyUp = async (event) => {
    if (event.ctrlKey && event.key === "s") {
      const auto_submit = await getStorageValue("auto_submit");
      event.preventDefault();
      stopListening();
      if (auto_submit) {
        const { sendButton } = elements();
        if (sendButton) {
          resetTranscript();
          sendButton.click();
        }
      }
    }
  };

  useEffect(() => {
    listeningRef.current = listening;
    if (listening) {
      const textArea = getTextArea();
      textArea.focus();
      textAreaValue.current = textArea.value;
      cursorPosition.current = textArea.selectionStart;
    } else {
      resetTranscript();
    }
  }, [listening]);

  useEffect(() => {
    setTranscriptValue(transcript);
    // transcriptRef.current = transcript;
  }, [transcript]);

  useEffect(() => {
    if (transcriptValue) {
      const textArea = getTextArea();

      textArea.value = `${textAreaValue.current.substring(
        0,
        cursorPosition.current
      )} ${transcriptValue} ${textAreaValue.current.substring(
        cursorPosition.current
      )}`;

      // document.execCommand("insertText", false, " ");
      document.execCommand("delete", false, "backward");

      textArea.selectionEnd =
        cursorPosition.current + transcriptValue.length + 1;
      textArea.style.height = textArea.scrollHeight + "px";

      initAutoSubmitTimeout();
    }
  }, [transcriptValue]);

  useEffect(() => {
    const textArea = getTextArea();
    sendButton.addEventListener("click", async () => {
      const auto_submit = await getStorageValue("auto_submit");
      if (!auto_submit) {
        stopListening();
      }
    });

    textArea.addEventListener("click", () => {
      cursorPosition.current = textArea.selectionStart;
      textAreaValue.current = textArea.value;
      resetTranscript();
    });

    document.querySelector("#prompt-textarea").addEventListener("keyup", () => {
      cursorPosition.current = textArea.selectionStart;
      textAreaValue.current = textArea.value;
      resetTranscript();
    });

    if (!window.keydownEventListenerAdded) {
      window.addEventListener("keydown", handleKeyDown);
      window.keydownEventListenerAdded = true;
    }
    if (!window.keyupEventListenerAdded) {
      window.addEventListener("keyup", handleKeyUp);
      window.keyupEventListenerAdded = true;
    }
    return () => {
      if (window.keydownEventListenerAdded) {
        window.removeEventListener("keydown", handleKeyDown);
        window.keydownEventListenerAdded = false;
      }
      if (window.keyupEventListenerAdded) {
        window.removeEventListener("keyup", handleKeyUp);
        window.keyupEventListenerAdded = false;
      }
    };
  }, []);

  return (
    <button
      disabled={disable}
      type="button"
      className={classNames(
        "rounded-md h-[30px] mb-[5px] w-[30px] disabled:text-gray-100 transition-colors disabled:opacity-40 recorder-container flex justify-center items-center text-ext-secondary bg-ext-primary hover:bg-ext-primary-dark"
      )}
      onClick={handleClick}
    >
      {/* width: 14px;
  height: 14px;
  right: 8px;
  top: 8px;
  -webkit-transform: scale(1);
  border-radius: 100%;
  position: absolute;
  background-color: transparent;
  border: 1px solid #ffffdf;
  transition: 1.5s all ease;
  -webkit-animation: woong 1.5s infinite; */}
      <span
        className={classNames({
          "h-[14px] w-[14px] right-2 top-2 rounded-full absolute bg-transparent border border-[#ffffdf] animate-woong":
            listening,
        })}
      />
      <span className="icon-microphone">
        <Microphone />
      </span>
    </button>
  );
}
