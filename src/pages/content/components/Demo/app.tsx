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
  };

  const handleKeyUp = (event) => {
    if (event.ctrlKey && event.key === "s") {
      event.preventDefault();
      stopListening();
    }
  };

  useEffect(() => {
    console.log({ listening });

    setActive(listening);
    if (listening) {
      textAreaValue.current = document.querySelector("#prompt-textarea").value;
      cursorPosition.current =
        document.querySelector("#prompt-textarea").selectionStart;

      console.log({ cursorPosition: cursorPosition.current });
    } else {
      // document.querySelector("#prompt-textarea").value =
      //   document.querySelector("#prompt-textarea").value + " ";
      resetTranscript();
    }
  }, [listening]);

  useEffect(() => {
    console.log({ transcript });

    setTranscriptValue(transcript);
  }, [transcript]);

  useEffect(() => {
    console.log({ transcriptValue, listening });

    if (transcriptValue && listening) {
      const textArea = document.querySelector("#prompt-textarea");

      // textArea.value = `${textAreaValue.current} ${transcriptValue}`;

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
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <button
      disabled={disable}
      type="button"
      className={classNames(
        "absolute p-1 rounded-md md:bottom-3 md:p-2 md:right-11 dark:hover:bg-gray-600 dark:disabled:hover:bg-transparent right-2 disabled:text-gray-100 text-white bottom-1.5 transition-colors disabled:opacity-40 h-8 w-8",
        {
          "bg-gray-600 ": active,
        }
      )}
      onClick={handleClick}
    >
      <Microphone />
    </button>
  );
}
