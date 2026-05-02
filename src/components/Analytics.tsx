import { BarChart3, TrendingUp, Clock, Target } from 'lucide-react';
import { DetectionEvent, Zone } from '../types';

interface AnalyticsProps {
  events: DetectionEvent[];
  zones: Zone[];
}

function formatHour(h: number) {
  if (h === 0) return '12am';
  if (h < 12) return `${h}am`;
  if (h === 12) return '12pm';
  return `${h - 12}pm`;
}

export default function Analytics({ events, zones }: AnalyticsProps) {
  const animalCounts: Record<string, number> = {};
  events.forEach(e => { animalCounts[e.animal_type] = (animalCounts[e.animal_type] || 0) + 1; });
  const sortedAnimals = Object.entries(animalCounts).sort((a, b) => b[1] - a[1]);
  const maxAnimal = sortedAnimals[0]?.[1] ?? 1;

  const zoneCounts: Record<string, number> = {};
  events.forEach(e => { zoneCounts[e.zone_name] = (zoneCounts[e.zone_name] || 0) + 1; });
  const sortedZones = Object.entries(zoneCounts).sort((a, b) => b[1] - a[1]);
  const maxZone = sortedZones[0]?.[1] ?? 1;

  const hourCounts: number[] = Array(24).fill(0);
  events.forEach(e => {
    const h = new Date(e.detected_at).getHours();
    hourCounts[h]++;
  });
  const maxHour = Math.max(...hourCounts, 1);

  const soundCounts: Record<string, number> = {};
  events.forEach(e => { soundCounts[e.sound_played] = (soundCounts[e.sound_played] || 0) + 1; });
  const sortedSounds = Object.entries(soundCounts).sort((a, b) => b[1] - a[1]);

  const avgConfidence = events.length
    ? Math.round(events.reduce((s, e) => s + e.confidence, 0) / events.length)
    : 0;
  const avgDuration = events.length
    ? (events.reduce((s, e) => s + e.duration_seconds, 0) / events.length).toFixed(1)
    : 0;

  const peakHour = hourCounts.indexOf(Math.max(...hourCounts));
  const peakHourLabel = formatHour(peakHour);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Analytics</h2>
        <p className="text-gray-500 text-sm">Detection patterns, frequency analysis, and system performance</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Avg. Confidence', value: `${avgConfidence}%`, icon: Target, color: 'bg-green-700' },
          { label: 'Avg. Duration', value: `${avgDuration}s`, icon: Clock, color: 'bg-amber-700' },
          { label: 'Peak Hour', value: peakHourLabel, icon: TrendingUp, color: 'bg-blue-800' },
          { label: 'Zones Used', value: Object.keys(zoneCounts).length, icon: BarChart3, color: 'bg-red-800' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-[#0d1a0d] border border-[#1e3a1e] rounded-xl p-4">
            <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center mb-3`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-xs text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="bg-[#0d1a0d] border border-[#1e3a1e] rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-green-600" />
          <span className="text-sm font-semibold text-gray-200">Activity by Hour of Day</span>
        </div>
        {events.length === 0 ? (
          <div className="text-center text-gray-600 text-sm py-8">No data available</div>
        ) : (
          <div className="flex items-end gap-1 h-24">
            {hourCounts.map((count, h) => (
              <div key={h} className="flex-1 flex flex-col items-center gap-1 group">
                <div
                  className="w-full rounded-t bg-green-700 hover:bg-green-500 transition-colors cursor-pointer min-h-[2px]"
                  style={{ height: `${Math.max((count / maxHour) * 100, count > 0 ? 4 : 2)}%` }}
                  title={`${formatHour(h)}: ${count} events`}
                />
                {h % 4 === 0 && (
                  <span className="text-gray-700 text-[9px] leading-none">{formatHour(h)}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-[#0d1a0d] border border-[#1e3a1e] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-semibold text-gray-200">Detections by Animal</span>
          </div>
          {sortedAnimals.length === 0 ? (
            <div className="text-center text-gray-600 text-sm py-6">No data available</div>
          ) : (
            <div className="space-y-3">
              {sortedAnimals.map(([animal, count]) => (
                <div key={animal}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-300">{animal}</span>
                    <span className="text-xs text-gray-500">{count}</span>
                  </div>
                  <div className="h-2 bg-[#1e3a1e] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-600 rounded-full transition-all"
                      style={{ width: `${(count / maxAnimal) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[#0d1a0d] border border-[#1e3a1e] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-sky-500" />
            <span className="text-sm font-semibold text-gray-200">Detections by Zone</span>
          </div>
          {sortedZones.length === 0 ? (
            <div className="text-center text-gray-600 text-sm py-6">No data available</div>
          ) : (
            <div className="space-y-3">
              {sortedZones.map(([zone, count]) => (
                <div key={zone}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-300">{zone}</span>
                    <span className="text-xs text-gray-500">{count}</span>
                  </div>
                  <div className="h-2 bg-[#1e3a1e] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sky-700 rounded-full transition-all"
                      style={{ width: `${(count / maxZone) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[#0d1a0d] border border-[#1e3a1e] rounded-xl p-5 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-gray-200">Sound Effectiveness</span>
          </div>
          {sortedSounds.length === 0 ? (
            <div className="text-center text-gray-600 text-sm py-6">No data available</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {sortedSounds.map(([sound, count], i) => (
                <div key={sound} className="bg-[#111f11] rounded-lg p-3 border border-[#1e3a1e]">
                  <div className="text-xs text-gray-500 mb-1">#{i + 1}</div>
                  <div className="text-sm font-semibold text-gray-200 mb-1">{sound}</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-[#1e3a1e] rounded-full">
                      <div
                        className="h-full bg-green-700 rounded-full"
                        style={{ width: `${(count / (sortedSounds[0]?.[1] ?? 1)) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{count}x</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
