export interface Zone {
  id: string;
  name: string;
  is_active: boolean;
  sensitivity: number;
  x_pos: number;
  y_pos: number;
  created_at: string;
}

export interface DetectionEvent {
  id: string;
  zone_id: string | null;
  zone_name: string;
  animal_type: string;
  sound_played: string;
  duration_seconds: number;
  confidence: number;
  detected_at: string;
}

export interface SystemSettings {
  id: number;
  is_active: boolean;
  sound_volume: number;
  detection_sensitivity: number;
  repellent_mode: 'auto' | 'burst' | 'continuous';
  cooldown_seconds: number;
  night_mode_enabled: boolean;
  alert_threshold: number;
  updated_at: string;
}

export type NavPage = 'dashboard' | 'motion' | 'sound' | 'zones' | 'analytics';
