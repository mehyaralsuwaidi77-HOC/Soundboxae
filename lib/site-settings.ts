import { cache } from "react";
import { isServerConfigured, serverSupabase } from "@/lib/supabase/server";

export interface SiteSettings {
  whatsappNumber: string;
  whatsappDisplay: string;
  managerPhone: string;
  setupTeamPhone: string;
  notificationEmail: string;
  companyName: string;
  companyAddress: string;
  websiteUrl: string;
}

const DEFAULTS: SiteSettings = {
  whatsappNumber:    "971553320051",
  whatsappDisplay:   "+971 55 332 0051",
  managerPhone:      "+971553320051",
  setupTeamPhone:    "+971553320051",
  notificationEmail: "info@soundboxdubai.com",
  companyName:       "Soundbox Electronic Equipment Rental",
  companyAddress:    "Dubai, United Arab Emirates",
  websiteUrl:        "https://www.soundboxdubai.com",
};

function formatDisplay(raw: string): string {
  const clean = raw.replace(/\D/g, "");
  if (clean.startsWith("971") && clean.length === 12) {
    return `+971 ${clean.slice(3, 5)} ${clean.slice(5, 8)} ${clean.slice(8)}`;
  }
  return raw.startsWith("+") ? raw : `+${raw}`;
}

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  if (!isServerConfigured()) return DEFAULTS;
  try {
    const db = await serverSupabase();
    const { data } = await db.from("website_settings").select("key, value");
    if (!data || data.length === 0) return DEFAULTS;
    const kv: Record<string, string> = {};
    data.forEach((row) => { kv[row.key] = String(row.value ?? ""); });
    const waNumber = kv["whatsapp_number"] || DEFAULTS.whatsappNumber;
    return {
      whatsappNumber:    waNumber,
      whatsappDisplay:   formatDisplay(waNumber),
      managerPhone:      kv["manager_phone"]      || DEFAULTS.managerPhone,
      setupTeamPhone:    kv["setup_team_phone"]   || DEFAULTS.setupTeamPhone,
      notificationEmail: kv["notification_email"] || DEFAULTS.notificationEmail,
      companyName:       kv["company_name"]       || DEFAULTS.companyName,
      companyAddress:    kv["company_address"]    || DEFAULTS.companyAddress,
      websiteUrl:        kv["website_url"]        || DEFAULTS.websiteUrl,
    };
  } catch {
    return DEFAULTS;
  }
});
