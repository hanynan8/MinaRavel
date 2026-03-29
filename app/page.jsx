'use client';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

// ─────────────────────────────────────────────
// 👇 ضع رابط اللوجو هنا — غيّره متى تشاء
const LOGO_URL = 'https://github.com/hanynan8/Chellange/blob/main/WhatsApp%20Image%202026-03-27%20at%208.01.50%20PM.jpeg?raw=true'; // مثال: '/logo.svg' أو 'https://...'
// ─────────────────────────────────────────────

export default function Home() {
  const { language, toggleLanguage, isRTL } = useLanguage();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeVehicle, setActiveVehicle] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetch('/api/data?collection=home')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(result => {
        console.log('API Response:', result);

        let extracted = null;

        if (result?.home?.[0]?.home?.[0]) {
          extracted = result.home[0].home[0];
        } else if (result?.home?.[0]) {
          extracted = result.home[0];
        } else if (result?.[0]?.home?.[0]) {
          extracted = result[0].home[0];
        } else if (result?.[0]) {
          extracted = result[0];
        } else if (result?.data?.home?.[0]?.home?.[0]) {
          extracted = result.data.home[0].home[0];
        } else if (result?.data?.home?.[0]) {
          extracted = result.data.home[0];
        } else if (result?.company) {
          extracted = result;
        }

        if (extracted && extracted.company) {
          setData(extracted);
        } else {
          throw new Error('Data structure mismatch - check console for details');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Hero slider auto-play
  useEffect(() => {
    if (!data?.heroSlider?.slides) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % data.heroSlider.slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [data]);

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toWesternNumerals = (str) => {
    if (!str) return '';
    const map = { '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4', '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9' };
    return str.replace(/[٠-٩]/g, d => map[d]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
          <span className="text-zinc-500 text-sm">جاري التحميل...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
        <div className="text-center">
          <span className="text-red-500 text-lg">خطأ في تحميل البيانات</span>
          {error && <p className="text-zinc-500 text-sm mt-2">{error}</p>}
        </div>
      </div>
    );
  }

  const lang = language; // 'ar' or 'en'

  const company     = data.company?.[lang]     || data.company?.ar     || {};
  const navigation  = data.navigation?.[lang]  || data.navigation?.ar  || [];
  const hero        = data.hero?.[lang]        || data.hero?.ar        || {};
  const heroSlider  = data.heroSlider?.slides  || [];
  const services    = data.services?.[lang]    || data.services?.ar    || {};
  const fleet       = data.fleet?.[lang]       || data.fleet?.ar       || {};
  const whyChooseUs = data.whyChooseUs?.[lang] || data.whyChooseUs?.ar || {};
  const testimonials= data.testimonials?.[lang]|| data.testimonials?.ar|| {};
  const cta         = data.cta?.[lang]         || data.cta?.ar         || {};
  const footer      = data.footer?.[lang]      || data.footer?.ar      || {};

  const phoneLink    = toWesternNumerals(company.phone);
  const whatsappLink = toWesternNumerals(company.whatsapp);

  return (
    <div className="min-h-screen bg-white" dir={isRTL ? 'rtl' : 'ltr'} style={{ fontFamily: isRTL ? "'Cairo', 'Tajawal', sans-serif" : "'Inter', 'Segoe UI', sans-serif" }}>

      {/* ── NAVBAR ── */}
      <header className="fixed w-full top-0 z-50 bg-white/95 backdrop-blur border-b border-zinc-100">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">

          {/* ── LOGO ── */}
          <a href="#home" className="flex items-center gap-2.5 flex-shrink-0">
            <img
              src={LOGO_URL}
              alt={company.name}
              className="h-11 sm:h-12 w-11 sm:w-12 object-cover rounded-full ring-2 ring-amber-400 ring-offset-1"
            />
          </a>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-5 lg:gap-8 flex-1 justify-center">
            {navigation.map((item, i) => (
              <li key={i}>
                <a href={item.link} className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors whitespace-nowrap">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Right side: lang toggle + CTA + burger */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">

            {/* Language Toggle Button */}
            <button
              onClick={toggleLanguage}
              title={language === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-200 hover:border-zinc-400 text-zinc-600 hover:text-zinc-900 transition-all text-xs sm:text-sm font-medium bg-white hover:bg-zinc-50"
            >
              {/* Globe icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <circle cx="12" cy="12" r="9" />
                <path d="M3.6 9h16.8M3.6 15h16.8M12 3a13.5 13.5 0 0 1 0 18M12 3a13.5 13.5 0 0 0 0 18" />
              </svg>
              <span className="leading-none">{language === 'ar' ? 'EN' : 'ع'}</span>
            </button>

            {/* Book now CTA */}
            <a
              href={`tel:${phoneLink}`}
              className="text-xs sm:text-sm bg-zinc-900 hover:bg-zinc-700 text-white px-4 sm:px-5 py-2 rounded-full transition-colors whitespace-nowrap"
            >
              {language === 'ar' ? 'احجز الآن' : 'Book Now'}
            </a>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(prev => !prev)}
              className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
              aria-label={language === 'ar' ? 'القائمة' : 'Menu'}
            >
              <span className={`block w-5 h-0.5 bg-zinc-700 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-5 h-0.5 bg-zinc-700 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-zinc-700 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </nav>

        {/* Mobile dropdown menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-96 border-t border-zinc-100' : 'max-h-0'}`}>
          <ul className="bg-white px-4 py-3 space-y-1">
            {navigation.map((item, i) => (
              <li key={i}>
                <a
                  href={item.link}
                  onClick={() => setMenuOpen(false)}
                  className="block text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 px-3 py-2.5 rounded-lg transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </header>
{/* ── HERO ── */}
      <section id="home" className="pt-16 min-h-screen flex flex-col justify-center relative overflow-hidden">

        {/* Background image */}
        <img
          src="https://cdn.jsdelivr.net/gh/MinaRavel12345/MinaWebsite@main/WhatsApp%20Image%202026-03-27%20at%207.59.35%20PM%20(3).jpeg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 grid md:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Text block */}
          <div className="text-white space-y-5 sm:space-y-6 order-2 md:order-1">
            <p className="text-amber-400 text-xs font-medium tracking-widest uppercase">
              {company.name}
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
              {hero.title}
            </h1>
            <p className="text-zinc-300 text-base sm:text-lg leading-relaxed max-w-md">
              {hero.subtitle}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="#fleet"
                className="bg-amber-400 hover:bg-amber-300 text-zinc-900 px-6 sm:px-7 py-3 rounded-full text-sm font-semibold transition-colors"
              >
                {hero.ctaButton}
              </a>
              <a
                href={`tel:${phoneLink}`}
                className="border border-white/40 hover:border-white text-white px-6 sm:px-7 py-3 rounded-full text-sm font-semibold transition-colors backdrop-blur-sm"
              >
                {hero.secondaryButton}
              </a>
            </div>

            {/* Stats */}
            {hero.stats && hero.stats.length > 0 && (
              <div className="flex flex-wrap gap-6 sm:gap-10 pt-6 border-t border-white/20">
                {hero.stats.map((stat, i) => (
                  <div key={i}>
                    <div className="text-xl sm:text-2xl font-bold text-amber-400">{stat.value}</div>
                    <div className="text-xs text-zinc-300 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Hero Slider */}
          {heroSlider.length > 0 && (
            <div className="relative order-1 md:order-2">
              <div
                className="relative overflow-hidden rounded-xl sm:rounded-2xl w-full"
                style={{ height: '360px' }}
              >
                {heroSlider.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                      index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                    }`}
                  >
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                    <img
                      src={slide.image}
                      alt={slide.ar?.title || ''}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 z-20 flex flex-col justify-end p-5 sm:p-8">
                      <span className="text-xs bg-amber-400 text-zinc-900 font-bold px-3 py-1 rounded-full inline-block self-start mb-2 sm:mb-3">
                        {slide.ar?.badge}
                      </span>
                      <h3 className="text-base sm:text-xl font-bold text-white mb-1">{slide.ar?.title}</h3>
                      <p className="text-zinc-300 text-xs sm:text-sm mb-2 sm:mb-3">{slide.ar?.description}</p>
                      <div className="flex items-baseline gap-3">
                        <span className="text-xl sm:text-2xl font-bold text-amber-400">
                          {slide.ar?.price} {slide.ar?.currency}
                        </span>
                        {slide.ar?.oldPrice && (
                          <span className="text-zinc-500 line-through text-xs sm:text-sm">{slide.ar.oldPrice}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dots */}
              <div className="flex gap-2 mt-3 sm:mt-4 justify-center">
                {heroSlider.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    aria-label={`الذهاب إلى الشريحة ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === currentSlide ? 'w-6 bg-amber-400' : 'w-1.5 bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── FLEET ── */}
      <section id="fleet" className="bg-zinc-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-10 sm:mb-12">
            <p className="text-amber-500 text-xs font-bold tracking-widest uppercase mb-2">أسطولنا</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900">{fleet.title}</h2>
            <p className="text-zinc-500 mt-2 text-sm sm:text-base">{fleet.subtitle}</p>
          </div>

          {fleet.vehicles && fleet.vehicles.length > 0 && (
            <>
              {/* Tabs — scrollable on small screens */}
              <div className="flex gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0"
                   style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {fleet.vehicles.map((v, i) => (
                  <button
                    key={v.id}
                    onClick={() => setActiveVehicle(i)}
                    className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                      activeVehicle === i
                        ? 'bg-zinc-900 text-white'
                        : 'bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-400'
                    }`}
                  >
                    <span>{v.icon}</span>
                    {v.name}
                  </button>
                ))}
              </div>

              {/* Active vehicle card */}
              {fleet.vehicles[activeVehicle] && (() => {
                const v = fleet.vehicles[activeVehicle];
                return (
                  <div className="rounded-xl sm:rounded-2xl overflow-hidden bg-white shadow-sm border border-zinc-100">
                    <div className="grid md:grid-cols-5">
                      {/* Image */}
<div className="md:col-span-3 h-56 sm:h-72 md:h-auto min-h-0 md:min-h-[320px] relative overflow-hidden">
  {v.image ? (
    <img
      src={v.image}
      alt={v.name}
      className="w-full h-full object-cover"
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center text-6xl sm:text-8xl"
         style={{ background: 'linear-gradient(135deg, #18181b 0%, #3f3f46 100%)' }}>
      {v.icon}
    </div>
  )}
  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-white via-transparent to-transparent hidden md:block" />
</div>
                      {/* Info */}
                      <div className="md:col-span-2 p-6 sm:p-10 flex flex-col justify-between">
                        <div>
                          <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{v.icon}</div>
                          <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 mb-2">{v.name}</h3>
                          <p className="text-zinc-500 text-sm leading-relaxed mb-4 sm:mb-6">{v.description}</p>
                          <div className="space-y-2 sm:space-y-3">
                            <div className="flex justify-between items-center py-2 sm:py-3 border-b border-zinc-100">
                              <span className="text-sm text-zinc-500">السعة</span>
                              <span className="text-sm font-semibold text-zinc-900">{v.capacity}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 sm:py-3 border-b border-zinc-100">
                              <span className="text-sm text-zinc-500">السعر</span>
                              <span className="text-base sm:text-lg font-bold text-amber-500">{v.price}</span>
                            </div>
                          </div>
                        </div>
                        <a
                          href={`tel:${phoneLink}`}
                          className="mt-6 sm:mt-8 block text-center bg-zinc-900 hover:bg-zinc-700 text-white py-3 rounded-full text-sm font-semibold transition-colors"
                        >
                          احجز هذه السيارة
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Thumbnail strip with scroll arrows */}
              <div className="relative mt-4">
                <button
                  onClick={() => scrollRef.current?.scrollBy({ left: -160, behavior: 'smooth' })}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow rounded-full w-8 h-8 flex items-center justify-center text-zinc-700 text-lg"
                  aria-label="تمرير لليسار"
                >
                  &#8249;
                </button>

                <div
                  ref={scrollRef}
                  className="flex gap-2 sm:gap-3 overflow-x-auto scroll-smooth px-10"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {fleet.vehicles.map((v, i) => (
<button
  key={v.id}
  onClick={() => setActiveVehicle(i)}
  aria-label={`عرض ${v.name}`}
  className={`flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg sm:rounded-xl overflow-hidden relative transition-all ${
    activeVehicle === i ? 'ring-2 ring-zinc-900 ring-offset-2' : 'opacity-60 hover:opacity-100'
  }`}
>
  {v.image ? (
    <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
  ) : (
    <div className="w-full h-full flex items-center justify-center text-2xl"
         style={{ background: 'linear-gradient(135deg,#18181b,#52525b)' }}>
      {v.icon}
    </div>
  )}
</button>
                  ))}
                </div>

                <button
                  onClick={() => scrollRef.current?.scrollBy({ left: 160, behavior: 'smooth' })}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow rounded-full w-8 h-8 flex items-center justify-center text-zinc-700 text-lg"
                  aria-label="تمرير لليمين"
                >
                  &#8250;
                </button>
              </div>
            </>
          )}
        </div>
      </section>

            {/* ── SERVICES ── */}
      <section id="services" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-10 sm:mb-12">
            <p className="text-amber-500 text-xs font-bold tracking-widest uppercase mb-2">خدماتنا</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900">{services.title}</h2>
            <p className="text-zinc-500 mt-2 max-w-xl text-sm sm:text-base">{services.subtitle}</p>
          </div>
          {services.items && services.items.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {services.items.map((s) => (
                <div
                  key={s.id}
                  className="group p-6 sm:p-8 rounded-xl sm:rounded-2xl border border-zinc-100 hover:border-amber-300 hover:bg-amber-50 transition-all duration-300"
                >
                  <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{s.icon}</div>
                  <h3 className="text-lg sm:text-xl font-bold text-zinc-900 mb-2">{s.name}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-4">{s.description}</p>
                  {s.features && s.features.length > 0 && (
                    <ul className="space-y-1.5">
                      {s.features.map((f, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-zinc-600">
                          <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs flex-shrink-0">✓</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>


      {/* ── WHY US ── */}
      <section id="about" className="py-16 sm:py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-10 sm:mb-12 text-center">
            <p className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-2">لماذا نحن</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">{whyChooseUs.title}</h2>
          </div>
          {whyChooseUs.features && whyChooseUs.features.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              {whyChooseUs.features.map((f) => (
                <div key={f.id} className="text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-zinc-800 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl mx-auto mb-3 sm:mb-4">
                    {f.icon}
                  </div>
                  <h3 className="text-white font-semibold mb-1 text-sm sm:text-base">{f.title}</h3>
                  <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-16 sm:py-24 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-10 sm:mb-12">
            <p className="text-amber-500 text-xs font-bold tracking-widest uppercase mb-2">آراء العملاء</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900">{testimonials.title}</h2>
          </div>
          {testimonials.reviews && testimonials.reviews.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {testimonials.reviews.map((r) => (
                <div key={r.id} className="bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl border border-zinc-100">
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(r.rating)].map((_, i) => (
                      <span key={i} className="text-amber-400 text-sm sm:text-base">★</span>
                    ))}
                  </div>
                  <p className="text-zinc-600 text-sm leading-relaxed mb-5 sm:mb-6">"{r.comment}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-zinc-900 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {r.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-zinc-900 text-sm">{r.name}</div>
                      <div className="text-xs text-zinc-400">{r.position}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 sm:py-24 bg-amber-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-900 mb-2">{cta.title}</h2>
            <p className="text-zinc-700 text-sm sm:text-base">{cta.subtitle}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto flex-shrink-0">
            <a
              href={`tel:${phoneLink}`}
              className="bg-zinc-900 hover:bg-zinc-700 text-white px-6 sm:px-7 py-3 rounded-full text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              📞 {cta.button}
            </a>
            <a
              href={`https://wa.me/${whatsappLink}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-zinc-100 text-zinc-900 px-6 sm:px-7 py-3 rounded-full text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              💬 {cta.whatsappButton}
            </a>
          </div>
        </div>
      </section>

      {/* ── {/* ── FOOTER ── */}
<footer id='contact' className='bg-zinc-950 text-white py-12 sm:py-16'>
  <div className='max-w-7xl mx-auto px-4 sm:px-6'>
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-10 sm:mb-12'>

      {/* Company info */}
      <div>
        <h3 className='text-base font-bold text-amber-400 mb-3 sm:mb-4'>{company.name}</h3>
        <p className='text-zinc-500 text-sm leading-relaxed mb-4'>{footer.description}</p>
        <div className='space-y-2 text-sm text-zinc-400'>

          <p><a href='tel:01273640711' className='hover:text-amber-400 transition-colors'>📞 01273640711</a></p>
          <p><a href='tel:01500038865' className='hover:text-amber-400 transition-colors'>📞 01500038865</a></p>
          <p><a href='tel:01027394820' className='hover:text-amber-400 transition-colors'>📞 01027394820</a></p>
          <p><a href='tel:01157443640' className='hover:text-amber-400 transition-colors'>📞 01157443640</a></p>

          <p><a href='https://www.facebook.com/share/1ATnxTiRbt/' target='_blank' rel='noopener noreferrer' className='hover:text-amber-400 transition-colors'>📘 صفحتنا على فيسبوك</a></p>

          <p><a href={`mailto:${company.email}`} className='hover:text-amber-400 transition-colors break-all'>📧 {company.email}</a></p>
          <p>📍 {company.location}</p>
        </div>
      </div>

      {/* Quick links */}
      <div>
        <h4 className='text-sm font-semibold text-zinc-300 mb-3 sm:mb-4'>{footer.quickLinks}</h4>
        <ul className='space-y-2'>
          {navigation.map((item, i) => (
            <li key={i}><a href={item.link} className='text-sm text-zinc-500 hover:text-amber-400 transition-colors'>{item.label}</a></li>
          ))}
        </ul>
      </div>

      {/* Services */}
      <div>
        <h4 className='text-sm font-semibold text-zinc-300 mb-3 sm:mb-4'>{footer.ourServices}</h4>
        {services.items && services.items.length > 0 && (
          <ul className='space-y-2'>
            {services.items.map((s) => (
              <li key={s.id}><a href='#services' className='text-sm text-zinc-500 hover:text-amber-400 transition-colors'>{s.icon} {s.name}</a></li>
            ))}
          </ul>
        )}
      </div>

      {/* Fleet */}
      <div>
        <h4 className='text-sm font-semibold text-zinc-300 mb-3 sm:mb-4'>أسطولنا</h4>
        {fleet.vehicles && fleet.vehicles.length > 0 && (
          <ul className='space-y-2'>
            {fleet.vehicles.map((v) => (
              <li key={v.id} className='text-sm text-zinc-500'>{v.icon} {v.name} — {v.capacity}</li>
            ))}
          </ul>
        )}
      </div>

    </div>

    <div className='border-t border-zinc-800 pt-6 sm:pt-8 text-center text-xs text-zinc-600'>
      {footer.copyright}
    </div>
  </div>
</footer>
    </div>
  );
}