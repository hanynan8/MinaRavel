"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

/* ─────────────────────────────────────────
   FETCH HOOK
───────────────────────────────────────── */
function useCountriesData() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch("/api/data?collection=countries")
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
   SCROLL REVEAL HOOK
───────────────────────────────────────── */
function useReveal(threshold = 0.08) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
      },
      { threshold }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
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
function Check({ size = 11, color = "#C8102E" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
function BookOpen({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
    </svg>
  );
}
function ClipboardList({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" /><path d="M9 12h6M9 16h4" />
    </svg>
  );
}
function Wallet({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
      <path d="M16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z" />
      <circle cx="17" cy="13" r="1" fill="currentColor" />
    </svg>
  );
}
function Briefcase({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M12 12v4M10 14h4" />
    </svg>
  );
}
function FileCheck({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6M9 15l2 2 4-4" />
    </svg>
  );
}
function Sun({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

/* ─────────────────────────────────────────
   SECTION CONFIG — maps section keys to icons & colors
───────────────────────────────────────── */
const SECTION_META = {
  educationSystem:      { icon: BookOpen,      color: "#C8102E" },
  admissionRequirements:{ icon: ClipboardList, color: "#a855f7" },
  costOfLiving:         { icon: Wallet,        color: "#10b981" },
  partTimeWork:         { icon: Briefcase,     color: "#f59e0b" },
  visaProcess:          { icon: FileCheck,     color: "#3b82f6" },
  lifeInSpain:          { icon: Sun,           color: "#ef4444" },
};

const SECTION_KEYS = Object.keys(SECTION_META);

/* ─────────────────────────────────────────
   SHARED — Section Label
───────────────────────────────────────── */
function Label({ text, visible, color = "#C8102E", dark = false }) {
  return (
    <div className={`flex items-center gap-2 mb-3 transition-all duration-500 ${visible ? "opacity-100" : "opacity-0"}`}>
      <div className="w-5 h-px" style={{ background: color }} />
      <span className={`text-xs font-bold tracking-[0.2em] uppercase ${dark ? "text-gray-400" : ""}`}
        style={!dark ? { color } : {}}>
        {text}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════
   ROOT PAGE
═══════════════════════════════════════ */
export default function CountriesPage() {
  const { language, isRTL } = useLanguage();
  const data = useCountriesData();
  const [activeSection, setActiveSection] = useState(SECTION_KEYS[0]);

  if (!data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400">Loading</span>
        </div>
      </div>
    );
  }

  const t = data.i18n[language] ?? data.i18n["en"];

  const mergedCountries = data.countries.map((c) => ({
    ...c,
    ...t.countries[c.id],
  }));

  return (
    <>
      <style>{STYLES}</style>
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className="min-h-screen bg-white text-[#0a0a0a] overflow-x-hidden"
        style={{ fontFamily: "'DM Sans', 'Tajawal', sans-serif" }}
      >
        <HeroSection data={data} t={t} />

        {mergedCountries.map((country) => (
          <CountryDetail
            key={country.id}
            country={country}
            t={t}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
        ))}

        <StatsStrip data={data} t={t} />
      </div>
    </>
  );
}

/* ═══════════════════════════════════════
   HERO
═══════════════════════════════════════ */
function HeroSection({ data, t }) {
  return (
    <section className="relative min-h-[52vh] flex items-end overflow-hidden bg-[#f4f4f4]">
      <div className="absolute inset-0 z-0">
        <Image
          src={data.hero.backgroundImage}
          alt="countries hero"
          fill
          className="object-cover object-center"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/88 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-white to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20 pt-36 w-full">
        <div className="flex items-center gap-3 mb-5 animate-fadein">
          <div className="w-8 h-px bg-[#C8102E]" />
          <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#C8102E]">
            {t.hero.badge}
          </span>
        </div>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[0.92] tracking-tighter max-w-2xl mb-5 animate-fadein-up">
          {t.hero.headline.split(",").map((chunk, i, arr) =>
            i === arr.length - 1
              ? <span key={i} className="text-[#C8102E]">{chunk}</span>
              : <span key={i}>{chunk},<br /></span>
          )}
        </h1>
        <p className="text-gray-500 text-lg max-w-lg leading-relaxed animate-fadein-up2">
          {t.hero.subheadline}
        </p>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-bounce">
        <div className="w-px h-8 bg-gray-300" />
        <span className="text-[10px] tracking-[0.2em] uppercase text-gray-400 font-medium">Scroll</span>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   COUNTRY DETAIL
═══════════════════════════════════════ */
function CountryDetail({ country, t, activeSection, setActiveSection }) {
  const [headerRef, headerVisible] = useReveal(0.1);

  return (
    <div>
      {/* ── Country Header ── */}
      <div ref={headerRef} className="relative overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0 z-0 opacity-20">
          <Image src={country.image} alt={country.name} fill className="object-cover" unoptimized />
        </div>
        <div className="absolute top-0 inset-x-0 h-[3px] z-10" style={{ background: country.color }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
          <div className={`transition-all duration-700 ${headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-5xl">{country.flag}</span>
              <div>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">{country.name}</h2>
                <p className="text-gray-400 text-sm font-medium mt-0.5">{country.tagline}</p>
              </div>
            </div>
            <p className="text-gray-300 text-[15px] max-w-2xl leading-relaxed">{country.desc}</p>
          </div>
        </div>
      </div>

      {/* ── Sticky Section Nav ── */}
      <SectionNav
        sectionKeys={SECTION_KEYS}
        t={t}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        country={country}
      />

      {/* ── Sections ── */}
      <div>
        {SECTION_KEYS.map((key, i) => (
          <SectionRow
            key={key}
            sectionKey={key}
            sectionData={country.sections[key]}
            content={country[key]}
            meta={SECTION_META[key]}
            index={i}
            id={`section-${key}`}
          />
        ))}
      </div>

      {/* ── CTA Banner ── */}
      <CtaBanner country={country} t={t} />
    </div>
  );
}

/* ─────────────────────────────────────────
   STICKY SECTION NAV
───────────────────────────────────────── */
function SectionNav({ sectionKeys, t, activeSection, setActiveSection, country }) {
  const scrollToSection = (key) => {
    setActiveSection(key);
    const el = document.getElementById(`section-${key}`);
    if (el) {
      const offset = 140;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div className="sticky top-[68px] z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {sectionKeys.map((key) => {
          const meta = SECTION_META[key];
          const Icon = meta.icon;
          const isActive = activeSection === key;
          return (
            <button
              key={key}
              onClick={() => scrollToSection(key)}
              className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-200 ${
                isActive
                  ? "text-white shadow-sm"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-[#0a0a0a]"
              }`}
              style={isActive ? { background: meta.color } : {}}
            >
              <Icon size={11} />
              {t.nav[key]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   SECTION ROW
───────────────────────────────────────── */
function SectionRow({ sectionKey, sectionData, content, meta, index, id }) {
  const [ref, visible] = useReveal(0.06);
  const isEven = index % 2 === 0;
  const Icon = meta.icon;

  if (!content) return null;

  return (
    <div
      id={id}
      ref={ref}
      className="grid lg:grid-cols-2 gap-0 items-stretch border-b border-gray-100 last:border-0 scroll-mt-36"
    >
      {/* ── Image Side ── */}
      <div
        className={`relative overflow-hidden min-h-[300px] lg:min-h-[480px] ${
          isEven ? "lg:order-1" : "lg:order-2"
        } transition-opacity duration-700 ${visible ? "opacity-100" : "opacity-0"}`}
      >
        {sectionData?.image && (
          <Image
            src={sectionData.image}
            alt={content.title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-700"
            unoptimized
          />
        )}
        {/* Color top bar */}
        <div className="absolute top-0 inset-x-0 h-[4px]" style={{ background: meta.color }} />

        {/* Section icon badge */}
        <div
          className="absolute top-6 right-6 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
          style={{ background: meta.color }}
        >
          <Icon size={20} color="white" />
        </div>

        {/* Label overlay */}
        <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
          <span className="inline-flex items-center gap-1.5 text-white text-xs font-bold uppercase tracking-widest">
            <div className="w-4 h-px bg-white/60" />
            {content.label}
          </span>
        </div>
      </div>

      {/* ── Content Side ── */}
      <div
        className={`flex flex-col justify-center px-10 py-14 lg:py-20 ${
          isEven ? "lg:order-2 bg-white" : "lg:order-1 bg-[#f7f7f7]"
        } transition-all duration-700 delay-100 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Label */}
        <Label text={content.label} visible={visible} color={meta.color} />

        {/* Title */}
        <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight mb-4">
          {content.title}
        </h3>

        {/* Description */}
        <p className="text-gray-500 text-[15px] leading-relaxed mb-8">{content.desc}</p>

        {/* Points */}
        <ul className="flex flex-col gap-3">
          {content.points.map((point, i) => (
            <li
              key={i}
              className={`flex items-start gap-3 transition-all duration-500 ${
                visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
              }`}
              style={{ transitionDelay: `${150 + i * 60}ms` }}
            >
              <span
                className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: meta.color + "20", border: `1.5px solid ${meta.color}40` }}
              >
                <Check size={9} color={meta.color} />
              </span>
              <span className="text-gray-700 text-sm font-medium leading-snug">{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   CTA BANNER
───────────────────────────────────────── */
function CtaBanner({ country, t }) {
  const [ref, visible] = useReveal(0.1);
  return (
    <div
      ref={ref}
      className={`py-20 px-6 bg-[#f7f7f7] border-b border-gray-100 transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-3xl mb-3 block">{country.flag}</span>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight mb-2">
            {country.name}
          </h3>
          <p className="text-gray-500 text-sm">{country.tagline}</p>
        </div>
        <Link
          href={country.ctaHref}
          className="shrink-0 inline-flex items-center gap-2 font-bold px-8 py-4 rounded-lg text-sm text-white transition-all active:scale-95 shadow-sm hover:opacity-90"
          style={{ background: country.color }}
        >
          {country.cta}
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   STATS STRIP
═══════════════════════════════════════ */
function StatsStrip({ data, t }) {
  const [ref, visible] = useReveal();

  return (
    <section ref={ref} className="relative py-28 px-6 overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0 z-0 opacity-10">
        <Image src={data.stats.backgroundImage} alt="" fill className="object-cover" unoptimized />
      </div>
      <div className="absolute top-0 inset-x-0 h-[3px] bg-[#C8102E] z-10" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className={`mb-14 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <Label text={t.stats.label} visible={visible} dark />
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            {t.stats.title}
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/8 rounded-2xl overflow-hidden border border-white/8">
          {data.stats.items.map((s, i) => (
            <div
              key={i}
              className={`bg-[#111] p-10 flex flex-col gap-2 transition-all duration-500 ${visible ? "opacity-100" : "opacity-0"}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <span className="text-5xl sm:text-6xl font-black text-white tracking-tighter leading-none">
                {s.value}
              </span>
              <span className="text-gray-400 text-xs font-semibold uppercase tracking-widest mt-2">
                {t.stats.items[i]}
              </span>
              <div className="w-6 h-0.5 bg-[#C8102E] mt-2" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,900&family=Tajawal:wght@400;700;800&display=swap');

  @keyframes fadein     { from { opacity: 0; } to { opacity: 1; } }
  @keyframes fadein-up  { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }

  .animate-fadein      { animation: fadein    0.6s ease both; }
  .animate-fadein-up   { animation: fadein-up 0.7s ease 0.1s both; }
  .animate-fadein-up2  { animation: fadein-up 0.7s ease 0.25s both; }

  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

  .scroll-mt-36 { scroll-margin-top: 9rem; }
`;