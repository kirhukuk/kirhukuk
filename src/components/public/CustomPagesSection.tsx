import React from 'react';
import { useCms } from '../../context/CmsContext';
import { FileText, ArrowRight, ShieldCheck, Scale, ExternalLink } from 'lucide-react';
import { CustomPage } from '../../types';
import { stripToPlainText } from '../../utils/renderRichContent';

export const CustomPagesSection: React.FC = () => {
  const { customPages, navigate } = useCms();

  // Published and set to show on home
  const homePages = customPages.filter(
    page => page.isPublished && page.showOnHome !== false
  );

  if (homePages.length === 0) {
    return null;
  }

  const getPageIcon = (slug: string) => {
    if (slug.includes('kvkk') || slug.includes('veri') || slug.includes('gizlilik')) {
      return <ShieldCheck className="w-5 h-5 text-[#B94A26]" />;
    }
    if (slug.includes('yasal') || slug.includes('uyari') || slug.includes('arabulucu')) {
      return <Scale className="w-5 h-5 text-[#B94A26]" />;
    }
    return <FileText className="w-5 h-5 text-[#B94A26]" />;
  };

  const getCleanSummary = (page: CustomPage) => {
    if (page.summary && page.summary.trim()) {
      return page.summary;
    }
    return stripToPlainText(page.content, 140);
  };

  return (
    <section
      id="custom-pages-section"
      className="py-10 sm:py-14 bg-white border-b border-slate-200 relative overflow-hidden px-4 sm:px-6"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#B94A26]/10 border border-[#B94A26]/20 text-xs font-semibold text-[#B94A26]">
            <FileText className="w-3.5 h-3.5" />
            <span>Özel Sayfalar & Kurumsal Bilgilendirmeler</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif-heading text-slate-900 tracking-tight leading-[1.25]">
            Bilgilendirme ve Özel Sayfalarımız
          </h2>
          <p className="text-sm text-slate-600">
            Hukuk büromuz tarafından hazırlanan aydınlatma metinleri, kurumsal ilkeler ve özel bilgilendirme içeriklerini buradan inceleyebilirsiniz.
          </p>
        </div>

        {/* Cards Grid - Centered & Responsive */}
        <div className="flex flex-wrap justify-center gap-6">
          {homePages.map((page) => (
            <div
              key={page.id}
              onClick={() => navigate('page', page.slug)}
              className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] max-w-md p-6 rounded-2xl bg-white hover:bg-[#F8FAFC] border border-slate-200 hover:border-[#B94A26]/40 transition-all duration-300 shadow-xs hover:shadow-md group flex flex-col justify-between cursor-pointer"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-slate-200 flex items-center justify-center group-hover:scale-105 group-hover:border-[#B94A26]/30 transition-all">
                    {getPageIcon(page.slug)}
                  </div>
                  {page.badge ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#B94A26]/10 text-[#B94A26] border border-[#B94A26]/20">
                      {page.badge}
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                      Özel Sayfa
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold font-serif-heading text-slate-900 group-hover:text-[#B94A26] transition-colors line-clamp-1">
                  {page.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {getCleanSummary(page)}
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#B94A26] group-hover:text-[#96381a] transition-colors">
                <span className="flex items-center gap-1.5">
                  <span>Sayfayı İncele</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#B94A26] transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
