import React, { useRef, useState, useEffect } from 'react';
import { useCms } from '../../context/CmsContext';
import {
  Scale,
  HeartHandshake,
  Briefcase,
  Building2,
  Home,
  FileText,
  Gavel,
  ShieldAlert,
  ScrollText,
  ShieldCheck,
  Landmark,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  LayoutGrid,
  Edit2
} from 'lucide-react';

export const PracticeAreasSection: React.FC = () => {
  const { practiceAreas, navigate, navigateToAdmin } = useCms();
  const sliderRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [viewMode, setViewMode] = useState<'slider' | 'grid'>('slider');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const activePractices = [...practiceAreas]
    .filter(p => p.isActive)
    .sort((a, b) => a.order - b.order);

  const getCardStep = () => {
    if (!sliderRef.current) return 380;
    const first = sliderRef.current.firstElementChild as HTMLElement;
    if (!first) return 380;
    const gap = window.innerWidth < 640 ? 16 : 24;
    return first.offsetWidth + gap;
  };

  // Auto-scroll loop
  useEffect(() => {
    if (viewMode !== 'slider' || isPaused || activePractices.length <= 1) return;

    const timer = setInterval(() => {
      if (!sliderRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 25) {
        sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        const step = getCardStep();
        sliderRef.current.scrollBy({ left: step, behavior: 'smooth' });
      }
    }, 3800);

    return () => clearInterval(timer);
  }, [viewMode, isPaused, activePractices.length]);

  const checkScroll = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    // Approximate active card index based on scroll position
    const step = getCardStep();
    const index = Math.round(scrollLeft / step);
    setActiveIndex(Math.min(Math.max(0, index), activePractices.length - 1));
  };

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [activePractices.length, viewMode]);

  const scroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const step = getCardStep();
    const scrollAmount = direction === 'left' ? -step : step;
    sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const scrollToCard = (index: number) => {
    if (!sliderRef.current) return;
    const step = getCardStep();
    sliderRef.current.scrollTo({ left: index * step, behavior: 'smooth' });
  };

  const getIcon = (iconName: string) => {
    const props = { className: 'w-6 h-6 text-[#C5A880]' };
    switch (iconName) {
      case 'Scale':
        return <Scale {...props} />;
      case 'HeartHandshake':
        return <HeartHandshake {...props} />;
      case 'Briefcase':
        return <Briefcase {...props} />;
      case 'Building2':
        return <Building2 {...props} />;
      case 'Home':
        return <Home {...props} />;
      case 'FileText':
        return <FileText {...props} />;
      case 'Gavel':
        return <Gavel {...props} />;
      case 'ShieldAlert':
        return <ShieldAlert {...props} />;
      case 'ScrollText':
        return <ScrollText {...props} />;
      case 'ShieldCheck':
        return <ShieldCheck {...props} />;
      case 'Landmark':
        return <Landmark {...props} />;
      default:
        return <Scale {...props} />;
    }
  };

  return (
    <section id="practice-areas-section" className="py-8 sm:py-12 px-4 sm:px-6 bg-white border-b border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 relative z-10">
        {/* Centered Header with Navigation Controls */}
        <div className="text-center max-w-3xl mx-auto space-y-2.5 sm:space-y-3 pb-4 border-b border-slate-100">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#B94A26]/10 border border-[#B94A26]/20 text-xs text-[#B94A26] font-semibold tracking-wide">
            <span>Uzmanlık Alanlarımız</span>
          </div>
          <h2 className="text-[28px] sm:text-[34px] md:text-[40px] font-bold font-serif-heading text-slate-900 tracking-tight leading-[1.25]">
            Hukuki Faaliyet ve Uzmanlık Alanlarımız
          </h2>
          <p className="text-slate-600 text-[15px] sm:text-[16px] leading-[1.7] max-w-2xl mx-auto">
            Müvekkillerimizin hukuki problemlerine derin mevzuat bilgisi, stratejik dava yönetimi ve yargı pratikleri ışığında çözüm üretiyoruz.
          </p>

          {/* Controls & View Switcher */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('slider')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                  viewMode === 'slider'
                    ? 'bg-[#B94A26] text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Yatay Kaydırma (Sola Kaydırma)"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Yatay Kaydır</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                  viewMode === 'grid'
                    ? 'bg-[#B94A26] text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Alt alta Izgara Görünümü"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Izgara</span>
              </button>
            </div>

            {/* Slider Navigation Arrows (only visible when in slider mode) */}
            {viewMode === 'slider' && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scroll('left')}
                  disabled={!canScrollLeft}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                    canScrollLeft
                      ? 'bg-white border-slate-300 text-slate-700 hover:border-[#B94A26] hover:text-[#B94A26] cursor-pointer shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed'
                  }`}
                  aria-label="Önceki Faaliyet Alanı"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => scroll('right')}
                  disabled={!canScrollRight}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                    canScrollRight
                      ? 'bg-[#B94A26] border-[#B94A26] text-white hover:bg-[#A33D1C] cursor-pointer shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed'
                  }`}
                  aria-label="Sonraki Faaliyet Alanı (Sola Kaydır)"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content: Horizontal Slider OR Grid */}
        {viewMode === 'slider' ? (
          <div className="relative">
            {/* Left fade shadow */}
            {canScrollLeft && (
              <div className="absolute left-0 top-0 bottom-6 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none hidden md:block" />
            )}

            {/* Right fade shadow */}
            {canScrollRight && (
              <div className="absolute right-0 top-0 bottom-6 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none hidden md:block" />
            )}

            {/* Horizontal Scrollable Track */}
            <div
              ref={sliderRef}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => {
                setTimeout(() => setIsPaused(false), 2000);
              }}
              className="flex gap-4 sm:gap-6 overflow-x-auto pb-8 pt-2 scroll-smooth snap-x snap-mandatory hide-scrollbar -mx-4 px-5 sm:mx-0 sm:px-0"
            >
              {activePractices.map((practice, index) => (
                <div
                  key={practice.id}
                  id={`practice-card-${practice.slug}`}
                  className="w-[calc(100vw-2.5rem)] sm:w-[350px] lg:w-[370px] shrink-0 snap-center sm:snap-start bg-white hover:bg-[#FCFBF9] border border-slate-200 hover:border-[#B94A26]/50 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between group shadow-xs hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="space-y-4">
                    {/* Header with Icon & Index Badge & Edit Button */}
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 text-[#B94A26] flex items-center justify-center group-hover:scale-105 transition-transform">
                        {getIcon(practice.icon)}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                          {String(index + 1).padStart(2, '0')} / {String(activePractices.length).padStart(2, '0')}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateToAdmin('practices', practice.id);
                          }}
                          className="p-1 rounded-md text-slate-400 hover:text-[#B94A26] hover:bg-[#B94A26]/10 transition-colors cursor-pointer"
                          title="Faaliyet Alanı İçeriğini Kontrol Panelinden Düzenle"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-slate-900 font-serif-heading group-hover:text-[#B94A26] transition-colors line-clamp-1">
                        {practice.title}
                      </h3>
                      <p className="text-slate-600 text-sm mt-2 leading-relaxed line-clamp-3">
                        {practice.shortDesc}
                      </p>
                    </div>

                    {/* Subservice Highlights */}
                    {practice.services && practice.services.length > 0 && (
                      <ul className="space-y-1.5 pt-3 border-t border-slate-100">
                        {practice.services.slice(0, 2).map((srv, idx) => (
                          <li key={idx} className="text-xs text-slate-500 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#B94A26] shrink-0"></span>
                            <span className="truncate">{srv}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Action Link */}
                  <div className="pt-6 mt-4 border-t border-slate-100">
                    <button
                      id={`practice-btn-${practice.slug}`}
                      onClick={() => navigate('practice-detail', practice.slug)}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-[#B94A26] hover:text-white text-slate-800 text-xs font-semibold tracking-wide flex items-center justify-between transition-all group-hover:border-[#B94A26]/30 border border-slate-200 cursor-pointer"
                    >
                      <span>Hizmet Kapsamını İncele</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Slider Dots / Progress Bar */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1.5">
                {activePractices.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => scrollToCard(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeIndex === idx
                        ? 'w-8 bg-[#B94A26]'
                        : 'w-2 bg-slate-200 hover:bg-slate-300'
                    }`}
                    aria-label={`Faaliyet Alanı ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="hidden sm:inline">← Sola ve sağa kaydırın →</span>
                <span className="font-mono text-[#B94A26] font-semibold">
                  {activeIndex + 1} / {activePractices.length}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Grid View fallback */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activePractices.map(practice => (
              <div
                key={practice.id}
                id={`practice-card-${practice.slug}`}
                className="bg-white hover:bg-[#FCFBF9] border border-slate-200 hover:border-[#B94A26]/50 rounded-xl p-6 transition-all duration-300 flex flex-col justify-between group shadow-xs"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 text-[#B94A26] flex items-center justify-center group-hover:scale-105 transition-transform">
                      {getIcon(practice.icon)}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateToAdmin('practices', practice.id);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-[#B94A26] hover:bg-[#B94A26]/10 transition-colors cursor-pointer"
                      title="Faaliyet Alanı İçeriğini Kontrol Panelinden Düzenle"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 font-serif-heading group-hover:text-[#B94A26] transition-colors">
                      {practice.title}
                    </h3>
                    <p className="text-slate-600 text-sm mt-2 leading-relaxed line-clamp-3">
                      {practice.shortDesc}
                    </p>
                  </div>
                  {practice.services && practice.services.length > 0 && (
                    <ul className="space-y-1.5 pt-2 border-t border-slate-100">
                      {practice.services.slice(0, 2).map((srv, idx) => (
                        <li key={idx} className="text-xs text-slate-500 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#B94A26]"></span>
                          <span className="truncate">{srv}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="pt-6 mt-4 border-t border-slate-100">
                  <button
                    id={`practice-btn-${practice.slug}`}
                    onClick={() => navigate('practice-detail', practice.slug)}
                    className="w-full py-2.5 px-4 rounded-lg bg-slate-50 hover:bg-[#B94A26] hover:text-white text-slate-800 text-xs font-semibold tracking-wide flex items-center justify-between transition-all border border-slate-200 cursor-pointer"
                  >
                    <span>Devamını Oku & Hizmet Kapsamı</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Contact Callout */}
        <div className="text-center pt-4">
          <p className="text-sm text-slate-600 mb-3">
            Farklı bir hukuki uyuşmazlığınız veya özel danışmanlık talebiniz mi var?
          </p>
          <button
            onClick={() => navigate('contact')}
            className="px-6 py-2.5 rounded-xl border border-[#B94A26] text-[#B94A26] hover:bg-[#B94A26] hover:text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs"
          >
            Avukatlarımızla Doğrudan İletişime Geçin
          </button>
        </div>
      </div>
    </section>
  );
};
