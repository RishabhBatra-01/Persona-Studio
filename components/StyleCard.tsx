import React from 'react';
import { HeadshotStyle } from '../types';

interface StyleCardProps {
  style: HeadshotStyle;
  isSelected: boolean;
  onSelect: (style: HeadshotStyle) => void;
  customInputValue?: string;
  onCustomInputChange?: (value: string) => void;
}

// Helper function to get solid color based on style
const getColorClass = (styleId: string): string => {
  const colorMap: Record<string, string> = {
    corporate: 'bg-slate-600',
    tech_office: 'bg-blue-600',
    academic: 'bg-amber-700',
    medical: 'bg-cyan-600',
    real_estate: 'bg-emerald-600',
    cafe: 'bg-yellow-600',
    speaker: 'bg-purple-600',
    outdoor: 'bg-green-600',
    startup: 'bg-orange-600',
    black_white: 'bg-gray-800',
    custom: 'bg-pink-600'
  };
  return colorMap[styleId] || 'bg-blue-600';
};

export const StyleCard: React.FC<StyleCardProps> = ({ 
  style, 
  isSelected, 
  onSelect,
  customInputValue,
  onCustomInputChange
}) => {
  const isCustom = style.id === 'custom';

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(style);
    }
  };

  return (
    <div 
      role="button"
      tabIndex={0}
      onClick={() => onSelect(style)}
      onKeyDown={handleKeyDown}
      aria-pressed={isSelected}
      className={`group relative cursor-pointer rounded-3xl overflow-hidden transition-all duration-300 border flex flex-col focus:outline-none focus:ring-4 focus:ring-blue-500/30 ${
        isSelected 
          ? 'border-blue-500/50 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.2)]' 
          : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10'
      }`}
    >

      
      <div className="flex items-start p-5 gap-4">
        {/* Color Orb */}
        <div className={`shrink-0 w-12 h-12 rounded-2xl ${getColorClass(style.id)} shadow-sm flex items-center justify-center text-white`}>
           {isSelected && (
             <svg className="w-6 h-6 animate-fade-in" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
             </svg>
           )}
           {!isSelected && isCustom && (
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
             </svg>
           )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className={`text-base font-bold mb-1 transition-colors ${isSelected ? 'text-theme-primary' : 'text-theme-primary group-hover:text-theme-primary'}`}>
            {style.name}
          </h3>
          <p className="text-xs text-theme-secondary leading-relaxed group-hover:text-theme-secondary transition-colors line-clamp-2">
            {style.description}
          </p>
        </div>
      </div>
      
      {/* Custom Input Area */}
      {isCustom && isSelected && (
        <div 
          className="px-5 pb-5 animate-fade-in relative z-10" 
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <textarea
            value={customInputValue}
            onChange={(e) => onCustomInputChange && onCustomInputChange(e.target.value)}
            onKeyDown={(e) => e.stopPropagation()}
            placeholder="e.g. futuristic sci-fi portrait with neon lights and cyberpunk aesthetic"
            className="w-full border-theme rounded-xl p-3 text-sm text-theme-primary placeholder-theme-tertiary focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none h-24 font-sans"
            style={{ backgroundColor: 'var(--input-bg)' }}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            autoFocus
          />
          <p className="text-[10px] text-theme-tertiary mt-2 leading-relaxed">
            💡 Describe the style, setting, lighting, background, or attire you want. Be specific for best results!
          </p>
        </div>
      )}
      
      {/* Active Indicator Glow */}
      {isSelected && (
        <div className="absolute inset-0 border-2 border-blue-500/50 rounded-3xl animate-pulse pointer-events-none" />
      )}
    </div>
  );
};