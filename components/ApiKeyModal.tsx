import React, { useState, useEffect } from 'react';
import { Button } from './Button';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string) => void;
  initialKey: string;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSave, initialKey }) => {
  const [key, setKey] = useState(initialKey);

  useEffect(() => {
    setKey(initialKey);
  }, [initialKey, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(key);
    onClose();
  };

  const handleClear = () => {
    onSave('');
    setKey('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div className="absolute inset-0 backdrop-blur-md animate-fade-in" style={{ backgroundColor: 'var(--overlay-bg)' }} onClick={onClose}></div>
        
        {/* Modal */}
        <div className="relative w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-fade-in border-theme" style={{ backgroundColor: 'var(--surface-bg)', animationDuration: '0.3s' }}>
            {/* Header Art */}
            <div className="h-32 bg-blue-600/10 flex items-center justify-center relative overflow-hidden">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-sm z-10">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                </div>
            </div>

            <div className="p-8 space-y-6">
                <div className="text-center space-y-2">
                    <h2 className="text-xl font-bold text-theme-primary">Unlock Your Studio</h2>
                    <p className="text-theme-secondary text-sm leading-relaxed">
                        To ensure your privacy, this app runs entirely in your browser using your own Google Gemini API key.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="apiKey" className="block text-xs font-semibold text-theme-secondary uppercase tracking-wider ml-1">
                            API Key
                        </label>
                        <div className="relative group">
                            <input
                                id="apiKey"
                                type="password"
                                value={key}
                                onChange={(e) => setKey(e.target.value)}
                                placeholder="AIzaSy..."
                                className="w-full rounded-xl px-4 py-4 text-theme-primary border-theme focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-mono text-sm shadow-inner"
                                style={{ backgroundColor: 'var(--input-bg)' }}
                                autoFocus
                            />
                            <div className="absolute inset-0 rounded-xl ring-1 ring-white/5 pointer-events-none"></div>
                        </div>
                        <p className="text-[10px] text-theme-tertiary ml-1">
                          Key is stored locally on your device.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        {initialKey ? (
                           <Button type="button" variant="outline" onClick={handleClear} className="flex-1 border-red-900/50 text-red-400 hover:bg-red-950/30 hover:border-red-500/50 hover:text-red-200">
                             Remove Key
                           </Button>
                        ) : (
                           <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
                              Cancel
                           </Button>
                        )}
                        <Button type="submit" variant="premium" disabled={!key.trim()} className="flex-1">
                            {initialKey ? 'Update Key' : 'Connect Key'}
                        </Button>
                    </div>
                </form>

                <div className="flex flex-col gap-2 pt-2 border-t text-center border-theme">
                    <a 
                        href="https://aistudio.google.com/app/apikey" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-theme-tertiary hover:text-blue-400 transition-colors flex items-center justify-center gap-1 group"
                    >
                        <span>Get a free key from Google AI Studio</span>
                        <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                    <a 
                        href="https://ai.google.dev/gemini-api/docs/billing" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] font-medium text-theme-tertiary hover:text-emerald-400 transition-colors"
                    >
                        Using Pro? Ensure billing is enabled in your Google Cloud Project.
                    </a>
                </div>
            </div>
        </div>
    </div>
  );
};