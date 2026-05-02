import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Zone } from '../types';

export function useZones() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchZones = useCallback(async () => {
    const { data } = await supabase
      .from('zones')
      .select('*')
      .order('created_at', { ascending: true });
    if (data) setZones(data as Zone[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchZones();
  }, [fetchZones]);

  const toggleZone = useCallback(async (id: string, is_active: boolean) => {
    await supabase.from('zones').update({ is_active }).eq('id', id);
    setZones(prev => prev.map(z => z.id === id ? { ...z, is_active } : z));
  }, []);

  const updateZoneSensitivity = useCallback(async (id: string, sensitivity: number) => {
    await supabase.from('zones').update({ sensitivity }).eq('id', id);
    setZones(prev => prev.map(z => z.id === id ? { ...z, sensitivity } : z));
  }, []);

  const addZone = useCallback(async (zone: Omit<Zone, 'id' | 'created_at'>) => {
    const { data } = await supabase.from('zones').insert(zone).select().maybeSingle();
    if (data) setZones(prev => [...prev, data as Zone]);
  }, []);

  const deleteZone = useCallback(async (id: string) => {
    await supabase.from('zones').delete().eq('id', id);
    setZones(prev => prev.filter(z => z.id !== id));
  }, []);

  return { zones, loading, toggleZone, updateZoneSensitivity, addZone, deleteZone, refetch: fetchZones };
}
