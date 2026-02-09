import React, { useState } from 'react';

interface ReplyModalProps {
    onClose: () => void;
    onGenerate: (instruction: string, contextType: string) => Promise<string>;
    onInsert: (text: string) => void;
    onRefine?: (text: string, refinement: 'shorten' | 'elaborate') => Promise<string>;
}

export const ReplyModal: React.FC<ReplyModalProps> = ({ onClose, onGenerate, onInsert, onRefine }) => {
    const [instruction, setInstruction] = useState('');
    const [generatedReply, setGeneratedReply] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [contextType, setContextType] = useState('professional'); // Default

    const handleGenerate = async () => {
        setIsLoading(true);
        try {
            const reply = await onGenerate(instruction, contextType);
            setGeneratedReply(reply);
        } catch (error) {
            console.error("Error generating reply:", error);
            setGeneratedReply("Error generating reply. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefine = async (refinement: 'shorten' | 'elaborate') => {
        if (!onRefine || !generatedReply) return;
        setIsLoading(true);
        try {
            const reply = await onRefine(generatedReply, refinement);
            setGeneratedReply(reply);
        } catch (error) {
            console.error("Error refining reply:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '400px',
            backgroundColor: 'white',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            zIndex: 2147483647,
            padding: '16px',
            border: '1px solid #e2e8f0',
            fontFamily: 'sans-serif'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Reply with AI</h3>
                <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '16px' }}>×</button>
            </div>

            <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Tone / Length:</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {[
                        { id: 'professional', label: 'Professional' },
                        { id: 'short', label: 'Short' },
                        { id: 'friendly', label: 'Friendly' },
                        { id: 'detailed', label: 'Detailed' }
                    ].map((type) => (
                        <button
                            key={type.id}
                            onClick={() => setContextType(type.id)}
                            style={{
                                padding: '6px 12px',
                                borderRadius: '16px',
                                border: '1px solid',
                                borderColor: contextType === type.id ? '#2563eb' : '#cbd5e1',
                                backgroundColor: contextType === type.id ? '#eff6ff' : 'white',
                                color: contextType === type.id ? '#2563eb' : '#475569',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: contextType === type.id ? 500 : 400,
                                transition: 'all 0.2s'
                            }}
                        >
                            {type.label}
                        </button>
                    ))}
                </div>
            </div>

            <textarea
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                placeholder="Additional instructions (optional)..."
                style={{
                    width: '100%',
                    height: '60px',
                    padding: '8px',
                    marginBottom: '12px',
                    borderRadius: '4px',
                    border: '1px solid #cbd5e1',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                }}
            />

            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    style={{
                        flex: 1,
                        padding: '8px',
                        backgroundColor: isLoading ? '#94a3b8' : '#2563eb',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: isLoading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isLoading ? 'Generating...' : 'Generate Draft'}
                </button>
            </div>

            {generatedReply && (
                <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <h4 style={{ margin: '0', fontSize: '14px', color: '#475569' }}>Draft:</h4>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                                onClick={() => handleRefine('shorten')}
                                disabled={isLoading}
                                style={{
                                    fontSize: '12px',
                                    padding: '4px 8px',
                                    backgroundColor: '#f1f5f9',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: '4px',
                                    cursor: isLoading ? 'default' : 'pointer'
                                }}
                            >
                                Shorten
                            </button>
                            <button
                                onClick={() => handleRefine('elaborate')}
                                disabled={isLoading}
                                style={{
                                    fontSize: '12px',
                                    padding: '4px 8px',
                                    backgroundColor: '#f1f5f9',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: '4px',
                                    cursor: isLoading ? 'default' : 'pointer'
                                }}
                            >
                                Elaborate
                            </button>
                        </div>
                    </div>
                    <textarea
                        value={generatedReply}
                        onChange={(e) => setGeneratedReply(e.target.value)}
                        style={{
                            width: '100%',
                            height: '150px',
                            padding: '8px',
                            borderRadius: '4px',
                            border: '1px solid #cbd5e1',
                            resize: 'vertical',
                            fontSize: '14px',
                            boxSizing: 'border-box'
                        }}
                    />
                    <button
                        onClick={() => onInsert(generatedReply)}
                        style={{
                            width: '100%',
                            marginTop: '8px',
                            padding: '8px',
                            backgroundColor: '#16a34a',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Insert into Reply
                    </button>
                </div>
            )}
        </div>
    );
};
