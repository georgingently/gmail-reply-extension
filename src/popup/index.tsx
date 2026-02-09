import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';

const Popup = () => {
    const [apiKey, setApiKey] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        chrome.storage.local.get(['groqApiKey'], (result) => {
            if (result && typeof result.groqApiKey === 'string') {
                setApiKey(result.groqApiKey);
            }
        });
    }, []);

    const handleSave = () => {
        chrome.storage.local.set({ groqApiKey: apiKey }, () => {
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
