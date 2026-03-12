-- ============================================================
-- AKS Automations — Google Sheets Sync + Site Content Tables
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- Safe to re-run: all statements use IF NOT EXISTS
-- ============================================================

-- ─── 7. Site Content (CMS) ───────────────────────────────────────────────────
-- Stores all editable website content as JSON blobs
-- Each row = one section (e.g. 'home', 'about', 'services', 'site', 'contact', 'projects')
CREATE TABLE IF NOT EXISTS site_content (
    id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    section     text        NOT NULL UNIQUE,          -- e.g. 'home', 'about', 'services'
    data        jsonb       NOT NULL DEFAULT '{}',    -- full section data as JSON
    updated_by  text,                                 -- who last updated
    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz
);

CREATE INDEX IF NOT EXISTS site_content_section_idx ON site_content (section);

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Public can read site content (for rendering pages)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'site_content' AND policyname = 'Public can read site_content'
  ) THEN
    CREATE POLICY "Public can read site_content"
        ON site_content FOR SELECT TO anon, authenticated USING (true);
  END IF;
END $$;

-- Block public writes
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'site_content' AND policyname = 'No public write to site_content'
  ) THEN
    CREATE POLICY "No public write to site_content"
        ON site_content FOR INSERT TO anon, authenticated WITH CHECK (false);
  END IF;
END $$;

-- ─── 8. Contact Form Submissions ────────────────────────────────────────────
-- Stores all contact form submissions for tracking
CREATE TABLE IF NOT EXISTS contact_submissions (
    id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name        text        NOT NULL,
    email       text        NOT NULL,
    phone       text,
    service     text,
    message     text,
    status      text        NOT NULL DEFAULT 'new',   -- new | replied | closed
    notes       text,
    ip_address  text,
    user_agent  text,
    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz
);

CREATE INDEX IF NOT EXISTS contact_submissions_status_idx    ON contact_submissions (status);
CREATE INDEX IF NOT EXISTS contact_submissions_created_idx   ON contact_submissions (created_at DESC);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'contact_submissions' AND policyname = 'No public access to contact_submissions'
  ) THEN
    CREATE POLICY "No public access to contact_submissions"
        ON contact_submissions FOR ALL TO anon, authenticated USING (false);
  END IF;
END $$;

-- ─── 9. Google Sheets Sync Log ──────────────────────────────────────────────
-- Tracks sync history for debugging and monitoring
CREATE TABLE IF NOT EXISTS gsheet_sync_log (
    id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    total       int         NOT NULL DEFAULT 0,
    synced      int         NOT NULL DEFAULT 0,
    skipped     int         NOT NULL DEFAULT 0,
    errors      int         NOT NULL DEFAULT 0,
    triggered_by text,                               -- 'cron' | 'admin' | 'manual'
    error_msg   text,
    synced_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS gsheet_sync_log_synced_at_idx ON gsheet_sync_log (synced_at DESC);

ALTER TABLE gsheet_sync_log ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'gsheet_sync_log' AND policyname = 'No public access to gsheet_sync_log'
  ) THEN
    CREATE POLICY "No public access to gsheet_sync_log"
        ON gsheet_sync_log FOR ALL TO anon, authenticated USING (false);
  END IF;
END $$;

-- ─── Auto-update triggers ──────────────────────────────────
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_site_content_updated_at') THEN
    CREATE TRIGGER trg_site_content_updated_at
        BEFORE UPDATE ON site_content
        FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_contact_submissions_updated_at') THEN
    CREATE TRIGGER trg_contact_submissions_updated_at
        BEFORE UPDATE ON contact_submissions
        FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
END $$;

-- ─── Seed: Default site content from static data ─────────────────────────────
-- This inserts the initial content structure. The actual data will be seeded
-- from the application using the /api/admin/seed-content endpoint.
-- You can also manually insert data here if preferred.
