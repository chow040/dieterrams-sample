
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { SavedReportItem, UserProfile, AnalysisSession } from '../types';
import { 
  Search, TrendingUp, TrendingDown, X, Loader2, Activity, Zap, 
  ArrowRight, Crown, Filter, List, LayoutGrid, AlertCircle, Plus
} from 'lucide-react';

interface DashboardProps {
  user: UserProfile;
  reportLibrary: SavedReportItem[];
  onSearch: (e?: React.FormEvent, ticker?: string) => void;
  onLoadReport: (item: SavedReportItem) => void;
  onDeleteReport: (ticker: string, e: React.MouseEvent) => void;
  tickerInput: string;
  onTickerChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  suggestions: {symbol: string, name: string}[];
  showSuggestions: boolean;
  onSelectSuggestion: (symbol: string) => void;
  setShowSuggestions: (show: boolean) => void;
  onViewSample: () => void;
  analysisSessions: AnalysisSession[];
  onViewAnalyzedReport: (id: string) => void;
  onCancelAnalysis: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  user, reportLibrary, onSearch, onLoadReport, onDeleteReport,
  tickerInput, onTickerChange, suggestions, showSuggestions,
  onSelectSuggestion, setShowSuggestions, onViewSample,
  analysisSessions, onViewAnalyzedReport, onCancelAnalysis
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<'ALL' | 'BOOKMARKED'>('ALL');
  const [view, setView] = useState<'GRID' | 'LIST'>('GRID');

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredItems = useMemo(() => {
    const items = reportLibrary;
    if (filter === 'BOOKMARKED') return items.filter(i => i.isBookmarked);
    return items;
  }, [reportLibrary, filter]);

  return (
    <div className="w-full max-w-6xl mx-auto pb-20 animate-fade-in">
      
      {/* Hero / Search */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-neutral-900 mb-6">
          Market Intelligence
        </h2>
        
        <div className="relative max-w-2xl" ref={dropdownRef}>
          <form onSubmit={(e) => onSearch(e)} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                value={tickerInput}
                onChange={onTickerChange}
                onFocus={() => { if(tickerInput) setShowSuggestions(true); }}
                placeholder="Enter Ticker (e.g. NVDA)"
                className="w-full bg-white border border-neutral-200 rounded-md py-3 pl-12 pr-4 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 transition-colors uppercase font-medium"
              />
            </div>
            <button
                type="submit"
                disabled={!tickerInput}
                className="bg-neutral-900 text-white px-6 py-3 rounded-md font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50"
            >
                Analyze
            </button>
          </form>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-md shadow-lg z-50">
              {suggestions.map((s) => (
                <div 
                  key={s.symbol}
                  onClick={() => onSelectSuggestion(s.symbol)}
                  className="px-4 py-3 hover:bg-neutral-50 cursor-pointer flex justify-between items-center group"
                >
                  <span className="font-bold text-neutral-900">{s.symbol}</span>
                  <span className="text-sm text-neutral-500">{s.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-neutral-200">
         <div className="flex gap-4">
            <button 
               onClick={() => setFilter('ALL')} 
               className={`text-sm font-medium ${filter === 'ALL' ? 'text-neutral-900 underline underline-offset-4 decoration-2' : 'text-neutral-500 hover:text-neutral-900'}`}
            >
               All Reports
            </button>
            <button 
               onClick={() => setFilter('BOOKMARKED')} 
               className={`text-sm font-medium ${filter === 'BOOKMARKED' ? 'text-neutral-900 underline underline-offset-4 decoration-2' : 'text-neutral-500 hover:text-neutral-900'}`}
            >
               Saved
            </button>
         </div>
         <div className="flex gap-2">
            <button onClick={() => setView('GRID')} className={`p-2 rounded ${view === 'GRID' ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-400 hover:text-neutral-900'}`}>
               <LayoutGrid className="w-4 h-4" />
            </button>
            <button onClick={() => setView('LIST')} className={`p-2 rounded ${view === 'LIST' ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-400 hover:text-neutral-900'}`}>
               <List className="w-4 h-4" />
            </button>
         </div>
      </div>

      {/* Active Analysis */}
      {analysisSessions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
           {analysisSessions.map(session => (
              <div key={session.id} className="bg-white border border-neutral-200 rounded-md p-6 shadow-sm relative overflow-hidden">
                 {session.status === 'PROCESSING' ? (
                    <div className="flex flex-col h-full justify-between gap-4">
                       <div className="flex justify-between items-start">
                          <div>
                             <h3 className="text-2xl font-bold text-neutral-900">{session.ticker}</h3>
                             <p className="text-sm text-neutral-500 font-medium mt-1">{session.phase}</p>
                          </div>
                          <Loader2 className="w-5 h-5 text-neutral-900 animate-spin" />
                       </div>
                       <div className="w-full bg-neutral-100 h-1 rounded-full overflow-hidden">
                          <div className="bg-neutral-900 h-full transition-all duration-300" style={{ width: `${session.progress}%` }}></div>
                       </div>
                    </div>
                 ) : session.status === 'READY' ? (
                    <div onClick={() => onViewAnalyzedReport(session.id)} className="cursor-pointer group h-full flex flex-col justify-between">
                       <div className="flex justify-between">
                          <h3 className="text-2xl font-bold text-neutral-900 group-hover:text-neutral-600 transition-colors">{session.ticker}</h3>
                          <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-sm">READY</span>
                       </div>
                       <div className="flex items-center gap-2 text-sm font-bold text-neutral-900 mt-4">
                          View Report <ArrowRight className="w-4 h-4" />
                       </div>
                    </div>
                 ) : (
                    <div className="flex flex-col h-full justify-between">
                       <div className="flex justify-between">
                          <h3 className="text-2xl font-bold text-neutral-400">{session.ticker}</h3>
                          <AlertCircle className="w-5 h-5 text-red-500" />
                       </div>
                       <p className="text-sm text-red-600 mt-2">{session.error}</p>
                       <button onClick={() => onCancelAnalysis(session.id)} className="text-xs font-bold text-neutral-500 mt-4 hover:text-neutral-900">Dismiss</button>
                    </div>
                 )}
              </div>
           ))}
        </div>
      )}

      {/* Library Grid */}
      {filteredItems.length === 0 && analysisSessions.length === 0 ? (
        <div className="text-center py-24 bg-white border border-neutral-100 rounded-md">
           <p className="text-neutral-400">No reports generated.</p>
           <button onClick={onViewSample} className="text-neutral-900 font-bold text-sm mt-2 hover:underline">View Sample</button>
        </div>
      ) : (
        <div className={view === 'GRID' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-2"}>
           {filteredItems.map(item => (
              <div 
                key={item.ticker}
                onClick={() => onLoadReport(item)}
                className={`
                   group bg-white border border-neutral-200 rounded-md hover:border-neutral-400 transition-all cursor-pointer relative
                   ${view === 'GRID' ? 'p-6 flex flex-col justify-between h-48' : 'p-4 flex items-center justify-between'}
                `}
              >
                 <button 
                    onClick={(e) => onDeleteReport(item.ticker, e)}
                    className="absolute top-2 right-2 p-2 text-neutral-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                 >
                    <X className="w-4 h-4" />
                 </button>

                 <div>
                    <div className="flex items-baseline gap-2">
                       <h3 className="text-xl font-bold text-neutral-900">{item.ticker}</h3>
                       {view === 'LIST' && <span className="text-sm text-neutral-500">{item.companyName}</span>}
                    </div>
                    {view === 'GRID' && <p className="text-sm text-neutral-500 truncate mt-1">{item.companyName}</p>}
                 </div>

                 <div className={`flex ${view === 'GRID' ? 'flex-col gap-1 items-start mt-4' : 'items-center gap-8'}`}>
                    <div className="text-2xl font-medium text-neutral-900 tracking-tight">{item.currentPrice}</div>
                    <div className={`text-sm font-medium ${item.priceChange.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                       {item.priceChange}
                    </div>
                 </div>

                 <div className="flex items-center justify-between mt-auto pt-4">
                     <span className={`text-xs font-bold px-2 py-0.5 rounded-sm border ${
                        item.verdict === 'BUY' ? 'bg-green-50 border-green-200 text-green-700' : 
                        item.verdict === 'SELL' ? 'bg-red-50 border-red-200 text-red-700' : 
                        'bg-neutral-100 border-neutral-200 text-neutral-600'
                     }`}>
                        {item.verdict}
                     </span>
                     {item.fullReport?.rocketScore && (
                        <div className="text-xs font-mono font-medium text-neutral-400">
                           Score: <span className="text-neutral-900">{item.fullReport.rocketScore}</span>
                        </div>
                     )}
                 </div>
              </div>
           ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
