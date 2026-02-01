
import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout';
import { Scanner } from './components/Scanner';
import { ResultCard } from './components/ResultCard';
import { ScanType, ScanResult, ScanHistoryItem } from './types';
import { analyzeUrl, analyzeFile } from './services/geminiService';

const App: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [currentResult, setCurrentResult] = useState<ScanResult | null>(null);
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('sentinel_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  const saveToHistory = useCallback((result: ScanResult) => {
    const newItem: ScanHistoryItem = {
      id: result.id,
      target: result.target,
      timestamp: result.timestamp,
      riskLevel: result.riskLevel
    };
    const updatedHistory = [newItem, ...history].slice(0, 10);
    setHistory(updatedHistory);
    localStorage.setItem('sentinel_history', JSON.stringify(updatedHistory));
  }, [history]);

  const handleScan = async (type: ScanType, value: string, file?: File) => {
    setIsScanning(true);
    setError(null);
    setCurrentResult(null);

    try {
      let result: ScanResult;
      if (type === ScanType.LINK) {
        result = await analyzeUrl(value);
      } else if (file) {
        result = await analyzeFile(file.name, value, file.type || 'application/octet-stream');
      } else {
        throw new Error("Invalid scan parameters");
      }
      
      setCurrentResult(result);
      saveToHistory(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during the scan. Please try again.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Real-time Threat Intelligence
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
            Stop Threats Before <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
              They Breach Your System.
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Sentinel AI uses advanced generative reasoning to identify sophisticated phishing links, 
            malicious scripts, and suspicious file patterns in seconds.
          </p>
        </section>

        {/* Main Scanner Section */}
        <section className="relative z-10">
          <Scanner onScan={handleScan} isLoading={isScanning} />
        </section>

        {/* Error Message */}
        {error && (
          <div className="max-w-3xl mx-auto p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Results Section */}
        {currentResult && (
          <section className="max-w-5xl mx-auto">
            <ResultCard result={currentResult} />
          </section>
        )}

        {/* Recent Activity / Stats Section */}
        {!currentResult && !isScanning && (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-600/20 text-blue-400 rounded-xl flex items-center justify-center mb-4">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <h3 className="text-white font-bold mb-2">Zero-Day Detection</h3>
              <p className="text-slate-500 text-sm">Our AI models identify threats that traditional signature-based scanners miss.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-emerald-600/20 text-emerald-400 rounded-xl flex items-center justify-center mb-4">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              </div>
              <h3 className="text-white font-bold mb-2">Real-time Grounding</h3>
              <p className="text-slate-500 text-sm">URLs are cross-referenced with live web data to verify authenticity and reputation.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-indigo-600/20 text-indigo-400 rounded-xl flex items-center justify-center mb-4">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
              </div>
              <h3 className="text-white font-bold mb-2">Safe Sandbox</h3>
              <p className="text-slate-500 text-sm">Upload files for analysis without risking your local environment or privacy.</p>
            </div>
          </section>
        )}

        {/* History Preview */}
        {history.length > 0 && !isScanning && !currentResult && (
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Recent Scans
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {history.map((item) => (
                <div key={item.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      item.riskLevel === 'LOW' ? 'text-emerald-400 border-emerald-500/30' : 
                      item.riskLevel === 'CRITICAL' || item.riskLevel === 'HIGH' ? 'text-rose-400 border-rose-500/30' : 
                      'text-amber-400 border-amber-500/30'
                    }`}>
                      {item.riskLevel}
                    </span>
                    <span className="text-[10px] text-slate-600 uppercase">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm font-mono text-slate-300 truncate">{item.target}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default App;
