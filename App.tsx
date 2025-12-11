import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import { Message, Memory, PersonalityConfig, Emotion } from './types';
import { sendMessageToAI } from './services/geminiService';
import { Menu, X } from 'lucide-react';

const App: React.FC = () => {
  // State: UI
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // State: Data
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [memories, setMemories] = useState<Memory[]>([]);
  const [currentMood, setCurrentMood] = useState<Emotion>('neutral');
  
  // State: Config
  const [personality, setPersonality] = useState<PersonalityConfig>({
    name: 'Lumia',
    trait: 'Gentle',
    voice: 'soft'
  });

  // Initial greeting
  useEffect(() => {
    const greeting: Message = {
      id: 'init',
      role: 'model',
      text: `Hello! I'm ${personality.name}. I'm here to listen, understand, and be by your side. How are you feeling today?`,
      timestamp: new Date(),
      emotion: 'warm'
    };
    setMessages([greeting]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Call our simulated LLaMA service (using Gemini)
      // We pass memories and personality to allow the AI to be context-aware
      const response = await sendMessageToAI(
        [...messages, userMsg], 
        userMsg.text, 
        memories, 
        personality
      );

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.reply,
        timestamp: new Date(),
        emotion: response.currentMood
      };

      setMessages(prev => [...prev, aiMsg]);
      setCurrentMood(response.currentMood);

      // If the AI learned new facts, add them to the "Database"
      if (response.newMemories && response.newMemories.length > 0) {
        const newMemObjs: Memory[] = response.newMemories.map((content, idx) => ({
          id: `${Date.now()}-${idx}`,
          content,
          date: new Date().toLocaleDateString()
        }));
        setMemories(prev => [...prev, ...newMemObjs]);
      }

    } catch (error) {
      console.error("Failed to get response", error);
      // Fallback error message
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "I'm having trouble connecting to my thought process. Please try again.",
        timestamp: new Date(),
        emotion: 'pensive'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      {/* Mobile Sidebar Toggle */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md text-gray-600"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Main Layout */}
      <Sidebar 
        memories={memories} 
        personality={personality} 
        setPersonality={setPersonality}
        isOpen={isSidebarOpen}
      />
      
      <ChatArea 
        messages={messages}
        input={input}
        setInput={setInput}
        onSend={handleSend}
        isLoading={isLoading}
        personality={personality}
        currentMood={currentMood}
      />
      
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
