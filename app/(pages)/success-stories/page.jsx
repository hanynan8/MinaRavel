"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

/* ─────────────────────────────────────────
   FETCH HOOK
───────────────────────────────────────── */
function useStoriesData() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch("/api/data?collection=successStories")
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
function Quote({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
    </svg>
  );
}
function Play({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
function Check({ size = 11, color = "#fff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
function Star({ size = 13, filled = true }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill={filled ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth={1.5}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
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
export default function SuccessStoriesPage() {
  const { language, isRTL } = useLanguage();
  const data = useStoriesData();

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
        <HeroSection   data={data} t={t} />
        <StatsStrip    data={data} t={t} />
        <Testimonials  data={data} t={t} />
        <Journeys      data={data} t={t} />
        <Approvals     data={data} t={t} />
        <VideoReviews  data={data} t={t} />
        <CtaBanner     t={t} />
      </div>
    </>
  );
}

/* ═══════════════════════════════════════
   HERO
═══════════════════════════════════════ */
function HeroSection({ data, t }) {
  return (
    <section className="relative min-h-[52vh] flex items-end overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image src={data.hero.backgroundImage} alt="success stories" fill
          className="object-cover object-center" priority unoptimized />
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
    </section>
  );
}

/* ═══════════════════════════════════════
   STATS STRIP (light — top of page)
═══════════════════════════════════════ */
function StatsStrip({ data, t }) {
  const [ref, visible] = useReveal();
  return (
    <section ref={ref} className="py-14 px-6 bg-[#f7f7f7] border-y border-gray-100">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 rounded-2xl overflow-hidden">
        {data.stats.items.map((s, i) => (
          <div
            key={i}
            className={`bg-white px-8 py-10 flex flex-col gap-1 transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <span className="text-4xl sm:text-5xl font-black text-[#0a0a0a] tracking-tighter leading-none">
              {s.value}
            </span>
            <span className="text-gray-400 text-xs font-semibold uppercase tracking-widest mt-1">
              {t.stats.items[i]}
            </span>
            <div className="w-5 h-0.5 bg-[#C8102E] mt-2" />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   TESTIMONIALS
═══════════════════════════════════════ */
function Testimonials({ data, t }) {
  const [ref, visible] = useReveal();
  const merged = data.testimonials.map((item) => ({
    ...item,
    ...t.testimonials[item.id],
  }));

  const TAG_COLORS = {
    university: "#a855f7",
    visa: "#10b981",
    career: "#3b82f6",
  };

  return (
    <section ref={ref} className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className={`mb-14 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <Label text={t.sections.testimonials} visible={visible} />
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
            {t.sections.testimonials}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {merged.map((item, i) => (
            <div
              key={item.id}
              className={`bg-[#f7f7f7] rounded-2xl p-7 flex flex-col gap-5 border border-gray-100 hover:border-[#C8102E]/20 hover:shadow-lg transition-all duration-300 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              {/* Quote icon */}
              <div className="text-[#C8102E]/15">
                <Quote size={32} />
              </div>

              {/* Stars */}
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} size={12} />)}
              </div>

              {/* Quote text */}
              <p className="text-gray-700 text-sm leading-relaxed flex-1 italic">"{item.quote}"</p>

              {/* Tag */}
              <span
                className="self-start text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full text-white"
                style={{ background: TAG_COLORS[item.type] ?? "#C8102E" }}
              >
                {item.tag}
              </span>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
                <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                  <Image src={item.avatar} alt={item.name} fill className="object-cover" unoptimized />
                </div>
                <div>
                  <p className="font-black text-sm text-[#0a0a0a]">{item.country} {item.name}</p>
                  <p className="text-gray-400 text-xs">{item.program}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   BEFORE & AFTER JOURNEYS
═══════════════════════════════════════ */
function Journeys({ data, t }) {
  const [ref, visible] = useReveal();
  const merged = data.journeys.map((j) => ({ ...j, ...t.journeys[j.id] }));

  return (
    <section ref={ref} className="py-24 px-6 bg-[#f7f7f7]">
      <div className="max-w-7xl mx-auto">
        <div className={`mb-14 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <Label text={t.sections.journeys} visible={visible} />
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight">{t.sections.journeys}</h2>
        </div>

        <div className="flex flex-col gap-5">
          {merged.map((j, i) => (
            <div
              key={j.id}
              className={`bg-white rounded-2xl border border-gray-100 overflow-hidden grid lg:grid-cols-[auto_1fr_1fr] gap-0 transition-all duration-500 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* Avatar + name */}
              <div className="flex flex-col items-center justify-center gap-3 px-8 py-8 border-b lg:border-b-0 lg:border-r border-gray-100">
                <div className="relative w-16 h-16 rounded-full overflow-hidden ring-4" style={{ ringColor: j.color }}>
                  <Image src={j.avatar} alt={j.name} fill className="object-cover" unoptimized />
                </div>
                <div className="text-center">
                  <p className="font-black text-sm">{j.country} {j.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{j.program}</p>
                  <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-widest text-white px-3 py-1 rounded-full bg-[#0a0a0a]">
                    {j.duration}
                  </span>
                </div>
              </div>

              {/* Before */}
              <div className="px-8 py-8 border-b lg:border-b-0 lg:border-r border-gray-100">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">Before</p>
                <p className="text-gray-500 text-sm leading-relaxed">{j.before}</p>
              </div>

              {/* After */}
              <div className="px-8 py-8 relative">
                <div className="absolute top-0 inset-x-0 h-[3px]" style={{ background: j.color }} />
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: j.color }}>After</p>
                <p className="text-gray-700 text-sm leading-relaxed font-medium">{j.after}</p>
                <span className="inline-block mt-4 text-lg">{j.flag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   VISA & UNIVERSITY APPROVALS
═══════════════════════════════════════ */
function Approvals({ data, t }) {
  const [ref, visible] = useReveal();
  const ta = t.approvals;

  return (
    <section ref={ref} className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className={`mb-14 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <Label text={t.sections.approvals} visible={visible} />
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-3">{ta.title}</h2>
          <p className="text-gray-500 max-w-xl text-[15px] leading-relaxed">{ta.desc}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ta.items.map((item, i) => {
            const isVisa = item.type === "visa";
            const color  = isVisa ? "#10b981" : "#a855f7";
            const label  = isVisa ? ta.visaLabel : ta.uniLabel;
            return (
              <div
                key={i}
                className={`rounded-2xl border p-5 flex items-center gap-4 transition-all duration-500 hover:shadow-md ${
                  visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{ borderColor: color + "30", background: color + "06", transitionDelay: `${i * 60}ms` }}
              >
                {/* Icon */}
                <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: color }}>
                  <Check size={13} color="#fff" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color }}>
                    {label}
                  </p>
                  <p className="font-black text-sm text-[#0a0a0a] truncate">{item.country} {item.name}</p>
                  <p className="text-gray-400 text-xs truncate">{item.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   VIDEO REVIEWS
═══════════════════════════════════════ */
function VideoReviews({ data, t }) {
  const [ref, visible] = useReveal();
  const tv = t.videos;
  const merged = data.videos.map((v) => ({ ...v, ...tv[v.id] }));

  return (
    <section ref={ref} className="py-24 px-6 bg-[#f7f7f7]">
      <div className="max-w-7xl mx-auto">
        <div className={`mb-14 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <Label text={t.sections.videos} visible={visible} />
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-3">{tv.title}</h2>
          <p className="text-gray-500 max-w-xl text-[15px]">{tv.desc}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {merged.map((v, i) => (
            <div
              key={v.id}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-xl ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {/* Thumbnail */}
              <div className="relative aspect-[4/3]">
                <Image src={v.thumbnail} alt={v.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />

                {/* Color top bar */}
                <div className="absolute top-0 inset-x-0 h-[3px]" style={{ background: v.color }} />

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/60 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <Play size={20} />
                  </div>
                </div>

                {/* Duration badge */}
                <span className="absolute bottom-3 right-3 text-[10px] font-bold text-white bg-black/50 backdrop-blur-sm px-2 py-1 rounded-md">
                  {v.duration}
                </span>

                {/* Country */}
                <span className="absolute top-3 left-3 text-xl">{v.country}</span>
              </div>

              {/* Info */}
              <div className="bg-white px-5 py-4">
                <p className="font-black text-sm text-[#0a0a0a]">{v.name}</p>
                <p className="text-gray-400 text-xs mt-0.5">{v.program}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   CTA BANNER
═══════════════════════════════════════ */
function CtaBanner({ t }) {
  const [ref, visible] = useReveal();
  return (
    <section ref={ref} className="relative py-28 px-6 overflow-hidden bg-[#0a0a0a]">
      <div className="absolute top-0 inset-x-0 h-[3px] bg-[#C8102E]" />
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <div className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight mb-4">
            {t.cta.title}
          </h2>
          <p className="text-gray-400 text-[15px] mb-10 leading-relaxed">{t.cta.desc}</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#C8102E] text-white font-bold px-8 py-4 rounded-lg text-base hover:bg-[#a50d24] transition-colors shadow-lg shadow-red-900/20"
          >
            {t.cta.button}
            <ArrowRight size={16} />
          </Link>
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
  @keyframes fadein    { from { opacity: 0; } to { opacity: 1; } }
  @keyframes fadein-up { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
  .animate-fadein     { animation: fadein    0.6s ease both; }
  .animate-fadein-up  { animation: fadein-up 0.7s ease 0.1s both; }
  .animate-fadein-up2 { animation: fadein-up 0.7s ease 0.25s both; }
`;