
/*
  # Scarecrow System Database Schema

  ## Overview
  This migration creates the full database schema for the Smart Scarecrow System,
  which uses motion detection sensors and sound repellent technology to deter animals.

  ## New Tables

  ### 1. `zones`
  Monitoring zones set up around the protected area.
  - `id` - Unique identifier
  - `name` - Zone display name (e.g., "North Field", "Garden Bed A")
  - `is_active` - Whether the zone is currently armed
  - `sensitivity` - Detection sensitivity level (1-10)
  - `x_pos`, `y_pos` - Visual position on the zone map (percentage)
  - `created_at` - Timestamp of zone creation

  ### 2. `detection_events`
  Log of all motion detection events triggered by sensors.
  - `id` - Unique identifier
  - `zone_id` - Reference to the zone that triggered the event
  - `zone_name` - Denormalized zone name for easier querying
  - `animal_type` - Detected or inferred animal type (e.g., "Bird", "Deer", "Rodent")
  - `sound_played` - The repellent sound used in response
  - `duration_seconds` - How long the repellent played
  - `confidence` - Detection confidence percentage
  - `detected_at` - Timestamp of detection

  ### 3. `system_settings`
  Global configuration for the scarecrow system.
  - `id` - Single-row settings record
  - `is_active` - Master on/off for the entire system
  - `sound_volume` - Global volume level (0-100)
  - `detection_sensitivity` - Global sensitivity override
  - `repellent_mode` - Mode: "auto", "burst", "continuous"
  - `cooldown_seconds` - Seconds between repeat triggers in the same zone
  - `night_mode_enabled` - Whether night detection is active
  - `alert_threshold` - Number of events before an alert is raised
  - `updated_at` - Last settings update

  ## Security
  - RLS enabled on all tables
  - Authenticated users can read and write all tables
  - Unauthenticated access is denied
*/

CREATE TABLE IF NOT EXISTS zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  sensitivity integer NOT NULL DEFAULT 5 CHECK (sensitivity BETWEEN 1 AND 10),
  x_pos numeric NOT NULL DEFAULT 50,
  y_pos numeric NOT NULL DEFAULT 50,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE zones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view zones"
  ON zones FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert zones"
  ON zones FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update zones"
  ON zones FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete zones"
  ON zones FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE TABLE IF NOT EXISTS detection_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id uuid REFERENCES zones(id) ON DELETE SET NULL,
  zone_name text NOT NULL DEFAULT '',
  animal_type text NOT NULL DEFAULT 'Unknown',
  sound_played text NOT NULL DEFAULT 'Predator Call',
  duration_seconds integer NOT NULL DEFAULT 3,
  confidence integer NOT NULL DEFAULT 80 CHECK (confidence BETWEEN 0 AND 100),
  detected_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE detection_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view events"
  ON detection_events FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert events"
  ON detection_events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete events"
  ON detection_events FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE TABLE IF NOT EXISTS system_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  is_active boolean NOT NULL DEFAULT true,
  sound_volume integer NOT NULL DEFAULT 75 CHECK (sound_volume BETWEEN 0 AND 100),
  detection_sensitivity integer NOT NULL DEFAULT 6 CHECK (detection_sensitivity BETWEEN 1 AND 10),
  repellent_mode text NOT NULL DEFAULT 'auto' CHECK (repellent_mode IN ('auto', 'burst', 'continuous')),
  cooldown_seconds integer NOT NULL DEFAULT 30,
  night_mode_enabled boolean NOT NULL DEFAULT true,
  alert_threshold integer NOT NULL DEFAULT 5,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view settings"
  ON system_settings FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert settings"
  ON system_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update settings"
  ON system_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

INSERT INTO system_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

INSERT INTO zones (name, is_active, sensitivity, x_pos, y_pos) VALUES
  ('North Field', true, 7, 25, 15),
  ('East Garden', true, 6, 75, 25),
  ('South Orchard', true, 8, 50, 75),
  ('West Perimeter', false, 5, 15, 55),
  ('Central Crop', true, 9, 50, 45)
ON CONFLICT DO NOTHING;
