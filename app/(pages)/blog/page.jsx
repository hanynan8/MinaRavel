"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

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
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
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
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/* ═══════════════════════════════════════
   ROOT PAGE
═══════════════════════════════════════ */
export default function BlogsPage() {
  const data = useBlogsData();
  const { language: lang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("all");

  if (!data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400">
            Loading
          </span>
        </div>
      </div>
    );
  }

  const t = data.i18n[lang];
  const isRTL = lang === "ar";

  const filteredPosts =
    activeCategory === "all"
      ? data.posts
      : data.posts.filter((p) => p.category === activeCategory);

  const featuredPost = data.posts.find((p) => p.featured);
  const gridPosts = filteredPosts.filter((p) => !p.featured || activeCategory !== "all");

  return (
    <>
      <style>{STYLES}</style>
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className="min-h-screen bg-white text-[#0a0a0a] overflow-x-hidden"
        style={{ fontFamily: "'DM Sans', 'Tajawal', sans-serif" }}
      >
        <BlogHero data={data} t={t} />
        <CategoryFilter
          data={data}
          t={t}
          active={activeCategory}
          setActive={setActiveCategory}
        />
        {activeCategory === "all" && featuredPost && (
          <FeaturedPost post={featuredPost} t={t} lang={lang} />
        )}
        <PostsGrid posts={gridPosts} t={t} lang={lang} />
        <Newsletter data={data} t={t} />
      </div>
    </>
  );
}

/* ═══════════════════════════════════════
   HERO
═══════════════════════════════════════ */
function BlogHero({ data, t }) {
  return (
    <section className="relative min-h-[55vh] flex items-end overflow-hidden bg-[#f4f4f4]">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src={data.hero.backgroundImage}
          alt="blog hero"
          fill
          className="object-cover object-center"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-white to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20 pt-40 w-full">
        {/* Overline */}
        <div className="flex items-center gap-3 mb-6 animate-fadein">
          <div className="w-8 h-px bg-[#C8102E]" />
          <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#C8102E]">
            {t.hero.badge}
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[0.92] tracking-tighter max-w-2xl mb-6 animate-fadein-up">
          {t.hero.headline.split(",").map((chunk, i, arr) =>
            i === arr.length - 1 ? (
              <span key={i} className="text-[#C8102E]">
                {chunk}
              </span>
            ) : (
              <span key={i}>
                {chunk},<br />
              </span>
            )
          )}
        </h1>

        {/* Subheadline */}
        <p className="text-gray-500 text-lg max-w-xl leading-relaxed animate-fadein-up2">
          {t.hero.subheadline}
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   CATEGORY FILTER BAR
═══════════════════════════════════════ */
function CategoryFilter({ data, t, active, setActive }) {
  return (
    <div className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-4">
          {data.categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActive(cat.id)}
              className={`shrink-0 px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                active === cat.id
                  ? "bg-[#C8102E] text-white shadow-md shadow-red-900/20"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t.categories[cat.id]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   FEATURED POST — full-width editorial
═══════════════════════════════════════ */
function FeaturedPost({ post, t, lang }) {
  const [ref, visible] = useReveal();
  const postT = t.posts[post.id];

  return (
    <section ref={ref} className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <Label text={t.featured} visible={visible} />

        <Link
          href={`/blog/${post.slug}`}
          className={`group grid lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-gray-100 hover:border-[#C8102E]/30 hover:shadow-2xl hover:shadow-red-900/5 transition-all duration-500 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Image */}
          <div className="relative h-72 lg:h-auto overflow-hidden bg-gray-100">
            <Image
              src={post.image}
              alt={postT.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              unoptimized
            />
            {/* Color top bar */}
            <div
              className="absolute top-0 inset-x-0 h-[4px]"
              style={{ background: post.color }}
            />
            {/* Category badge */}
            <div className="absolute top-5 start-5">
              <span
                className="px-3 py-1 rounded-full text-white text-xs font-bold uppercase tracking-wider"
                style={{ background: post.color }}
              >
                {t.categories[post.category]}
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="p-10 lg:p-14 flex flex-col justify-center bg-white">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-xs text-gray-400 font-semibold">
                {formatDate(post.date, lang)}
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span className="text-xs text-gray-400 font-semibold">
                {post.readTime} {t.readTime}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight mb-5 group-hover:text-[#C8102E] transition-colors duration-200">
              {postT.title}
            </h2>

            <p className="text-gray-500 text-base leading-relaxed mb-8">
              {postT.excerpt}
            </p>

            <div className="flex items-center gap-2 text-sm font-bold text-[#C8102E]">
              {t.readMore}
              <ArrowRight size={14} />
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   POSTS GRID
═══════════════════════════════════════ */
function PostsGrid({ posts, t, lang }) {
  const [ref, visible] = useReveal();

  if (!posts.length) return null;

  return (
    <section ref={ref} className="py-16 px-6 bg-[#f7f7f7]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <PostCard
              key={post.id}
              post={post}
              t={t}
              lang={lang}
              visible={visible}
              delay={i * 70}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function PostCard({ post, t, lang, visible, delay }) {
  const postT = t.posts[post.id];

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-[#C8102E]/30 hover:shadow-xl hover:shadow-red-900/5 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-gray-100">
        <Image
          src={post.image}
          alt={postT.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />
        {/* Color accent top bar */}
        <div
          className="absolute top-0 inset-x-0 h-[3px]"
          style={{ background: post.color }}
        />
        {/* Category badge */}
        <div className="absolute top-4 start-4">
          <span
            className="px-2.5 py-1 rounded-full text-white text-[10px] font-bold uppercase tracking-wider"
            style={{ background: post.color }}
          >
            {t.categories[post.category]}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col gap-3 flex-1">
        {/* Meta */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-400 font-semibold">
            {formatDate(post.date, lang)}
          </span>
          <span className="w-0.5 h-0.5 rounded-full bg-gray-300" />
          <span className="text-[11px] text-gray-400 font-semibold">
            {post.readTime} {t.readTime}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-black text-[#0a0a0a] text-base leading-snug group-hover:text-[#C8102E] transition-colors duration-150">
          {postT.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-500 text-sm leading-relaxed flex-1 line-clamp-3">
          {postT.excerpt}
        </p>

        {/* Read more */}
        <div className="flex items-center gap-1 text-xs font-bold text-[#C8102E] mt-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200">
          {t.readMore} <ArrowRight size={12} />
        </div>
      </div>
    </Link>
  );
}

/* ═══════════════════════════════════════
   NEWSLETTER
═══════════════════════════════════════ */
function Newsletter({ data, t }) {
  const [ref, visible] = useReveal();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  }

  return (
    <section
      ref={ref}
      className="relative py-28 px-6 overflow-hidden bg-[#0a0a0a]"
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0 opacity-10">
        <Image
          src={data.newsletter.backgroundImage}
          alt=""
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      {/* Red top border */}
      <div className="absolute top-0 inset-x-0 h-[3px] bg-[#C8102E] z-10" />

      <div
        className={`relative z-10 max-w-2xl mx-auto text-center transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <Label text={t.newsletter.badge} visible={visible} dark centered />

        <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight mb-4">
          {t.newsletter.title}
        </h2>
        <p className="text-gray-400 text-base mb-10">
          {t.newsletter.subtitle}
        </p>

        {submitted ? (
          <div className="flex items-center justify-center gap-3 text-[#C8102E] font-bold text-lg">
            <Check size={20} color="#C8102E" />
            <span>Thank you!</span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.newsletter.placeholder}
              className="flex-1 bg-white/8 border border-white/10 text-white placeholder-gray-500 px-5 py-4 rounded-lg text-sm focus:outline-none focus:border-[#C8102E] transition-colors"
            />
            <button
              type="submit"
              className="bg-[#C8102E] text-white font-bold px-8 py-4 rounded-lg text-sm hover:bg-[#a50d24] transition-colors shadow-lg shadow-red-900/30 shrink-0"
            >
              {t.newsletter.cta}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   SHARED — Section Label
═══════════════════════════════════════ */
function Label({ text, visible, dark = false, centered = false }) {
  return (
    <div
      className={`flex items-center gap-2 mb-3 transition-all duration-500 ${
        centered ? "justify-center" : ""
      } ${visible ? "opacity-100" : "opacity-0"}`}
    >
      <div className="w-5 h-px bg-[#C8102E]" />
      <span
        className={`text-xs font-bold tracking-[0.2em] uppercase ${
          dark ? "text-gray-400" : "text-[#C8102E]"
        }`}
      >
        {text}
      </span>
      {centered && <div className="w-5 h-px bg-[#C8102E]" />}
    </div>
  );
}

/* ═══════════════════════════════════════
   INLINE SVG ICONS
═══════════════════════════════════════ */
function ArrowRight({ size = 16, color = "currentColor" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function Check({ size = 16, color = "currentColor" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6L9 17l-5-5" />
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

  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }

  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .start-4 { inset-inline-start: 1rem; }
  .start-5 { inset-inline-start: 1.25rem; }
`;