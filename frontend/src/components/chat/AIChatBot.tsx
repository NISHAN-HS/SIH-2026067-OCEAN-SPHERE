import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Sparkles, Activity, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import Markdown from 'react-markdown';
import { sendPredictionChat, PredictionChatRequest, PredictionChatResponse } from '../../services/api';
import { useTheme } from '../../hooks/useTheme';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestions?: string[];
  isThinking?: boolean;
}

export const AIChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useTheme();

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          sender: 'assistant',
          text: "Hi there! I'm the **OceanSphere AI Copilot**. \n\nYou can ask me to predict forecast reliability scores for specific coordinates, or analyze the impact of temperature and salinity anomalies.",
          timestamp: new Date().toLocaleTimeString(),
          suggestions: [
            "Predict reliability for Chennai offshore (IND_EAST)",
            "What if temperature bias increases to 1.5°C?",
            "Check optimal vessel routing from Mumbai to Dubai"
          ]
        }
      ]);
    }
  }, [messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Build history payload
      const history = messages.map(m => ({
        sender: m.sender,
        text: m.text,
        timestamp: m.timestamp
      }));

      const requestPayload: PredictionChatRequest = {
        message: userMessage.text,
        history
      };

      const response: PredictionChatResponse = await sendPredictionChat(requestPayload);

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString(),
        suggestions: response.suggestions
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: "⚠️ Sorry, I'm having trouble connecting to the prediction engine right now. Please try again.",
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend(input);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-ocean-600 hover:bg-ocean-500 text-white shadow-xl shadow-ocean-500/30 transition-transform hover:scale-105 active:scale-95 flex items-center justify-center animate-bounce-subtle"
          title="Open AI Copilot"
        >
          <Bot className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-6rem)] flex flex-col rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 border ${
          isDarkMode 
            ? 'bg-slate-900/95 border-slate-800 shadow-ocean-900/20' 
            : 'bg-white/95 border-slate-200 shadow-slate-300/50'
        } backdrop-blur-xl`}>
          
          {/* Header */}
          <div className="px-5 py-4 flex items-center justify-between border-b bg-gradient-to-r from-ocean-600 to-sky-500 text-white shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                  OceanSphere Copilot <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </h3>
                <span className="text-[10px] font-medium text-ocean-100 flex items-center gap-1">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
                  </span>
                  Online - Prediction Engine Active
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className={`flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin ${isDarkMode ? 'scrollbar-thumb-slate-700' : 'scrollbar-thumb-slate-300'}`}>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-ocean-600 text-white rounded-br-sm'
                    : isDarkMode 
                      ? 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-sm' 
                      : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-bl-sm'
                }`}>
                  {msg.sender === 'assistant' ? (
                    <div className="prose prose-sm prose-slate dark:prose-invert max-w-none leading-relaxed prose-p:my-1.5 prose-ul:my-1.5 prose-li:my-0.5">
                      <Markdown>{msg.text}</Markdown>
                    </div>
                  ) : (
                    <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                  )}
                  <span className={`block text-[9px] font-semibold mt-2 ${
                    msg.sender === 'user' ? 'text-ocean-200' : isDarkMode ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    {msg.timestamp}
                  </span>

                  {/* Render Suggestions if present and it's the last assistant message */}
                  {msg.suggestions && msg.suggestions.length > 0 && msg.id === messages[messages.length - 1]?.id && !isTyping && (
                    <div className="mt-4 space-y-2">
                      <p className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Suggested Actions
                      </p>
                      <div className="flex flex-col gap-2">
                        {msg.suggestions.map((sugg, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSend(sugg)}
                            className={`text-left text-xs px-3 py-2 rounded-lg border transition-colors ${
                              isDarkMode 
                                ? 'border-ocean-800/50 bg-ocean-900/20 hover:bg-ocean-900/40 text-ocean-300 hover:text-ocean-200' 
                                : 'border-ocean-100 bg-ocean-50 hover:bg-ocean-100 text-ocean-700'
                            }`}
                          >
                            {sugg}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className={`rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2 ${
                  isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-slate-50 border border-slate-200'
                }`}>
                  <Loader2 className={`w-4 h-4 animate-spin ${isDarkMode ? 'text-ocean-400' : 'text-ocean-600'}`} />
                  <span className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Analyzing prediction telemetry...
                  </span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className={`p-4 border-t ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about reliability or region telemetry..."
                className={`w-full pr-12 pl-4 py-3 rounded-xl text-sm outline-none transition-shadow ${
                  isDarkMode 
                    ? 'bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:ring-2 focus:ring-ocean-500/50' 
                    : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-ocean-500/50'
                }`}
                disabled={isTyping}
              />
              <button
                onClick={() => handleSend(input)}
                disabled={!input.trim() || isTyping}
                className="absolute right-2 p-2 rounded-lg bg-ocean-600 hover:bg-ocean-500 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className={`text-[9px] font-medium text-center mt-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              OceanSphere Copilot can make mistakes. Verify critical parameters.
            </p>
          </div>
        </div>
      )}
    </>
  );
};
