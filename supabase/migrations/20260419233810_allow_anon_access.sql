
/*
  # Allow Anonymous Access for Scarecrow System

  ## Changes
  This migration updates RLS policies to allow anonymous (unauthenticated) users
  to interact with the scarecrow system tables. This is appropriate for a local
  monitoring dashboard that doesn't require user accounts.

  ## Modified Tables
  - `zones` - Allow anon read/write
  - `detection_events` - Allow anon read/write
  - `system_settings` - Allow anon read/write
*/

DROP POLICY IF EXISTS "Authenticated users can view zones" ON zones;
DROP POLICY IF EXISTS "Authenticated users can insert zones" ON zones;
DROP POLICY IF EXISTS "Authenticated users can update zones" ON zones;
DROP POLICY IF EXISTS "Authenticated users can delete zones" ON zones;

DROP POLICY IF EXISTS "Authenticated users can view events" ON detection_events;
DROP POLICY IF EXISTS "Authenticated users can insert events" ON detection_events;
DROP POLICY IF EXISTS "Authenticated users can delete events" ON detection_events;

DROP POLICY IF EXISTS "Authenticated users can view settings" ON system_settings;
DROP POLICY IF EXISTS "Authenticated users can insert settings" ON system_settings;
DROP POLICY IF EXISTS "Authenticated users can update settings" ON system_settings;

CREATE POLICY "Public read zones"
  ON zones FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public insert zones"
  ON zones FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Public update zones"
  ON zones FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public delete zones"
  ON zones FOR DELETE
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public read events"
  ON detection_events FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public insert events"
  ON detection_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Public delete events"
  ON detection_events FOR DELETE
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public read settings"
  ON system_settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public insert settings"
  ON system_settings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Public update settings"
  ON system_settings FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
