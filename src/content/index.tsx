import React from 'react';
import ReactDOM from 'react-dom/client';
import { GmailAdapter } from './gmailAdapter';
import { ContentApp } from './ContentApp';

console.log('Gmail Reply Extension: Content script loaded');

// Create a root element for our app
const root = document.createElement('div');
root.id = 'gmail-reply-extension-root';
document.body.appendChild(root);

ReactDOM.createRoot(root).render(
    <React.StrictMode>
    <ContentApp />
    </React.StrictMode>
);

// Listen for a message from the background or popup (if we add one later)
chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
    if (request.action === "extract_content") {
        const data = GmailAdapter.extractEmails();
        console.log('Extracted Data:', data);
        sendResponse({ status: "success", data });
    }
});

