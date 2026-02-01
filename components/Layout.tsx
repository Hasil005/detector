
import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] -z-10"></div>
      
      <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center shadow-lg shadow-blue-900/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">SENTINEL<span className="text-blue-500">AI</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Documentation</a>
            <a href="#" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Threat Database</a>
            <button className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-full transition-all border border-slate-700">
              API Access
            </button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 relative">
        {children}
      </main>

      <footer className="border-t border-slate-900 py-8 mt-12 bg-slate-950">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            © 2024 Sentinel AI Security. Powered by Google Gemini. This is an AI analysis tool; always use caution with unknown files/links.
          </p>
        </div>
      </footer>
    </div>
  );
};
