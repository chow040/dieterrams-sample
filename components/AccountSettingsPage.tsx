
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { ArrowLeft, Save, Check } from 'lucide-react';

interface AccountSettingsPageProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onBack: () => void;
}

const AccountSettingsPage: React.FC<AccountSettingsPageProps> = ({ user, onUpdateUser, onBack }) => {
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('ultramagnus_user_api_key');
    if (stored) setApiKey(stored);
  }, []);

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('ultramagnus_user_api_key', apiKey.trim());
    } else {
      localStorage.removeItem('ultramagnus_user_api_key');
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-neutral-900 mb-8">
         <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <h1 className="text-3xl font-bold text-neutral-900 mb-2">Settings</h1>
      <p className="text-neutral-500 mb-12">Manage your preferences and API connections.</p>

      <div className="space-y-12">
         {/* API Key Section */}
         <section className="bg-white p-8 border border-neutral-200 rounded-lg">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Gemini API Key</h3>
            <p className="text-sm text-neutral-500 mb-6 max-w-lg">
               To prevent rate limiting and ensure privacy, providing your own API key is recommended. 
               The key is stored locally in your browser.
            </p>
            
            <div className="flex gap-4">
               <input 
                  type="password" 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API Key"
                  className="flex-1 bg-neutral-50 border border-neutral-200 rounded-md px-4 py-2 text-sm font-mono focus:outline-none focus:border-neutral-400 focus:bg-white transition-colors"
               />
               <button 
                  onClick={handleSaveKey}
                  className={`px-6 py-2 rounded-md text-sm font-bold transition-colors flex items-center gap-2 ${isSaved ? 'bg-green-600 text-white' : 'bg-neutral-900 text-white hover:bg-neutral-700'}`}
               >
                  {isSaved && <Check className="w-4 h-4" />}
                  {isSaved ? 'Saved' : 'Save Key'}
               </button>
            </div>
         </section>

         {/* Account Info */}
         <section className="bg-white p-8 border border-neutral-200 rounded-lg">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Profile</h3>
            <div className="grid grid-cols-2 gap-6">
               <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Name</label>
                  <div className="p-3 bg-neutral-50 rounded border border-neutral-100 text-sm text-neutral-900">{user.name}</div>
               </div>
               <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Email</label>
                  <div className="p-3 bg-neutral-50 rounded border border-neutral-100 text-sm text-neutral-900">{user.email}</div>
               </div>
            </div>
         </section>
      </div>
    </div>
  );
};

export default AccountSettingsPage;
