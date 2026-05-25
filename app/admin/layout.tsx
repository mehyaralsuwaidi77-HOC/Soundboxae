"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  ImageIcon,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Lock,
} from "lucide-react";

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "soundbox2025";

const navItems = [
  { label: "Dashboard", href: "/admin",           icon: <LayoutDashboard size={17} /> },
  { label: "Leads",     href: "/admin/leads",     icon: <Users size={17} /> },
  { label: "Bookings",  href: "/admin/bookings",  icon: <CalendarCheck size={17} /> },
  { label: "Gallery",   href: "/admin/gallery",   icon: <ImageIcon size={17} /> },
  { label: "Analytics", href: "/admin/analytics", icon: <BarChart3 size={17} /> },
  { label: "Settings",  href: "/admin/settings",  icon: <Settings size={17} /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("sbx_admin");
    if (stored === "1") setAuthed(true);
  }, []);

  function handleLogin() {
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem("sbx_admin", "1");
      setAuthed(true);
    } else {
      setError("Incorrect password.");
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("sbx_admin");
    setAuthed(false);
    setPw("");
  }

  if (!authed) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#050505" }}
      >
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
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Enter admin password"
            className="w-full bg-[#181824] rounded-lg px-4 py-3 text-sm border outline-none mb-3 placeholder:text-[#3A3A4E]"
            style={{ color: "#FFFFFF", borderColor: "rgba(214,168,79,0.2)" }}
          />
          {error && <p className="text-xs mb-3" style={{ color: "#EB5757" }}>{error}</p>}
          <button onClick={handleLogin} className="btn-gold w-full">
            Login
          </button>
          <p className="text-xs mt-4 text-center" style={{ color: "#5A5A6E" }}>
            Set <code>NEXT_PUBLIC_ADMIN_PASSWORD</code> in .env.local
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#0B0B0F" }}>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 flex flex-col transition-[transform] duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:flex`}
        style={{
          background: "#050505",
          borderRight: "1px solid rgba(214,168,79,0.1)",
        }}
      >
        <div className="p-5 border-b" style={{ borderColor: "rgba(214,168,79,0.1)" }}>
          <Image src="/logos/soundbox-logo.png" alt="Soundbox" width={120} height={34} className="object-contain" />
          <p className="text-xs mt-1" style={{ color: "#5A5A6E" }}>Admin Dashboard</p>
        </div>
        <nav className="flex-1 py-6 px-3 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
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

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header
          className="sticky top-0 z-30 flex items-center gap-4 px-6 py-4 border-b"
          style={{ background: "rgba(5,5,5,0.95)", backdropFilter: "blur(12px)", borderColor: "rgba(214,168,79,0.1)" }}
        >
          <button
            className="lg:hidden p-1"
            style={{ color: "#D6A84F" }}
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>
          <h2 className="text-sm font-semibold text-white">
            {navItems.find((n) => n.href === pathname)?.label ?? "Admin"}
          </h2>
          <Link href="/" className="ml-auto text-xs transition-[color] duration-150 hover:text-white" style={{ color: "#5A5A6E" }}>
            ← Back to Site
          </Link>
        </header>

        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
