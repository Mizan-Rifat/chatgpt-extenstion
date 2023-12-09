`
I am creating a Chrome browseer extension name 'VoiceGPT' to add speaking and listening feature to chat GPT. 
In the extension I have added listening and speaking features to chat GPT.  so instead of typing in the input field you can now talk and even can listen the chat response. Means that you can voice chat with chatgpt. for this I have used JavaScript SpeechSynthesisUtterance  api for a speaking and js SpeechRecognition api  for listening. even you can change the language to   any supported language by those API.
 in Chrome Web Store there many more extension like this.  but they have  problem with accessibilities, like you you can't type text and speak as in the same input field. You need to type or speak. you cannot change the cursor pointer in the input field and talk again.  Or they may have another input field for listening. and when is speaking sometimes it's repeating and you cannot stop it. so I made this extension to solve this problem. in my extension you can type or talk in the same input field. even you can change the cursor pointer and again can talk in the same place where is the cursor.

 But i didn't make the functionality of speech recognition or Speech Synthesis. I've build on based of JavaScript SpeechSynthesisUtterance  api for a speaking and js SpeechRecognition api.
ANd i didn't add any support for any language. I using all the language that supports by those api.

 write a description for the extension with above points 


 add detail about  voice commands:
'clear all':  will clear the input field,
'clear':  will remove the last  transcript
"stop listening":   will stop listening
'submit':  will submit the text

add keyboard shortcut details:
ctrl + space/(ctrl +b in mac):  will start/stop listening
ctrl + s:  with holding on ctrl + s will Trigger Hold and talk mode



VoiceGPT: Your Voice-Driven Chrome Extension for Seamless Conversations

VoiceGPT is an innovative Chrome browser extension designed to enhance your chat experience by integrating voice commands with the powerful GPT-3.5 language model. Unlike traditional voice-enabled extensions, VoiceGPT prioritizes functionality and accessibility, offering a comprehensive solution for users seeking a natural and fluid interaction.

Key Features:

1. Unified Input Field: VoiceGPT lets you effortlessly switch between typing and talking within the same input field. Whether you prefer the keyboard or your voice, seamlessly transition within the same input field for a hassle-free conversation.

2. Cursor Freedom: Take control of your cursor! Unlike other voice-enabled extensions, VoiceGPT allows you to change the cursor position within the input field, providing you the flexibility to seamlessly blend typing and voice commands.

3. Multilingual Support: Speak and listen in your preferred language. Leveraging JavaScript SpeechSynthesisUtterance and SpeechRecognition APIs, VoiceGPT lets you switch between supported languages with ease.

Voice Commands:

'clear all': Clears the entire input field, providing a clean slate for your next interaction.
'clear': Removes the last transcript, allowing you to edit or start anew.
"stop listening": Halts the listening function, providing control over when the extension is actively processing voice commands.
'submit': Submits the current text in the input field, triggering a response from GPT-3.5.
Keyboard Shortcuts:

Ctrl + Space (Ctrl + B in Mac): Initiates or stops the listening function, allowing you to seamlessly control when VoiceGPT is actively awaiting your voice input.
Ctrl + S: Holding down Ctrl + S triggers the Hold and Talk mode, enabling continuous voice input until the combination is released.

Special Note:
For the speaking and listening functionalities in VoiceGPT, the extension leverages the capabilities of the JavaScript SpeechSynthesisUtterance and SpeechRecognition API. It's essential to note that the developer has not independently developed these functionalities; instead, the developer have harnessed the power of existing APIs provided by the web platform.

Please be aware that any issues, inaccuracies, or limitations related to speech synthesis, voice recognition, or language support are inherent to the underlying APIs. If certain languages are not perfectly supported or present challenges, it is a reflection of the capabilities of the underlying APIs, and the developer is not responsible for any shortcomings in this regard.

The extension aims to provide a seamless and user-friendly experience within the constraints of the utilized APIs. If you encounter any issues, please consider to communicate with developer.
`;
