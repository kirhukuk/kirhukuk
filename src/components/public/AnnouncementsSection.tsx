import React, { useRef, useState, useEffect } from 'react';
import { useCms } from '../../context/CmsContext';
import { Bell, Calendar, Pin, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export const AnnouncementsSection: React.FC = () => {
  const { announcements, navigate } = useCms();
  const sliderRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const activeAnnouncements = [...announcements]
    .filter(a => a.isActive)
    .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  const getCardStep = () => {
    if (!sliderRef.current) return 360;
    const first = sliderRef.current.firstElementChild as HTMLElement;
    if (!first) return 360;
    const gap = window.innerWidth < 640 ? 16 : 24;
    return first.offsetWidth + gap;
  };

  // Auto-scroll loop
  useEffect(() => {
    if (isPaused || activeAnnouncements.length <= 1) return;

    const timer = setInterval(() => {
      if (!sliderRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 25) {
        sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        const step = getCardStep();
        sliderRef.current.scrollBy({ left: step, behavior: 'smooth' });
      }
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused, activeAnnouncements.length]);

  const checkScroll = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
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
  }, [activeAnnouncements.length]);

  const scroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const step = getCardStep();
    const scrollAmount = direction === 'left' ? -step : step;
    sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  if (activeAnnouncements.length === 0) return null;

  return (
    <section id="announcements-section" className="py-10 sm:py-14 px-4 sm:px-6 bg-white border-b border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Centered Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 pb-6 border-b border-slate-200">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#B94A26]/10 border border-[#B94A26]/20 text-xs text-[#B94A26] font-semibold uppercase tracking-wider">
            <Bell className="w-3.5 h-3.5" />
            <span>Büro Bildirimleri</span>
          </div>
          <h2 className="text-3xl font-bold font-serif-heading text-slate-900 tracking-tight leading-[1.25]">
            Duyurular & Büro Bülteni
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto">
            Önemli adli duyurular ve çalışma saatleri bildirimleri. Sola kaydırarak inceleyebilirsiniz.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
                  canScrollLeft
                    ? 'bg-white border-slate-300 text-slate-700 hover:border-[#B94A26] hover:text-[#B94A26] shadow-xs'
                    : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                }`}
                aria-label="Önceki Duyuru"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
                  canScrollRight
                    ? 'bg-[#B94A26] border-[#B94A26] text-white hover:bg-[#96381a] shadow-xs'
                    : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                }`}
                aria-label="Sonraki Duyuru (Sola Kaydır)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => navigate('announcements')}
              className="text-xs font-semibold text-[#B94A26] hover:text-[#96381a] flex items-center gap-1 group ml-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:border-[#B94A26]/40 transition-colors"
            >
              <span>Tümünü Gör</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Horizontal Scrollable Announcements Track */}
        <div
          ref={sliderRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => {
            setTimeout(() => setIsPaused(false), 2000);
          }}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 scroll-smooth snap-x snap-mandatory hide-scrollbar -mx-4 px-5 sm:mx-0 sm:px-0"
        >
          {activeAnnouncements.map(item => (
            <div
              key={item.id}
              className={`w-[calc(100vw-2.5rem)] sm:w-[350px] shrink-0 snap-center sm:snap-start p-6 rounded-2xl border flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-xs ${
                item.isPinned
                  ? 'bg-white border-[#B94A26]/40'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#B94A26]" />
                    {item.date}
                  </span>
                  {item.isPinned && (
                    <span className="flex items-center gap-1 text-[#B94A26] bg-[#B94A26]/10 px-2 py-0.5 rounded text-[11px] font-semibold border border-[#B94A26]/20">
                      <Pin className="w-3 h-3" />
                      Sabit Duyuru
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-900 font-serif-heading line-clamp-1">
                  {item.title}
                </h3>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                  {item.content}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100">
                <button
                  onClick={() => navigate('announcements')}
                  className="text-xs text-[#B94A26] hover:text-[#96381a] font-semibold flex items-center gap-1"
                >
                  <span>Ayrıntıları Gör</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
