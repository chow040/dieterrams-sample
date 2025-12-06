
import React, { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, name: string) => void;
  message?: string;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin, message }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoading(true);
    setTimeout(() => {
      const name = email.split('@')[0];
      onLogin(email, name.charAt(0).toUpperCase() + name.slice(1));
      setIsLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-neutral-900/20 backdrop-blur-[2px]" onClick={onClose}></div>
      <div className="relative w-full max-w-sm bg-white rounded-lg shadow-xl border border-neutral-200 overflow-hidden">
        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-neutral-900">{message || "Sign In"}</h2>
            <p className="text-sm text-neutral-500 mt-1">Access your saved equity research.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
               <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Email</label>
               <input 
                 type="email" 
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="w-full bg-neutral-50 border border-neutral-200 rounded-md py-2 px-3 text-sm text-neutral-900 focus:outline-none focus:border-neutral-400 focus:bg-white transition-colors"
                 autoFocus
               />
            </div>
            <div>
               <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Password</label>
               <input 
                 type="password" 
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="w-full bg-neutral-50 border border-neutral-200 rounded-md py-2 px-3 text-sm text-neutral-900 focus:outline-none focus:border-neutral-400 focus:bg-white transition-colors"
               />
            </div>
            <button 
              type="submit"
              disabled={isLoading || !email}
              className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-2.5 rounded-md transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? "Processing..." : "Continue"} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
        <div className="px-8 py-4 bg-neutral-50 border-t border-neutral-100 text-center">
           <button onClick={onClose} className="text-xs text-neutral-500 hover:text-neutral-900 font-medium">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
