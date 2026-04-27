# ChatGPT VHDL Code Highlighter

A lightweight Chrome extension that adds syntax highlighting for VHDL code blocks generated in ChatGPT.

ChatGPT does not always highlight VHDL code properly, so this extension detects VHDL blocks and applies a simple, readable syntax theme directly inside the ChatGPT interface.

## Features

- Highlights VHDL keywords, types, functions, comments, strings, characters, numbers and operators
- Works on `chatgpt.com`
- Also supports `chat.openai.com`
- Runs automatically when VHDL code appears
- No configuration required
- Lightweight: plain JavaScript and CSS

## Installation

1. Download this repository as a [ZIP file](https://github.com/cocciasecca/chatgpt-vhdl-code-highlighter/archive/refs/heads/main.zip).
2. Extract the ZIP file.
3. Open Chrome and go to:

   ```text
   chrome://extensions
   ```
4. Enable Developer mode.
5. Click Load unpacked.
6. Select the extracted extension folder.
7. Open ChatGPT and ask for some VHDL code.

That’s it — VHDL code blocks should now be highlighted automatically.
