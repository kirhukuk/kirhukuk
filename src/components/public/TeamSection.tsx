import React, { useRef, useState, useEffect } from 'react';
import { useCms } from '../../context/CmsContext';
import {
  Mail,
  ArrowRight,
  Linkedin,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  LayoutGrid
} from 'lucide-react';

export const TeamSection: React.FC = () => {
  const { teamMembers, navigate } = useCms();
  const sliderRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [viewMode, setViewMode] = useState<'slider' | 'grid'>('slider');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const activeTeam = [...teamMembers]
    .filter(t => t.isActive)
    .sort((a, b) => a.order - b.order);

  const getCardStep = () => {
    if (!sliderRef.current) return 324;
    const first = sliderRef.current.firstElementChild as HTMLElement;
    if (!first) return 324;
    const gap = window.innerWidth < 640 ? 16 : 24;
    return first.offsetWidth + gap;
  };

  // Auto-scroll loop
  useEffect(() => {
    if (viewMode !== 'slider' || isPaused || activeTeam.length <= 1) return;

    const timer = setInterval(() => {
      if (!sliderRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 25) {
        sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        const step = getCardStep();
        sliderRef.current.scrollBy({ left: step, behavior: 'smooth' });
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [viewMode, isPaused, activeTeam.length]);

  const checkScroll = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    const step = getCardStep();
    const index = Math.round(scrollLeft / step);
    setActiveIndex(Math.min(Math.max(0, index), activeTeam.length - 1));
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
  }, [activeTeam.length, viewMode]);

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
    <section id="team-section" className="py-8 sm:py-12 px-4 sm:px-6 bg-white border-b border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 relative z-10">
        {/* Centered Header with Nav Controls */}
        <div className="text-center max-w-3xl mx-auto space-y-2.5 sm:space-y-3 pb-4 border-b border-slate-100">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#B94A26]/10 border border-[#B94A26]/20 text-xs text-[#B94A26] font-semibold tracking-wide">
            <span>Hukuk ve Danışman Kadromuz</span>
          </div>
          <h2 className="text-[28px] sm:text-[34px] md:text-[40px] font-bold font-serif-heading text-slate-900 tracking-tight leading-[1.25]">
            Ekibimiz & Avukat Kadromuz
          </h2>
          <p className="text-slate-600 text-[15px] sm:text-[16px] leading-[1.7] max-w-2xl mx-auto">
            Müvekkillerimizin haklarını korumak ve tüm hukuki süreçleri titizlikle yürütmek için birlikte çalışan yetkin avukat ve danışman kadromuz.
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
                  aria-label="Önceki Avukat"
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
                  aria-label="Sonraki Avukat (Sola Kaydır)"
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
              {activeTeam.map(member => (
                <div
                  key={member.id}
                  id={`team-card-${member.id}`}
                  className="w-[calc(100vw-2.5rem)] sm:w-[310px] shrink-0 snap-center sm:snap-start bg-white hover:bg-[#FCFBF9] border border-slate-200 hover:border-[#B94A26]/50 rounded-xl overflow-hidden transition-all duration-300 group flex flex-col justify-between shadow-2xs hover:shadow-sm hover:-translate-y-0.5"
                >
                  {/* Photo & Badge - Full Photo Visibility */}
                  <div className="relative h-64 sm:h-72 overflow-hidden bg-slate-100">
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent"></div>
                    <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded text-[10px] sm:text-[11px] text-[#B94A26] font-mono font-semibold shadow-2xs">
                      {member.barInfo ? (member.barInfo.includes('—') ? member.barInfo.split('—')[0]?.trim() : member.barInfo) : 'KIR HUKUK'}
                    </div>
                  </div>

                  {/* Info Body */}
                  <div className="p-3.5 sm:p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 font-serif-heading group-hover:text-[#B94A26] transition-colors truncate">
                        {member.name}
                      </h3>
                      <p className="text-[11px] text-[#B94A26] font-semibold tracking-wide uppercase">
                        {member.title}
                      </p>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mt-1">
                        {member.shortBio}
                      </p>

                      {/* Specialization Tags */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {member.specializations.slice(0, 2).map((spec, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="pt-2.5 mt-2 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="p-1.5 rounded text-slate-400 hover:text-[#B94A26] hover:bg-slate-100 transition-colors"
                            title={member.email}
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                        )}
                        {member.social?.linkedin && (
                          <a
                            href={member.social.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded text-slate-400 hover:text-[#B94A26] hover:bg-slate-100 transition-colors"
                            title="LinkedIn"
                          >
                            <Linkedin className="w-4 h-4" />
                          </a>
                        )}
                      </div>

                      <button
                        onClick={() => navigate('team-detail', member.id)}
                        className="text-xs font-bold text-[#B94A26] hover:text-[#933718] flex items-center gap-1 group/btn cursor-pointer"
                      >
                        <span>Özgeçmiş</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Slider Indicator Dots */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1.5">
                {activeTeam.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => scrollToCard(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeIndex === idx
                        ? 'w-8 bg-[#B94A26]'
                        : 'w-2 bg-slate-200 hover:bg-slate-300'
                    }`}
                    aria-label={`Avukat ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="hidden sm:inline">← Sola ve sağa kaydırın →</span>
                <span className="font-mono text-[#B94A26] font-semibold">
                  {activeIndex + 1} / {activeTeam.length}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Grid View fallback */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeTeam.map(member => (
              <div
                key={member.id}
                id={`team-card-${member.id}`}
                className="bg-white border border-slate-200 hover:border-[#B94A26]/50 rounded-xl overflow-hidden transition-all duration-300 group flex flex-col justify-between shadow-2xs hover:shadow-sm"
              >
                {/* Photo & Badge - Full Photo Visibility */}
                <div className="relative h-64 sm:h-72 overflow-hidden bg-slate-100">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent"></div>
                  <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded text-[10px] sm:text-[11px] text-[#B94A26] font-mono font-semibold shadow-2xs">
                    {member.barInfo ? (member.barInfo.includes('—') ? member.barInfo.split('—')[0]?.trim() : member.barInfo) : 'KIR HUKUK'}
                  </div>
                </div>

                <div className="p-3.5 sm:p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 font-serif-heading group-hover:text-[#B94A26] transition-colors truncate">
                      {member.name}
                    </h3>
                    <p className="text-[11px] text-[#B94A26] font-semibold tracking-wide uppercase">
                      {member.title}
                    </p>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mt-1">
                      {member.shortBio}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {member.specializations.slice(0, 2).map((spec, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2.5 mt-2 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="p-1.5 rounded text-slate-400 hover:text-[#B94A26] hover:bg-slate-100 transition-colors"
                          title={member.email}
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      )}
                      {member.social?.linkedin && (
                        <a
                          href={member.social.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded text-slate-400 hover:text-[#B94A26] hover:bg-slate-100 transition-colors"
                          title="LinkedIn"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    <button
                      onClick={() => navigate('team-detail', member.id)}
                      className="text-xs font-bold text-[#B94A26] hover:text-[#933718] flex items-center gap-1 group/btn cursor-pointer"
                    >
                      <span>Özgeçmiş</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
