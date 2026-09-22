import React from 'react';
import { useCms } from '../../context/CmsContext';
import { ArrowLeft, Clock, ShieldCheck } from 'lucide-react';
import { renderRichContent } from '../../utils/renderRichContent';

interface CustomPageViewProps {
  slug: string;
}

export const CustomPageView: React.FC<CustomPageViewProps> = ({ slug }) => {
  const { customPages, navigate } = useCms();

  const page = customPages.find(p => p.slug === slug && p.isPublished) || customPages[0];

  return (
    <div id="custom-page-view" className="pt-28 pb-24 px-4 sm:px-6 bg-[#F8FAFC] min-h-screen text-slate-800">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button onClick={() => navigate('home')} className="hover:text-[#9A7B4F] transition-colors">
            Ana Sayfa
          </button>
          <span>/</span>
          <span className="text-[#9A7B4F] font-semibold">{page.title}</span>
        </div>

        {/* Title Header */}
        <div className="space-y-3 pb-6 border-b border-slate-200">
          <h1 className="text-3xl sm:text-4xl font-bold font-serif-heading text-slate-900 tracking-normal leading-[1.25]">
            {page.title}
          </h1>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#9A7B4F]" />
              Son Güncelleme: {page.updatedAt || '2026-01-01'}
            </span>
            <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Yürürlükte
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 sm:p-10">
          <div
            className="prose max-w-none text-slate-700 leading-relaxed text-sm sm:text-base space-y-4"
            dangerouslySetInnerHTML={{ __html: renderRichContent(page.content, { theme: 'light' }) }}
          />
        </div>

        {/* Back Link */}
        <div>
          <button
            onClick={() => navigate('home')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#9A7B4F] hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Ana Sayfaya Geri Dön</span>
          </button>
        </div>
      </div>
    </div>
  );
};
