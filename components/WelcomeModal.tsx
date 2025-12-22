import React from 'react';
import { Button } from './Button';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGetStarted: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose, onGetStarted }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 md:p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="welcome-modal-backdrop absolute inset-0"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div 
        className="welcome-modal-content relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl md:rounded-3xl overflow-hidden animate-fade-in z-10"
        style={{ animationDuration: '0.3s' }}
      >
        {/* Header with gradient */}
        <div className="relative h-36 md:h-48 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 flex items-center justify-center overflow-hidden">
          {/* Animated background blobs */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl animate-blob"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          </div>
          
          <div className="relative text-center z-10">
            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-white/20 backdrop-blur-sm rounded-2xl md:rounded-3xl flex items-center justify-center mb-3 md:mb-4 shadow-lg">
              <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">Welcome to Persona Studio</h1>
            <p className="text-blue-100 text-base md:text-lg">Transform selfies into professional headshots</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 md:p-8 space-y-5 md:space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl md:text-2xl font-bold text-theme-primary">How It Works</h2>
            <p className="text-theme-secondary text-sm md:text-base">Get professional headshots in 3 simple steps</p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-3 gap-3 md:gap-6">
            {/* Step 1 */}
            <div className="text-center space-y-2 md:space-y-3">
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto bg-blue-500/10 rounded-xl md:rounded-2xl flex items-center justify-center">
                <span className="text-xl md:text-3xl">📸</span>
              </div>
              <div>
                <h3 className="font-bold text-theme-primary text-xs md:text-base mb-0.5 md:mb-1">1. Upload Photo</h3>
                <p className="text-[10px] md:text-sm text-theme-secondary hidden sm:block">Upload a casual selfie or portrait</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center space-y-2 md:space-y-3">
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto bg-purple-500/10 rounded-xl md:rounded-2xl flex items-center justify-center">
                <span className="text-xl md:text-3xl">🎨</span>
              </div>
              <div>
                <h3 className="font-bold text-theme-primary text-xs md:text-base mb-0.5 md:mb-1">2. Choose Style</h3>
                <p className="text-[10px] md:text-sm text-theme-secondary hidden sm:block">Pick from professional styles</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center space-y-2 md:space-y-3">
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto bg-emerald-500/10 rounded-xl md:rounded-2xl flex items-center justify-center">
                <span className="text-xl md:text-3xl">✨</span>
              </div>
              <div>
                <h3 className="font-bold text-theme-primary text-xs md:text-base mb-0.5 md:mb-1">3. Get Result</h3>
                <p className="text-[10px] md:text-sm text-theme-secondary hidden sm:block">Download your headshot in seconds</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="rounded-2xl p-6 space-y-3 border-theme" style={{ backgroundColor: 'var(--surface-bg)' }}>
            <h3 className="font-bold text-theme-primary mb-3">Why Persona Studio?</h3>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="flex items-start gap-3">
                <span className="text-emerald-500 mt-0.5">✓</span>
                <div>
                  <p className="text-sm font-medium text-theme-primary">AI-Powered</p>
                  <p className="text-xs text-theme-secondary">Google Gemini 2.5 technology</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-emerald-500 mt-0.5">✓</span>
                <div>
                  <p className="text-sm font-medium text-theme-primary">Privacy First</p>
                  <p className="text-xs text-theme-secondary">Your photos stay on your device</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-emerald-500 mt-0.5">✓</span>
                <div>
                  <p className="text-sm font-medium text-theme-primary">Lightning Fast</p>
                  <p className="text-xs text-theme-secondary">Results in 5-15 seconds</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-emerald-500 mt-0.5">✓</span>
                <div>
                  <p className="text-sm font-medium text-theme-primary">Multiple Styles</p>
                  <p className="text-xs text-theme-secondary">Corporate, creative, and custom</p>
                </div>
              </div>
            </div>
          </div>

          {/* API Key Notice */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">API Key Required</p>
                <p className="text-xs text-theme-secondary">You'll need a free Google Gemini API key to use this app. We'll help you set it up!</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="flex-1"
            >
              Skip Tour
            </Button>
            <Button 
              variant="premium" 
              onClick={onGetStarted}
              className="flex-1"
            >
              Get Started
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
          </div>

          {/* Don't show again */}
          <div className="text-center">
            <label className="inline-flex items-center gap-2 text-xs text-theme-tertiary cursor-pointer hover:text-theme-secondary transition-colors">
              <input 
                type="checkbox" 
                className="rounded border-theme"
                onChange={(e) => {
                  if (e.target.checked) {
                    localStorage.setItem('persona_studio_welcome_seen', 'true');
                  }
                }}
              />
              Don't show this again
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
