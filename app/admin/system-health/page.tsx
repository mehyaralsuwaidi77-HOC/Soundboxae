"use client";

import { useEffect, useState, useCallback } from "react";
import { RefreshCw, CheckCircle, XCircle, AlertCircle, Database, HardDrive, Loader2, Shield } from "lucide-react";

interface TableCheck  { table: string; ok: boolean; error: string | null; count: number | null }
interface BucketCheck { bucket: string; exists: boolean; error: string | null }

interface HealthData {
  configured: boolean;
  url?: string;
  error?: string;
  tables: TableCheck[];
  buckets: BucketCheck[];
  timestamp?: string;
}

interface SetupResult { bucket: string; status: "created" | "exists" | "error"; message?: string }

const StatusIcon = ({ ok, size = 16 }: { ok: boolean | null; size?: number }) => {
  if (ok === null) return <AlertCircle size={size} style={{ color: "#F2994A" }} />;
  return ok
    ? <CheckCircle size={size} style={{ color: "#27AE60" }} />
    : <XCircle size={size} style={{ color: "#EB5757" }} />;
};

export default function SystemHealthPage() {
  const [health, setHealth]             = useState<HealthData | null>(null);
  const [loading, setLoading]           = useState(true);
  const [setupLoading, setSetupLoading] = useState(false);
  const [setupResults, setSetupResults] = useState<SetupResult[] | null>(null);

  const fetchHealth = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/admin/system-health");
      const data = await res.json();
      setHealth(data);
    } catch {
      setHealth({ configured: false, error: "Failed to reach /api/admin/system-health", tables: [], buckets: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchHealth(); }, [fetchHealth]);

  async function handleSetupStorage() {
    setSetupLoading(true);
    setSetupResults(null);
    try {
      const res = await fetch("/api/admin/setup-storage", { method: "POST" });
      const { results } = await res.json();
      setSetupResults(results ?? []);
      await fetchHealth();
    } finally {
      setSetupLoading(false);
    }
  }

  const missingSections = health?.tables.filter((t) => !t.ok).length ?? 0;
  const missingBuckets  = health?.buckets.filter((b) => !b.exists).length ?? 0;

  // Env vars visible client-side
  const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const envVars = [
    {
      name: "NEXT_PUBLIC_SUPABASE_URL",
      ok: !!supabaseUrl,
      hint: supabaseUrl ? supabaseUrl.replace(/^https?:\/\//, "").slice(0, 36) + "…" : "not set",
    },
    {
      name: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      ok: !!supabaseAnon,
      hint: supabaseAnon ? "set (" + supabaseAnon.slice(0, 8) + "…)" : "not set",
    },
    {
      name: "SUPABASE_SERVICE_ROLE_KEY",
      ok: health?.configured ?? false,
      hint: health?.configured ? "set (server-side)" : "not set",
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>System Health</h1>
          <p className="text-sm mt-0.5" style={{ color: "#5A5A6E" }}>
            Supabase connection, tables, and storage bucket status
          </p>
        </div>
        <button
          onClick={fetchHealth}
          disabled={loading}
          className="p-2 rounded-lg glass-card transition-[opacity] duration-150 disabled:opacity-50"
          style={{ color: "#D6A84F" }}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
        </button>
      </div>

      {/* Connection banner */}
      {health && (
        <div
          className="rounded-xl p-5 flex items-center gap-4"
          style={{
            background: health.configured ? "rgba(39,174,96,0.08)" : "rgba(235,87,87,0.08)",
            border: `1px solid ${health.configured ? "rgba(39,174,96,0.2)" : "rgba(235,87,87,0.2)"}`,
          }}
        >
          <StatusIcon ok={health.configured} size={24} />
          <div>
            <p className="font-semibold" style={{ color: health.configured ? "#27AE60" : "#EB5757" }}>
              {health.configured ? "Supabase Connected" : "Supabase Not Configured"}
            </p>
            {health.url && <p className="text-xs mt-0.5" style={{ color: "#5A5A6E" }}>{health.url}</p>}
            {health.error && <p className="text-xs mt-0.5" style={{ color: "#EB5757" }}>{health.error}</p>}
            {health.timestamp && (
              <p className="text-xs mt-0.5" style={{ color: "#5A5A6E" }}>
                Checked at {new Date(health.timestamp).toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
      )}

      {loading && (
        <div className="glass-card rounded-xl p-12 flex items-center justify-center">
          <Loader2 size={28} className="animate-spin" style={{ color: "#D6A84F" }} />
        </div>
      )}

      {!loading && health?.configured && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Database Tables */}
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Database size={16} style={{ color: "#D6A84F" }} />
              <h2 className="font-bold" style={{ fontFamily: "var(--font-display)" }}>Database Tables</h2>
              {missingSections > 0 ? (
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(235,87,87,0.12)", color: "#EB5757" }}>
                  {missingSections} not found
                </span>
              ) : (
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(39,174,96,0.1)", color: "#27AE60" }}>
                  All OK
                </span>
              )}
            </div>
            <div className="space-y-2">
              {health.tables.map((t) => (
                <div
                  key={t.table}
                  className="flex items-center justify-between py-1.5 border-b last:border-0"
                  style={{ borderColor: "rgba(255,255,255,0.04)" }}
                >
                  <div className="flex items-center gap-2">
                    <StatusIcon ok={t.ok} />
                    <span className="text-sm font-mono" style={{ color: "#A7A7B3" }}>{t.table}</span>
                  </div>
                  <div className="text-right">
                    {t.ok && t.count !== null && (
                      <span className="text-xs" style={{ color: "#5A5A6E" }}>{t.count} rows</span>
                    )}
                    {!t.ok && t.error && (
                      <span className="text-xs max-w-32 truncate block" style={{ color: "#EB5757" }} title={t.error}>
                        {t.error}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {missingSections > 0 && (
              <div className="mt-4 p-3 rounded-lg text-xs" style={{ background: "rgba(242,153,74,0.08)", color: "#F2994A", border: "1px solid rgba(242,153,74,0.2)" }}>
                Run <code className="font-mono">supabase/migrations/001_initial_schema.sql</code> in Supabase SQL Editor to create missing tables.
              </div>
            )}
          </div>

          {/* Storage Buckets */}
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <HardDrive size={16} style={{ color: "#D6A84F" }} />
              <h2 className="font-bold" style={{ fontFamily: "var(--font-display)" }}>Storage Buckets</h2>
              {missingBuckets > 0 ? (
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(235,87,87,0.12)", color: "#EB5757" }}>
                  {missingBuckets} missing
                </span>
              ) : (
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(39,174,96,0.1)", color: "#27AE60" }}>
                  All OK
                </span>
              )}
            </div>
            <div className="space-y-2">
              {health.buckets.map((b) => (
                <div
                  key={b.bucket}
                  className="flex items-center justify-between py-1.5 border-b last:border-0"
                  style={{ borderColor: "rgba(255,255,255,0.04)" }}
                >
                  <div className="flex items-center gap-2">
                    <StatusIcon ok={b.exists} />
                    <span className="text-sm font-mono" style={{ color: "#A7A7B3" }}>{b.bucket}</span>
                  </div>
                  <span className="text-xs" style={{ color: b.exists ? "#27AE60" : "#EB5757" }}>
                    {b.exists ? "exists" : "missing"}
                  </span>
                </div>
              ))}
            </div>

            {missingBuckets > 0 && (
              <div className="mt-4 space-y-3">
                <div className="p-3 rounded-lg text-xs" style={{ background: "rgba(242,153,74,0.08)", color: "#F2994A", border: "1px solid rgba(242,153,74,0.2)" }}>
                  Missing buckets will cause upload errors. Click below to create them automatically.
                </div>
                <button
                  onClick={handleSetupStorage}
                  disabled={setupLoading}
                  className="btn-gold w-full inline-flex items-center justify-center gap-2 text-sm disabled:opacity-60"
                >
                  {setupLoading
                    ? <><Loader2 size={14} className="animate-spin" /> Creating buckets…</>
                    : <><HardDrive size={14} /> Create Missing Buckets</>}
                </button>
              </div>
            )}

            {missingBuckets === 0 && (
              <button
                onClick={handleSetupStorage}
                disabled={setupLoading}
                className="mt-4 w-full text-sm py-2 rounded-lg transition-[background] duration-150 disabled:opacity-60"
                style={{ background: "rgba(255,255,255,0.04)", color: "#5A5A6E", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                {setupLoading ? "Running…" : "Re-run bucket setup"}
              </button>
            )}

            {setupResults && (
              <div className="mt-3 space-y-1">
                {setupResults.map((r) => (
                  <div key={r.bucket} className="flex items-center gap-2 text-xs">
                    <StatusIcon ok={r.status !== "error"} size={13} />
                    <span className="font-mono" style={{ color: "#A7A7B3" }}>{r.bucket}</span>
                    <span style={{ color: r.status === "created" ? "#27AE60" : r.status === "exists" ? "#5A5A6E" : "#EB5757" }}>
                      {r.status === "created" ? "created" : r.status === "exists" ? "already exists" : r.message}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Environment Variables */}
      {!loading && (
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={16} style={{ color: "#D6A84F" }} />
            <h2 className="font-bold" style={{ fontFamily: "var(--font-display)" }}>Environment Variables</h2>
          </div>
          <div className="space-y-2">
            {envVars.map((v) => (
              <div
                key={v.name}
                className="flex items-center justify-between py-2 border-b last:border-0"
                style={{ borderColor: "rgba(255,255,255,0.04)" }}
              >
                <div className="flex items-center gap-2.5">
                  <StatusIcon ok={v.ok} />
                  <code className="text-sm" style={{ color: "#A7A7B3" }}>{v.name}</code>
                </div>
                <span className="text-xs" style={{ color: v.ok ? "#5A5A6E" : "#EB5757" }}>
                  {v.hint}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs mt-4" style={{ color: "#3A3A4E" }}>
            Values are never shown in full. Set these in your Vercel project settings under Environment Variables.
          </p>
        </div>
      )}
    </div>
  );
}
