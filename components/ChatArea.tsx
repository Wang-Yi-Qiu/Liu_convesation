import React, { useRef, useEffect } from 'react';
import { Message, PersonalityConfig, Emotion } from '../types';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import EmotionBadge from './EmotionBadge';

interface ChatAreaProps {
  messages: Message[];
  input: string;
  setInput: (s: string) => void;
  onSend: () => void;
  isLoading: boolean;
  personality: PersonalityConfig;
  currentMood: Emotion;
}

const ChatArea: React.FC<ChatAreaProps> = ({ 
  messages, 
  input, 
  setInput, 
  onSend, 
  isLoading, 
  personality,
  currentMood
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 relative overflow-hidden">
      {/* Chat Header */}
      <div className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
            <Bot size={20} />
          </div>
          <div>
            <h1 className="font-semibold text-gray-800">{personality.name}</h1>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Online • {personality.trait} Mode
            </p>
          </div>
        </div>
        <EmotionBadge emotion={currentMood} />
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
            <Bot size={48} className="text-gray-300" />
            <p className="text-sm">Start a conversation with {personality.name}...</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[85%] md:max-w-[70%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                msg.role === 'user' ? 'bg-indigo-500 text-white' : 'bg-white border border-gray-200 text-indigo-600'
              }`}>
                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>

              {/* Bubble */}
              <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`px-5 py-3 rounded-2xl shadow-sm text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
                {/* Timestamp & Mood (for AI) */}
                <div className="flex items-center gap-2 mt-1 px-1">
                  <span className="text-[10px] text-gray-400">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {msg.role === 'model' && msg.emotion && (
                     <span className="text-[10px] text-indigo-400 font-medium lowercase">
                       • feels {msg.emotion}
                     </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start w-full">
            <div className="flex gap-3 max-w-[70%]">
               <div className="w-8 h-8 rounded-full bg-white border border-gray-200 text-indigo-600 flex items-center justify-center">
                <Bot size={14} />
              </div>
              <div className="bg-white border border-gray-100 px-5 py-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-indigo-500" />
                <span className="text-xs text-gray-500">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 sm:p-6 bg-white border-t border-gray-100">
        <div className="relative flex items-center bg-gray-50 rounded-2xl border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300 transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 bg-transparent px-5 py-4 text-sm text-gray-800 placeholder-gray-400 focus:outline-none resize-none overflow-hidden"
            style={{ minHeight: '56px' }}
          />
          <button
            onClick={onSend}
            disabled={isLoading || !input.trim()}
            className={`mr-3 p-2 rounded-xl transition-all ${
              input.trim() && !isLoading
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-center text-[10px] text-gray-400 mt-3">
          AI can make mistakes. Please treat your virtual friend with kindness.
        </p>
      </div>
    </div>
  );
};

export default ChatArea;
