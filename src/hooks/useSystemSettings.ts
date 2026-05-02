import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { SystemSettings } from '../types';

export function useSystemSettings() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    const { data } = await supabase
      .from('system_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle();
    if (data) setSettings(data as SystemSettings);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = useCallback(async (updates: Partial<SystemSettings>) => {
    const { data } = await supabase
      .from('system_settings')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', 1)
      .select()
      .maybeSingle();
    if (data) setSettings(data as SystemSettings);
  }, []);

  return { settings, loading, updateSettings, refetch: fetchSettings };
}
