'use client';

import { useState, useRef, useEffect } from 'react';

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
        { role: 'assistant', content: 'Hi there! I am the AKS AI Assistant. How can I help you discover our services or projects?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const newMessages = [...messages, { role: 'user' as const, content: input.trim() }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages })
            });
            const data = await res.json();
            
            if (data.reply) {
                setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
            }
        } catch (error) {
            setMessages([...newMessages, { role: 'assistant', content: 'Sorry, I am offline right now!' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
            {/* Chatbot Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--blue), var(--purple))',
                        color: 'white',
                        border: 'none',
                        boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '28px',
                        transition: 'transform 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <i className="bx bx-message-dots" />
                </button>
            )}

            {/* Chatbot Window */}
            {isOpen && (
                <div style={{
                    width: '350px',
                    height: '500px',
                    background: 'var(--bg-2)',
                    border: '1px solid var(--border)',
                    borderRadius: '20px',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    animation: 'chat-slide-up 0.3s ease-out forwards'
                }}>
                    <style>{`
                        @keyframes chat-slide-up {
                            from { opacity: 0; transform: translateY(20px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                        .chat-scroll::-webkit-scrollbar { width: 6px; }
                        .chat-scroll::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
                    `}</style>
                    
                    {/* Header */}
                    <div style={{
                        padding: '16px 20px',
                        background: 'linear-gradient(135deg, var(--blue), var(--purple))',
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexShrink: 0
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '10px', height: '10px', background: '#10B981', borderRadius: '50%', boxShadow: '0 0 8px #10B981' }} />
                            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>AKS AI Bot</h3>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)}
                            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '24px', opacity: 0.8 }}
                        >
                            &times;
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="chat-scroll" style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--bg)' }}>
                        {messages.map((msg, i) => (
                            <div key={i} style={{
                                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '85%',
                                padding: '12px 16px',
                                borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                background: msg.role === 'user' ? 'var(--blue)' : 'var(--bg-3)',
                                color: msg.role === 'user' ? 'white' : 'var(--ink)',
                                fontSize: '14px',
                                lineHeight: 1.5,
                                border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none'
                            }}>
                                {msg.content}
                            </div>
                        ))}
                        {isLoading && (
                            <div style={{
                                alignSelf: 'flex-start',
                                padding: '12px 16px',
                                borderRadius: '16px 16px 16px 4px',
                                background: 'var(--bg-3)',
                                color: 'var(--ink)',
                                fontSize: '14px',
                                border: '1px solid var(--border)'
                            }}>
                                <span className="typing-dot" /> <span className="typing-dot" /> <span className="typing-dot" />
                                <style>{`
                                    .typing-dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--ink-3); margin-right: 4px; animation: wave 1.3s linear infinite; }
                                    .typing-dot:nth-child(2) { animation-delay: -1.1s; }
                                    .typing-dot:nth-child(3) { animation-delay: -0.9s; }
                                    @keyframes wave { 0%, 60%, 100% { transform: initial; } 30% { transform: translateY(-4px); } }
                                `}</style>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSubmit} style={{
                        padding: '16px',
                        borderTop: '1px solid var(--border)',
                        background: 'var(--bg-2)',
                        display: 'flex',
                        gap: '8px'
                    }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask anything..."
                            style={{
                                flex: 1,
                                padding: '10px 16px',
                                borderRadius: '100px',
                                border: '1px solid var(--border)',
                                background: 'var(--bg)',
                                color: 'var(--ink)',
                                outline: 'none',
                                fontSize: '14px'
                            }}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: input.trim() && !isLoading ? 'var(--blue)' : 'var(--bg-3)',
                                color: input.trim() && !isLoading ? 'white' : 'var(--ink-3)',
                                border: 'none',
                                cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s',
                                flexShrink: 0
                            }}
                        >
                            <i className="bx bx-send" style={{ fontSize: '18px' }} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
