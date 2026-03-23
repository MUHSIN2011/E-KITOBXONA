import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Loader2 } from 'lucide-react';
import { useSendQuestionToAiMutation } from '@/api/api';
import ReactMarkdown from 'react-markdown';

interface Message {
    role: 'user' | 'ai';
    text: string;
}

function ChatAIComponent() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const [sendQuestion, { isLoading }] = useSendQuestionToAiMutation();

    // Auto scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 500);
        }
    }, [isOpen]);

    const handleSend = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userText = input.trim();
        setInput('');

        // Add user message
        setMessages(prev => [...prev, { role: 'user', text: userText }]);

        try {
            const response = await sendQuestion({
                question: userText,
            }).unwrap();

            if (response?.answer) {
                setMessages(prev => [...prev, { role: 'ai', text: response.answer }]);
            }
        } catch (err) {
            setMessages(prev => [...prev, {
                role: 'ai',
                text: "❌ Хатогӣ дар пайвастшавӣ бо AI. Лутфан аз нав кӯшиш кунед."
            }]);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const clearChat = () => {
        setMessages([]);
    };

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-end justify-end p-4 sm:p-6 pointer-events-none">
            {/* Chat Window with Animation */}
            <div className={`mb-3 sm:mb-4 transition-all duration-500 transform pointer-events-auto ${isOpen
                ? 'opacity-100 translate-x-0 scale-100 visible'
                : 'opacity-0 translate-x-20 scale-95 invisible'
                }`}>
                
                <div className="w-[300px] sm:w-[350px] md:w-[380px] h-[450px] sm:h-[500px] md:h-[550px] bg-white dark:bg-[#1a1a1a] rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden">

                    {/* Header */}
                    <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex justify-between items-center shadow-md">
                        <div className="flex items-center gap-2">
                            <div className="p-1 sm:p-1.5 bg-white/20 rounded-lg animate-pulse">
                                <Bot size={18} className="sm:w-5 sm:h-5" />
                            </div>
                            <div>
                                <h3 className="text-xs sm:text-sm font-bold">Ёвари AI</h3>
                                <span className="text-[8px] sm:text-[10px] text-blue-100 flex items-center gap-1">
                                    <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                    Online
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            {messages.length > 0 && (
                                <button
                                    onClick={clearChat}
                                    className="hover:bg-white/20 p-1 rounded-full transition-all duration-200 text-xs"
                                    title="Тоза кардани чат"
                                >
                                    🗑️
                                </button>
                            )}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="hover:bg-white/20 p-1 rounded-full transition-all duration-200 hover:rotate-90"
                            >
                                <X size={18} className="sm:w-5 sm:h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div
                        ref={scrollRef}
                        className="flex-1 p-3 sm:p-4 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#121212] dark:to-[#1a1a1a] text-xs sm:text-sm space-y-3"
                    >
                        {/* Welcome Message with Stagger Animation */}
                        <div
                            className={`flex justify-start transition-all duration-500 delay-100 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                                }`}
                        >
                            <div className="bg-white dark:bg-[#2a2a2a] p-2 sm:p-3 rounded-xl sm:rounded-2xl rounded-tl-none shadow-sm max-w-[85%] border border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-2 mb-2">
                                    <Bot size={14} className="text-blue-500" />
                                    <span className="text-[10px] sm:text-[11px] font-medium text-gray-500 dark:text-gray-400">
                                        AI Assistant
                                    </span>
                                </div>
                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                    <ReactMarkdown
                                        components={{
                                            p: ({ children }) => (
                                                <p className="text-sm  text-gray-800 dark:text-gray-200 leading-relaxed mb-2">
                                                    {children}
                                                </p>
                                            ),
                                            strong: ({ children }) => (
                                                <strong className="font-semibold text-blue-600 dark:text-blue-400">
                                                    {children}
                                                </strong>
                                            ),
                                        }}
                                    >
                                        {`**Салом!**   
                                        Ман ёвари электронии шумо. Чӣ тавр ба шумо кӯмак расонам?`}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>

                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} transition-all duration-300`}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div
                                    className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-sm max-w-[85%] ${msg.role === 'user'
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none'
                                        : 'bg-white dark:bg-[#2a2a2a] dark:text-gray-100 border border-gray-100 dark:border-gray-800 rounded-tl-none'
                                        }`}
                                >
                                    {msg.role === 'ai' ? (
                                        <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-line">
                                            <ReactMarkdown
                                                components={{
                                                    ol: ({ children }) => <ol className="list-decimal ml-4 mb-4 space-y-2 text-gray-800 dark:text-gray-200">{children}</ol>,
                                                    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                                                    p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>
                                                }}
                                            >
                                                {msg.text
                                                    .replace(/\\n/g, '\n')
                                                    .replace(/^(\d+)\.(?!\s)/gm, '$1. ')
                                                }
                                            </ReactMarkdown>
                                        </div>
                                    ) : (
                                        <div className="whitespace-pre-wrap break-words">{msg.text}</div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start animate-fade-in">
                                <div className="bg-white dark:bg-[#2a2a2a] p-2 sm:p-3 rounded-xl sm:rounded-2xl rounded-tl-none shadow-sm border border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center gap-1">
                                        <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin text-blue-500" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area with Slide Animation */}
                    <div
                        className={`p-3 sm:p-4 bg-white dark:bg-[#1a1a1a] border-t border-gray-100 dark:border-gray-800 transition-all duration-500 delay-200 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                            }`}
                    >
                        <form onSubmit={handleSend} className="relative">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Нависед..."
                                disabled={isLoading}
                                className="w-full pl-3 sm:pl-4 pr-10 sm:pr-12 py-2 sm:py-2.5 bg-gray-100 dark:bg-[#2a2a2a] border-none rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm outline-none transition-all duration-300 focus:scale-[1.02]"
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 p-1 sm:p-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 shadow-md"
                            >
                                <Send size={14} className="sm:w-4 sm:h-4" />
                            </button>
                        </form>
                        <div className="text-[8px] sm:text-[9px] text-center text-gray-400 mt-2">
                            AI ёвари интеллектуалӣ
                        </div>
                    </div>
                </div>
            </div>

            {/* Toggle Button with Pulse Ring Animation */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    relative p-3 cursor-pointer pointer-events-auto sm:p-4 rounded-full shadow-lg transition-all duration-300 
                    transform hover:scale-110 active:scale-95
                    ${isOpen
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rotate-90'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white animate-pulse-ring'
                    }
                `}
            >
                {isOpen ? (
                    <X size={20} className="sm:w-7 sm:h-7" />
                ) : (
                    <MessageCircle size={20} className="sm:w-7 sm:h-7" />
                )}

                {/* Notification Badge */}
                {!isOpen && (
                    <>
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                    </>
                )}
            </button>
        </div>
    );
}

export default ChatAIComponent;