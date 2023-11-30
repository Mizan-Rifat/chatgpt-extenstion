import "regenerator-runtime/runtime";
import { useEffect, useMemo, useRef, useState } from "react";
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
  const transcriptRef = useRef(false);
  const [transcriptValue, setTranscriptValue] = useState("");
  const [disable, setDisable] = useState(false);

  const { sendButton } = elements();

  const startListening = async () => {
    const voiceLang = await getStorageValue("voice_lang");
    SpeechRecognition.startListening({ language: voiceLang, continuous: true });
  };

  const stopListening = () => {
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

  const handleClick = () => {
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleKeyDown = (event) => {
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

  const handleKeyUp = (event) => {
    if (event.ctrlKey && event.key === "s") {
      event.preventDefault();
      stopListening();
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
    transcriptRef.current = transcript;
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
    }
  }, [transcriptValue]);

  useEffect(() => {
    const textArea = getTextArea();
    sendButton.addEventListener("click", () => {
      stopListening();
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
    <div className="relative">
      <button
        disabled={disable}
        type="button"
        className={classNames(
          "absolute rounded-md h-[30px] w-[30px] md:bottom-3 right-12 disabled:text-gray-100 bottom-1.5 transition-colors disabled:opacity-40 recorder-container flex justify-center items-center text-ext-secondary bg-ext-primary hover:bg-ext-primary-dark"
        )}
        onClick={handleClick}
      >
        <span
          className={classNames({
            outer: listening,
          })}
        />
        <span className="icon-microphone">
          <Microphone />
        </span>
      </button>
    </div>
  );
}
