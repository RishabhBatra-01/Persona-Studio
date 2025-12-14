import React, { useState, useRef, useCallback, useMemo, lazy, Suspense } from 'react';
import { HEADSHOT_STYLES, AI_MODELS } from './constants';
import { HeadshotStyle, AppState, AiModelId } from './types';
import { compressAndResizeImage } from './utils/imageUtils';
import { generateHeadshot, editHeadshot } from './services/geminiService';
import { Button } from './components/Button';
import { StyleCard } from './components/StyleCard';
import { LoadingOverlay } from './components/LoadingOverlay';
import { ApiKeyModal } from './components/ApiKeyModal';
import { ApiStats } from './components/ApiStats';
import { Footer } from './components/Footer';
import { Toast, ToastMessage } from './components/Toast';
import { useApiMetrics } from './hooks/useApiMetrics';

// Lazy load heavy components
const ImageComparisonSlider = lazy(() => 
  import('./components/ImageComparisonSlider').then(module => ({ default: module.ImageComparisonSlider }))
);

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.UPLOAD);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<HeadshotStyle | null>(null);
  const [customStylePrompt, setCustomStylePrompt] = useState('');
  const [editPrompt, setEditPrompt] = useState('');
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [selectedModelId, setSelectedModelId] = useState<AiModelId>('gemini-2.5-flash-image');
  
  // API Key State - memoized initialization
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('gemini_api_key') || '';
  });
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);

  // API Metrics Hook
  const { metrics, trackRequest } = useApiMetrics();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Memoized callbacks to prevent re-renders
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    setToast({ id: Date.now().toString(), message, type });
  }, []);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      showToast("Processing your photo...", "info");
      const base64 = await compressAndResizeImage(file);
      setOriginalImage(base64);
      setAppState(AppState.STYLE_SELECT);
      showToast("Photo ready! Choose a style.", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to process image.", "error");
    }
  }, [showToast]);

  const handleStyleSelect = useCallback((style: HeadshotStyle) => {
    setSelectedStyle(style);
  }, []);

  const handleSaveApiKey = useCallback((key: string) => {
    setApiKey(key);
    if (key) {
      localStorage.setItem('gemini_api_key', key);
      showToast("Studio key connected.", "success");
    } else {
      localStorage.removeItem('gemini_api_key');
      showToast("Studio key removed.", "info");
    }
  }, [showToast]);

  const handleGenerate = useCallback(async () => {
    if (!originalImage || !selectedStyle) return;
    
    if (!apiKey) {
      setIsKeyModalOpen(true);
      return;
    }

    // Determine prompt
    let finalPrompt = selectedStyle.promptModifier;
    if (selectedStyle.id === 'custom') {
      if (!customStylePrompt.trim()) {
        showToast("Please describe your custom style.", "error");
        return;
      }
      finalPrompt = `professional headshot, ${customStylePrompt}, high quality, photorealistic`;
    }

    setAppState(AppState.GENERATING);

    try {
      const result = await trackRequest(() => 
        generateHeadshot(apiKey, originalImage, finalPrompt, selectedModelId)
      );
      
      setGeneratedImage(result);
      setAppState(AppState.RESULT);
      showToast("Headshot ready!", "success");
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Generation failed.", "error");
      setAppState(AppState.STYLE_SELECT); 
      
      if (err.message.includes('Permission Denied') || err.message.includes('API Key')) {
        setTimeout(() => setIsKeyModalOpen(true), 1500);
      }
    }
  }, [originalImage, selectedStyle, apiKey, customStylePrompt, selectedModelId, trackRequest, showToast]);

  const handleEdit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!generatedImage || !editPrompt.trim()) return;

    if (!apiKey) {
      setIsKeyModalOpen(true);
      return;
    }

    const currentImage = generatedImage; 
    const prevAppState = appState;
    setAppState(AppState.GENERATING);

    try {
      const result = await trackRequest(() => 
        editHeadshot(apiKey, currentImage, editPrompt, selectedModelId)
      );
      setGeneratedImage(result);
      setEditPrompt('');
      setAppState(AppState.RESULT);
      showToast("Refinements applied.", "success");
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Edit failed.", "error");
      setAppState(prevAppState);

      if (err.message.includes('Permission Denied') || err.message.includes('API Key')) {
        setTimeout(() => setIsKeyModalOpen(true), 1500);
      }
    }
  }, [generatedImage, editPrompt, apiKey, selectedModelId, appState, trackRequest, showToast]);

  const handleReset = useCallback(() => {
    setOriginalImage(null);
    setGeneratedImage(null);
    setSelectedStyle(null);
    setEditPrompt('');
    setCustomStylePrompt('');
    setAppState(AppState.UPLOAD);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const handleDownload = useCallback(() => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `persona-studio-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("Saved to your device.", "success");
    }
  }, [generatedImage, showToast]);

  // Memoize expensive computations
  const currentModelName = useMemo(() => 
    AI_MODELS.find(m => m.id === selectedModelId)?.name || 'Standard',
    [selectedModelId]
  );

  const estimatedTime = useMemo(() => 
    selectedModelId.includes('flash') ? '~5 seconds' : '~10-15 seconds',
    [selectedModelId]
  );

  return (
    <div className="min-h-screen text-slate-100 selection:bg-blue-500/30 flex flex-col font-sans relative">
      <ApiKeyModal 
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        onSave={handleSaveApiKey}
        initialKey={apiKey}
      />

      <ApiStats 
        metrics={metrics} 
        apiKey={apiKey} 
        onOpenSettings={() => setIsKeyModalOpen(true)}
      />
      
      {toast && <Toast toast={toast} onDismiss={() => setToast(null)} />}

      {/* Floating Header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 pointer-events-none">
        <header className="glass-panel rounded-full px-6 py-3 flex items-center justify-between gap-6 pointer-events-auto shadow-2xl shadow-black/20">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={handleReset}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <span className="font-bold text-sm tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Persona<span className="font-light text-slate-500"> Studio</span>
            </span>
          </div>
          
          <div className="h-4 w-px bg-white/10"></div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsKeyModalOpen(true)}
              className={`p-2 rounded-full transition-all duration-300 ${apiKey ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
              title={apiKey ? "Studio Connected" : "Connect Studio"}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 {apiKey ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                 ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                 )}
              </svg>
            </button>
            
            {appState !== AppState.UPLOAD && (
               <button onClick={handleReset} className="text-xs font-medium text-slate-400 hover:text-white transition-colors px-2">
                  New
               </button>
            )}
          </div>
        </header>
      </div>

      <main className="flex-grow w-full max-w-5xl mx-auto px-4 pt-32 pb-12 flex flex-col items-center justify-center min-h-[80vh]">
        {/* Step 1: Upload */}
        {appState === AppState.UPLOAD && (
          <div className="w-full max-w-2xl text-center space-y-10 animate-fade-in">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-blue-300 mb-2">
                 <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                 Gemini 2.5 Powered Studio
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]">
                Your Perfect <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                  Professional Look
                </span>
              </h1>
              <p className="text-lg text-slate-400 max-w-md mx-auto leading-relaxed">
                Upload a casual selfie. We'll handle the lighting, backdrop, and attire instantly.
              </p>
            </div>

            <div 
              className="relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
               <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
               
               <div className="relative glass-panel rounded-[2rem] p-12 md:p-16 transition-transform duration-300 group-hover:scale-[1.01]">
                  <div className="w-24 h-24 mx-auto bg-slate-800/50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-white/10">
                    <svg className="w-10 h-10 text-slate-300 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-2">Drop your selfie here</h3>
                  <p className="text-slate-500">or click to browse</p>
               </div>

              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/png, image/jpeg, image/webp" 
                className="hidden" 
                onChange={handleFileUpload} 
              />
            </div>
            
            {!apiKey && (
              <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <button 
                  onClick={() => setIsKeyModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all group"
                >
                  <span className="text-sm text-slate-300 group-hover:text-white font-medium">Configure Gemini API Key</span>
                  <svg className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
                <p className="text-xs text-slate-500 mt-2">Required for image generation</p>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Select Style */}
        {appState === AppState.STYLE_SELECT && originalImage && (
          <div className="w-full grid lg:grid-cols-12 gap-8 lg:gap-16 items-start animate-fade-in">
            {/* Left: Preview */}
            <div className="lg:col-span-5 lg:sticky lg:top-32 flex flex-col gap-6">
               <div className="relative group rounded-3xl overflow-hidden shadow-2xl shadow-black/50 aspect-[3/4] w-full max-w-sm border-[8px] border-white/5 bg-slate-900 mx-auto rotate-1 hover:rotate-0 transition-transform duration-500">
                 <img 
                   src={originalImage} 
                   alt="Original" 
                   className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                   loading="lazy"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent">
                    <div className="absolute bottom-6 left-6">
                        <p className="text-white font-bold text-lg">Original</p>
                        <p className="text-slate-400 text-sm">Select a vibe to transform</p>
                    </div>
                 </div>
               </div>
               
               {/* Controls Panel */}
               <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 space-y-6 max-w-sm mx-auto w-full">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quality Mode</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {AI_MODELS.map((model) => (
                            <button
                            key={model.id}
                            onClick={() => setSelectedModelId(model.id)}
                            className={`relative flex flex-col p-3 rounded-xl border text-left transition-all ${
                                selectedModelId === model.id 
                                ? 'bg-blue-500/10 border-blue-500/50' 
                                : 'bg-white/5 border-transparent hover:bg-white/10'
                            }`}
                            >
                            <span className={`text-sm font-bold ${selectedModelId === model.id ? 'text-white' : 'text-slate-300'}`}>
                                {model.name}
                            </span>
                            <span className="text-[10px] text-slate-500 mt-1">{model.badge}</span>
                            {selectedModelId === model.id && (
                                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]"></span>
                            )}
                            </button>
                        ))}
                    </div>
                  </div>
               </div>
            </div>

            {/* Right: Controls */}
            <div className="lg:col-span-7 space-y-10">
              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-white">Select Your Vibe</h2>
                <p className="text-slate-400 text-lg">Choose a style that fits your personal brand.</p>
              </div>

              <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
                {HEADSHOT_STYLES.map((style) => (
                  <StyleCard 
                    key={style.id} 
                    style={style} 
                    isSelected={selectedStyle?.id === style.id}
                    onSelect={handleStyleSelect}
                    customInputValue={customStylePrompt}
                    onCustomInputChange={setCustomStylePrompt}
                  />
                ))}
              </div>

              <div className="pt-8 border-t border-white/5 flex flex-col items-center gap-4">
                <Button 
                  onClick={handleGenerate} 
                  disabled={!selectedStyle || (selectedStyle.id === 'custom' && !customStylePrompt.trim())} 
                  variant="premium"
                  className="w-full py-5 text-lg shadow-xl shadow-blue-900/20"
                >
                  Create Magic
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </Button>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">
                    {estimatedTime}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Loading */}
        {appState === AppState.GENERATING && (
           <LoadingOverlay message={generatedImage ? "Applying finishing touches..." : "Analyzing facial features and studio lighting..."} />
        )}

        {/* Step 4: Result & Edit */}
        {appState === AppState.RESULT && generatedImage && (
          <div className="w-full max-w-5xl animate-fade-in space-y-12">
            
            <div className="text-center space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold text-white">Your New Look</h2>
                <div className="flex justify-center gap-4">
                   <Button variant="outline" onClick={handleReset} className="px-6 rounded-full text-sm">
                     Discard
                   </Button>
                   <Button variant="premium" onClick={handleDownload} className="px-8 rounded-full shadow-lg shadow-blue-500/25">
                     Save Image
                   </Button>
                </div>
            </div>

            <div className="grid md:grid-cols-12 gap-8 lg:gap-16 items-start">
               {/* Result Image - Main Focus */}
               <div className="md:col-span-7 lg:col-span-8">
                   <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/10 group bg-slate-950/50 aspect-[3/4] md:aspect-auto md:h-[600px] flex items-center justify-center">
                      <Suspense fallback={<div className="text-slate-400">Loading comparison...</div>}>
                        {originalImage ? (
                          <ImageComparisonSlider 
                            beforeImage={originalImage} 
                            afterImage={generatedImage} 
                          />
                        ) : (
                          <img src={generatedImage} alt="Generated Headshot" className="w-full h-full object-cover" loading="lazy" />
                        )}
                      </Suspense>
                      
                      <div className="absolute bottom-6 right-6 flex gap-4 z-30 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                         <button onClick={() => window.open(generatedImage, '_blank')} className="pointer-events-auto p-4 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all hover:scale-110 shadow-lg">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                         </button>
                         <button onClick={handleDownload} className="pointer-events-auto p-4 bg-white text-slate-900 rounded-full hover:bg-blue-50 transition-all hover:scale-110 shadow-lg">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                         </button>
                      </div>
                   </div>
                   <p className="text-center text-xs text-slate-500 mt-4">Drag the slider to compare original vs. result</p>
               </div>

               {/* Editing Panel - Sidebar */}
               <div className="md:col-span-5 lg:col-span-4 space-y-6 md:sticky md:top-32">
                  <div className="glass-panel p-6 rounded-3xl space-y-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-blue-400">
                             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                             </svg>
                             <span className="text-xs font-bold uppercase tracking-wider">AI Editor</span>
                        </div>
                        <h3 className="text-xl font-bold text-white">Refine Result</h3>
                        <p className="text-sm text-slate-400">Not quite right? Ask the AI to tweak it.</p>
                    </div>

                    <form onSubmit={handleEdit} className="space-y-4">
                        <div className="relative">
                            <input
                            type="text"
                            value={editPrompt}
                            onChange={(e) => setEditPrompt(e.target.value)}
                            placeholder="e.g. Add glasses..."
                            className="w-full bg-slate-950/50 border border-slate-700/50 rounded-2xl px-4 py-4 pr-12 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm shadow-inner"
                            />
                            <button 
                                type="submit"
                                disabled={!editPrompt.trim()}
                                className="absolute right-2 top-2 p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl disabled:opacity-0 disabled:scale-90 transition-all duration-300 shadow-lg"
                            >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                            </button>
                        </div>
                        
                        <div className="space-y-3">
                            <p className="text-xs font-semibold text-slate-500 uppercase">Quick Fixes</p>
                            <div className="flex flex-wrap gap-2">
                                {['Brighter', 'Warm Tone', 'B&W', 'Smile'].map(suggestion => (
                                <button 
                                    key={suggestion}
                                    type="button"
                                    onClick={() => setEditPrompt(suggestion)}
                                    className="text-xs bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 px-3 py-2 rounded-lg transition-colors"
                                >
                                    {suggestion}
                                </button>
                                ))}
                            </div>
                        </div>
                    </form>
                  </div>
                  
                  <div className="glass-panel p-4 rounded-3xl flex items-center justify-between text-xs text-slate-400">
                       <span>Generations this session</span>
                       <span className="font-mono bg-white/10 px-2 py-1 rounded-md text-white">{metrics.totalRequests}</span>
                  </div>
                  
                  <div className="glass-panel p-4 rounded-3xl flex items-center justify-between text-xs text-slate-400">
                       <span>Active Model</span>
                       <span className="font-mono bg-white/10 px-2 py-1 rounded-md text-blue-200">
                           {currentModelName}
                       </span>
                  </div>
               </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;
