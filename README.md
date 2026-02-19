# Gmail Reply Extension

A privacy-focused Chrome Extension that helps you draft email replies using the Groq LLM. It reads the current email context, understands the conversation history, and generates professional, friendly, or concise replies based on your instructions.

## ✨ Features

- **Context-Aware Replies**: Analyzes the full email thread (including hidden/collapsed replies) to generate relevant responses.
- **Customizable Tones**:
  - **Short**: Concise and to the point.
  - **Friendly**: Warm and casual but professional.
  - **Detailed**: Comprehensive and thorough.
  - **Professional**: Standard business tone.
- **Refinement**: Ask the AI to shorten or elaborate on a drafted reply.
- **Privacy-First**:
  - **Local Processing**: Your API key is stored locally in your browser (`chrome.storage.local`) and never sent to our servers.
  - **PII Masking**: Automatically masks emails and phone numbers before sending data to the LLM to protect sensitive information.
- **Seamless Integration**: Adds a "Reply with AI" button directly to the Gmail interface.

## 🚀 Installation

### Option A: Download ZIP from GitHub (no build required)

1.  Download and extract the repository ZIP from GitHub.
2.  Open Chrome and navigate to `chrome://extensions/`.
3.  Enable **Developer mode** (top right toggle).
4.  Click **Load unpacked**.
5.  Select the extracted project folder (the folder that contains `manifest.json`).

### Option B: Build from source

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/georgingently/gmail-reply-extension.git
    cd gmail-reply-extension
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Build the Extension**:
    ```bash
    npm run build
    ```

4.  **Load into Chrome**:
    - Open Chrome and navigate to `chrome://extensions/`.
    - Enable **Developer mode** (top right toggle).
    - Click **Load unpacked**.
    - Select the project root folder (contains `manifest.json`).

## ⚙️ Configuration

1.  **Get a Groq API Key**:
    - Sign up at [Groq Console](https://console.groq.com/keys) to get your free API key.

2.  **Configure the Extension**:
    - Click the extension icon in the Chrome toolbar.
    - Paste your **Groq API Key**.
    - (Optional) Enable **Privacy Settings**:
        - **Mask Emails**: Replaces email addresses with placeholders (e.g., `[EMAIL_1]`) before sending to AI.
        - **Mask Phone Numbers**: Replaces phone numbers with `[PHONE_1]`.
    - Click **Save Key**.

## 🛡️ Privacy & Security

This extension is designed with privacy in mind:
- **No Remote Telemetry**: We do not track your usage or collect your data.
- **Data Isolation**: Your API key and email data are only sent directly to Groq's API for the purpose of generating the reply.
- **PII Masking**: You can enable masking features to ensure that sensitive details like email addresses and phone numbers are redacted from the prompt sent to the LLM. The extension automatically restores these details in the generated reply.

## 🛠️ Development

- **Run in Watch Mode**:
    ```bash
    npm run dev
    ```
- **Linting**:
    ```bash
    npm run lint
    ```

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## 📄 License

[ISC](LICENSE)
