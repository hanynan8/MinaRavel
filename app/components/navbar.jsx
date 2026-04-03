"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

/* ─────────────────────────────────────────
   FETCH HOOK
───────────────────────────────────────── */
function useNavbarData() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch("/api/data?collection=navbar")
      .then((r) => r.json())
      .then((res) => {
        const doc = Array.isArray(res) ? res[0] : res;
        setData(doc);
      })
      .catch(console.error);
  }, []);
  return data;
}

/* ─────────────────────────────────────────
   ICONS
───────────────────────────────────────── */
function ArrowRight({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
function ChevronDown({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
function Globe({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
    </svg>
  );
}
function MenuIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}
function XIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

/* ─────────────────────────────────────────
   LANGUAGE DROPDOWN
───────────────────────────────────────── */
function LangDropdown({ languages }) {
  const { language, changeLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = languages.find((l) => l.code === language) || languages[0];

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-[#0a0a0a] border border-gray-200 rounded-lg hover:border-gray-300 transition-all duration-150"
      >
        <Globe size={13} />
        <span>{current.flag} {current.code.toUpperCase()}</span>
        <span className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          <ChevronDown size={12} />
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] w-44 bg-white border border-gray-100 rounded-xl shadow-xl shadow-black/8 overflow-hidden z-50 animate-dropdown">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { changeLanguage(lang.code); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-100 ${
                lang.code === language
                  ? "bg-[#f7f7f7] text-[#0a0a0a] font-bold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-[#0a0a0a] font-medium"
              }`}
            >
              <span className="text-base">{lang.flag}</span>
              <span>{lang.label}</span>
              {lang.code === language && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#C8102E]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   NAVBAR COMPONENT
═══════════════════════════════════════ */
export default function Navbar() {
  const { language } = useLanguage();
  const data = useNavbarData();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  if (!data) return null;

  const t     = data.i18n[language] ?? data.i18n["en"];
  const isRTL = language === "ar";

  return (
    <>
      <style>{NAV_STYLES}</style>
      <nav
        dir={isRTL ? "rtl" : "ltr"}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/96 backdrop-blur-md border-b border-gray-100 shadow-sm"
            : "bg-transparent"
        }`}
        style={{ fontFamily: "'DM Sans', 'Tajawal', sans-serif" }}
      >
        <div className="max-w-7xl mx-auto px-6 h-[68px] flex items-center justify-between gap-6">

          {/* Brand */}
          <Link href="/" className="shrink-0 text-xl font-black tracking-tighter text-[#0a0a0a] hover:opacity-80 transition-opacity">
            {t.brand}<span className="text-[#C8102E]">.</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {data.links.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="relative px-3 py-2 text-sm font-medium text-gray-500 hover:text-[#0a0a0a] transition-colors tracking-wide group"
              >
                {t.links[link.id]}
                <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#C8102E] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left rounded-full" />
              </Link>
            ))}
          </div>

          {/* Desktop Right Controls */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <LangDropdown languages={data.languages} />
            <Link
              href={data.ctaHref}
              className="inline-flex items-center gap-2 bg-[#C8102E] text-white text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-[#a50d24] active:scale-95 transition-all shadow-sm shadow-red-900/20"
            >
              {t.cta}
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* Mobile Controls */}
          <div className="lg:hidden flex items-center gap-2">
            <LangDropdown languages={data.languages} />
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="p-2 text-gray-600 hover:text-black rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0"
        }`}>
          <div className="bg-white border-t border-gray-100 px-6 py-5 flex flex-col gap-1">
            {data.links.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between py-3 px-2 text-base font-medium text-gray-700 hover:text-[#C8102E] border-b border-gray-50 last:border-0 transition-colors group"
              >
                {t.links[link.id]}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight size={13} />
                </span>
              </Link>
            ))}
            <Link
              href={data.ctaHref}
              className="mt-3 bg-[#C8102E] text-white font-bold px-5 py-3 rounded-lg text-center text-sm hover:bg-[#a50d24] transition-colors"
            >
              {t.cta}
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}

const NAV_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&family=Tajawal:wght@400;700;800&display=swap');
  @keyframes dropdown {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .animate-dropdown { animation: dropdown 0.18s ease both; }
`;