-- ============================================================
-- AKS Automations — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- Safe to re-run: all statements use IF NOT EXISTS
-- ============================================================

-- ─── 1. Facebook Lead Ads ────────────────────────────────────
CREATE TABLE IF NOT EXISTS fb_leads (
    id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    leadgen_id    text        NOT NULL UNIQUE,   -- Facebook lead ID (idempotency key)
    page_id       text,
    form_id       text,
    adgroup_id    text,
    ad_id         text,
    created_time  bigint,                         -- Unix timestamp from Facebook
    field_data    jsonb       DEFAULT '[]',        -- Array of { name, values[] }
    raw_response  jsonb,                           -- Full Graph API response
    status        text        NOT NULL DEFAULT 'new',   -- new | contacted | qualified | closed | lost
    notes         text,
    received_at   timestamptz NOT NULL DEFAULT now(),
    updated_at    timestamptz
);

CREATE INDEX IF NOT EXISTS fb_leads_status_idx       ON fb_leads (status);
CREATE INDEX IF NOT EXISTS fb_leads_received_at_idx  ON fb_leads (received_at DESC);
CREATE INDEX IF NOT EXISTS fb_leads_form_id_idx      ON fb_leads (form_id);

ALTER TABLE fb_leads ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'fb_leads' AND policyname = 'No public access to fb_leads'
  ) THEN
    CREATE POLICY "No public access to fb_leads"
        ON fb_leads FOR ALL TO anon, authenticated USING (false);
  END IF;
END $$;

-- ─── 2. WhatsApp Messages Log ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS whatsapp_messages (
    id             bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    lead_id        text,                            -- references fb_leads.leadgen_id (soft FK)
    phone          text        NOT NULL,
    direction      text        NOT NULL DEFAULT 'outbound',  -- outbound | inbound
    type           text        NOT NULL DEFAULT 'text',      -- text | template | image | audio
    content        text,
    template_name  text,
    wa_message_id  text        UNIQUE,              -- WhatsApp message ID for status updates
    status         text        NOT NULL DEFAULT 'sent',     -- sent | delivered | read | failed | received
    error_data     jsonb,
    sent_at        timestamptz NOT NULL DEFAULT now(),
    updated_at     timestamptz
);

CREATE INDEX IF NOT EXISTS wa_messages_lead_idx    ON whatsapp_messages (lead_id);
CREATE INDEX IF NOT EXISTS wa_messages_wa_id_idx   ON whatsapp_messages (wa_message_id);
CREATE INDEX IF NOT EXISTS wa_messages_phone_idx   ON whatsapp_messages (phone);
CREATE INDEX IF NOT EXISTS wa_messages_sent_at_idx ON whatsapp_messages (sent_at DESC);

ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'whatsapp_messages' AND policyname = 'No public access to whatsapp_messages'
  ) THEN
    CREATE POLICY "No public access to whatsapp_messages"
        ON whatsapp_messages FOR ALL TO anon, authenticated USING (false);
  END IF;
END $$;

-- ─── 3. WhatsApp Follow-up Sequences ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS whatsapp_sequences (
    id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name        text        NOT NULL,
    description text,
    trigger     text        NOT NULL DEFAULT 'manual',  -- manual | on_new_lead
    is_active   boolean     NOT NULL DEFAULT true,
    steps       jsonb       NOT NULL DEFAULT '[]',
    -- Each step: { delay_hours, type: 'text'|'template', message?, template_name?, language?, components? }
    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz
);

ALTER TABLE whatsapp_sequences ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'whatsapp_sequences' AND policyname = 'No public access to whatsapp_sequences'
  ) THEN
    CREATE POLICY "No public access to whatsapp_sequences"
        ON whatsapp_sequences FOR ALL TO anon, authenticated USING (false);
  END IF;
END $$;

-- ─── 4. WhatsApp Follow-up Queue ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS whatsapp_followup_queue (
    id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    lead_id      text,
    phone        text        NOT NULL,
    sequence_id  bigint      REFERENCES whatsapp_sequences(id) ON DELETE CASCADE,
    step_index   int         NOT NULL DEFAULT 0,
    scheduled_at timestamptz NOT NULL,
    status       text        NOT NULL DEFAULT 'pending', -- pending | completed | failed | cancelled
    created_at   timestamptz NOT NULL DEFAULT now(),
    updated_at   timestamptz
);

CREATE INDEX IF NOT EXISTS wa_queue_status_scheduled_idx ON whatsapp_followup_queue (status, scheduled_at);
CREATE INDEX IF NOT EXISTS wa_queue_lead_idx             ON whatsapp_followup_queue (lead_id);

ALTER TABLE whatsapp_followup_queue ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'whatsapp_followup_queue' AND policyname = 'No public access to whatsapp_followup_queue'
  ) THEN
    CREATE POLICY "No public access to whatsapp_followup_queue"
        ON whatsapp_followup_queue FOR ALL TO anon, authenticated USING (false);
  END IF;
END $$;

-- ─── 5. Projects ─────────────────────────────────────────────────────────────
-- Tracks internal client projects through design → development → deployed stages
CREATE TABLE IF NOT EXISTS projects (
    id              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name            text          NOT NULL,
    client_name     text,
    client_email    text,
    client_phone    text,
    description     text,
    status          text          NOT NULL DEFAULT 'discovery',
    -- discovery | designing | development | review | changes | deployed | payment_pending | completed | on_hold
    priority        text          NOT NULL DEFAULT 'medium',  -- low | medium | high | urgent
    start_date      date,
    due_date        date,
    budget          numeric(12,2) DEFAULT 0,
    amount_paid     numeric(12,2) DEFAULT 0,
    tags            text[]        DEFAULT '{}',
    notes           text,
    lead_id         text,       -- optional soft-link to fb_leads.leadgen_id
    created_at      timestamptz   NOT NULL DEFAULT now(),
    updated_at      timestamptz
);

CREATE INDEX IF NOT EXISTS projects_status_idx   ON projects (status);
CREATE INDEX IF NOT EXISTS projects_priority_idx ON projects (priority);
CREATE INDEX IF NOT EXISTS projects_due_date_idx ON projects (due_date);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'projects' AND policyname = 'No public access to projects'
  ) THEN
    CREATE POLICY "No public access to projects"
        ON projects FOR ALL TO anon, authenticated USING (false);
  END IF;
END $$;

-- ─── 6. Notification Contacts ─────────────────────────────────────────────────
-- Phone numbers that receive WhatsApp alerts for key events
CREATE TABLE IF NOT EXISTS notification_contacts (
    id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name        text        NOT NULL,
    phone       text        NOT NULL,              -- digits only, with country code (e.g. 919876543210)
    label       text,                              -- optional tag e.g. "Owner", "Sales Team"
    notify_on   text[]      NOT NULL DEFAULT '{"new_lead","project_update"}',
    -- Possible values: "new_lead" | "project_update" | "payment_update" | "all"
    is_active   boolean     NOT NULL DEFAULT true,
    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz
);

CREATE INDEX IF NOT EXISTS notif_contacts_active_idx ON notification_contacts (is_active);

ALTER TABLE notification_contacts ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'notification_contacts' AND policyname = 'No public access to notification_contacts'
  ) THEN
    CREATE POLICY "No public access to notification_contacts"
        ON notification_contacts FOR ALL TO anon, authenticated USING (false);
  END IF;
END $$;

-- ─── Auto-update trigger for updated_at ──────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_fb_leads_updated_at') THEN
    CREATE TRIGGER trg_fb_leads_updated_at
        BEFORE UPDATE ON fb_leads
        FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_wa_messages_updated_at') THEN
    CREATE TRIGGER trg_wa_messages_updated_at
        BEFORE UPDATE ON whatsapp_messages
        FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_wa_sequences_updated_at') THEN
    CREATE TRIGGER trg_wa_sequences_updated_at
        BEFORE UPDATE ON whatsapp_sequences
        FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_wa_queue_updated_at') THEN
    CREATE TRIGGER trg_wa_queue_updated_at
        BEFORE UPDATE ON whatsapp_followup_queue
        FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_projects_updated_at') THEN
    CREATE TRIGGER trg_projects_updated_at
        BEFORE UPDATE ON projects
        FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_notif_contacts_updated_at') THEN
    CREATE TRIGGER trg_notif_contacts_updated_at
        BEFORE UPDATE ON notification_contacts
        FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
END $$;

-- ─── Seed: Primary notification contact ──────────────────────────────────────
-- Only inserts if phone doesn't already exist
INSERT INTO notification_contacts (name, phone, label, notify_on, is_active)
SELECT 'AKS Admin', '919156903129', 'Owner', ARRAY['all'], true
WHERE NOT EXISTS (
    SELECT 1 FROM notification_contacts WHERE phone = '919156903129'
);
