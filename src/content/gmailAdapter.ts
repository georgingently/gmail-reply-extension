import { EmailData, ThreadData } from '../types';

export class GmailAdapter {
    static getThreadContainer(): HTMLElement | null {
        return document.querySelector('div[role="main"]');
    }

    static getSubject(): string {
        const subjectElement = document.querySelector('h2.hP');
        return subjectElement ? subjectElement.textContent || '' : '';
    }

    static extractEmails(): ThreadData {
        const emails: EmailData[] = [];
        const messageBodies = document.querySelectorAll('.a3s.aiL');

        messageBodies.forEach((body) => {
            // Find the container for this specific message
            // .gs is the wrapper for the message
            const messageWrapper = body.closest('.gs');

            let sender = 'Unknown';
            let timestamp = '';

            if (messageWrapper) {
                // .gD is the class for the sender name
                const senderElement = messageWrapper.querySelector('.gD');
                if (senderElement) {
                    sender = senderElement.getAttribute('email') || senderElement.textContent || 'Unknown';
                }

                // .g3 is the class for the timestamp
                const timeElement = messageWrapper.querySelector('.g3');
                if (timeElement) {
                    timestamp = timeElement.getAttribute('title') || timeElement.textContent || '';
                }
            }

            // Cleanup content: Remove quoted text to avoid confusion
            // .gmail_quote, .gmail_attr are common classes for quoted text
            const clone = body.cloneNode(true) as HTMLElement;

            // FIX: Do NOT remove quoted text, as it contains the context for replies/forwards.
            // clone.querySelectorAll('.gmail_quote').forEach(e => e.remove());
            // clone.querySelectorAll('.gmail_attr').forEach(e => e.remove());

            // FIX: Ensure hidden content (collapsed replies) is read.
            // Gmail hides expanded content with style="display: none" or hidden attributes.
            // We need to make sure everything in the clone is visible for innerText to catch it.
            const hiddenElements = clone.querySelectorAll('[style*="display: none"], [hidden]');
            hiddenElements.forEach(el => {
                if (el instanceof HTMLElement) {
                    el.style.display = 'block';
                    el.removeAttribute('hidden');
                }
            });

            // Also check for standard Gmail hidden classes if known, though manual expansion check is safer.
            // For now, unwrapping display:none should catch the "trimmed content".

            let content = clone.innerText.trim();

            if (content) {
                emails.push({
                    sender,
                    subject: this.getSubject(),
                    content,
                    timestamp
                });
            }
        });

        // Try to identify "Me"
        const myEmail = this.getMyEmail();

        return {
            id: window.location.hash,
            emails,
            myEmail
        };
    }

    static getMyEmail(): string {
        // Heuristic: Try to find the user's email in the window title or a hidden input
        // A reliable way in Gmail content scripts is tough without auth.
        // We'll rely on the user setting or the "gD" element having "me" content sometimes.
        // Better approach: Let the user prompt handle "Draft a reply to [Sender]" 
        // and we explicitly tell the LLM who the last sender was in the prompt.
        return document.title.match(/- (.*@.*) - Gmail/)?.[1] || 'Me';
    }
}
