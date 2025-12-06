import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ReportCard, { ReportCardSkeleton } from './components/ReportCard';
import Dashboard from './components/Dashboard';
import AuthModal from './components/AuthModal';
import AccountSettingsPage from './components/AccountSettingsPage';
import LandingPage from './components/LandingPage';
import SettingsModal from './components/SettingsModal';
import { generateEquityReport } from './services/geminiService';
import { EquityReport, SavedReportItem, UserProfile, AnalysisSession, LoadingState } from './types';

// Simple ID generator
const generateId = () => Math.random().toString(36).substr(2, 9);

const SAMPLE_REPORT: EquityReport = {
  companyName: "AstroMining Corp",
  ticker: "ASTRO",
  reportDate: "Nov 24, 2024",
  currentPrice: "$24.50",
  priceChange: "+5.25%",
  marketCap: "$5.2B",
  peRatio: "N/A",
  dayHigh: "$24.95",
  dayLow: "$23.80",
  week52High: "$28.00",
  week52Low: "$12.00",
  priceTarget: "$42.00",
  priceTargetRange: "$35.00 - $55.00",
  priceTargetModel: {
    estimatedEPS: "$1.75",
    targetPE: "24.0x",
    growthRate: "45%",
    logic: "Valuation assumes successful deployment of lunar harvesting fleet by Q3 2025."
  },
  scenarioAnalysis: {
    bear: { label: "Bear", price: "$12.00", logic: "Regulatory delays push launch to 2026.", probability: "25%" },
    base: { label: "Base", price: "$42.00", logic: "Standard execution of roadmap.", probability: "50%" },
    bull: { label: "Bull", price: "$85.00", logic: "Discovery of rare isotopes boosts margin.", probability: "25%" }
  },
  summary: "AstroMining represents a high-risk, high-reward play in the emerging space resource sector. While current cash burn is significant, their proprietary extraction tech provides a wide moat.",
  rocketScore: 88,
  rocketReason: "Strong proprietary tech and first-mover advantage in a massive TAM sector.",
  financialHealthScore: 45,
  financialHealthReason: "High burn rate; requires capital raise within 18 months.",
  momentumScore: 72,
  momentumReason: "Breaking out of multi-month consolidation pattern on high volume.",
  shortTermFactors: {
    positive: [{ title: "NASA Contract", detail: "Finalist for Artemis support role." }],
    negative: [{ title: "Cash Burn", detail: "$12M monthly burn rate concerns investors." }]
  },
  longTermFactors: {
    positive: [{ title: "Resource Scarcity", detail: "Terrestrial rare earth supply shrinking." }],
    negative: [{ title: "Regulation", detail: "Space treaty modifications could impact ownership rights." }]
  },
  financials: [
    { year: "2021", revenue: 0, grossProfit: 0, operatingIncome: -15, netIncome: -15, eps: -0.10, cashAndEquivalents: 50, totalDebt: 0, shareholderEquity: 50, operatingCashFlow: -12, capitalExpenditure: 2, freeCashFlow: -14 },
    { year: "2022", revenue: 5, grossProfit: 2, operatingIncome: -25, netIncome: -24, eps: -0.15, cashAndEquivalents: 120, totalDebt: 10, shareholderEquity: 110, operatingCashFlow: -20, capitalExpenditure: 15, freeCashFlow: -35 },
    { year: "2023", revenue: 45, grossProfit: 28, operatingIncome: -10, netIncome: -12, eps: -0.05, cashAndEquivalents: 85, totalDebt: 15, shareholderEquity: 95, operatingCashFlow: -5, capitalExpenditure: 25, freeCashFlow: -30 }
  ],
  priceHistory: [
     { month: 'Jan', price: 15 }, { month: 'Feb', price: 18 }, { month: 'Mar', price: 16 }, 
     { month: 'Apr', price: 20 }, { month: 'May', price: 22 }, { month: 'Jun', price: 21 },
     { month: 'Jul', price: 25 }, { month: 'Aug', price: 24 }, { month: 'Sep', price: 28 }, 
     { month: 'Oct', price: 26 }, { month: 'Nov', price: 24.5 }
  ],
  peers: [
     { ticker: "SPCE", name: "Virgin Galactic", marketCap: "1.2B", peRatio: "N/A", revenueGrowth: "15%", netMargin: "-45%" },
     { ticker: "RKLB", name: "Rocket Lab", marketCap: "2.5B", peRatio: "N/A", revenueGrowth: "35%", netMargin: "-25%" }
  ],
  upcomingEvents: [{ date: "Dec 15", event: "Launch Window Open", impact: "High" }],
  recentNews: [{ headline: "CEO announces partnership with SpaceX", date: "Nov 20, 2024" }],
  earningsCallAnalysis: {
    sentiment: "Bullish",
    summary: "Management confident in 2025 milestones.",
    keyTakeaways: ["Production ramp ahead of schedule", "New partnerships incoming"]
  },
  overallSentiment: {
    score: 85,
    label: "Bullish",
    summary: "Strong momentum and positive news flow outweigh short-term cash concerns."
  },
  insiderActivity: [],
  riskMetrics: {
    beta: "1.8",
    shortInterestPercentage: "15%",
    shortInterestRatio: "4.2",
    volatility: "High"
  },
  institutionalSentiment: "Accumulating",
  tags: ["Space", "Mining", "Growth"],
  valuation: "Speculative",
  verdict: "BUY",
  verdictReason: "Asymmetric upside potential."
};

type ViewState = 'LANDING' | 'DASHBOARD' | 'REPORT' | 'SETTINGS';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('LANDING');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  // Report Management
  const [reportLibrary, setReportLibrary] = useState<SavedReportItem[]>([]);
  const [currentReport, setCurrentReport] = useState<EquityReport | null>(null);
  const [analysisSessions, setAnalysisSessions] = useState<AnalysisSession[]>([]);
  
  // Dashboard State
  const [tickerInput, setTickerInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Initialize with local storage if needed, or simple mock
  useEffect(() => {
    // Load saved reports from local storage could go here
    const saved = localStorage.getItem('ultramagnus_reports');
    if (saved) {
      try {
        setReportLibrary(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load library", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ultramagnus_reports', JSON.stringify(reportLibrary));
  }, [reportLibrary]);

  const handleLogin = (email: string, name: string) => {
    setUser({
      id: generateId(),
      name,
      email,
      tier: 'Pro',
      joinDate: new Date().toISOString()
    });
    setShowAuthModal(false);
    if (view === 'LANDING') setView('DASHBOARD');
  };

  const handleLogout = () => {
    setUser(null);
    setView('LANDING');
  };

  const handleSearch = async (e?: React.FormEvent, tickerOverride?: string) => {
    if (e) e.preventDefault();
    const ticker = (tickerOverride || tickerInput).toUpperCase().trim();
    if (!ticker) return;

    // Check if we already have it
    const existing = reportLibrary.find(r => r.ticker === ticker);
    if (existing && existing.fullReport) {
      setCurrentReport(existing.fullReport);
      setView('REPORT');
      setTickerInput('');
      return;
    }

    // Start new analysis session
    const sessionId = generateId();
    const newSession: AnalysisSession = {
      id: sessionId,
      ticker,
      progress: 0,
      status: 'PROCESSING',
      phase: 'Initializing...'
    };
    
    setAnalysisSessions(prev => [newSession, ...prev]);
    setTickerInput('');
    setShowSuggestions(false);

    try {
      // Simulation of progress
      const progressInterval = setInterval(() => {
        setAnalysisSessions(curr => curr.map(s => 
          s.id === sessionId && s.status === 'PROCESSING' 
            ? { ...s, progress: Math.min(s.progress + 5, 90), phase: getPhase(s.progress) } 
            : s
        ));
      }, 500);

      const report = await generateEquityReport(ticker, (chunk) => {
        // Optional: Streaming updates could go here
      });

      clearInterval(progressInterval);

      setAnalysisSessions(curr => curr.map(s => 
        s.id === sessionId 
          ? { ...s, status: 'READY', progress: 100, phase: 'Complete', result: report } 
          : s
      ));
      
      // Auto save to library
      const newItem: SavedReportItem = {
        ticker: report.ticker,
        companyName: report.companyName,
        currentPrice: report.currentPrice,
        priceChange: report.priceChange,
        verdict: report.verdict,
        addedAt: Date.now(),
        fullReport: report,
        isBookmarked: false
      };
      
      setReportLibrary(prev => {
        const filtered = prev.filter(p => p.ticker !== report.ticker);
        return [newItem, ...filtered];
      });

    } catch (error: any) {
      setAnalysisSessions(curr => curr.map(s => 
        s.id === sessionId 
          ? { ...s, status: 'ERROR', error: error.message || "Failed to generate report" } 
          : s
      ));
    }
  };

  const getPhase = (progress: number) => {
    if (progress < 20) return "Gathering market data...";
    if (progress < 40) return "Analyzing financials...";
    if (progress < 60) return "Scanning news & sentiment...";
    if (progress < 80) return "Synthesizing investment thesis...";
    return "Finalizing report...";
  };

  const handleLoadReport = (item: SavedReportItem) => {
    if (item.fullReport) {
      setCurrentReport(item.fullReport);
      setView('REPORT');
    }
  };

  const handleViewAnalyzedReport = (sessionId: string) => {
    const session = analysisSessions.find(s => s.id === sessionId);
    if (session && session.result) {
       setCurrentReport(session.result);
       setView('REPORT');
       // Remove from active sessions
       setAnalysisSessions(prev => prev.filter(s => s.id !== sessionId));
    }
  };

  const handleToggleBookmark = (item: SavedReportItem | EquityReport) => {
    // Both types have ticker, so we can access it directly. 
    // Using 'in' check with union of types that both have the property causes TS to infer 'never' in the else branch.
    const ticker = item.ticker;
    
    setReportLibrary(prev => prev.map(r => {
      if (r.ticker === ticker) {
        return { ...r, isBookmarked: !r.isBookmarked };
      }
      return r;
    }));
  };

  const handleDeleteReport = (ticker: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setReportLibrary(prev => prev.filter(r => r.ticker !== ticker));
  };

  // View Routing
  if (view === 'LANDING') {
    return (
      <>
        <LandingPage 
          onStartAnalysis={() => setView('DASHBOARD')} 
          onViewDemo={() => {
            setCurrentReport(SAMPLE_REPORT);
            setView('REPORT');
          }}
          onLogin={() => setShowAuthModal(true)}
        />
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
          onLogin={handleLogin} 
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 font-sans text-neutral-900">
      <Header 
        onHome={() => setView('DASHBOARD')}
        savedCount={reportLibrary.filter(r => r.isBookmarked).length}
        user={user}
        onLogin={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        onOpenSettings={() => setShowSettingsModal(true)}
      />

      <main className="pt-8 px-4 md:px-6">
        {view === 'DASHBOARD' && (
          <Dashboard 
            user={user || { id: 'guest', name: 'Guest', email: '', tier: 'Guest', joinDate: '' }}
            reportLibrary={reportLibrary}
            onSearch={handleSearch}
            onLoadReport={handleLoadReport}
            onDeleteReport={handleDeleteReport}
            tickerInput={tickerInput}
            onTickerChange={(e) => setTickerInput(e.target.value)}
            suggestions={[]} // Could implement suggestions logic
            showSuggestions={showSuggestions}
            onSelectSuggestion={(s) => {
               setTickerInput(s);
               handleSearch(undefined, s);
            }}
            setShowSuggestions={setShowSuggestions}
            onViewSample={() => {
               setCurrentReport(SAMPLE_REPORT);
               setView('REPORT');
            }}
            analysisSessions={analysisSessions}
            onViewAnalyzedReport={handleViewAnalyzedReport}
            onCancelAnalysis={(id) => setAnalysisSessions(prev => prev.filter(s => s.id !== id))}
          />
        )}

        {view === 'REPORT' && currentReport && (
          <ReportCard 
            report={currentReport}
            isBookmarked={reportLibrary.find(r => r.ticker === currentReport.ticker)?.isBookmarked || false}
            onToggleBookmark={() => handleToggleBookmark(currentReport)}
          />
        )}
        
        {view === 'SETTINGS' && (
           <AccountSettingsPage 
              user={user || { id: 'guest', name: 'Guest', email: '', tier: 'Guest', joinDate: '' }}
              onUpdateUser={setUser}
              onBack={() => setView('DASHBOARD')}
           />
        )}
      </main>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        onLogin={handleLogin} 
      />
      
      <SettingsModal 
         isOpen={showSettingsModal}
         onClose={() => setShowSettingsModal(false)}
         user={user}
      />
    </div>
  );
};

export default App;