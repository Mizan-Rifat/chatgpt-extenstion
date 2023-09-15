import "regenerator-runtime/runtime";
import { useEffect, useMemo, useRef, useState } from "react";
import { Microphone } from "./Icons";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import classNames from "classnames";

const getTextArea = () =>
  document.querySelector("#prompt-textarea") as HTMLInputElement;

export default function App() {
  const textAreaValue = useRef("");
  const cursorPosition = useRef(0);
  const [transcriptValue, setTranscriptValue] = useState("");
  const [active, setActive] = useState(false);
  const [disable, setDisable] = useState(false);

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
    ],
    []
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

  const startListening = () => {
    SpeechRecognition.startListening({ language: "en-IN", continuous: true });
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

  const handleClick = () => {
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleKeyDown = (event) => {
    if (event.ctrlKey && event.key === "s") {
      event.preventDefault();
      startListening();
    }
  };

  const handleKeyUp = (event) => {
    if (event.ctrlKey && event.key === "s") {
      event.preventDefault();
      stopListening();
    }
  };

  useEffect(() => {
    setActive(listening);
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
  }, [transcript]);

  useEffect(() => {
    if (transcriptValue && listening) {
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

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <>
      <button
        disabled={disable}
        type="button"
        className={classNames(
          "absolute p-1 rounded-md md:bottom-3 md:p-2 md:right-11 dark:hover:bg-gray-600 dark:disabled:hover:bg-transparent right-2 disabled:text-gray-100 text-white bottom-1.5 transition-colors disabled:opacity-40 h-8 w-8 recorder-container",
          {
            "bg-gray-600 ": active,
          }
        )}
        onClick={handleClick}
      >
        <span
          className={classNames({
            outer: listening,
          })}
        ></span>
        <span className="icon-microphone">
          <Microphone />
        </span>
      </button>
    </>
  );
}
