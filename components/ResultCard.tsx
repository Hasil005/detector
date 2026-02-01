
import React from 'react';
import { ScanResult, RiskLevel } from '../types';

interface ResultCardProps {
  result: ScanResult;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const getRiskColors = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.LOW: return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5';
      case RiskLevel.MEDIUM: return 'text-amber-400 border-amber-500/30 bg-amber-500/5';
      case RiskLevel.HIGH: return 'text-orange-400 border-orange-500/30 bg-orange-500/5';
      case RiskLevel.CRITICAL: return 'text-rose-500 border-rose-500/30 bg-rose-500/10';
      default: return 'text-slate-400 border-slate-700 bg-slate-800/5';
    }
  };

  const getShieldIcon = (level: RiskLevel) => {
    const size = 64;
    switch (level) {
      case RiskLevel.LOW: 
        return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-emerald-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>;
      case RiskLevel.CRITICAL:
      case RiskLevel.HIGH:
        return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-rose-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m10.2 11.8 3.6 3.6"/><path d="m13.8 11.8-3.6 3.6"/></svg>;
      default:
        return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-amber-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
    }
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className={`border rounded-2xl overflow-hidden ${getRiskColors(result.riskLevel)} transition-all`}>
        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-900/50 border border-white/5 shadow-inner">
              {getShieldIcon(result.riskLevel)}
              <div className="mt-4 text-center">
                <div className="text-3xl font-bold">{result.riskScore}%</div>
                <div className="text-xs uppercase tracking-widest font-bold opacity-70">Risk Score</div>
              </div>
            </div>

            <div className="flex-grow space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                   <h2 className="text-2xl font-bold text-white">Security Report</h2>
                   <span className={`px-3 py-0.5 rounded-full text-xs font-bold border ${getRiskColors(result.riskLevel)}`}>
                    {result.riskLevel}
                   </span>
                </div>
                <p className="text-slate-400 font-mono text-sm truncate max-w-md">{result.target}</p>
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-slate-200 leading-relaxed">{result.analysis}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                    Findings
                  </h3>
                  <ul className="space-y-2">
                    {result.findings.map((finding, i) => (
                      <li key={i} className="text-sm text-slate-400 flex gap-2">
                        <span className="text-blue-500 mt-1.5">•</span>
                        {finding}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
                    Recommendations
                  </h3>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, i) => (
                      <li key={i} className="text-sm text-slate-400 flex gap-2">
                        <span className="text-emerald-500 mt-1.5">✓</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sources Section for grounded content */}
        {result.sources && result.sources.length > 0 && (
          <div className="bg-slate-900/80 border-t border-slate-800 p-6">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Verification Sources</h4>
            <div className="flex flex-wrap gap-4">
              {result.sources.map((source, i) => (
                <a 
                  key={i} 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:border-blue-500/50 hover:bg-slate-700 transition-all group"
                >
                  <span className="text-xs font-medium text-slate-300 group-hover:text-blue-400 truncate max-w-[200px]">{source.title || source.uri}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
