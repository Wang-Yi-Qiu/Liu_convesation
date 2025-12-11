import React from 'react';
import { Emotion } from '../types';
import { Smile, Heart, Zap, Coffee, Sun, CloudRain } from 'lucide-react';

interface EmotionBadgeProps {
  emotion: Emotion;
}

const EmotionBadge: React.FC<EmotionBadgeProps> = ({ emotion }) => {
  const getConfig = (e: Emotion) => {
    switch (e) {
      case 'happy': return { icon: Smile, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Happy' };
      case 'excited': return { icon: Zap, color: 'text-orange-600', bg: 'bg-orange-100', label: 'Excited' };
      case 'empathetic': return { icon: Heart, color: 'text-pink-600', bg: 'bg-pink-100', label: 'Caring' };
      case 'pensive': return { icon: CloudRain, color: 'text-indigo-600', bg: 'bg-indigo-100', label: 'Deep' };
      case 'warm': return { icon: Sun, color: 'text-amber-600', bg: 'bg-amber-100', label: 'Warm' };
      default: return { icon: Coffee, color: 'text-gray-600', bg: 'bg-gray-100', label: 'Calm' };
    }
  };

  const { icon: Icon, color, bg, label } = getConfig(emotion);

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${bg} transition-all duration-300`}>
      <Icon size={16} className={color} />
      <span className={`text-xs font-medium ${color}`}>{label}</span>
    </div>
  );
};

export default EmotionBadge;
