import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { DetectionEvent } from '../types';

const ANIMAL_TYPES = ['Bird', 'Deer', 'Rabbit', 'Raccoon', 'Fox', 'Rodent', 'Wild Boar', 'Crow'];
const SOUND_TYPES = ['Predator Call', 'Ultrasonic Burst', 'Hawk Screech', 'Dog Bark', 'Thunder Crack', 'Air Horn'];

export function useDetectionEvents() {
  const [events, setEvents] = useState<DetectionEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    const { data } = await supabase
      .from('detection_events')
      .select('*')
      .order('detected_at', { ascending: false })
      .limit(200);
    if (data) setEvents(data as DetectionEvent[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEvents();
    const channel = supabase
      .channel('detection_events_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'detection_events' }, (payload) => {
        setEvents(prev => [payload.new as DetectionEvent, ...prev].slice(0, 200));
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchEvents]);

  const simulateDetection = useCallback(async (zoneName: string, zoneId: string | null) => {
    const animal = ANIMAL_TYPES[Math.floor(Math.random() * ANIMAL_TYPES.length)];
    const sound = SOUND_TYPES[Math.floor(Math.random() * SOUND_TYPES.length)];
    const event = {
      zone_id: zoneId,
      zone_name: zoneName,
      animal_type: animal,
      sound_played: sound,
      duration_seconds: Math.floor(Math.random() * 8) + 2,
      confidence: Math.floor(Math.random() * 30) + 70,
    };
    await supabase.from('detection_events').insert(event);
  }, []);

  const clearEvents = useCallback(async () => {
    await supabase.from('detection_events').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    setEvents([]);
  }, []);

  return { events, loading, simulateDetection, clearEvents, refetch: fetchEvents };
}
