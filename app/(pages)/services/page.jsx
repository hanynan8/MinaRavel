"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

/* ─────────────────────────────────────────
   FETCH HOOK
───────────────────────────────────────── */
function useServicesData() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch("/api/data?collection=services")
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
function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
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
function Check({ size = 11 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="#C8102E" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

/* ─────────────────────────────────────────
   SHARED — Section Label
───────────────────────────────────────── */
function Label({ text, visible, dark = false }) {
  return (
    <div className={`flex items-center gap-2 mb-3 transition-all duration-500 ${visible ? "opacity-100" : "opacity-0"}`}>
      <div className="w-5 h-px bg-[#C8102E]" />
      <span className={`text-xs font-bold tracking-[0.2em] uppercase ${dark ? "text-gray-400" : "text-[#C8102E]"}`}>
        {text}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════
   ROOT PAGE
═══════════════════════════════════════ */
export default function ServicesPage() {
  const { language, isRTL } = useLanguage();
  const data = useServicesData();

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

  return (
    <>
      <style>{STYLES}</style>
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className="min-h-screen bg-white text-[#0a0a0a] overflow-x-hidden"
        style={{ fontFamily: "'DM Sans', 'Tajawal', sans-serif" }}
      >
        <HeroSection data={data} t={t} />
        <ServicesList data={data} t={t} />
        <StatsStrip  data={data} t={t} />
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
        <Image src={data.hero.backgroundImage} alt="services hero" fill className="object-cover object-center" priority unoptimized />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/88 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-white to-transparent" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20 pt-36 w-full">
        <div className="flex items-center gap-3 mb-5 animate-fadein">
          <div className="w-8 h-px bg-[#C8102E]" />
          <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#C8102E]">{t.hero.badge}</span>
        </div>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[0.92] tracking-tighter max-w-2xl mb-5 animate-fadein-up">
          {t.hero.headline.split(",").map((chunk, i, arr) =>
            i === arr.length - 1
              ? <span key={i} className="text-[#C8102E]">{chunk}</span>
              : <span key={i}>{chunk},<br /></span>
          )}
        </h1>
        <p className="text-gray-500 text-lg max-w-lg leading-relaxed animate-fadein-up2">{t.hero.subheadline}</p>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-bounce">
        <div className="w-px h-8 bg-gray-300" />
        <span className="text-[10px] tracking-[0.2em] uppercase text-gray-400 font-medium">Scroll</span>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   SERVICES LIST
═══════════════════════════════════════ */
function ServicesList({ data, t }) {
  const merged = data.services.map((svc) => ({
    ...svc,
    ...t.services[svc.id],
  }));
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col gap-0">
        {merged.map((svc, i) => (
          <ServiceRow key={svc.id} service={svc} index={i} />
        ))}
      </div>
    </section>
  );
}

function ServiceRow({ service, index }) {
  const [ref, visible] = useReveal(0.08);
  const isEven = index % 2 === 0;

  return (
    <div ref={ref} className={`grid lg:grid-cols-2 gap-0 items-stretch border-b border-gray-100 last:border-0`}>
      {/* Image side */}
      <div className={`relative overflow-hidden min-h-[340px] lg:min-h-[460px] ${isEven ? "lg:order-1" : "lg:order-2"} ${visible ? "opacity-100" : "opacity-0"} transition-opacity duration-700`}>
        <Image src={service.image} alt={service.title} fill className="object-cover hover:scale-105 transition-transform duration-700" unoptimized />
        <div className="absolute top-0 inset-x-0 h-[4px]" style={{ background: service.color }} />
        <div className="absolute bottom-6 right-6 w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
          <span className="text-white font-black text-xl leading-none">{String(index + 1).padStart(2, "0")}</span>
        </div>
      </div>

      {/* Content side */}
      <div className={`flex flex-col justify-center px-10 py-14 lg:py-20 ${isEven ? "lg:order-2 bg-white" : "lg:order-1 bg-[#f7f7f7]"} ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} transition-all duration-700 delay-100`}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-px" style={{ background: service.color }} />
          <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: service.color }}>{service.category}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight mb-4">{service.title}</h2>
        <p className="text-gray-500 text-[15px] leading-relaxed mb-8">{service.desc}</p>
        <ul className="flex flex-col gap-3 mb-10">
          {service.features.map((f, i) => (
            <li key={i} className="flex items-center gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full border-2 border-[#C8102E] flex items-center justify-center"><Check size={11} /></span>
              <span className="text-[#0a0a0a] text-sm font-medium">{f}</span>
            </li>
          ))}
        </ul>
        <div>
          <Link href={service.ctaHref}
            className="inline-flex items-center gap-2 font-bold px-7 py-3.5 rounded-lg text-sm text-white transition-all active:scale-95 shadow-sm"
            style={{ background: service.color }}
          >
            {service.cta}
            <ArrowRight size={13} />
          </Link>
        </div>
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
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">{t.stats.title}</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/8 rounded-2xl overflow-hidden border border-white/8">
          {data.stats.items.map((s, i) => (
            <div key={i}
              className={`bg-[#111] p-10 flex flex-col gap-2 transition-all duration-500 ${visible ? "opacity-100" : "opacity-0"}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <span className="text-5xl sm:text-6xl font-black text-white tracking-tighter leading-none">{s.value}</span>
              <span className="text-gray-400 text-xs font-semibold uppercase tracking-widest mt-2">{t.stats.items[i]}</span>
              <div className="w-6 h-0.5 bg-[#C8102E] mt-2" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,900&family=Tajawal:wght@400;700;800&display=swap');
  @keyframes fadein     { from { opacity: 0; } to { opacity: 1; } }
  @keyframes fadein-up  { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
  .animate-fadein      { animation: fadein    0.6s ease both; }
  .animate-fadein-up   { animation: fadein-up 0.7s ease 0.1s both; }
  .animate-fadein-up2  { animation: fadein-up 0.7s ease 0.25s both; }
`;