import React, { useState } from 'react';
import { ReplyModal } from './components/ReplyModal';
import { GmailAdapter } from './gmailAdapter';

export const ContentApp: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpen = () => {
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
    };

    const handleGenerate = async (instruction: string, contextType: string): Promise<string> => {
        // Collect context
        const threadData = GmailAdapter.extractEmails();

        // Find the last email in the thread to determine context
        const lastEmail = threadData.emails[threadData.emails.length - 1];
        const lastSender = lastEmail?.sender || 'Unknown';
        const myEmail = threadData.myEmail || 'Me';

        // Filter out empty emails
        const emailsText = threadData.emails
            .filter(e => e.content.trim().length > 0)
            .map(e => `[${e.timestamp}] From: ${e.sender}\nBody: ${e.content}\n`)
            .join('\n---\n');

        let styleInstruction = '';
        switch (contextType) {
            case 'short':
                styleInstruction = 'Keep the reply very short, concise, and to the point. Avoid fluff.';
                break;
            case 'friendly':
                styleInstruction = 'Keep the reply short, warm, and friendly. Use a casual but professional tone.';
                break;
            case 'detailed':
                styleInstruction = 'Provide a detailed and comprehensive reply. Cover all aspects thoroughly.';
                break;
            case 'professional':
            default:
                styleInstruction = 'Write a standard professional reply. specific, clear, and polite.';
                break;
        }

        const prompt = `
Context:
My Email: ${myEmail}
Last Email From: ${lastSender}

Email Thread History:
${emailsText}

User Instruction: ${instruction}
Style Requirement: ${styleInstruction}

Task: Draft a reply to the last email from "${lastSender}".\nRequirements:\n- Start with a proper salutation to "${lastSender}".\n- Ensure clear paragraph breaks.\n- Sign it as "Me" (or my name if apparent).
`;

        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(
                { action: 'generate_reply', prompt },
                (response) => {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError.message);
                    } else if (response.error) {
                        reject(response.error);
                    } else {
                        // Ensure reply is a string
                        const replyText = typeof response.reply === 'string' ? response.reply : JSON.stringify(response.reply || '');
                        resolve(replyText);
                    }
                }
            );
        });
    };

    const handleRefine = async (currentDraft: string, refinement: 'shorten' | 'elaborate'): Promise<string> => {
        let refinementInstruction = '';
        if (refinement === 'shorten') {
            refinementInstruction = 'Rewrite the following email draft to be significantly shorter and more concise. Remove unnecessary words while keeping the core message.';
        } else if (refinement === 'elaborate') {
            refinementInstruction = 'Rewrite the following email draft to be more detailed and elaborate. Expand on the key points to be more comprehensive and polite.';
        }

        const prompt = `
Current Draft:
${currentDraft}

Refinement Instruction: ${refinementInstruction}

Task: Rewrite the draft above according to the instruction. Return ONLY the rewritten email body.
`;

        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(
                { action: 'generate_reply', prompt },
                (response) => {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError.message);
                    } else if (response.error) {
                        reject(response.error);
                    } else {
                        const replyText = typeof response.reply === 'string' ? response.reply : JSON.stringify(response.reply || '');
                        resolve(replyText);
                    }
                }
            );
        });
    };

    const handleInsert = (text: string) => {
        // Simple insertion: Copy to clipboard or try to find active element
        // Gmail's composer is tricky.
        // For now, let's copy to clipboard and alert user, 
        // OR try to insert into document.activeElement if it's contenteditable

        const activeElement = document.activeElement as HTMLElement;
        if (activeElement && activeElement.isContentEditable) {
            document.execCommand('insertText', false, text);
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(text).then(() => {
                alert('Reply copied to clipboard! Paste it into the Gmail composer.');
            });
        }
        setIsModalOpen(false);
    };

    return (
        <>
            {!isModalOpen && (
                <button
                    onClick={handleOpen}
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        padding: '12px 20px',
                        backgroundColor: '#2563eb',
                        color: 'white',
                        borderRadius: '24px',
                        border: 'none',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        cursor: 'pointer',
                        zIndex: 2147483647,
                        fontFamily: 'sans-serif',
                        fontWeight: 600,
                        fontSize: '14px'
                    }}
                >
                    Reply with AI
                </button>
            )}

            {isModalOpen && (
                <ReplyModal
                    onClose={handleClose}
                    onGenerate={handleGenerate}
                    onInsert={handleInsert}
                    onRefine={handleRefine}
                />
            )}
        </>
    );
};
