
import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, ChevronDown, Rocket, LayoutGrid } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  onHome: () => void;
  savedCount: number;
  user: UserProfile | null;
  onLogin: () => void;
  onLogout: () => void;
  onOpenSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onHome, 
  savedCount, 
  user, 
  onLogin, 
  onLogout, 
  onOpenSettings 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={onHome}
        >
          <div className="w-8 h-8 bg-neutral-900 rounded flex items-center justify-center">
             <Rocket className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-neutral-900 group-hover:text-neutral-600 transition-colors">
            Ultramagnus
          </h1>
        </div>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={onHome}
            className="hidden md:flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Library</span>
            {savedCount > 0 && (
              <span className="bg-neutral-100 text-neutral-900 border border-neutral-200 text-xs font-bold px-1.5 py-0.5 rounded">
                {savedCount}
              </span>
            )}
          </button>
          
          <div className="relative" ref={menuRef}>
            {user ? (
              <div>
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border border-neutral-200 hover:bg-neutral-50 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-bold">
                     {user.name.charAt(0)}
                  </div>
                  <ChevronDown className={`w-3 h-3 text-neutral-500 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg border border-neutral-200 shadow-lg py-1 animate-fade-in">
                    <div className="px-4 py-3 border-b border-neutral-100">
                      <div className="text-sm font-bold text-neutral-900">{user.name}</div>
                      <div className="text-xs text-neutral-500 truncate">{user.email}</div>
                    </div>
                    <button 
                      onClick={() => { onOpenSettings(); setIsMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 flex items-center gap-2"
                    >
                      <Settings className="w-3.5 h-3.5" /> Settings
                    </button>
                    <button 
                      onClick={() => { onLogout(); setIsMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={onLogin}
                className="text-sm font-bold text-neutral-900 hover:text-neutral-600 transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
