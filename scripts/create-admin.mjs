#!/usr/bin/env node
/**
 * Creates the initial Supabase Auth admin user.
 * Usage:  node scripts/create-admin.mjs
 *
 * Required env vars (can be set in .env.local):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Optional (fall back to defaults if not set):
 *   ADMIN_EMAIL             — defaults to admin@soundboxdubai.com
 *   ADMIN_INITIAL_PASSWORD  — defaults to soundbox2025
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join } from "path";

// Load .env.local manually (no dotenv dependency required)
function loadEnvFile() {
  try {
    const content = readFileSync(join(process.cwd(), ".env.local"), "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx < 0) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
      if (key && !process.env[key]) process.env[key] = val;
    }
  } catch {
    // .env.local may not exist — rely on shell env
  }
}

loadEnvFile();

const SUPABASE_URL     = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_EMAIL      = process.env.ADMIN_EMAIL            ?? "admin@soundboxdubai.com";
const ADMIN_PASSWORD   = process.env.ADMIN_INITIAL_PASSWORD ?? "soundbox2025";

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("❌  Missing required environment variables.");
  console.error("    Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

console.log(`Creating admin user: ${ADMIN_EMAIL} …`);

const { data, error } = await supabase.auth.admin.createUser({
  email: ADMIN_EMAIL,
  password: ADMIN_PASSWORD,
  email_confirm: true,
});

if (error) {
  if (error.message?.includes("already been registered")) {
    console.log("ℹ️   User already exists. To reset the password:");
    console.log(`    supabase.auth.admin.updateUserById(id, { password: "newpass" })`);
  } else {
    console.error("❌  Failed:", error.message);
    process.exit(1);
  }
} else {
  console.log("✅  Admin user created successfully.");
  console.log("    Email:   ", data.user.email);
  console.log("    User ID: ", data.user.id);
  console.log("\n🔑  Log in at /admin with these credentials.");
}
