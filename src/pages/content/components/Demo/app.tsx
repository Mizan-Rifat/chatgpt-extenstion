import "regenerator-runtime/runtime";
import { useEffect, useMemo, useRef, useState } from "react";
import { Microphone } from "./Icons";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import classNames from "classnames";

export default function App() {
  const textArea = document.querySelector("#prompt-textarea");
  const textAreaValueRef = useRef("");
  const [textAreaValue, setTextAreaValue] = useState("");
  const [transcriptValue, setTranscriptValue] = useState("");
  const [active, setActive] = useState(false);
  const [disable, setDisable] = useState(false);

  const commands = useMemo(
    () => [
      {
        command: "clear all",
        callback: ({ resetTranscript }) => {
          console.log("asdasd");
          textArea.value = "";
          textAreaValueRef.current = "";
          setTranscriptValue("");
          resetTranscript();
        },
      },
      // {
      //   command: "reset",
      //   callback: ({ resetTranscript }) => {
      //     textArea.value = textAreaValueRef.current;
      //     setTranscriptValue("");
      //     resetTranscript();
      //   },
      // },
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

  const handleStartListening = () => {
    SpeechRecognition.startListening({ continuous: true });
    const value = textArea.value;
    textAreaValueRef.current = value;
    setTextAreaValue(textArea.value);
  };
  const handleStopListening = () => {
    SpeechRecognition.stopListening();
    resetTranscript();
    // textAreaValueRef.current = textArea.value;
    textArea.value = textArea.value + " ";
  };

  const handleClick = () => {
    if (listening) {
      handleStartListening();
    } else {
      handleStopListening();
    }
  };

  const handleKeyDown = (event) => {
    if (event.ctrlKey && event.key === "s") {
      event.preventDefault();
      handleStartListening();
    }
  };

  const handleKeyUp = (event) => {
    if (event.ctrlKey && event.key === "s") {
      event.preventDefault();
      handleStopListening();
    }
  };

  useEffect(() => {
    setActive(listening);
  }, [listening]);

  useEffect(() => {
    setTranscriptValue(transcript);
  }, [transcript]);

  useEffect(() => {
    console.log("tc", textAreaValue);

    console.log({ transcriptValue });
    textArea.value = textArea.value + transcriptValue;
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
