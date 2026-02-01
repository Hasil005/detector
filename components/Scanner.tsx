
import React, { useState, useRef } from 'react';
import { ScanType } from '../types';

interface ScannerProps {
  onScan: (type: ScanType, value: string, file?: File) => void;
  isLoading: boolean;
}

export const Scanner: React.FC<ScannerProps> = ({ onScan, isLoading }) => {
  const [activeTab, setActiveTab] = useState<ScanType>(ScanType.LINK);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onScan(ScanType.LINK, urlInput);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Small safety check or just pass to parent
      const reader = new FileReader();
      reader.onload = () => {
        const base64Content = (reader.result as string).split(',')[1];
        onScan(ScanType.FILE, base64Content, file);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm shadow-2xl">
        {/* Tabs */}
        <div className="flex border-b border-slate-800">
          <button
            onClick={() => setActiveTab(ScanType.LINK)}
            className={`flex-1 flex items-center justify-center gap-2 py-4 font-medium transition-all ${
              activeTab === ScanType.LINK 
                ? 'bg-slate-800/50 text-blue-400 border-b-2 border-blue-500' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            URL Scanner
          </button>
          <button
            onClick={() => setActiveTab(ScanType.FILE)}
            className={`flex-1 flex items-center justify-center gap-2 py-4 font-medium transition-all ${
              activeTab === ScanType.FILE 
                ? 'bg-slate-800/50 text-blue-400 border-b-2 border-blue-500' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
            File Scanner
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {activeTab === ScanType.LINK ? (
            <form onSubmit={handleUrlSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="url"
                  placeholder="https://example.com/suspicious-path"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  disabled={isLoading}
                  required
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl py-4 pl-4 pr-32 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-600 font-mono text-sm"
                />
                <button
                  type="submit"
                  disabled={isLoading || !urlInput}
                  className={`absolute right-2 top-2 bottom-2 px-6 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                    isLoading 
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'
                  }`}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'Scan Now'
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-500 px-1">
                Sentinel uses AI to analyze URL patterns, redirection chains, and historical reputation data.
              </p>
            </form>
          ) : (
            <div className="space-y-4 text-center">
              <div 
                className={`border-2 border-dashed border-slate-700 rounded-2xl p-10 transition-all ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-500/50 hover:bg-slate-800/30'
                }`}
                onClick={() => !isLoading && fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Click to upload file</h3>
                    <p className="text-sm text-slate-500">Maximum file size: 5MB</p>
                  </div>
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                disabled={isLoading}
              />
              <p className="text-xs text-slate-500">
                AI analyzes code structure, script behavior, and metadata to identify potential threats.
              </p>
            </div>
          )}
        </div>

        {/* Loading Overlay State */}
        {isLoading && (
          <div className="absolute inset-0 z-10 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center">
            <div className="text-center p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h4 className="text-white font-semibold">Running Deep AI Scan</h4>
              <p className="text-slate-400 text-sm">Analyzing potential attack vectors...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
