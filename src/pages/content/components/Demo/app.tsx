import "regenerator-runtime/runtime";
import { useEffect, useMemo, useRef, useState } from "react";
import { Microphone } from "./Icons";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import classNames from "classnames";

export default function App() {
  const textArea = () => document.querySelector("#prompt-textarea");
  const textAreaValue = useRef("");
  const transcriptValueRef = useRef("");
  const [transcriptValue, setTranscriptValue] = useState("");
  const [active, setActive] = useState(false);
  const [disable, setDisable] = useState(false);

  // const commands = useMemo(
  //   () => [
  //     {
  //       command: "clear all",
  //       callback: ({ resetTranscript }) => {
  //         console.log("asdasd");
  //         textArea.value = "";
  //         textAreaValue.current = "";
  //         setTranscriptValue("");
  //         resetTranscript();
  //       },
  //     },
  //     // {
  //     //   command: "reset",
  //     //   callback: ({ resetTranscript }) => {
  //     //     textArea.value = textAreaValue.current;
  //     //     setTranscriptValue("");
  //     //     resetTranscript();
  //     //   },
  //     // },
  //   ],
  //   []
  // );

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    setDisable(true);
  }

  const handleClick = () => {
    if (!listening) {
      SpeechRecognition.startListening({ continuous: true });
    } else {
      SpeechRecognition.stopListening();
      resetTranscript();
    }
  };

  const handleKeyDown = (event) => {
    if (event.ctrlKey && event.key === "s") {
      event.preventDefault();
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  const handleKeyUp = (event) => {
    if (event.ctrlKey && event.key === "s") {
      event.preventDefault();
      SpeechRecognition.stopListening();
      resetTranscript();
    }
  };

  useEffect(() => {
    // console.log({ listening });

    setActive(listening);
    if (listening) {
      textAreaValue.current = document.querySelector("#prompt-textarea").value;
      // console.log("tc", textAreaValue.current);
    } else {
      // textArea.value += " ";
      // textAreaValue.current = "";
    }
  }, [listening]);

  useEffect(() => {
    setTranscriptValue(transcript.replace(transcriptValueRef.current, ""));
    transcriptValueRef.current = transcript;
  }, [transcript]);

  useEffect(() => {
    console.log({ transcriptValue });

    if (transcriptValue) {
      document.querySelector("#prompt-textarea").value += transcriptValue;
    }
  }, [transcriptValue]);

  // useEffect(() => {
  //   window.addEventListener("keydown", handleKeyDown);
  //   window.addEventListener("keyup", handleKeyUp);
  //   return () => {
  //     window.removeEventListener("keydown", handleKeyDown);
  //     window.removeEventListener("keyup", handleKeyUp);
  //   };
  // }, []);

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
