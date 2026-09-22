import React, { useRef, useState, useEffect } from 'react';
import { useCms } from '../../context/CmsContext';
import {
  Calendar,
  Clock,
  User,
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  LayoutGrid
} from 'lucide-react';

export const ArticlesSection: React.FC = () => {
  const { articles, navigate } = useCms();
  const sliderRef = useRef<HTMLDivElement>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [viewMode, setViewMode] = useState<'slider' | 'grid'>('slider');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const publishedArticles = articles.filter(a => a.isPublished);
  const categories = ['all', ...Array.from(new Set(publishedArticles.map(a => a.category)))];

  const filtered =
    selectedCategory === 'all'
      ? publishedArticles
      : publishedArticles.filter(a => a.category === selectedCategory);

  const getCardStep = () => {
    if (!sliderRef.current) return 374;
    const first = sliderRef.current.firstElementChild as HTMLElement;
    if (!first) return 374;
    const gap = window.innerWidth < 640 ? 16 : 24;
    return first.offsetWidth + gap;
  };

  // Auto-scroll loop
  useEffect(() => {
    if (viewMode !== 'slider' || isPaused || filtered.length <= 1) return;

    const timer = setInterval(() => {
      if (!sliderRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 25) {
        sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        const step = getCardStep();
        sliderRef.current.scrollBy({ left: step, behavior: 'smooth' });
      }
    }, 4200);

    return () => clearInterval(timer);
  }, [viewMode, isPaused, filtered.length]);

  const checkScroll = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    const step = getCardStep();
    const index = Math.round(scrollLeft / step);
    setActiveIndex(Math.min(Math.max(0, index), filtered.length - 1));
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
  }, [filtered.length, viewMode, selectedCategory]);

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

  return (
    <section id="articles-section" className="py-8 sm:py-12 px-4 sm:px-6 bg-white border-b border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 relative z-10">
        {/* Centered Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2.5 sm:space-y-3 pb-4 border-b border-slate-200">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#B94A26]/10 border border-[#B94A26]/20 text-xs text-[#B94A26] font-semibold tracking-wide">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Hukuki Makale ve Yayınlar</span>
          </div>
          <h2 className="text-[28px] sm:text-[34px] md:text-[40px] font-bold font-serif-heading text-slate-900 tracking-tight leading-[1.25]">
            Hukuki Makaleler ve Güncel İçerikler
          </h2>
          <p className="text-slate-600 text-[15px] sm:text-[16px] leading-[1.7] max-w-2xl mx-auto">
            Yargıtay içtihatları, güncel mevzuat analizleri ve hukuki hak arama rehberleri.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('slider')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                  viewMode === 'slider'
                    ? 'bg-[#B94A26] text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Yatay Kaydırma (Sola Kaydır)"
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

            {/* Slider Navigation Arrows */}
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
                  aria-label="Önceki Makale"
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
                  aria-label="Sonraki Makale (Sola Kaydır)"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-2 pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#B94A26] text-white font-semibold shadow-xs'
                  : 'bg-white text-slate-700 hover:text-[#B94A26] hover:border-[#B94A26] border border-slate-200 shadow-2xs'
              }`}
            >
              {cat === 'all' ? 'Tüm Konular' : cat}
            </button>
          ))}
        </div>

        {/* Content: Horizontal Slider OR Grid */}
        {viewMode === 'slider' ? (
          <div className="relative">
            {/* Left & Right fade shadows */}
            {canScrollLeft && (
              <div className="absolute left-0 top-0 bottom-6 w-16 bg-gradient-to-r from-[#F8FAFC] to-transparent z-10 pointer-events-none hidden md:block" />
            )}
            {canScrollRight && (
              <div className="absolute right-0 top-0 bottom-6 w-16 bg-gradient-to-l from-[#F8FAFC] to-transparent z-10 pointer-events-none hidden md:block" />
            )}

            {/* Horizontal Track */}
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
              {filtered.map(article => (
                <article
                  key={article.id}
                  className="w-[calc(100vw-2.5rem)] sm:w-[350px] lg:w-[370px] shrink-0 snap-center sm:snap-start bg-white hover:bg-[#FCFBF9] border border-slate-200 hover:border-[#B94A26]/50 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group hover:-translate-y-0.5"
                >
                  <div>
                    <div className="relative h-48 overflow-hidden bg-slate-100">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded text-[11px] font-semibold text-[#B94A26] border border-slate-200 shadow-2xs">
                        {article.category}
                      </div>
                    </div>

                    <div className="p-5 sm:p-6 space-y-3">
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#B94A26]" />
                          {article.publishedAt}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#B94A26]" />
                          {article.readTime}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 font-serif-heading leading-snug group-hover:text-[#B94A26] transition-colors line-clamp-2">
                        {article.title}
                      </h3>

                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                        {article.summary}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 flex items-center gap-1.5 truncate max-w-[160px]">
                      <User className="w-3.5 h-3.5 text-[#B94A26] shrink-0" />
                      <span className="truncate">{article.author}</span>
                    </span>

                    <button
                      onClick={() => navigate('article-detail', article.slug)}
                      className="text-xs font-bold text-[#B94A26] hover:text-[#933718] flex items-center gap-1 group/link shrink-0 cursor-pointer"
                    >
                      <span>Yazıyı Oku</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {/* Slider Dots / Progress Bar */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1.5">
                {filtered.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => scrollToCard(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeIndex === idx
                        ? 'w-8 bg-[#B94A26]'
                        : 'w-2 bg-slate-200 hover:bg-slate-300'
                    }`}
                    aria-label={`Makale ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="hidden sm:inline">← Sola ve sağa kaydırın →</span>
                <span className="font-mono text-[#B94A26] font-semibold">
                  {activeIndex + 1} / {filtered.length}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filtered.map(article => (
              <article
                key={article.id}
                className="bg-white border border-slate-200 hover:border-[#B94A26]/50 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded text-[11px] font-semibold text-[#B94A26] border border-slate-200 shadow-2xs">
                      {article.category}
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 space-y-3">
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#B94A26]" />
                        {article.publishedAt}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#B94A26]" />
                        {article.readTime}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 font-serif-heading leading-snug group-hover:text-[#B94A26] transition-colors">
                      {article.title}
                    </h3>

                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                      {article.summary}
                    </p>
                  </div>
                </div>

                <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#B94A26]" />
                    {article.author}
                  </span>

                  <button
                    onClick={() => navigate('article-detail', article.slug)}
                    className="text-xs font-bold text-[#B94A26] hover:text-[#933718] flex items-center gap-1 group/link cursor-pointer"
                  >
                    <span>Yazıyı Oku</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
