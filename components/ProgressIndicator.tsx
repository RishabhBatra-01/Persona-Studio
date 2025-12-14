import React, { useState, useEffect } from 'react';

interface ProgressIndicatorProps {
  message: string;
  estimatedTime?: number; // in seconds
}

interface Step {
  id: string;
  label: string;
  duration: number; // percentage of total time
}

const GENERATION_STEPS: Step[] = [
  { id: 'analyze', label: 'Analyzing facial features', duration: 20 },
  { id: 'style', label: 'Applying style transformation', duration: 40 },
  { id: 'render', label: 'Rendering final image', duration: 30 },
  { id: 'finalize', label: 'Finalizing details', duration: 10 },
];

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
  message, 
  estimatedTime = 10 
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(estimatedTime);

  useEffect(() => {
    const startTime = Date.now();
    const totalDuration = estimatedTime * 1000; // convert to ms

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progressPercent = Math.min((elapsed / totalDuration) * 100, 99);
      setProgress(progressPercent);

      // Update time remaining
      const remaining = Math.max(0, Math.ceil((totalDuration - elapsed) / 1000));
      setTimeRemaining(remaining);

      // Update current step based on progress
      let cumulativeDuration = 0;
      for (let i = 0; i < GENERATION_STEPS.length; i++) {
        cumulativeDuration += GENERATION_STEPS[i].duration;
        if (progressPercent < cumulativeDuration) {
          setCurrentStepIndex(i);
          break;
        }
      }

      // Clear interval when done
      if (progressPercent >= 99) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [estimatedTime]);

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 space-y-8 animate-fade-in">
      {/* Loading Spinner */}
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 bg-blue-600/20 rounded-full"></div>
        <div className="absolute inset-0 border-2 rounded-full border-theme"></div>
        <div className="absolute inset-0 border-t-2 border-blue-500 rounded-full animate-spin"></div>
        <div 
          className="absolute inset-4 border-b-2 border-blue-400 rounded-full animate-spin" 
          style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
        ></div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-10 h-10 text-theme-primary animate-float" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>

        {/* Progress percentage */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-center">
          <p className="text-2xl font-bold text-blue-500">{Math.round(progress)}%</p>
        </div>
      </div>
      
      {/* Main message */}
      <div className="text-center space-y-2 mt-8">
        <h3 className="text-2xl font-bold text-theme-primary">
          Working Magic
        </h3>
        <p className="text-theme-secondary max-w-xs mx-auto text-sm font-medium">
          {message}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="w-full max-w-md space-y-3">
        {GENERATION_STEPS.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isPending = index > currentStepIndex;

          return (
            <div 
              key={step.id}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                isCurrent ? 'glass-panel scale-105' : 'opacity-60'
              }`}
            >
              {/* Step icon */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                isCompleted 
                  ? 'bg-emerald-500 text-white' 
                  : isCurrent 
                  ? 'bg-blue-500 text-white animate-pulse' 
                  : 'bg-theme-surface border-theme text-theme-tertiary'
              }`}>
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : isCurrent ? (
                  <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                ) : (
                  <span className="text-xs font-bold">{index + 1}</span>
                )}
              </div>

              {/* Step label */}
              <div className="flex-1">
                <p className={`text-sm font-medium transition-colors ${
                  isCurrent ? 'text-theme-primary' : 'text-theme-secondary'
                }`}>
                  {step.label}
                </p>
              </div>

              {/* Status indicator */}
              {isCurrent && (
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Time remaining */}
      <div className="text-center space-y-2">
        <p className="text-xs font-medium text-theme-tertiary uppercase tracking-wider">
          Estimated Time Remaining
        </p>
        <p className="text-lg font-bold text-blue-500">
          {timeRemaining > 0 ? `~${timeRemaining} seconds` : 'Almost done...'}
        </p>
      </div>

      {/* Fun fact or tip */}
      <div className="glass-panel rounded-xl p-4 max-w-md">
        <p className="text-xs text-theme-secondary text-center">
          <span className="font-semibold text-theme-primary">💡 Tip:</span> You can refine your result after generation using the edit feature!
        </p>
      </div>
    </div>
  );
};
