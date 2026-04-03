"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

/* ─────────────────────────────────────────
   FETCH HOOK
───────────────────────────────────────── */
function useHomeData() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch("/api/data?collection=home")
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

/* ═══════════════════════════════════════
   ROOT PAGE
═══════════════════════════════════════ */
export default function HomePage() {
  const data = useHomeData();
  const { language: lang } = useLanguage();

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

  const t     = data.i18n[lang];
  const isRTL = lang === "ar";

  return (
    <>
      <style>{STYLES}</style>
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className="min-h-screen bg-white text-[#0a0a0a] overflow-x-hidden"
        style={{ fontFamily: "'DM Sans', 'Tajawal', sans-serif" }}
      >
        <Hero     data={data} t={t} />
        <Why      data={data} t={t} />
        <Services data={data} t={t} />
        <Stats    data={data} t={t} />
      </div>
    </>
  );
}

/* ═══════════════════════════════════════
   HERO
═══════════════════════════════════════ */
function Hero({ data, t }) {
  return (
    <section className="relative min-h-screen flex items-end overflow-hidden bg-[#f4f4f4]">
      {/* Full-bleed background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={data.hero.backgroundImage}
          alt="hero"
          fill
          className="object-cover object-center"
          priority
          unoptimized
        />
        {/* White fade left-to-right */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent" />
        {/* Bottom fade to white */}
        <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-white to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-28 pt-40 w-full">
        {/* Overline */}
        <div className="flex items-center gap-3 mb-6 animate-fadein">
          <div className="w-8 h-px bg-[#C8102E]" />
          <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#C8102E]">
            {t.hero.badge}
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[88px] font-black leading-[0.92] tracking-tighter max-w-3xl mb-8 animate-fadein-up">
          {t.hero.headline.split(",").map((chunk, i, arr) =>
            i === arr.length - 1 ? (
              <span key={i} className="text-[#C8102E]">{chunk}</span>
            ) : (
              <span key={i}>{chunk},<br /></span>
            )
          )}
        </h1>

        {/* Subheadline */}
        <p className="text-gray-500 text-lg max-w-lg mb-10 leading-relaxed animate-fadein-up2">
          {t.hero.subheadline}
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4 animate-fadein-up2">
          <Link
            href={data.hero.ctaConsultationHref}
            className="inline-flex items-center gap-2 bg-[#C8102E] text-white font-bold px-8 py-4 rounded-lg text-base hover:bg-[#a50d24] transition-colors shadow-lg shadow-red-900/20"
          >
            {t.hero.ctaConsultation}
            <ArrowRight size={16} />
          </Link>
          <Link
            href={data.hero.ctaApplyHref}
            className="inline-flex items-center gap-2 border-2 border-[#0a0a0a] text-[#0a0a0a] font-bold px-8 py-4 rounded-lg text-base hover:bg-[#0a0a0a] hover:text-white transition-all"
          >
            {t.hero.ctaApply}
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-bounce">
        <div className="w-px h-10 bg-gray-300" />
        <span className="text-[10px] tracking-[0.2em] uppercase text-gray-400 font-medium">Scroll</span>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   WHY SECTION
═══════════════════════════════════════ */
function Why({ data, t }) {
  const [ref, visible] = useReveal();

  return (
    <section ref={ref} className="py-28 px-6 bg-white">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">

        {/* Image */}
        <div
          className={`relative overflow-hidden rounded-2xl aspect-[4/3] transition-all duration-700 ease-out ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Image
            src={data.why.image}
            alt="Why Edumaster"
            fill
            className="object-cover"
            unoptimized
          />
          {/* Red accent bottom bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#C8102E]" />
        </div>

        {/* Content */}
        <div>
          <Label text="Why Us" visible={visible} />
          <h2
            className={`text-4xl sm:text-5xl font-black tracking-tight leading-tight mb-10 transition-all duration-700 delay-100 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {t.why.title}
          </h2>

          <ul className="flex flex-col divide-y divide-gray-100">
            {t.why.points.map((point, i) => (
              <li
                key={i}
                className={`flex items-center gap-5 py-4 transition-all duration-500 ${
                  visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
                }`}
                style={{ transitionDelay: `${150 + i * 70}ms` }}
              >
                <span className="shrink-0 w-7 h-7 rounded-full border-2 border-[#C8102E] flex items-center justify-center">
                  <Check size={12} color="#C8102E" />
                </span>
                <span className="text-gray-700 font-medium text-[15px] leading-snug">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   SERVICES
═══════════════════════════════════════ */
function Services({ data, t }) {
  const [ref, visible] = useReveal();

  const merged = data.services.items.map((item) => ({
    ...item,
    ...t.services.items[item.id],
  }));

  return (
    <section ref={ref} className="py-28 px-6 bg-[#f7f7f7]">
      <div className="max-w-7xl mx-auto">

        {/* Header row */}
        <div
          className={`flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div>
            <Label text="Our Services" visible={visible} />
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
              {t.services.title}
            </h2>
          </div>
          <Link
            href={data.services.ctaHref}
            className="inline-flex items-center gap-2 border-2 border-[#0a0a0a] text-[#0a0a0a] font-bold px-6 py-3 rounded-lg text-sm hover:bg-[#0a0a0a] hover:text-white transition-all shrink-0"
          >
            {t.services.cta}
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {merged.map((s, i) => (
            <ServiceCard key={s.id} service={s} visible={visible} delay={i * 70} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service, visible, delay }) {
  return (
    <Link
      href={service.href}
      className={`group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-[#C8102E]/30 hover:shadow-xl hover:shadow-red-900/5 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <Image
          src={service.image}
          alt={service.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />
        {/* Color accent top bar */}
        <div
          className="absolute top-0 inset-x-0 h-[3px]"
          style={{ background: service.color }}
        />
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col gap-3 flex-1">
        <h3 className="font-black text-[#0a0a0a] text-base leading-snug group-hover:text-[#C8102E] transition-colors duration-150">
          {service.title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed flex-1">
          {service.desc}
        </p>
        <div className="flex items-center gap-1 text-xs font-bold text-[#C8102E] mt-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200">
          Learn more <ArrowRight size={12} />
        </div>
      </div>
    </Link>
  );
}

/* ═══════════════════════════════════════
   STATS
═══════════════════════════════════════ */
function Stats({ data, t }) {
  const [ref, visible] = useReveal();

  const merged = data.stats.items.map((item, i) => ({
    ...item,
    label: t.stats.items[i],
  }));

  return (
    <section ref={ref} className="relative py-28 px-6 overflow-hidden bg-[#0a0a0a]">
      {/* Background image very subtle */}
      <div className="absolute inset-0 z-0 opacity-15">
        <Image
          src={data.stats.backgroundImage}
          alt=""
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      {/* Red top border */}
      <div className="absolute top-0 inset-x-0 h-[3px] bg-[#C8102E] z-10" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div
          className={`mb-14 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <Label text="Track Record" visible={visible} dark />
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            {t.stats.title}
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/8 rounded-2xl overflow-hidden border border-white/8">
          {merged.map((s, i) => (
            <div
              key={i}
              className={`bg-[#111] p-10 flex flex-col gap-2 transition-all duration-500 ${
                visible ? "opacity-100" : "opacity-0"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <span className="text-5xl sm:text-6xl font-black text-white tracking-tighter leading-none">
                {s.value}
              </span>
              <span className="text-gray-400 text-xs font-semibold uppercase tracking-widest mt-2">
                {s.label}
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
   SHARED — Section Label
═══════════════════════════════════════ */
function Label({ text, visible, dark = false }) {
  return (
    <div
      className={`flex items-center gap-2 mb-3 transition-all duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="w-5 h-px bg-[#C8102E]" />
      <span
        className={`text-xs font-bold tracking-[0.2em] uppercase ${
          dark ? "text-gray-400" : "text-[#C8102E]"
        }`}
      >
        {text}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════
   INLINE SVG ICONS — zero emoji
═══════════════════════════════════════ */
function ArrowRight({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
function Check({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
function Menu({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}
function X({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

/* ═══════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,900&family=Tajawal:wght@300;400;700;800&display=swap');

  @keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes fadein-up {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .animate-fadein      { animation: fadein    0.6s ease both; }
  .animate-fadein-up   { animation: fadein-up 0.7s ease 0.1s both; }
  .animate-fadein-up2  { animation: fadein-up 0.7s ease 0.25s both; }
`;