
import React, { useState, useMemo, useRef } from 'react';
import { EquityReport, SavedReportItem, Scenario } from '../types';
import { 
  Target, Activity, TrendingUp, TrendingDown, Minus, Bookmark, Download, 
  ExternalLink, ChevronDown, Check, ThumbsUp, ThumbsDown, ArrowRight,
  Shield, Zap, Lock, Info, BarChart3, Users, DollarSign
} from 'lucide-react';
import {
  ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area,
  BarChart, Bar, Legend, ScatterChart, Scatter, ReferenceLine, Cell
} from 'recharts';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface ReportCardProps {
  report: EquityReport;
  isBookmarked: boolean;
  onToggleBookmark: (item: SavedReportItem) => void;
  isTeaserMode?: boolean;
  onUnlock?: () => void;
}

// Minimalist Locked Overlay
const LockedOverlay = ({ onUnlock, label }: { onUnlock?: () => void, label: string }) => (
  <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center text-center p-6 border border-neutral-200 rounded-lg">
    <Lock className="w-6 h-6 text-neutral-400 mb-3" />
    <h3 className="font-bold text-neutral-900 mb-1">{label} Locked</h3>
    <button onClick={onUnlock} className="mt-3 text-sm font-bold text-white bg-neutral-900 px-4 py-2 rounded hover:bg-neutral-800 transition-colors">
      Unlock Analysis
    </button>
  </div>
);

const ReportCard: React.FC<ReportCardProps> = ({ report, isBookmarked, onToggleBookmark, isTeaserMode, onUnlock }) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'FINANCIALS' | 'PEERS'>('OVERVIEW');
  const reportRef = useRef<HTMLDivElement>(null);

  // --- Helpers for Styling ---
  const getTrendColor = (val: string) => val.startsWith('+') ? 'text-green-600' : val.startsWith('-') ? 'text-red-600' : 'text-neutral-500';
  const getVerdictStyle = (v: string) => {
    switch (v) {
      case 'BUY': return 'bg-neutral-900 text-white';
      case 'SELL': return 'bg-white border border-neutral-300 text-neutral-900';
      default: return 'bg-neutral-100 text-neutral-600';
    }
  };

  const priceChartData = useMemo(() => {
     if(!report.priceHistory) return [];
     return report.priceHistory.map(p => ({
        ...p,
        target: report.analystPriceTargets?.find(t => t.month === p.month)?.averageTarget
     }));
  }, [report]);

  const financials = report.financials || [];

  return (
    <div ref={reportRef} className="bg-white min-h-screen text-neutral-900 pb-20 animate-fade-in">
      
      {/* Header Section */}
      <div className="border-b border-neutral-200 bg-neutral-50/50">
        <div className="max-w-5xl mx-auto px-6 py-8">
           <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div>
                 <div className="flex items-baseline gap-3 mb-2">
                    <h1 className="text-4xl font-bold tracking-tight text-neutral-900">{report.ticker}</h1>
                    <span className="text-xl text-neutral-500 font-light">{report.companyName}</span>
                 </div>
                 <div className="flex items-center gap-4 text-sm font-medium">
                    <span className="text-3xl font-mono tracking-tight">{report.currentPrice}</span>
                    <span className={`px-2 py-0.5 rounded-sm bg-white border border-neutral-200 ${getTrendColor(report.priceChange)}`}>
                       {report.priceChange}
                    </span>
                 </div>
                 <div className="text-xs text-neutral-400 mt-2 font-mono uppercase">
                    Generated {report.reportDate} • Market Cap: {report.marketCap}
                 </div>
              </div>

              <div className="flex gap-2">
                 <button 
                   onClick={() => onToggleBookmark(report as any)}
                   className={`px-4 py-2 text-sm font-bold border rounded-md transition-colors ${isBookmarked ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'}`}
                 >
                    {isBookmarked ? 'Saved' : 'Save'}
                 </button>
                 <button className="p-2 border border-neutral-200 rounded-md bg-white text-neutral-500 hover:text-neutral-900">
                    <Download className="w-4 h-4" />
                 </button>
              </div>
           </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
         
         {/* Left Column: Metrics & Analysis */}
         <div className="lg:col-span-2 space-y-12">
            
            {/* Executive Summary */}
            <section>
               <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-3">Executive Summary</h3>
               <p className="text-lg leading-relaxed font-light text-neutral-800 border-l-2 border-neutral-900 pl-4">
                  {report.summary}
               </p>
            </section>

            {/* Verdict Block */}
            <section className="grid grid-cols-2 gap-4">
               <div className="p-6 border border-neutral-200 rounded-lg relative overflow-hidden">
                  {isTeaserMode && <LockedOverlay onUnlock={onUnlock} label="Verdict" />}
                  <div className="text-xs font-bold text-neutral-500 uppercase mb-2">AI Verdict</div>
                  <div className={`text-3xl font-bold inline-block px-3 py-1 rounded-sm ${getVerdictStyle(report.verdict)}`}>
                     {report.verdict}
                  </div>
                  <p className="text-sm text-neutral-600 mt-3 leading-snug">{report.verdictReason}</p>
               </div>
               
               <div className="p-6 border border-neutral-200 rounded-lg relative overflow-hidden">
                   {isTeaserMode && <LockedOverlay onUnlock={onUnlock} label="Price Target" />}
                   <div className="text-xs font-bold text-neutral-500 uppercase mb-2">12M Price Target</div>
                   <div className="text-3xl font-mono font-medium text-neutral-900">{report.priceTarget}</div>
                   <div className="text-sm text-neutral-500 mt-1">Range: {report.priceTargetRange}</div>
                   {report.priceTargetModel && (
                      <div className="mt-3 pt-3 border-t border-neutral-100 text-xs text-neutral-500">
                         Based on {report.priceTargetModel.targetPE} P/E × {report.priceTargetModel.estimatedEPS} EPS
                      </div>
                   )}
               </div>
            </section>

            {/* Charts Section */}
            <section>
               <div className="flex items-center gap-6 border-b border-neutral-200 mb-6">
                  <button onClick={() => setActiveTab('OVERVIEW')} className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'OVERVIEW' ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-400 hover:text-neutral-600'}`}>Price Action</button>
                  <button onClick={() => setActiveTab('FINANCIALS')} className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'FINANCIALS' ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-400 hover:text-neutral-600'}`}>Financials</button>
                  <button onClick={() => setActiveTab('PEERS')} className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'PEERS' ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-400 hover:text-neutral-600'}`}>Peer Comps</button>
               </div>

               <div className="h-[350px] w-full bg-white border border-neutral-100 rounded-lg p-4">
                  <ResponsiveContainer width="100%" height="100%">
                     {activeTab === 'OVERVIEW' ? (
                        <ComposedChart data={priceChartData}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                           <XAxis dataKey="month" stroke="#a3a3a3" fontSize={10} tickLine={false} axisLine={false} />
                           <YAxis stroke="#a3a3a3" fontSize={10} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                           <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '4px' }} />
                           <Area type="monotone" dataKey="price" stroke="#171717" fill="#f5f5f5" strokeWidth={2} />
                           <Line type="monotone" dataKey="target" stroke="#a3a3a3" strokeDasharray="4 4" dot={false} strokeWidth={2} />
                        </ComposedChart>
                     ) : activeTab === 'FINANCIALS' ? (
                        <BarChart data={financials}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                           <XAxis dataKey="year" stroke="#a3a3a3" fontSize={10} tickLine={false} axisLine={false} />
                           <YAxis stroke="#a3a3a3" fontSize={10} tickLine={false} axisLine={false} />
                           <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '4px' }} />
                           <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}/>
                           <Bar dataKey="revenue" name="Revenue" fill="#e5e5e5" />
                           <Bar dataKey="netIncome" name="Net Income" fill="#171717" />
                        </BarChart>
                     ) : (
                        <BarChart data={report.peers} layout="vertical">
                           <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e5e5" />
                           <XAxis type="number" hide />
                           <YAxis dataKey="ticker" type="category" stroke="#171717" fontSize={12} width={50} tickLine={false} axisLine={false} />
                           <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ background: '#fff', border: '1px solid #e5e5e5' }} />
                           <Bar dataKey="peRatio" fill="#171717" barSize={20} radius={[0, 4, 4, 0]} />
                        </BarChart>
                     )}
                  </ResponsiveContainer>
               </div>
            </section>

            {/* Scenario Analysis */}
            <section className="relative">
               {isTeaserMode && <LockedOverlay onUnlock={onUnlock} label="Scenario Modeling" />}
               <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4">Probabilistic Scenarios</h3>
               <div className="grid grid-cols-3 gap-0 border border-neutral-200 rounded-lg overflow-hidden">
                  {report.scenarioAnalysis && Object.entries(report.scenarioAnalysis).map(([key, val], idx) => {
                     const data = val as Scenario;
                     return (
                     <div key={key} className={`p-4 ${idx !== 2 ? 'border-r border-neutral-200' : ''}`}>
                        <div className="flex justify-between items-center mb-2">
                           <span className="text-xs font-bold uppercase text-neutral-500">{data.label}</span>
                           <span className="text-xs font-mono text-neutral-400">{data.probability}</span>
                        </div>
                        <div className="text-xl font-mono font-bold text-neutral-900 mb-2">{data.price}</div>
                        <p className="text-xs text-neutral-500 leading-snug">{data.logic}</p>
                     </div>
                  )})}
               </div>
            </section>

         </div>

         {/* Right Column: Scores & Factors */}
         <div className="space-y-8">
            
            {/* Rocket Score Card */}
            <div className="p-6 bg-neutral-900 text-white rounded-lg relative overflow-hidden">
               {isTeaserMode && <div className="absolute inset-0 bg-neutral-900/90 z-10 flex items-center justify-center"><Lock className="text-neutral-500"/></div>}
               <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Moonshot Score</span>
                  <Zap className="w-4 h-4 text-white" />
               </div>
               <div className="text-5xl font-mono font-bold mb-4">{report.rocketScore}<span className="text-xl text-neutral-500">/100</span></div>
               <p className="text-sm text-neutral-300 leading-relaxed border-t border-neutral-800 pt-4">
                  {report.rocketReason}
               </p>
            </div>

            {/* Fundamental Health */}
            <div className="p-6 border border-neutral-200 rounded-lg">
               <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">Financial Health</span>
                  <Shield className="w-4 h-4 text-neutral-900" />
               </div>
               <div className="text-3xl font-mono font-medium mb-2">{report.financialHealthScore}/100</div>
               <div className="w-full bg-neutral-100 h-1.5 rounded-full mb-4">
                  <div className="bg-neutral-900 h-full rounded-full" style={{ width: `${report.financialHealthScore}%` }}></div>
               </div>
               <p className="text-xs text-neutral-600">{report.financialHealthReason}</p>
            </div>

            {/* Key Factors */}
            <div className="space-y-4">
               <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Thesis Drivers</h3>
               
               <div className="space-y-3">
                  {report.shortTermFactors.positive.slice(0, 2).map((f, i) => (
                     <div key={i} className="flex gap-3">
                        <TrendingUp className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
                        <div>
                           <div className="text-sm font-bold text-neutral-900">{f.title}</div>
                           <div className="text-xs text-neutral-500 leading-snug">{f.detail}</div>
                        </div>
                     </div>
                  ))}
                  {report.shortTermFactors.negative.slice(0, 2).map((f, i) => (
                     <div key={i} className="flex gap-3">
                        <TrendingDown className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                        <div>
                           <div className="text-sm font-bold text-neutral-500">{f.title}</div>
                           <div className="text-xs text-neutral-400 leading-snug">{f.detail}</div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Sources */}
            {report.sources && (
               <div className="pt-6 border-t border-neutral-200">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-3">Sources</h3>
                  <div className="space-y-2">
                     {report.sources.map((s, i) => (
                        <a key={i} href={s.uri} target="_blank" rel="noopener" className="flex items-center gap-2 text-xs text-neutral-500 hover:text-neutral-900 truncate">
                           <ExternalLink className="w-3 h-3" /> {s.title}
                        </a>
                     ))}
                  </div>
               </div>
            )}
         </div>

      </div>
    </div>
  );
};

export const ReportCardSkeleton = () => (
  <div className="max-w-5xl mx-auto p-6 space-y-8 animate-pulse">
     <div className="h-32 bg-neutral-100 rounded-lg w-full"></div>
     <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-4">
           <div className="h-40 bg-neutral-100 rounded-lg"></div>
           <div className="h-64 bg-neutral-100 rounded-lg"></div>
        </div>
        <div className="h-96 bg-neutral-100 rounded-lg"></div>
     </div>
  </div>
);

export default ReportCard;
