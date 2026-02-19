import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';

const Popup = () => {
    const [apiKey, setApiKey] = useState('');
    const [maskEmails, setMaskEmails] = useState(false);
    const [maskNumbers, setMaskNumbers] = useState(false);
    const [status, setStatus] = useState('');

    useEffect(() => {
        chrome.storage.local.get(['groqApiKey', 'maskEmails', 'maskNumbers'], (result) => {
            if (result) {
                if (typeof result.groqApiKey === 'string') setApiKey(result.groqApiKey);
                if (typeof result.maskEmails === 'boolean') setMaskEmails(result.maskEmails);
                if (typeof result.maskNumbers === 'boolean') setMaskNumbers(result.maskNumbers);
            }
        });
    }, []);

    const handleSave = () => {
        chrome.storage.local.set({
            groqApiKey: apiKey,
            maskEmails,
            maskNumbers
        }, () => {
            setStatus('Saved!');
            setTimeout(() => setStatus(''), 2000);
        });
    };

    return (
        <div style={{ padding: '20px', width: '300px', fontFamily: 'sans-serif' }}>
            <h1>Gmail Reply Settings</h1>
            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Groq API Key:</label>
                <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    placeholder="gsk_..."
                />
                <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                    Get your API key from the <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer">Groq Console</a>.
                </p>
                <p style={{ fontSize: '11px', color: '#888', marginTop: '5px', fontStyle: 'italic' }}>
                    Note: Your key is stored locally in your browser (chrome.storage.local) and is never shared with anyone, even if you share the extension code.
                </p>
            </div>

            <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Privacy Settings</h3>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={maskEmails}
                        onChange={(e) => setMaskEmails(e.target.checked)}
                        style={{ marginRight: '8px' }}
                    />
                    Mask Emails
                </label>
                <label style={{ display: 'block', marginBottom: '0', fontSize: '13px', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={maskNumbers}
                        onChange={(e) => setMaskNumbers(e.target.checked)}
                        style={{ marginRight: '8px' }}
                    />
                    Mask Phone Numbers
                </label>
            </div>
            <button
                onClick={handleSave}
                style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                Save Key
            </button>
            {status && <p style={{ color: 'green', marginTop: '10px', textAlign: 'center' }}>{status}</p>}
        </div>
    );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Popup />
    </React.StrictMode>
);
