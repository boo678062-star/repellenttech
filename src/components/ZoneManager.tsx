import { useState } from 'react';
import { Plus, Trash2, Shield, ShieldOff, Crosshair } from 'lucide-react';
import { Zone } from '../types';

interface ZoneManagerProps {
  zones: Zone[];
  onToggle: (id: string, active: boolean) => void;
  onUpdateSensitivity: (id: string, sensitivity: number) => void;
  onAdd: (zone: Omit<Zone, 'id' | 'created_at'>) => void;
  onDelete: (id: string) => void;
}

const ZONE_COLORS = [
  'border-green-600 bg-green-900/20',
  'border-amber-600 bg-amber-900/20',
  'border-sky-600 bg-sky-900/20',
  'border-red-600 bg-red-900/20',
  'border-orange-600 bg-orange-900/20',
];

const DOT_COLORS = ['bg-green-500', 'bg-amber-500', 'bg-sky-500', 'bg-red-500', 'bg-orange-500'];

export default function ZoneManager({ zones, onToggle, onUpdateSensitivity, onAdd, onDelete }: ZoneManagerProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSens, setNewSens] = useState(5);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    await onAdd({
      name: newName.trim(),
      is_active: true,
      sensitivity: newSens,
      x_pos: Math.floor(Math.random() * 70) + 15,
      y_pos: Math.floor(Math.random() * 70) + 15,
    });
    setNewName('');
    setNewSens(5);
    setShowAdd(false);
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Zone Management</h2>
          <p className="text-gray-500 text-sm">Configure and monitor your detection sensor zones</p>
        </div>
        <button
          onClick={() => setShowAdd(v => !v)}
          className="flex items-center gap-2 px-4 py-2 bg-green-800/40 border border-green-700 rounded-lg text-green-400 text-sm font-semibold hover:bg-green-800/60 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Zone
        </button>
      </div>

      {showAdd && (
        <div className="bg-[#0d1a0d] border border-green-800/60 rounded-xl p-4 space-y-3">
          <p className="text-sm font-semibold text-green-300">New Detection Zone</p>
          <div className="flex gap-3">
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="Zone name (e.g. East Garden)"
              className="flex-1 bg-[#152015] border border-[#1e3a1e] rounded-lg px-3 py-2 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-green-700"
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
            />
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Sens:</span>
              <input
                type="number" min={1} max={10} value={newSens}
                onChange={e => setNewSens(Number(e.target.value))}
                className="w-16 bg-[#152015] border border-[#1e3a1e] rounded-lg px-2 py-2 text-sm text-gray-300 focus:outline-none focus:border-green-700 text-center"
              />
            </div>
            <button onClick={handleAdd} className="px-4 py-2 bg-green-700 rounded-lg text-white text-sm font-semibold hover:bg-green-600 transition-colors">
              Create
            </button>
            <button onClick={() => setShowAdd(false)} className="px-3 py-2 bg-[#1e3a1e] rounded-lg text-gray-400 text-sm hover:bg-[#254225] transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {zones.map((zone, i) => (
          <div
            key={zone.id}
            className={`bg-[#0d1a0d] border rounded-xl p-4 transition-all ${zone.is_active ? ZONE_COLORS[i % ZONE_COLORS.length] : 'border-[#1e3a1e]'}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${zone.is_active ? DOT_COLORS[i % DOT_COLORS.length] : 'bg-gray-600'} ${zone.is_active ? 'animate-pulse' : ''}`} />
                <span className="text-sm font-semibold text-gray-200">{zone.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggle(zone.id, !zone.is_active)}
                  className={`p-1.5 rounded-md transition-colors ${zone.is_active ? 'bg-green-900/40 text-green-500 hover:bg-green-900/60' : 'bg-[#1e3a1e] text-gray-600 hover:bg-[#254225]'}`}
                  title={zone.is_active ? 'Deactivate' : 'Activate'}
                >
                  {zone.is_active ? <Shield className="w-3.5 h-3.5" /> : <ShieldOff className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => onDelete(zone.id)}
                  className="p-1.5 rounded-md bg-[#1e3a1e] text-gray-600 hover:bg-red-900/40 hover:text-red-400 transition-colors"
                  title="Delete zone"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-gray-600">Status</span>
                <div className={`font-semibold mt-0.5 ${zone.is_active ? 'text-green-400' : 'text-gray-500'}`}>
                  {zone.is_active ? 'Armed' : 'Disarmed'}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-gray-600 mb-0.5">
                  <Crosshair className="w-3 h-3" />
                  <span>Sensitivity: {zone.sensitivity}/10</span>
                </div>
                <input
                  type="range" min={1} max={10} value={zone.sensitivity}
                  onChange={e => onUpdateSensitivity(zone.id, Number(e.target.value))}
                  className="w-full h-1 appearance-none bg-[#1e3a1e] rounded-full cursor-pointer accent-green-500"
                />
              </div>
            </div>
          </div>
        ))}
        {zones.length === 0 && (
          <div className="bg-[#0d1a0d] border border-[#1e3a1e] rounded-xl p-8 text-center text-gray-600 text-sm">
            No zones configured. Add a zone to get started.
          </div>
        )}
      </div>
    </div>
  );
}
