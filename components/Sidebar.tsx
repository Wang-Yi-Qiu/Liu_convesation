import React from 'react';
import { Memory, PersonalityConfig } from '../types';
import { Brain, Settings, Sparkles, Database } from 'lucide-react';

interface SidebarProps {
  memories: Memory[];
  personality: PersonalityConfig;
  setPersonality: (p: PersonalityConfig) => void;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ memories, personality, setPersonality, isOpen }) => {
  return (
    <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative z-20 w-72 h-full bg-white border-r border-gray-100 shadow-xl md:shadow-none transition-transform duration-300 ease-in-out flex flex-col`}>
      
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Brain className="text-indigo-500" />
          <span>Core System</span>
        </h2>
        <p className="text-xs text-gray-500 mt-1">LLaMA 3.1-8B (Simulated)</p>
      </div>

      {/* Personality Selector */}
      <div className="p-6">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Settings size={14} /> Personality Matrix
        </h3>
        <div className="space-y-3">
          {(['Gentle', 'Energetic', 'Rational'] as const).map((trait) => (
            <button
              key={trait}
              onClick={() => setPersonality({ ...personality, trait })}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                personality.trait === trait
                  ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{trait}</span>
                {personality.trait === trait && <Sparkles size={14} />}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Long Term Memory Bank */}
      <div className="flex-1 overflow-y-auto p-6 pt-0">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2 sticky top-0 bg-white py-2">
          <Database size={14} /> Memory Bank
        </h3>
        
        {memories.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <p className="text-sm text-gray-400">No memories yet.</p>
            <p className="text-xs text-gray-400 mt-1">Chat to build context.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {memories.map((mem) => (
              <li key={mem.id} className="bg-amber-50 border border-amber-100 rounded-lg p-3 relative group">
                <p className="text-sm text-gray-700 leading-relaxed">"{mem.content}"</p>
                <span className="text-[10px] text-amber-400 mt-2 block font-mono">{mem.date}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="p-4 border-t border-gray-100 text-center">
        <p className="text-[10px] text-gray-400">
          Powered by React & GenAI
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
