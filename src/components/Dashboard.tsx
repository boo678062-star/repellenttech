import { Shield, Radio, Volume2, AlertTriangle, Clock, TrendingUp, Zap } from 'lucide-react';
import { SystemSettings, Zone, DetectionEvent } from '../types';

interface DashboardProps {
  settings: SystemSettings | null;
  zones: Zone[];
  events: DetectionEvent[];
  onSimulate: (zoneName: string, zoneId: string | null) => void;
}

function StatCard({ label, value, sub, icon: Icon, color }: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; color: string;
}) {
  return (
    <div className="bg-[#0d1a0d] border border-[#1e3a1e] rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm font-medium text-gray-400">{label}</div>
      {sub && <div className="text-xs text-gray-600 mt-1">{sub}</div>}
    </div>
  );
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const ANIMAL_COLORS: Record<string, string> = {
  Bird: 'text-sky-400',
  Deer: 'text-amber-400',
  Rabbit: 'text-orange-400',
  Raccoon: 'text-gray-400',
  Fox: 'text-orange-500',
  Rodent: 'text-yellow-500',
  'Wild Boar': 'text-red-400',
  Crow: 'text-gray-500',
};

export default function Dashboard({ settings, zones, events, onSimulate }: DashboardProps) {
  const activeZones = zones.filter(z => z.is_active).length;
  const todayEvents = events.filter(e => {
    const d = new Date(e.detected_at);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  });
  const lastEvent = events[0];
  const topAnimal = (() => {
    const counts: Record<string, number> = {};
    events.forEach(e => { counts[e.animal_type] = (counts[e.animal_type] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'None';
  })();

  const randomZone = zones.find(z => z.is_active);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">System Overview</h2>
        <p className="text-gray-500 text-sm">Real-time status of your smart scarecrow network</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Zones"
          value={activeZones}
          sub={`of ${zones.length} total`}
          icon={Shield}
          color={activeZones > 0 ? 'bg-green-700' : 'bg-gray-700'}
        />
        <StatCard
          label="Today's Detections"
          value={todayEvents.length}
          sub="last 24 hours"
          icon={Radio}
          color="bg-amber-700"
        />
        <StatCard
          label="Top Intruder"
          value={topAnimal}
          sub="most detected"
          icon={AlertTriangle}
          color="bg-red-800"
        />
        <StatCard
          label="Total Events"
          value={events.length}
          sub="all time"
          icon={TrendingUp}
          color="bg-blue-800"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-[#0d1a0d] border border-[#1e3a1e] rounded-xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e3a1e]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-gray-200">Recent Detections</span>
            </div>
            <span className="text-xs text-gray-600">{events.length} total</span>
          </div>
          <div className="divide-y divide-[#1e3a1e]">
            {events.slice(0, 6).map(event => (
              <div key={event.id} className="flex items-center gap-4 px-5 py-3 hover:bg-[#111f11] transition-colors">
                <div className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0 animate-pulse" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${ANIMAL_COLORS[event.animal_type] ?? 'text-gray-300'}`}>
                      {event.animal_type}
                    </span>
                    <span className="text-gray-600 text-xs">detected in</span>
                    <span className="text-gray-300 text-xs font-medium truncate">{event.zone_name}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-gray-600">{event.sound_played}</span>
                    <span className="text-xs text-gray-700">•</span>
                    <span className="text-xs text-gray-600">{event.confidence}% confidence</span>
                  </div>
                </div>
                <span className="text-xs text-gray-600 flex-shrink-0">{timeAgo(event.detected_at)}</span>
              </div>
            ))}
            {events.length === 0 && (
              <div className="px-5 py-8 text-center text-gray-600 text-sm">No detection events yet</div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[#0d1a0d] border border-[#1e3a1e] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-gray-200">System Status</span>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Master System', value: settings?.is_active ? 'Active' : 'Inactive', ok: settings?.is_active },
                { label: 'Night Mode', value: settings?.night_mode_enabled ? 'Enabled' : 'Disabled', ok: settings?.night_mode_enabled },
                { label: 'Sound Mode', value: settings?.repellent_mode ?? 'auto', ok: true },
                { label: 'Volume', value: `${settings?.sound_volume ?? 75}%`, ok: (settings?.sound_volume ?? 0) > 0 },
                { label: 'Sensitivity', value: `${settings?.detection_sensitivity ?? 6}/10`, ok: true },
              ].map(({ label, value, ok }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{label}</span>
                  <span className={`text-xs font-semibold capitalize ${ok ? 'text-green-400' : 'text-gray-500'}`}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0d1a0d] border border-[#1e3a1e] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Volume2 className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-semibold text-gray-200">Quick Test</span>
            </div>
            <p className="text-xs text-gray-600 mb-3">Simulate a detection event in an active zone</p>
            <button
              onClick={() => randomZone && onSimulate(randomZone.name, randomZone.id)}
              disabled={!randomZone}
              className="w-full py-2.5 rounded-lg bg-amber-700/30 border border-amber-700/50 text-amber-400 text-sm font-semibold hover:bg-amber-700/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Trigger Test Detection
            </button>
            {lastEvent && (
              <div className="mt-3 text-xs text-gray-600 text-center">
                Last: {lastEvent.zone_name} – {timeAgo(lastEvent.detected_at)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
