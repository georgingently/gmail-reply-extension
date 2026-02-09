console.log('Gmail Reply Background Script Loaded');

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
    if (request.action === 'generate_reply') {
        handleGenerateReply(request.prompt, sendResponse);
        return true; // Will respond asynchronously
    }
});

async function handleGenerateReply(prompt: string, sendResponse: (response: any) => void) {
    try {
        const result = await chrome.storage.local.get(['groqApiKey']);
        const apiKey = result.groqApiKey;

        if (!apiKey) {
            sendResponse({ error: 'API Key not found. Please set it in the extension settings.' });
            return;
        }

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful email assistant. Generate a professional email reply. structure it clearly with:\n1. A polite Salutation (e.g., "Hi [Name],")\n2. The Body of the email with proper paragraph spacing (use two newlines between paragraphs).\n3. A Closing/Signature (e.g., "Best regards, [Name]").\n\nDo NOT include a Subject line. Do NOT include the original email thread. Do NOT include conversational filler involved.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                model: 'llama-3.3-70b-versatile'
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            sendResponse({ error: `Groq API Error: ${errorData.error?.message || response.statusText}` });
            return;
        }

        const data = await response.json();
        const reply = data.choices[0]?.message?.content || '';
        sendResponse({ reply });

    } catch (error: any) {
        console.error('Groq fetch error:', error);
        sendResponse({ error: error.message });
    }
}

