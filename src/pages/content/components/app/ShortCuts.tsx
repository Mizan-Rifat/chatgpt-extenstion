const ShortCuts = () => {
  return (
    <div className="">
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
          <div className="flex flex-col gap-3 text-sm text-token-text-primary leading-6">
            <div className="command">
              <strong>Voice Commands:</strong>
              <ul className="ml-2 mt-1">
                <li>
                  <b>CLEAR ALL : </b> Clears the entire input field, providing a
                  clean slate for your next interaction.
                </li>
                <li>
                  <b>CLEAR : </b> Removes the last spoken transcript, allowing
                  you to edit or start anew.
                </li>
                <li>
                  <b>STOP LISTENING : </b> Halts the listening function, giving
                  you control over when the extension processes voice commands.
                </li>
                <li>
                  <b>SUBMIT : </b> Submits the current text in the input field,
                  triggering a response from ChatGPT.
                </li>
              </ul>
            </div>

            <div className="command">
              <strong>Keyboard Shortcuts:</strong>
              <ul className="ml-2 mt-1">
                <li>
                  <b>Ctrl + Space (Ctrl + B in Mac) : </b> Initiates or stops
                  the listening function, giving you seamless control over when
                  VoiceGPT actively awaits your voice input.
                </li>
                <li>
                  <b>Ctrl + S : </b> Holding down Ctrl + S triggers the Hold and
                  Talk mode, enabling continuous voice input until the
                  combination is released.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShortCuts;
