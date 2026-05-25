"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard, Users, CalendarCheck, ImageIcon,
  BarChart3, Settings, Image as ImageLogo, LogOut, Menu, Lock, Package,
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

// Legacy password fallback (used when Supabase is NOT configured)
const LEGACY_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "soundbox2025";

const navItems = [
  { label: "Dashboard", href: "/admin",           icon: <LayoutDashboard size={17} /> },
  { label: "Leads",     href: "/admin/leads",     icon: <Users size={17} /> },
  { label: "Bookings",  href: "/admin/bookings",  icon: <CalendarCheck size={17} /> },
  { label: "Products",  href: "/admin/products",  icon: <Package size={17} /> },
  { label: "Gallery",   href: "/admin/gallery",   icon: <ImageIcon size={17} /> },
  { label: "Clients",   href: "/admin/clients",   icon: <ImageLogo size={17} /> },
  { label: "Analytics", href: "/admin/analytics", icon: <BarChart3 size={17} /> },
  { label: "Settings",  href: "/admin/settings",  icon: <Settings size={17} /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname   = usePathname();
  const [authed, setAuthed]         = useState(false);
  const [checking, setChecking]     = useState(true);
  const [email, setEmail]           = useState("");
  const [pw, setPw]                 = useState("");
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Check existing session on mount ────────────────────────────────────────
  const checkSession = useCallback(async () => {
    if (isSupabaseConfigured) {
      const { data } = await supabase.auth.getSession();
      setAuthed(!!data.session);
    } else {
      // Legacy localStorage fallback
      setAuthed(sessionStorage.getItem("sbx_admin") === "1");
    }
    setChecking(false);
  }, []);

  useEffect(() => {
    checkSession();

    if (isSupabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setAuthed(!!session);
        if (!session) setChecking(false);
      });
      return () => subscription.unsubscribe();
    }
  }, [checkSession]);

  // ── Login ──────────────────────────────────────────────────────────────────
  async function handleLogin() {
    setLoading(true);
    setError("");
    try {
      if (isSupabaseConfigured) {
        const { error: authErr } = await supabase.auth.signInWithPassword({
          email,
          password: pw,
        });
        if (authErr) {
          setError("Invalid email or password.");
        }
      } else {
        // Legacy password check
        if (pw === LEGACY_PASSWORD) {
          sessionStorage.setItem("sbx_admin", "1");
          setAuthed(true);
        } else {
          setError("Incorrect password.");
        }
      }
    } finally {
      setLoading(false);
    }
  }

  // ── Logout ─────────────────────────────────────────────────────────────────
  async function handleLogout() {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    } else {
      sessionStorage.removeItem("sbx_admin");
    }
    setAuthed(false);
    setEmail("");
    setPw("");
  }

  // ── Loading splash ─────────────────────────────────────────────────────────
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#050505" }}>
        <div className="w-5 h-5 rounded-full border-2 border-[#D6A84F] border-t-transparent animate-spin" />
      </div>
    );
  }

  // ── Login screen ───────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#050505" }}>
        <div className="glass-card rounded-2xl p-10 w-full max-w-sm">
          <div className="flex justify-center mb-8">
            <Image src="/logos/soundbox-logo.png" alt="Soundbox" width={160} height={45} className="object-contain" />
          </div>
          <div className="flex items-center gap-2 mb-6">
            <Lock size={16} style={{ color: "#D6A84F" }} />
            <h1 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
              Admin Access
            </h1>
          </div>

          {isSupabaseConfigured ? (
            <>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="admin@soundboxdubai.com"
                className="w-full bg-[#181824] rounded-lg px-4 py-3 text-sm border outline-none mb-3 placeholder:text-[#3A3A4E]"
                style={{ color: "#FFF", borderColor: "rgba(214,168,79,0.2)" }}
              />
              <input
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="Password"
                className="w-full bg-[#181824] rounded-lg px-4 py-3 text-sm border outline-none mb-3 placeholder:text-[#3A3A4E]"
                style={{ color: "#FFF", borderColor: "rgba(214,168,79,0.2)" }}
              />
            </>
          ) : (
            <>
              <p className="text-xs mb-3 px-1" style={{ color: "#F2994A" }}>
                Supabase not configured — using legacy password login.
              </p>
              <input
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="Enter admin password"
                className="w-full bg-[#181824] rounded-lg px-4 py-3 text-sm border outline-none mb-3 placeholder:text-[#3A3A4E]"
                style={{ color: "#FFF", borderColor: "rgba(214,168,79,0.2)" }}
              />
            </>
          )}

          {error && <p className="text-xs mb-3" style={{ color: "#EB5757" }}>{error}</p>}

          <button onClick={handleLogin} disabled={loading} className="btn-gold w-full disabled:opacity-60">
            {loading ? "Logging in…" : "Login"}
          </button>

          {isSupabaseConfigured ? (
            <p className="text-xs mt-4 text-center" style={{ color: "#5A5A6E" }}>
              Run <code className="text-[#D6A84F]">npm run admin:create</code> to set initial credentials
            </p>
          ) : (
            <p className="text-xs mt-4 text-center" style={{ color: "#5A5A6E" }}>
              Set <code className="text-[#D6A84F]">NEXT_PUBLIC_ADMIN_PASSWORD</code> in .env.local
            </p>
          )}
        </div>
      </div>
    );
  }

  // ── Authenticated layout ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex" style={{ background: "#0B0B0F" }}>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 flex flex-col transition-[transform] duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:flex`}
        style={{ background: "#050505", borderRight: "1px solid rgba(214,168,79,0.1)" }}
      >
        <div className="p-5 border-b" style={{ borderColor: "rgba(214,168,79,0.1)" }}>
          <Image src="/logos/soundbox-logo.png" alt="Soundbox" width={120} height={34} className="object-contain" />
          <p className="text-xs mt-1" style={{ color: "#5A5A6E" }}>Admin Dashboard</p>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-[background,color] duration-150"
                style={{
                  background: active ? "rgba(214,168,79,0.12)" : "transparent",
                  color: active ? "#D6A84F" : "#A7A7B3",
                  borderLeft: active ? "2px solid #D6A84F" : "2px solid transparent",
                }}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t" style={{ borderColor: "rgba(214,168,79,0.1)" }}>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm w-full transition-[color] duration-150 hover:text-white"
            style={{ color: "#A7A7B3" }}
          >
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header
          className="sticky top-0 z-30 flex items-center gap-4 px-6 py-4 border-b"
          style={{ background: "rgba(5,5,5,0.95)", backdropFilter: "blur(12px)", borderColor: "rgba(214,168,79,0.1)" }}
        >
          <button className="lg:hidden p-1" style={{ color: "#D6A84F" }} onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
          <h2 className="text-sm font-semibold text-white">
            {navItems.find((n) => pathname === n.href || (n.href !== "/admin" && pathname.startsWith(n.href)))?.label ?? "Admin"}
          </h2>
          {isSupabaseConfigured && (
            <span className="ml-2 text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(39,174,96,0.15)", color: "#27AE60" }}>
              DB Connected
            </span>
          )}
          <Link href="/" className="ml-auto text-xs transition-[color] duration-150 hover:text-white" style={{ color: "#5A5A6E" }}>
            ← Back to Site
          </Link>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
