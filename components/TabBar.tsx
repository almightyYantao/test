import React from 'react';
import { Home, Trophy, PlusCircle, Settings, UserCircle } from 'lucide-react';
import { View } from '../types';

interface TabBarProps {
  currentView: View;
  onChange: (view: View) => void;
  isAdmin: boolean;
}

const TabBar: React.FC<TabBarProps> = ({ currentView, onChange, isAdmin }) => {
  const getButtonClass = (view: View) => 
    `flex flex-col items-center justify-center w-full h-full space-y-1 ${
      currentView === view ? 'text-primary-600' : 'text-slate-400 hover:text-slate-600'
    }`;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex items-center justify-around z-50 pb-safe">
      <button onClick={() => onChange(View.HOME)} className={getButtonClass(View.HOME)}>
        <Home size={24} />
        <span className="text-[10px] font-medium">Home</span>
      </button>

      <button onClick={() => onChange(View.LEADERBOARD)} className={getButtonClass(View.LEADERBOARD)}>
        <Trophy size={24} />
        <span className="text-[10px] font-medium">Ranking</span>
      </button>

      <button onClick={() => onChange(View.CREATE)} className="flex flex-col items-center justify-center w-full h-full -mt-6">
        <div className="bg-primary-600 rounded-full p-3 shadow-lg shadow-primary-200 text-white transform transition active:scale-95">
            <PlusCircle size={32} />
        </div>
        <span className="text-[10px] font-medium text-slate-500 mt-1">Award</span>
      </button>

      <button onClick={() => onChange(View.PROFILE)} className={getButtonClass(View.PROFILE)}>
        <UserCircle size={24} />
        <span className="text-[10px] font-medium">Me</span>
      </button>

      {isAdmin && (
        <button onClick={() => onChange(View.ADMIN)} className={getButtonClass(View.ADMIN)}>
          <Settings size={24} />
          <span className="text-[10px] font-medium">Admin</span>
        </button>
      )}
    </div>
  );
};

export default TabBar;