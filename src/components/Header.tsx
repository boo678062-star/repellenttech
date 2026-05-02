import { Zap, Bell, Wifi, WifiOff } from 'lucide-react';
import { SystemSettings } from '../types';

interface HeaderProps {
  settings: SystemSettings | null;
  eventCount: number;
  onToggleSystem: () => void;
}

export default function Header({ settings, eventCount, onToggleSystem }: HeaderProps) {
  const isActive = settings?.is_active ?? false;

  return (
    <header className="h-16 bg-[#0d1a0d] border-b border-[#1e3a1e] flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isActive ? 'bg-green-600' : 'bg-gray-700'}`}>
            <Zap className="w-5 h-5 text-white" />
          </div>
          {isActive && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0d1a0d] animate-pulse" />
          )}
        </div>
        <div>
          <h1 className="text-white font-bold text-lg leading-none">ScareCrow Motion Detection</h1>
          <p className="text-green-600 text-xs font-medium">Repellent Technology</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-[#152015] border border-[#1e3a1e] rounded-lg px-3 py-1.5">
          {isActive ? (
            <Wifi className="w-4 h-4 text-green-500" />
          ) : (
            <WifiOff className="w-4 h-4 text-gray-500" />
          )}
          <span className={`text-sm font-medium ${isActive ? 'text-green-400' : 'text-gray-500'}`}>
            {isActive ? 'System Online' : 'System Offline'}
          </span>
        </div>

        <div className="relative">
          <div className="w-9 h-9 bg-[#152015] border border-[#1e3a1e] rounded-lg flex items-center justify-center cursor-pointer hover:bg-[#1e3a1e] transition-colors">
            <Bell className="w-4 h-4 text-gray-400" />
          </div>
          {eventCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full text-[10px] font-bold text-black flex items-center justify-center">
              {eventCount > 9 ? '9+' : eventCount}
            </span>
          )}
        </div>

        <button
          onClick={onToggleSystem}
          className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
            isActive
              ? 'bg-red-900/40 border border-red-700 text-red-400 hover:bg-red-900/60'
              : 'bg-green-900/40 border border-green-700 text-green-400 hover:bg-green-900/60'
          }`}
        >
          {isActive ? 'Deactivate' : 'Activate'}
        </button>
      </div>
    </header>
  );
}
