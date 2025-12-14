import React from 'react';
import { ApiMetrics } from '../types';

interface ApiStatsProps {
  metrics: ApiMetrics;
  apiKey: string;
  onOpenSettings: () => void;
}

export const ApiStats: React.FC<ApiStatsProps> = ({ apiKey, onOpenSettings }) => {
  const getMaskedKey = (key: string) => {
    if (!key) return 'Not Set';
    if (key.startsWith('AIza')) {
       return `AIza...${key.slice(-4)}`;
    }
    return key.length > 8 ? `${key.slice(0, 4)}...${key.slice(-4)}` : '********';
  };

  return (
    <div className="fixed top-4 right-4 z-[40] animate-fade-in hidden md:block">
      {apiKey ? (
         /* Connected State */
         <div 
           onClick={onOpenSettings}
           className="backdrop-blur-md border-theme rounded-full shadow-2xl px-4 py-2 flex items-center gap-4 hover:border-blue-500 transition-colors cursor-pointer group"
           style={{ backgroundColor: 'var(--surface-bg)' }}
           role="button"
           title="Click to manage API Key"
         >
            <div className="flex items-center gap-2">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </div>
                <span className="text-xs font-semibold text-theme-secondary uppercase tracking-wider group-hover:text-theme-primary transition-colors">Gemini Live</span>
            </div>
            
            <div className="w-px h-3 border-theme"></div>

            <div className="flex items-center gap-2">
               <span className="text-[10px] text-theme-tertiary uppercase font-medium">Key</span>
               <span className="text-xs text-blue-300 font-mono tracking-wider group-hover:text-blue-200 transition-colors">
                 {getMaskedKey(apiKey)}
               </span>
            </div>
         </div>
      ) : (
         /* Disconnected State - "Add Key" prompt */
         <button 
           onClick={onOpenSettings}
           className="bg-blue-600/90 hover:bg-blue-500/90 backdrop-blur-md border border-blue-400/30 rounded-full shadow-2xl px-5 py-2.5 flex items-center gap-3 transition-all hover:scale-105 active:scale-95 group"
         >
            <div className="relative flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-20"></span>
                 <svg className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
            </div>
            <span className="text-xs font-bold text-white uppercase tracking-wider">Connect Gemini API</span>
         </button>
      )}
    </div>
  );
};