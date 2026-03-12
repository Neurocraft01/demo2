import { supabaseAdmin } from './supabase';
import fs from 'fs';
import path from 'path';

// ─── Static Fallback Data ────────────────────────────────────────────────────
import * as siteData from '@/data/site';
import * as homeData from '@/data/home';
import * as aboutData from '@/data/about';
import * as servicesData from '@/data/services';
import * as projectsData from '@/data/projects';
import * as contactData from '@/data/contact';

const STATIC_FALLBACKS: Record<string, Record<string, unknown>> = {
    site: { ...siteData },
    home: { ...homeData },
    about: { ...aboutData },
    services: { ...servicesData },
    projects: { ...projectsData },
    contact: { ...contactData },
};

// Path to local JSON overrides file
const OVERRIDES_PATH = path.join(process.cwd(), 'src', 'data', 'cms-overrides.json');

function readLocalOverrides(): Record<string, Record<string, unknown>> {
    try {
        const raw = fs.readFileSync(OVERRIDES_PATH, 'utf-8');
        return JSON.parse(raw);
    } catch {
        return {};
    }
}

function writeLocalOverrides(overrides: Record<string, Record<string, unknown>>): void {
    fs.writeFileSync(OVERRIDES_PATH, JSON.stringify(overrides, null, 2), 'utf-8');
}

// In-memory cache with TTL
const cache: Record<string, { data: Record<string, unknown>; expires: number }> = {};
const CACHE_TTL = 60_000; // 1 minute

/**
 * Fetch site content for a section.
 * Priority: cache → Supabase → local JSON overrides → static data.
 */
export async function getSiteContent<T = Record<string, unknown>>(
    section: string
): Promise<T> {
    // Check memory cache
    const cached = cache[section];
    if (cached && cached.expires > Date.now()) {
        return cached.data as T;
    }

    // Try Supabase
    try {
        const { data, error } = await supabaseAdmin
            .from('site_content')
            .select('data')
            .eq('section', section)
            .single();

        if (!error && data?.data) {
            cache[section] = { data: data.data, expires: Date.now() + CACHE_TTL };
            return data.data as T;
        }
    } catch {
        // Supabase not available — fall through
    }

    // Try local JSON overrides
    const overrides = readLocalOverrides();
    if (overrides[section]) {
        cache[section] = { data: overrides[section], expires: Date.now() + CACHE_TTL };
        return overrides[section] as T;
    }

    // Fallback to static data
    const fallback = STATIC_FALLBACKS[section] ?? {};
    cache[section] = { data: fallback, expires: Date.now() + CACHE_TTL };
    return fallback as T;
}

/**
 * Save site content for a section.
 * Tries Supabase first; falls back to local JSON file.
 */
export async function saveSiteContent(
    section: string,
    data: Record<string, unknown>,
    updatedBy?: string
): Promise<{ success: boolean; error?: string }> {
    // Try Supabase first
    try {
        const { error } = await supabaseAdmin
            .from('site_content')
            .upsert(
                {
                    section,
                    data: data,
                    updated_by: updatedBy ?? 'admin',
                },
                { onConflict: 'section' }
            );

        if (!error) {
            delete cache[section];
            return { success: true };
        }
    } catch {
        // Supabase not available — fall through to local save
    }

    // Fallback: save to local JSON file
    try {
        const overrides = readLocalOverrides();
        overrides[section] = data;
        writeLocalOverrides(overrides);
        delete cache[section];
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message || 'Save failed' };
    }
}

/**
 * Get all sections of site content (for admin dashboard).
 */
export async function getAllSiteContent(): Promise<Record<string, unknown>> {
    const sections: Record<string, unknown> = {};

    for (const sectionName of Object.keys(STATIC_FALLBACKS)) {
        sections[sectionName] = await getSiteContent(sectionName);
    }

    return sections;
}

/**
 * Seed all static data into Supabase (initial migration).
 * Only inserts sections that don't already exist.
 */
export async function seedSiteContent(): Promise<{
    seeded: string[];
    skipped: string[];
    errors: string[];
}> {
    const seeded: string[] = [];
    const skipped: string[] = [];
    const errors: string[] = [];

    for (const [section, data] of Object.entries(STATIC_FALLBACKS)) {
        try {
            // Check if already exists
            const { data: existing } = await supabaseAdmin
                .from('site_content')
                .select('section')
                .eq('section', section)
                .single();

            if (existing) {
                skipped.push(section);
                continue;
            }

            // Clean the module export — remove internal keys
            const cleanData: Record<string, unknown> = {};
            for (const [key, val] of Object.entries(data)) {
                if (key === 'default' || key.startsWith('_') || typeof val === 'function') continue;
                cleanData[key] = val;
            }

            const { error } = await supabaseAdmin
                .from('site_content')
                .insert({ section, data: cleanData, updated_by: 'system_seed' });

            if (error) {
                errors.push(`${section}: ${error.message}`);
            } else {
                seeded.push(section);
            }
        } catch (err: any) {
            errors.push(`${section}: ${err.message}`);
        }
    }

    return { seeded, skipped, errors };
}
