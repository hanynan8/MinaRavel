"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { use } from "react";
/* ─────────────────────────────────────────
   FETCH HOOK
───────────────────────────────────────── */
function useBlogsData() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch("/api/data?collection=blogs")
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
   DATE FORMATTER
───────────────────────────────────────── */
function formatDate(dateStr, lang) {
  const date = new Date(dateStr);
  const localeMap = { en: "en-US", ar: "ar-EG", es: "es-ES" };
  return date.toLocaleDateString(localeMap[lang] || "en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
}

/* ─────────────────────────────────────────
   TABLE OF CONTENTS BUILDER
───────────────────────────────────────── */
function buildTOC(sections) {
  return sections
    .filter((s) => s.type === "tip")
    .map((s) => ({ number: s.number, heading: s.heading }));
}

/* ═══════════════════════════════════════
   ROOT PAGE — receives { params: { id } }
═══════════════════════════════════════ */
export default function BlogPostPage({ params }) {
  const { id } = use(params);
  const data = useBlogsData();
  const { language: lang } = useLanguage();
  const [activeSection, setActiveSection] = useState(null);

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

  const t = data.i18n[lang];
  const isRTL = lang === "ar";

  // Find post meta
  const postMeta = data.posts.find((p) => p.id === id);
  // Find post content from i18n
  const postContent = t.posts[id] || t.posts[Object.keys(t.posts)[0]];

  if (!postMeta || !postContent) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-black mb-4">Post not found</h1>
          <Link href="/blog" className="text-[#C8102E] font-bold underline">
            {t.backToBlog}
          </Link>
        </div>
      </div>
    );
  }

  const toc = buildTOC(postContent.sections);
  const relatedPosts = data.posts
    .filter((p) => p.id !== id && p.category === postMeta.category)
    .slice(0, 3);

  return (
    <>
      <style>{STYLES}</style>
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className="min-h-screen bg-white text-[#0a0a0a] overflow-x-hidden"
        style={{ fontFamily: "'DM Sans', 'Tajawal', sans-serif" }}
      >
        <PostHero postMeta={postMeta} postContent={postContent} t={t} lang={lang} />

        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-[1fr_320px] gap-16 items-start">

            {/* ── MAIN CONTENT ── */}
            <article>
              {postContent.sections.map((section, i) => (
                <Section
                  key={i}
                  section={section}
                  postColor={postMeta.color}
                  onVisible={(num) => setActiveSection(num)}
                />
              ))}
            </article>

            {/* ── SIDEBAR ── */}
            <aside className="lg:sticky lg:top-24 flex flex-col gap-8">
              {toc.length > 0 && (
                <TOC toc={toc} t={t} activeSection={activeSection} />
              )}
              <CTACard />
            </aside>
          </div>
        </div>

        {relatedPosts.length > 0 && (
          <RelatedPosts posts={relatedPosts} t={t} lang={lang} data={data} />
        )}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════
   HERO
═══════════════════════════════════════ */
function PostHero({ postMeta, postContent, t, lang }) {
  return (
    <section className="relative overflow-hidden bg-[#0a0a0a]">
      {/* Background image */}
      <div className="absolute inset-0 z-0 opacity-20">
        <Image src={postMeta.image} alt="" fill className="object-cover" unoptimized />
      </div>
      {/* Top color bar */}
      <div
        className="absolute top-0 inset-x-0 h-[3px] z-10"
        style={{ background: postMeta.color }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-20 pb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 mb-8 animate-fadein">
          <Link
            href="/blog"
            className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 hover:text-white transition-colors"
          >
            {t.backToBlog}
          </Link>
          <span className="text-gray-600">/</span>
          <span
            className="text-xs font-bold tracking-[0.2em] uppercase"
            style={{ color: postMeta.color }}
          >
            {t.categories[postMeta.category]}
          </span>
        </div>

        {/* Category badge */}
        <div className="mb-5 animate-fadein">
          <span
            className="px-3 py-1.5 rounded-full text-white text-xs font-bold uppercase tracking-wider"
            style={{ background: postMeta.color }}
          >
            {t.categories[postMeta.category]}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight tracking-tighter mb-6 animate-fadein-up">
          {postContent.title}
        </h1>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-4 animate-fadein-up2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#C8102E] flex items-center justify-center">
              <span className="text-white text-xs font-black">E</span>
            </div>
            <span className="text-gray-400 text-sm font-semibold">
              {t.by} {postContent.author}
            </span>
          </div>
          <span className="text-gray-600">·</span>
          <span className="text-gray-400 text-sm font-semibold">
            {formatDate(postMeta.date, lang)}
          </span>
          <span className="text-gray-600">·</span>
          <span className="text-gray-400 text-sm font-semibold">
            {postMeta.readTime} {t.readTime}
          </span>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   SECTION RENDERER
═══════════════════════════════════════ */
function Section({ section, postColor, onVisible }) {
  const [ref, visible] = useReveal(0.2);

  useEffect(() => {
    if (visible && section.type === "tip") {
      onVisible(section.number);
    }
  }, [visible]);

  const baseAnim = `transition-all duration-700 ${
    visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
  }`;

  switch (section.type) {
    case "intro":
      return (
        <div ref={ref} className={`mb-10 ${baseAnim}`}>
          <p className="text-xl text-gray-600 leading-relaxed font-medium border-s-4 border-[#C8102E] ps-6">
            {section.text}
          </p>
        </div>
      );

    case "tip":
      return (
        <div
          ref={ref}
          id={`section-${section.number}`}
          className={`mb-10 ${baseAnim}`}
        >
          <div className="flex gap-5 items-start">
            {/* Number badge */}
            <div
              className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center mt-1"
              style={{ background: postColor + "18" }}
            >
              <span
                className="text-sm font-black"
                style={{ color: postColor }}
              >
                {section.number}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-black text-[#0a0a0a] mb-3 leading-snug">
                {section.heading}
              </h2>
              <p className="text-gray-600 leading-relaxed text-[15px]">
                {section.text}
              </p>
            </div>
          </div>
          <div className="mt-6 border-b border-gray-100" />
        </div>
      );

    case "image":
      return (
        <div ref={ref} className={`my-10 ${baseAnim}`}>
          <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-gray-100">
            <Image
              src={section.src}
              alt={section.caption || ""}
              fill
              className="object-cover"
              unoptimized
            />
            <div
              className="absolute top-0 inset-x-0 h-[3px]"
              style={{ background: postColor }}
            />
          </div>
          {section.caption && (
            <p className="text-center text-xs text-gray-400 font-medium mt-3 tracking-wide">
              {section.caption}
            </p>
          )}
        </div>
      );

    case "callout":
      return (
        <div
          ref={ref}
          className={`my-10 rounded-2xl p-6 sm:p-8 border ${baseAnim}`}
          style={{
            background: postColor + "08",
            borderColor: postColor + "30",
          }}
        >
          <div className="flex gap-4 items-start">
            <div
              className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5"
              style={{ background: postColor }}
            >
              <LightBulb size={14} color="white" />
            </div>
            <div>
              <h4
                className="font-black text-sm uppercase tracking-wider mb-2"
                style={{ color: postColor }}
              >
                {section.heading}
              </h4>
              <p className="text-gray-700 text-[15px] leading-relaxed">
                {section.text}
              </p>
            </div>
          </div>
        </div>
      );

    case "closing":
      return (
        <div
          ref={ref}
          className={`mt-12 mb-6 rounded-2xl bg-[#0a0a0a] p-8 sm:p-10 ${baseAnim}`}
        >
          <div
            className="w-8 h-[3px] mb-5"
            style={{ background: postColor }}
          />
          <p className="text-gray-300 text-base leading-relaxed mb-6">
            {section.text}
          </p>
          <Link
            href="/consultation"
            className="inline-flex items-center gap-2 font-bold text-white text-sm px-6 py-3 rounded-lg transition-colors"
            style={{ background: postColor }}
          >
            Free Consultation
            <ArrowRight size={14} />
          </Link>
        </div>
      );

    default:
      return null;
  }
}

/* ═══════════════════════════════════════
   TABLE OF CONTENTS
═══════════════════════════════════════ */
function TOC({ toc, t, activeSection }) {
  return (
    <div className="rounded-2xl border border-gray-100 overflow-hidden">
      <div className="bg-[#0a0a0a] px-5 py-4 flex items-center gap-2">
        <div className="w-1 h-4 bg-[#C8102E] rounded-full" />
        <span className="text-white text-xs font-bold uppercase tracking-widest">
          {t.tableOfContents}
        </span>
      </div>
      <nav className="p-2">
        {toc.map((item) => (
          <a
            key={item.number}
            href={`#section-${item.number}`}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
              activeSection === item.number
                ? "bg-[#C8102E]/8 text-[#C8102E]"
                : "text-gray-600 hover:bg-gray-50 hover:text-[#0a0a0a]"
            }`}
          >
            <span
              className={`shrink-0 text-[10px] font-black ${
                activeSection === item.number ? "text-[#C8102E]" : "text-gray-400"
              }`}
            >
              {item.number}
            </span>
            <span className="leading-snug line-clamp-2">{item.heading}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}

/* ═══════════════════════════════════════
   CTA SIDEBAR CARD
═══════════════════════════════════════ */
function CTACard() {
  return (
    <div className="rounded-2xl bg-[#C8102E] p-6 text-white">
      <div className="w-8 h-[3px] bg-white/40 mb-4" />
      <h3 className="font-black text-lg leading-tight mb-2">
        Need Help with Your Application?
      </h3>
      <p className="text-red-100 text-sm leading-relaxed mb-5">
        Our experts are ready to guide you through every step. Free 30-min consultation.
      </p>
      <Link
        href="/consultation"
        className="flex items-center justify-center gap-2 bg-white text-[#C8102E] font-bold text-sm py-3 px-5 rounded-lg hover:bg-red-50 transition-colors"
      >
        Book Free Consultation
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}

/* ═══════════════════════════════════════
   RELATED POSTS
═══════════════════════════════════════ */
function RelatedPosts({ posts, t, lang, data }) {
  const [ref, visible] = useReveal();

  return (
    <section ref={ref} className="py-20 px-6 bg-[#f7f7f7]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div
          className={`flex items-center gap-3 mb-10 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="w-5 h-px bg-[#C8102E]" />
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#C8102E]">
            {t.relatedPosts}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post, i) => {
            const postT = t.posts[post.id];
            if (!postT) return null;
            return (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className={`group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-[#C8102E]/30 hover:shadow-xl hover:shadow-red-900/5 transition-all duration-300 ${
                  visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="relative h-44 overflow-hidden bg-gray-100">
                  <Image
                    src={post.image}
                    alt={postT.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                  <div
                    className="absolute top-0 inset-x-0 h-[3px]"
                    style={{ background: post.color }}
                  />
                </div>
                <div className="p-5 flex flex-col gap-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-400 font-semibold">
                      {formatDate(post.date, lang)}
                    </span>
                    <span className="w-0.5 h-0.5 rounded-full bg-gray-300" />
                    <span className="text-[11px] text-gray-400 font-semibold">
                      {post.readTime} {t.readTime}
                    </span>
                  </div>
                  <h3 className="font-black text-[#0a0a0a] text-sm leading-snug group-hover:text-[#C8102E] transition-colors">
                    {postT.title}
                  </h3>
                  <div className="flex items-center gap-1 text-xs font-bold text-[#C8102E] mt-auto pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {t.readMore} <ArrowRight size={11} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   INLINE SVG ICONS
═══════════════════════════════════════ */
function ArrowRight({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function LightBulb({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21h6M12 3a6 6 0 0 1 6 6c0 2.5-1.5 4.5-3 6H9c-1.5-1.5-3-3.5-3-6a6 6 0 0 1 6-6z" />
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

  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .border-s-4  { border-inline-start-width: 4px; }
  .ps-6        { padding-inline-start: 1.5rem; }
`;