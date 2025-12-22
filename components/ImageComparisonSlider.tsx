import React, { useState, useRef, useEffect, useCallback } from 'react';

interface ImageComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
}

export const ImageComparisonSlider: React.FC<ImageComparisonSliderProps> = ({ beforeImage, afterImage }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percentage = (x / rect.width) * 100;
      setSliderPosition(percentage);
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    handleMove('touches' in e ? e.touches[0].clientX : e.clientX);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging.current) return;
    handleMove('touches' in e ? e.touches[0].clientX : e.clientX);
  }, [handleMove]);

  useEffect(() => {
    const handleUp = () => (isDragging.current = false);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchend', handleUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleMouseMove);

    return () => {
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchend', handleUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleMouseMove);
    };
  }, [handleMouseMove]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full select-none overflow-hidden cursor-ew-resize group bg-slate-900"
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
    >
      {/* After Image (Full Background) */}
      <img 
        src={afterImage} 
        alt="AI Generated" 
        className="absolute inset-0 w-full h-full object-contain" 
      />
      
      {/* Before Image (Foreground with Clip Path) */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{ 
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
          WebkitClipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
        }}
      >
        <img 
          src={beforeImage} 
          alt="Original" 
          className="absolute inset-0 w-full h-full object-contain" 
        />
        
        {/* Label on Before Side */}
        <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-black/60 text-white text-[8px] md:text-[10px] uppercase font-bold tracking-widest px-2 py-1 md:px-3 md:py-1.5 rounded-full backdrop-blur-md pointer-events-none border border-white/10">
          Original
        </div>
      </div>
      
      {/* Label on After Side (Only visible if slider allows) */}
      <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-blue-600/60 text-white text-[8px] md:text-[10px] uppercase font-bold tracking-widest px-2 py-1 md:px-3 md:py-1.5 rounded-full backdrop-blur-md pointer-events-none border border-white/10">
        AI Result
      </div>

      {/* Slider Handle Line */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Slider Knob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center shadow-xl text-slate-900 transition-transform group-active:scale-110">
           <svg className="w-4 h-4 md:w-5 md:h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
           </svg>
        </div>
      </div>
    </div>
  );
};