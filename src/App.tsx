import { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import MotionLog from './components/MotionLog';
import SoundControl from './components/SoundControl';
import ZoneManager from './components/ZoneManager';
import Analytics from './components/Analytics';
import { useSystemSettings } from './hooks/useSystemSettings';
import { useZones } from './hooks/useZones';
import { useDetectionEvents } from './hooks/useDetectionEvents';
import { NavPage } from './types';

export default function App() {
  const [page, setPage] = useState<NavPage>('dashboard');
  const { settings, loading: settingsLoading, updateSettings } = useSystemSettings();
  const { zones, loading: zonesLoading, toggleZone, updateZoneSensitivity, addZone, deleteZone } = useZones();
  const { events, loading: eventsLoading, simulateDetection, clearEvents } = useDetectionEvents();

  const loading = settingsLoading || zonesLoading || eventsLoading;

  const recentCount = events.filter(e => {
    return Date.now() - new Date(e.detected_at).getTime() < 5 * 60 * 1000;
  }).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060d06] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-green-700 border-t-green-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-green-600 text-sm font-medium">Initializing ScareCrow System...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060d06] flex flex-col text-gray-300">
      <Header
        settings={settings}
        eventCount={recentCount}
        onToggleSystem={() => updateSettings({ is_active: !settings?.is_active })}
      />
      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 64px)' }}>
        <Sidebar current={page} onChange={setPage} recentEventCount={recentCount} />
        <main className="flex-1 overflow-y-auto bg-[#080f08]">
          {page === 'dashboard' && (
            <Dashboard
              settings={settings}
              zones={zones}
              events={events}
              onSimulate={simulateDetection}
            />
          )}
          {page === 'motion' && (
            <MotionLog
              events={events}
              zones={zones}
              onSimulate={simulateDetection}
              onClear={clearEvents}
            />
          )}
          {page === 'sound' && (
            <SoundControl settings={settings} onUpdate={updateSettings} />
          )}
          {page === 'zones' && (
            <ZoneManager
              zones={zones}
              onToggle={toggleZone}
              onUpdateSensitivity={updateZoneSensitivity}
              onAdd={addZone}
              onDelete={deleteZone}
            />
          )}
          {page === 'analytics' && (
            <Analytics events={events} zones={zones} />
          )}
        </main>
      </div>
    </div>
  );
}
