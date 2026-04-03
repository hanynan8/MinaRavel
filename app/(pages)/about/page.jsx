"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

/* ─────────────────────────────────────────
   FETCH HOOK
───────────────────────────────────────── */
function useAboutData() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch("/api/data?collection=about")
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
function Check({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="#C8102E" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
function Target({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  );
}
function Eye({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
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
export default function AboutPage() {
  const { language, isRTL } = useLanguage();
  const data = useAboutData();

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
        <WhoWeAre      data={data} t={t} />
        <MissionVision data={data} t={t} />
        <WhyChooseUs   data={data} t={t} />
        <StatsStrip    data={data} t={t} />
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
        <Image src={data.hero.backgroundImage} alt="about hero" fill className="object-cover object-center" priority unoptimized />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/88 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-white to-transparent" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20 pt-36 w-full">
        <div className="flex items-center gap-3 mb-5 animate-fadein">
          <div className="w-8 h-px bg-[#C8102E]" />
          <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#C8102E]">{t.hero.badge}</span>
        </div>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[0.92] tracking-tighter max-w-2xl mb-5 animate-fadein-up">
          {t.hero.headline.split(" ").map((word, i, arr) =>
            i === arr.length - 1
              ? <span key={i} className="text-[#C8102E]"> {word}</span>
              : <span key={i}>{word} </span>
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
   WHO WE ARE
═══════════════════════════════════════ */
function WhoWeAre({ data, t }) {
  const [ref, visible] = useReveal();
  return (
    <section ref={ref} className="py-28 px-6 bg-white">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
        <div className={`relative overflow-hidden rounded-2xl aspect-[4/3] transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <Image src={data.whoWeAre.image} alt="Who We Are" fill className="object-cover" unoptimized />
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#C8102E]" />
          <div className="absolute top-6 left-6 bg-white rounded-xl px-4 py-3 shadow-lg">
            <p className="text-2xl font-black text-[#0a0a0a] leading-none">{data.whoWeAre.badge.value}</p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">{t.whoWeAre.badgeLabel}</p>
          </div>
        </div>
        <div>
          <Label text={t.whoWeAre.label} visible={visible} />
          <h2 className={`text-4xl sm:text-5xl font-black tracking-tight leading-tight mb-6 transition-all duration-700 delay-100 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            {t.whoWeAre.title}
          </h2>
          <div className={`space-y-4 transition-all duration-700 delay-150 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            {t.whoWeAre.paragraphs.map((p, i) => (
              <p key={i} className="text-gray-600 text-[15px] leading-relaxed">{p}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   MISSION & VISION
═══════════════════════════════════════ */
function MissionVision({ data, t }) {
  const [ref, visible] = useReveal();
  const cards = [
    { key: "mission", icon: <Target />, title: t.mission.title, body: t.mission.body, color: "#C8102E" },
    { key: "vision",  icon: <Eye />,    title: t.vision.title,  body: t.vision.body,  color: "#0a0a0a" },
  ];
  return (
    <section ref={ref} className="py-28 px-6 bg-[#f7f7f7]">
      <div className="max-w-7xl mx-auto">
        <div className={`mb-14 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <Label text={t.mvLabel} visible={visible} />
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">{t.mvTitle}</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {cards.map((card, i) => (
            <div key={card.key}
              className={`relative bg-white border border-gray-100 rounded-2xl p-10 overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-black/5 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="absolute top-0 inset-x-0 h-[3px]" style={{ background: card.color }} />
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: `${card.color}12`, color: card.color }}>
                {card.icon}
              </div>
              <h3 className="text-2xl font-black tracking-tight mb-3" style={{ color: card.color }}>{card.title}</h3>
              <p className="text-gray-600 text-[15px] leading-relaxed">{card.body}</p>
              <div className="absolute -bottom-4 -right-2 text-[120px] font-black leading-none opacity-[0.04] select-none pointer-events-none" style={{ color: card.color }}>
                {card.title.charAt(0)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   WHY CHOOSE US
═══════════════════════════════════════ */
function WhyChooseUs({ data, t }) {
  const [ref, visible] = useReveal();
  return (
    <section ref={ref} className="py-28 px-6 bg-white">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
        <div>
          <Label text={t.why.label} visible={visible} />
          <h2 className={`text-4xl sm:text-5xl font-black tracking-tight leading-tight mb-10 transition-all duration-700 delay-100 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            {t.why.title}
          </h2>
          <ul className="flex flex-col divide-y divide-gray-100">
            {t.why.points.map((point, i) => (
              <li key={i}
                className={`flex items-start gap-5 py-5 transition-all duration-500 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"}`}
                style={{ transitionDelay: `${150 + i * 80}ms` }}
              >
                <span className="shrink-0 mt-0.5 w-7 h-7 rounded-full border-2 border-[#C8102E] flex items-center justify-center">
                  <Check size={12} />
                </span>
                <div>
                  <p className="text-[#0a0a0a] font-bold text-[15px] leading-snug">{point.title}</p>
                  {point.desc && <p className="text-gray-500 text-sm mt-1 leading-relaxed">{point.desc}</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className={`relative overflow-hidden rounded-2xl aspect-[4/3] transition-all duration-700 delay-200 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <Image src={data.why.image} alt="Why Choose Edumaster" fill className="object-cover" unoptimized />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <p className="text-white font-black text-xl leading-snug drop-shadow-md">{t.why.imageCaption}</p>
          </div>
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#C8102E]" />
        </div>
      </div>
    </section>
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