import { useState } from 'react';
import { Activity, Trash2, Radio, Filter } from 'lucide-react';
import { DetectionEvent, Zone } from '../types';

interface MotionLogProps {
  events: DetectionEvent[];
  zones: Zone[];
  onSimulate: (zoneName: string, zoneId: string | null) => void;
  onClear: () => void;
}

const ANIMAL_BADGE: Record<string, string> = {
  Bird: 'bg-sky-900/50 text-sky-400 border-sky-800',
  Deer: 'bg-amber-900/50 text-amber-400 border-amber-800',
  Rabbit: 'bg-orange-900/50 text-orange-400 border-orange-800',
  Raccoon: 'bg-gray-800/50 text-gray-400 border-gray-700',
  Fox: 'bg-orange-900/50 text-orange-500 border-orange-800',
  Rodent: 'bg-yellow-900/50 text-yellow-500 border-yellow-800',
  'Wild Boar': 'bg-red-900/50 text-red-400 border-red-800',
  Crow: 'bg-gray-900/50 text-gray-500 border-gray-800',
};

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}

export default function MotionLog({ events, zones, onSimulate, onClear }: MotionLogProps) {
  const [filterZone, setFilterZone] = useState('all');
  const [filterAnimal, setFilterAnimal] = useState('all');
  const [simZoneId, setSimZoneId] = useState<string>(zones[0]?.id ?? '');
  const [firing, setFiring] = useState(false);

  const animalTypes = [...new Set(events.map(e => e.animal_type))];

  const filtered = events.filter(e => {
    if (filterZone !== 'all' && e.zone_name !== filterZone) return false;
    if (filterAnimal !== 'all' && e.animal_type !== filterAnimal) return false;
    return true;
  });

  const handleSimulate = async () => {
    const zone = zones.find(z => z.id === simZoneId) ?? zones.find(z => z.is_active);
    if (!zone) return;
    setFiring(true);
    await onSimulate(zone.name, zone.id);
    setTimeout(() => setFiring(false), 1000);
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Motion Detection Log</h2>
          <p className="text-gray-500 text-sm">All sensor-triggered events across your zones</p>
        </div>
        <button
          onClick={onClear}
          className="flex items-center gap-2 px-3 py-2 bg-red-900/20 border border-red-800/40 rounded-lg text-red-400 text-sm hover:bg-red-900/40 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Clear Log
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#0d1a0d] border border-[#1e3a1e] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Radio className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-semibold text-gray-200">Simulate Detection</span>
          </div>
          <div className="flex gap-3">
            <select
              value={simZoneId}
              onChange={e => setSimZoneId(e.target.value)}
              className="flex-1 bg-[#152015] border border-[#1e3a1e] rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-green-700"
            >
              {zones.map(z => (
                <option key={z.id} value={z.id}>{z.name} {!z.is_active ? '(inactive)' : ''}</option>
              ))}
            </select>
            <button
              onClick={handleSimulate}
              disabled={firing || zones.length === 0}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                firing
                  ? 'bg-amber-600 text-black scale-95'
                  : 'bg-amber-700/40 border border-amber-700 text-amber-400 hover:bg-amber-700/60'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {firing ? (
                <><span className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />Firing</>
              ) : (
                <>Trigger</>
              )}
            </button>
          </div>
        </div>

        <div className="bg-[#0d1a0d] border border-[#1e3a1e] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-gray-200">Filter Events</span>
          </div>
          <div className="flex gap-3">
            <select
              value={filterZone}
              onChange={e => setFilterZone(e.target.value)}
              className="flex-1 bg-[#152015] border border-[#1e3a1e] rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-green-700"
            >
              <option value="all">All Zones</option>
              {[...new Set(events.map(e => e.zone_name))].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <select
              value={filterAnimal}
              onChange={e => setFilterAnimal(e.target.value)}
              className="flex-1 bg-[#152015] border border-[#1e3a1e] rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-green-700"
            >
              <option value="all">All Animals</option>
              {animalTypes.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-[#0d1a0d] border border-[#1e3a1e] rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3 border-b border-[#1e3a1e] bg-[#0a150a]">
          <Activity className="w-4 h-4 text-green-600" />
          <span className="text-sm font-semibold text-gray-300">
            {filtered.length} {filtered.length === 1 ? 'Event' : 'Events'}
          </span>
          <span className="text-xs text-gray-600 ml-auto">Newest first</span>
        </div>
        <div className="overflow-y-auto max-h-[calc(100vh-420px)]">
          {filtered.length === 0 ? (
            <div className="px-5 py-12 text-center text-gray-600 text-sm">No events match your filters</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1e3a1e] bg-[#0a150a]">
                  {['Time', 'Zone', 'Animal', 'Sound Played', 'Duration', 'Confidence'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a2e1a]">
                {filtered.map((e, i) => (
                  <tr key={e.id} className={`hover:bg-[#111f11] transition-colors ${i === 0 ? 'bg-[#112011]/50' : ''}`}>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{formatTime(e.detected_at)}</td>
                    <td className="px-4 py-3 text-gray-300 font-medium text-xs">{e.zone_name}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded border text-xs font-medium ${ANIMAL_BADGE[e.animal_type] ?? 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                        {e.animal_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{e.sound_played}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{e.duration_seconds}s</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-[#1e3a1e] rounded-full w-16">
                          <div
                            className="h-full bg-green-600 rounded-full"
                            style={{ width: `${e.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{e.confidence}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
