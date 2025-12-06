
import React from 'react';
import { ArrowRight, BarChart3, Shield, Zap } from 'lucide-react';

interface LandingPageProps {
  onStartAnalysis: () => void;
  onViewDemo: () => void;
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartAnalysis, onViewDemo, onLogin }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900">
      <nav className="flex items-center justify-between px-6 py-6 border-b border-neutral-100">
        <div className="text-xl font-bold tracking-tighter">Ultramagnus</div>
        <div className="flex gap-4 text-sm font-medium">
          <button onClick={onLogin} className="text-neutral-500 hover:text-neutral-900">Sign In</button>
          <button onClick={onStartAnalysis} className="text-neutral-900 underline underline-offset-4 decoration-neutral-300 hover:decoration-neutral-900">Launch</button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="max-w-3xl space-y-8">
          <div className="inline-block px-3 py-1 bg-neutral-100 text-neutral-600 text-xs font-bold uppercase tracking-widest rounded-sm">
            AI-Powered Equity Research
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-neutral-900 leading-[0.95]">
            Rational analysis <br /> for irrational markets.
          </h1>
          
          <p className="text-xl text-neutral-500 max-w-xl mx-auto font-light">
            Synthesize financial models, earnings calls, and risk factors into a clear, unbiased investment thesis.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button 
              onClick={onStartAnalysis}
              className="h-12 px-8 bg-neutral-900 text-white font-medium rounded-md hover:bg-neutral-700 transition-colors flex items-center gap-2"
            >
              Analyze Ticker <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={onViewDemo}
              className="h-12 px-8 bg-white text-neutral-900 border border-neutral-200 font-medium rounded-md hover:bg-neutral-50 transition-colors"
            >
              View Sample
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-5xl text-left">
          <div className="p-6 border border-neutral-100 rounded-lg hover:border-neutral-300 transition-colors">
            <BarChart3 className="w-6 h-6 text-neutral-900 mb-4" />
            <h3 className="font-bold mb-2">Deep Valuation</h3>
            <p className="text-sm text-neutral-500">Automated DCF and relative valuation modeling based on verified financial statements.</p>
          </div>
          <div className="p-6 border border-neutral-100 rounded-lg hover:border-neutral-300 transition-colors">
            <Shield className="w-6 h-6 text-neutral-900 mb-4" />
            <h3 className="font-bold mb-2">Risk Detection</h3>
            <p className="text-sm text-neutral-500">Semantic analysis of earnings calls to identify executive hesitation and governance flags.</p>
          </div>
          <div className="p-6 border border-neutral-100 rounded-lg hover:border-neutral-300 transition-colors">
            <Zap className="w-6 h-6 text-neutral-900 mb-4" />
            <h3 className="font-bold mb-2">Scenario Logic</h3>
            <p className="text-sm text-neutral-500">Probability-weighted Bear, Base, and Bull cases derived from macro and micro factors.</p>
          </div>
        </div>
      </main>

      <footer className="border-t border-neutral-100 py-8 text-center text-xs text-neutral-400">
        © 2024 Ultramagnus AI. Not financial advice.
      </footer>
    </div>
  );
};

export default LandingPage;
