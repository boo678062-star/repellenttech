import { useState } from 'react';
import { Volume2, VolumeX, Zap, Moon, Clock, AlertTriangle } from 'lucide-react';
import { SystemSettings } from '../types';

interface SoundControlProps {
  settings: SystemSettings | null;
  onUpdate: (updates: Partial<SystemSettings>) => Promise<void>;
}

const SOUNDS = [
  { id: 'Ultrasonic Burst', label: 'Ultrasonic Burst', desc: 'High-frequency deterrent, inaudible to humans', icon: '📡' },
];

function SliderControl({ label, value, min, max, onChange, color = 'green' }: {
  label: string; value: number; min: number; max: number;
  onChange: (v: number) => void; color?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400">{label}</span>
        <span className={`text-sm font-bold ${color === 'amber' ? 'text-amber-400' : 'text-green-400'}`}>{value}</span>
      </div>
      <div className="relative h-2 bg-[#1e3a1e] rounded-full cursor-pointer">
        <div
          className={`absolute left-0 top-0 h-full rounded-full transition-all ${color === 'amber' ? 'bg-amber-600' : 'bg-green-600'}`}
          style={{ width: `${pct}%` }}
        />
        <input
          type="range" min={min} max={max} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
        />
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 shadow transition-all ${color === 'amber' ? 'bg-amber-500 border-amber-300' : 'bg-green-500 border-green-300'}`}
          style={{ left: `calc(${pct}% - 8px)` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-gray-700">{min}</span>
        <span className="text-xs text-gray-700">{max}</span>
      </div>
    </div>
  );
}

export default function SoundControl({ settings, onUpdate }: SoundControlProps) {
  const [saving, setSaving] = useState(false);
  const [localVol, setLocalVol] = useState(settings?.sound_volume ?? 75);
  const [localSens, setLocalSens] = useState(settings?.detection_sensitivity ?? 6);
  const [localCooldown, setLocalCooldown] = useState(settings?.cooldown_seconds ?? 30);
  const [localMode, setLocalMode] = useState<'auto' | 'burst' | 'continuous'>(settings?.repellent_mode ?? 'auto');

  const save = async () => {
    setSaving(true);
    await onUpdate({
      sound_volume: localVol,
      detection_sensitivity: localSens,
      cooldown_seconds: localCooldown,
      repellent_mode: localMode,
    });
    setTimeout(() => setSaving(false), 600);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Sound Repellent Control</h2>
          <p className="text-gray-500 text-sm">Configure audio deterrent settings and behavior</p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-green-800/40 border border-green-700 rounded-lg text-green-400 text-sm font-semibold hover:bg-green-800/60 transition-all disabled:opacity-60"
        >
          {saving ? (
            <><span className="w-3 h-3 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />Saving</>
          ) : 'Save Settings'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-[#0d1a0d] border border-[#1e3a1e] rounded-xl p-5 space-y-5">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-gray-200">Audio Settings</span>
          </div>

          <SliderControl
            label="Master Volume"
            value={localVol}
            min={0} max={100}
            onChange={setLocalVol}
          />

          <div className="border-t border-[#1e3a1e] pt-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <VolumeX className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-400">Mute All Sounds</span>
              </div>
              <button
                onClick={() => onUpdate({ sound_volume: localVol === 0 ? 75 : 0 })}
                className={`w-11 h-6 rounded-full transition-all relative ${
                  localVol === 0 ? 'bg-red-700' : 'bg-[#1e3a1e]'
                }`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${localVol === 0 ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400 block mb-2">Repellent Mode</label>
            <div className="grid grid-cols-3 gap-2">
              {(['auto', 'burst', 'continuous'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setLocalMode(mode)}
                  className={`py-2 rounded-lg text-xs font-semibold capitalize transition-all border ${
                    localMode === mode
                      ? 'bg-green-800/50 border-green-700 text-green-300'
                      : 'bg-[#152015] border-[#1e3a1e] text-gray-500 hover:border-green-900'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
            <div className="mt-2 text-xs text-gray-600">
              {localMode === 'auto' && 'Automatic selection based on animal type and confidence level'}
              {localMode === 'burst' && 'Short, sharp bursts repeated 3 times then cooldown period'}
              {localMode === 'continuous' && 'Sustained repellent sound until motion ceases'}
            </div>
          </div>
        </div>

        <div className="bg-[#0d1a0d] border border-[#1e3a1e] rounded-xl p-5 space-y-5">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-semibold text-gray-200">Detection Settings</span>
          </div>

          <SliderControl
            label="Detection Sensitivity"
            value={localSens}
            min={1} max={10}
            onChange={setLocalSens}
            color="amber"
          />

          <div className="border-t border-[#1e3a1e] pt-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-400">Zone Cooldown Period</span>
              <span className="ml-auto text-sm font-bold text-amber-400">{localCooldown}s</span>
            </div>
            <div className="flex gap-2">
              {[10, 30, 60, 120, 300].map(s => (
                <button
                  key={s}
                  onClick={() => setLocalCooldown(s)}
                  className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all border ${
                    localCooldown === s
                      ? 'bg-amber-900/40 border-amber-700 text-amber-400'
                      : 'bg-[#152015] border-[#1e3a1e] text-gray-600 hover:border-amber-900'
                  }`}
                >
                  {s >= 60 ? `${s / 60}m` : `${s}s`}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-[#1e3a1e] pt-4 space-y-3">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-400"></span>
              <button
                }`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings?.night_mode_enabled ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <div>
                <span className="text-sm text-gray-400">Alert Threshold</span>
                <span className="text-xs text-gray-600 ml-2">(events before alert)</span>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <button onClick={() => onUpdate({ alert_threshold: Math.max(1, (settings?.alert_threshold ?? 5) - 1) })}
                  className="w-6 h-6 bg-[#1e3a1e] rounded text-gray-400 hover:bg-[#254225] text-sm font-bold">−</button>
                <span className="text-sm font-bold text-white w-6 text-center">{settings?.alert_threshold ?? 5}</span>
                <button onClick={() => onUpdate({ alert_threshold: Math.min(20, (settings?.alert_threshold ?? 5) + 1) })}
                  className="w-6 h-6 bg-[#1e3a1e] rounded text-gray-400 hover:bg-[#254225] text-sm font-bold">+</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#0d1a0d] border border-[#1e3a1e] rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Volume2 className="w-4 h-4 text-green-600" />
          <span className="text-sm font-semibold text-gray-200">Available Repellent Sounds</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {SOUNDS.map(sound => (
            <div
              key={sound.id}
              className="bg-[#111f11] border border-[#1e3a1e] rounded-lg p-3 hover:border-green-800/60 transition-colors"
            >
              <div className="text-xl mb-1">{sound.icon}</div>
              <div className="text-sm font-semibold text-gray-200 mb-1">{sound.label}</div>
              <div className="text-xs text-gray-600">{sound.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
