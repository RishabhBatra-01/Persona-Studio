import React, { useState } from 'react';

export const UploadTips: React.FC = () => {
  const [showExamples, setShowExamples] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Tips Section */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-theme-primary flex items-center gap-2">
          <span className="text-2xl">💡</span>
          Tips for Best Results
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-theme-primary">Face Clearly Visible</p>
              <p className="text-xs text-theme-secondary">Front-facing, no obstructions</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-theme-primary">Good Lighting</p>
              <p className="text-xs text-theme-secondary">Well-lit, avoid harsh shadows</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-theme-primary">High Quality</p>
              <p className="text-xs text-theme-secondary">Clear, not blurry or pixelated</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-theme-primary">Simple Background</p>
              <p className="text-xs text-theme-secondary">Less clutter = better results</p>
            </div>
          </div>
        </div>
      </div>

      {/* File Requirements */}
      <div className="text-center space-y-2">
        <p className="text-xs text-theme-tertiary">
          Supports: <span className="font-medium text-theme-secondary">JPG, PNG, WEBP</span> • Max size: <span className="font-medium text-theme-secondary">10MB</span>
        </p>
        
        <button
          onClick={() => setShowExamples(!showExamples)}
          className="text-xs text-blue-500 hover:text-blue-400 transition-colors font-medium inline-flex items-center gap-1"
        >
          {showExamples ? 'Hide' : 'Show'} Examples
          <svg 
            className={`w-3 h-3 transition-transform ${showExamples ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Examples Section */}
      {showExamples && (
        <div className="glass-panel rounded-2xl p-6 space-y-4 animate-fade-in">
          <h3 className="text-lg font-bold text-theme-primary text-center">Good vs Bad Examples</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Good Example */}
            <div className="space-y-3">
              <div className="relative rounded-xl overflow-hidden border-2 border-emerald-500/50 bg-emerald-500/5">
                <div className="aspect-[3/4] bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 mx-auto bg-emerald-500/20 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Good Photo</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 px-4">Clear face, good lighting, simple background</p>
                  </div>
                </div>
                <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  ✓ GOOD
                </div>
              </div>
              <ul className="space-y-1 text-xs text-theme-secondary">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span> Face centered and clear
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span> Natural lighting
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span> Neutral expression
                </li>
              </ul>
            </div>

            {/* Bad Example */}
            <div className="space-y-3">
              <div className="relative rounded-xl overflow-hidden border-2 border-red-500/50 bg-red-500/5">
                <div className="aspect-[3/4] bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-red-700 dark:text-red-300">Avoid This</p>
                    <p className="text-xs text-red-600 dark:text-red-400 px-4">Blurry, dark, face obscured</p>
                  </div>
                </div>
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  ✗ BAD
                </div>
              </div>
              <ul className="space-y-1 text-xs text-theme-secondary">
                <li className="flex items-center gap-2">
                  <span className="text-red-500">✗</span> Face partially hidden
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500">✗</span> Poor lighting/shadows
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500">✗</span> Blurry or low quality
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
