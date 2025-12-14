import React, { memo } from 'react';
import { HeadshotStyle } from '../types';

interface StyleCardProps {
  style: HeadshotStyle;
  isSelected: boolean;
  onSelect: (style: HeadshotStyle) => void;
  customInputValue?: string;
  onCustomInputChange?: (value: string) => void;
}

// OPTIMIZED: Wrapped in React.memo to prevent unnecessary re-renders
export const StyleCard = memo<StyleCardProps>(({ 
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

  // OPTIMIZED: Prevent propagation inline to avoid creating new function
  const handleTextareaClick = (e: React.MouseEvent) => {
    e.stopPropagation();
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
      {/* OPTIMIZED: Removed absolute overlay that causes repaints */}
      
      <div className="flex items-start p-5 gap-4">
        {/* Color Orb */}
        <div className={`shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br ${style.previewColor} shadow-lg flex items-center justify-center text-white/90`}>
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
          <h3 className={`text-base font-bold mb-1 transition-colors ${isSelected ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
            {style.name}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors line-clamp-2">
            {style.description}
          </p>
        </div>
      </div>
      
      {/* Custom Input Area */}
      {isCustom && isSelected && (
        <div className="px-5 pb-5 animate-fade-in relative z-10" onClick={handleTextareaClick}>
          <textarea
            value={customInputValue}
            onChange={(e) => onCustomInputChange && onCustomInputChange(e.target.value)}
            placeholder="e.g. A futuristic sci-fi portrait with neon lights..."
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none h-24"
            autoFocus
          />
        </div>
      )}
      
      {/* Active Indicator - OPTIMIZED: Removed animate-pulse for better performance */}
      {isSelected && (
        <div className="absolute inset-0 border-2 border-blue-500/50 rounded-3xl pointer-events-none" />
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for better memoization
  return (
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.style.id === nextProps.style.id &&
    prevProps.customInputValue === nextProps.customInputValue
  );
});

StyleCard.displayName = 'StyleCard';
