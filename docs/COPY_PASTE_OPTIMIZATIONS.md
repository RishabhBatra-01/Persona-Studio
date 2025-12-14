# Copy-Paste Performance Optimizations

## 1. Optimize Button Component

Replace entire `components/Button.tsx` with:

```typescript
import React, { memo } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'premium';
  isLoading?: boolean;
}

export const Button = memo<ButtonProps>(({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  disabled,
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed tracking-wide";
  
  const variants = {
    primary: "bg-white text-slate-900 hover:bg-slate-200 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] border border-transparent",
    premium: "bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 border border-transparent hover:scale-[1.02]",
    secondary: "bg-slate-800/50 backdrop-blur-md border border-slate-700/50 hover:bg-slate-800 hover:border-slate-600 text-white",
    outline: "border-2 border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white bg-transparent",
    ghost: "text-slate-400 hover:text-white hover:bg-white/5"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="animate-pulse">Thinking...</span>
        </>
      ) : children}
    </button>
  );
});

Button.displayName = 'Button';
```

---

## 2. Optimize LoadingOverlay Component

Replace entire `components/LoadingOverlay.tsx` with:

```typescript
import React, { memo } from 'react';

interface LoadingOverlayProps {
  message: string;
}

export const LoadingOverlay = memo<LoadingOverlayProps>(({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 space-y-8 animate-fade-in">
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
        <div className="absolute inset-0 border-2 border-white/10 rounded-full"></div>
        <div className="absolute inset-0 border-t-2 border-blue-400 rounded-full animate-spin"></div>
        <div className="absolute inset-4 border-b-2 border-purple-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        
        <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-10 h-10 text-white animate-float" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
        </div>
      </div>
      
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">
          Working Magic
        </h3>
        <p className="text-slate-400 max-w-xs mx-auto text-sm animate-pulse tracking-wide font-medium">
          {message}
        </p>
      </div>
    </div>
  );
});

LoadingOverlay.displayName = 'LoadingOverlay';
```

---

## 3. Optimize Footer Component

Replace entire `components/Footer.tsx` with:

```typescript
import React, { memo } from 'react';

export const Footer = memo(() => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-slate-900 bg-slate-950 py-8 mt-12">
      <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
           <span>&copy; {currentYear} Persona Studio</span>
           <span className="w-1 h-1 rounded-full bg-slate-700"></span>
           <span>Powered by Google Gemini 2.5</span>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-right">
          <p>
            <strong className="text-slate-400">Privacy Notice:</strong> Your images are processed directly via the Google Gemini API using your API key. 
            We do not store your photos on our servers.
          </p>
          <a 
            href="https://ai.google.dev/gemini-api/docs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors"
          >
            API Documentation
          </a>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';
```

---

## 4. Optimize ApiStats Component

Replace entire `components/ApiStats.tsx` with:

```typescript
import React, { memo, useMemo } from 'react';
import { ApiMetrics } from '../types';

interface ApiStatsProps {
  metrics: ApiMetrics;
  apiKey: string;
  onOpenSettings: () => void;
}

export const ApiStats = memo<ApiStatsProps>(({ apiKey, onOpenSettings }) => {
  const maskedKey = useMemo(() => {
    if (!apiKey) return 'Not Set';
    if (apiKey.startsWith('AIza')) {
       return `AIza...${apiKey.slice(-4)}`;
    }
    return apiKey.length > 8 ? `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}` : '********';
  }, [apiKey]);

  return (
    <div className="fixed bottom-4 right-4 z-[40] animate-fade-in hidden md:block">
      {apiKey ? (
         <div 
           onClick={onOpenSettings}
           className="bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-full shadow-2xl px-4 py-2 flex items-center gap-4 hover:border-slate-500 transition-colors cursor-pointer group"
           role="button"
           title="Click to manage API Key"
         >
            <div className="flex items-center gap-2">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </div>
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider group-hover:text-white transition-colors">Gemini Live</span>
            </div>
            
            <div className="w-px h-3 bg-slate-700"></div>

            <div className="flex items-center gap-2">
               <span className="text-[10px] text-slate-500 uppercase font-medium">Key</span>
               <span className="text-xs text-blue-300 font-mono tracking-wider group-hover:text-blue-200 transition-colors">
                 {maskedKey}
               </span>
            </div>
         </div>
      ) : (
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
});

ApiStats.displayName = 'ApiStats';
```

---

## 5. Add Debouncing Hook

Create new file `hooks/useDebounce.ts`:

```typescript
import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

---

## 6. Update ImageComparisonSlider for Better Performance

Add this at the top of `components/ImageComparisonSlider.tsx`:

```typescript
import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
```

Wrap the export:

```typescript
export const ImageComparisonSlider = memo<ImageComparisonSliderProps>(({ beforeImage, afterImage }) => {
  // ... existing code
});

ImageComparisonSlider.displayName = 'ImageComparisonSlider';
```

---

## 7. Add Request Cancellation to geminiService

Add this to `services/geminiService.ts`:

```typescript
// At the top, create abort controller map
const abortControllers = new Map<string, AbortController>();

export const cancelRequest = (requestId: string) => {
  const controller = abortControllers.get(requestId);
  if (controller) {
    controller.abort();
    abortControllers.delete(requestId);
  }
};

// Modify generateHeadshot to support cancellation
export const generateHeadshot = async (
  apiKey: string,
  imageBase64: string,
  stylePrompt: string,
  modelId: AiModelId = 'gemini-2.5-flash-image',
  requestId?: string
): Promise<string> => {
  // Create abort controller
  const controller = new AbortController();
  if (requestId) {
    abortControllers.set(requestId, controller);
  }

  try {
    // ... existing code
    
    // Clean up controller on success
    if (requestId) {
      abortControllers.delete(requestId);
    }
    
    return extractImageFromResponse(response);
  } catch (error: any) {
    // Clean up controller on error
    if (requestId) {
      abortControllers.delete(requestId);
    }
    
    if (error.name === 'AbortError') {
      throw new Error('Request cancelled');
    }
    
    console.error("Gemini Generation Error:", error);
    handleGeminiError(error, modelId);
    throw error;
  }
};
```

---

## 8. Add Performance Monitoring

Create new file `utils/performance.ts`:

```typescript
export const measurePerformance = (name: string) => {
  const start = performance.now();
  
  return {
    end: () => {
      const duration = performance.now() - start;
      console.log(`⚡ ${name}: ${duration.toFixed(2)}ms`);
      return duration;
    }
  };
};

export const measureAsync = async <T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> => {
  const measure = measurePerformance(name);
  try {
    const result = await fn();
    measure.end();
    return result;
  } catch (error) {
    measure.end();
    throw error;
  }
};
```

Use it in App.tsx:

```typescript
import { measureAsync } from './utils/performance';

// In handleGenerate:
const result = await measureAsync('Generate Headshot', () =>
  trackRequest(() => 
    generateHeadshot(apiKey, originalImage, finalPrompt, selectedModelId)
  )
);
```

---

## 9. Update package.json Scripts

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:analyze": "vite build --mode production && vite-bundle-visualizer",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  }
}
```

---

## 10. Add Loading Attribute to Images

In all `<img>` tags, add `loading="lazy"`:

```typescript
<img 
  src={originalImage} 
  alt="Original" 
  className="w-full h-full object-cover"
  loading="lazy"
  decoding="async"
/>
```

---

## Testing Checklist

After applying optimizations:

- [ ] App loads faster
- [ ] No console errors
- [ ] Image upload works
- [ ] Style selection works
- [ ] Generation works
- [ ] Edit works
- [ ] Download works
- [ ] API key modal works
- [ ] Toast notifications work
- [ ] Image comparison slider works
- [ ] Mobile responsive
- [ ] No memory leaks (check DevTools)

---

## Rollback Instructions

If something breaks:

```bash
# Restore backups
cp vite.config.backup.ts vite.config.ts
cp hooks/useApiMetrics.backup.ts hooks/useApiMetrics.ts
cp utils/imageUtils.backup.ts utils/imageUtils.ts
cp components/StyleCard.backup.tsx components/StyleCard.tsx

# Reinstall dependencies
npm install

# Restart dev server
npm run dev
```
