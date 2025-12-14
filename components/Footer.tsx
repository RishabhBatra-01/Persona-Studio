import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-theme py-8 mt-12" style={{ backgroundColor: 'var(--surface-bg)' }}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Row: Copyright and Powered by */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-4">
          <div className="flex items-center gap-2 text-xs text-theme-tertiary">
            <span>&copy; {new Date().getFullYear()} Persona Studio</span>
            <span className="w-1 h-1 rounded-full border-theme"></span>
            <span>Powered by Google Gemini 2.5</span>
          </div>
          
          <a 
            href="https://ai.google.dev/gemini-api/docs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-theme-tertiary hover:text-blue-400 transition-colors whitespace-nowrap"
          >
            API Documentation →
          </a>
        </div>
        
        {/* Bottom Row: Privacy Notice */}
        <div className="text-center md:text-left">
          <p className="text-xs text-theme-tertiary leading-relaxed max-w-3xl mx-auto md:mx-0">
            <strong className="text-theme-secondary">Privacy Notice:</strong> Your images are processed directly via the Google Gemini API using your API key. We do not store your photos on our servers.
          </p>
        </div>
      </div>
    </footer>
  );
};