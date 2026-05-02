import { LayoutDashboard, Activity, Volume2, Map, BarChart3 } from 'lucide-react';
import { NavPage } from '../types';

interface SidebarProps {
  current: NavPage;
  onChange: (page: NavPage) => void;
  recentEventCount: number;
}

const navItems: { id: NavPage; label: string; icon: React.ElementType; desc: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, desc: 'Overview' },
  { id: 'motion', label: 'Motion Log', icon: Activity, desc: 'Detection events' },
  { id: 'sound', label: 'Sound Control', icon: Volume2, desc: 'Repellent audio' },
  { id: 'zones', label: 'Zones', icon: Map, desc: 'Sensor areas' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, desc: 'Insights' },
];

export default function Sidebar({ current, onChange, recentEventCount }: SidebarProps) {
  return (
    <aside className="w-56 bg-[#0d1a0d] border-r border-[#1e3a1e] flex flex-col flex-shrink-0">
      <nav className="flex-1 p-3 pt-4 space-y-1">
        {navItems.map(({ id, label, icon: Icon, desc }) => {
          const active = current === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all group relative ${
                active
                  ? 'bg-green-900/40 border border-green-800/60'
                  : 'hover:bg-[#152015] border border-transparent'
              }`}
            >
              <div className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 transition-colors ${
                active ? 'bg-green-700' : 'bg-[#1e3a1e] group-hover:bg-[#254225]'
              }`}>
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-green-600'}`} />
              </div>
              <div className="min-w-0">
                <div className={`text-sm font-medium leading-none ${active ? 'text-green-300' : 'text-gray-300'}`}>
                  {label}
                </div>
                <div className="text-xs text-gray-600 mt-0.5">{desc}</div>
              </div>
              {id === 'motion' && recentEventCount > 0 && (
                <span className="ml-auto w-5 h-5 bg-amber-600 rounded-full text-[10px] font-bold text-white flex items-center justify-center flex-shrink-0">
                  {recentEventCount > 9 ? '9+' : recentEventCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[#1e3a1e]">
        <div className="bg-[#152015] rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-green-400 font-medium">Live Monitoring</span>
          </div>
          <p className="text-xs text-gray-500">Real-time sensor data active. All zones reporting.</p>
        </div>
      </div>
    </aside>
  );
}
