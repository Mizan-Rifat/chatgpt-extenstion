import "regenerator-runtime/runtime";
import { useEffect, useMemo, useRef, useState } from "react";
import { Microphone } from "./Icons";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import classNames from "classnames";

// const textArea = () => document.querySelector("#prompt-textarea");

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
          document.querySelector("#prompt-textarea").value = "";
          textAreaValue.current = "";
          setTranscriptValue("");
          resetTranscript();
        },
      },
      {
        command: "clear",
        callback: ({ resetTranscript }) => {
          document.querySelector("#prompt-textarea").value =
            textAreaValue.current;
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

    if (document.activeElement.id === "prompt-textarea") {
      cursorPosition.current =
        document.querySelector("#prompt-textarea").selectionStart;

      textAreaValue.current = document.querySelector("#prompt-textarea").value;
      resetTranscript();
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
      document.querySelector("#prompt-textarea").focus();
      textAreaValue.current = document.querySelector("#prompt-textarea").value;
      cursorPosition.current =
        document.querySelector("#prompt-textarea").selectionStart;
    } else {
      // document.querySelector("#prompt-textarea").value =
      //   document.querySelector("#prompt-textarea").value + " ";
      resetTranscript();
    }
  }, [listening]);

  useEffect(() => {
    setTranscriptValue(transcript);
  }, [transcript]);

  useEffect(() => {
    if (transcriptValue && listening) {
      const textArea = document.querySelector("#prompt-textarea");

      textArea.value = `${textAreaValue.current.substring(
        0,
        cursorPosition.current
      )} ${transcriptValue} ${textAreaValue.current.substring(
        cursorPosition.current
      )}`;

      textArea.selectionEnd =
        cursorPosition.current + transcriptValue.length + 1;
      // cursorPosition.current += transcriptValue.length;
      textArea.style.height =
        document.querySelector("#prompt-textarea").scrollHeight + "px";
    }
  }, [transcriptValue]);

  useEffect(() => {
    document.querySelector("#prompt-textarea").addEventListener("click", () => {
      cursorPosition.current =
        document.querySelector("#prompt-textarea").selectionStart;

      textAreaValue.current = document.querySelector("#prompt-textarea").value;
      resetTranscript();
    });

    document
      .querySelector("#prompt-textarea")
      .addEventListener("keyup", (e) => {
        cursorPosition.current =
          document.querySelector("#prompt-textarea").selectionStart;

        textAreaValue.current =
          document.querySelector("#prompt-textarea").value;
        resetTranscript();
      });

    // window.addEventListener("keydown", handleKeyDown);
    // window.addEventListener("keyup", handleKeyUp);
    // return () => {
    //   window.removeEventListener("keydown", handleKeyDown);
    //   window.removeEventListener("keyup", handleKeyUp);
    // };
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
