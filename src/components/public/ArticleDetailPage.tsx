import React from 'react';
import { useCms } from '../../context/CmsContext';
import {
  Calendar,
  Clock,
  User,
  Share2,
  ArrowLeft,
  ArrowRight,
  ShieldAlert,
  Bookmark,
  MessageCircle
} from 'lucide-react';
import { renderRichContent } from '../../utils/renderRichContent';

interface ArticleDetailPageProps {
  slug: string;
}

export const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({ slug }) => {
  const { articles, settings, navigate } = useCms();

  const article = articles.find(a => a.slug === slug) || articles[0];
  const relatedArticles = articles.filter(a => a.id !== article.id && a.isPublished).slice(0, 3);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Makale bağlantısı panoya kopyalandı.');
    }
  };

  return (
    <div id="article-detail-page" className="pt-28 pb-24 px-4 sm:px-6 bg-[#F8FAFC] min-h-screen text-slate-800">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Navigation & Category */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => navigate('articles')}
            className="text-xs font-semibold text-slate-500 hover:text-[#9A7B4F] flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Tüm Makalelere Dön</span>
          </button>

          <span className="px-3 py-1 rounded-full bg-white border border-[#C5A880]/40 text-xs font-semibold text-[#9A7B4F] shadow-xs">
            {article.category}
          </span>
        </div>

        {/* Title & Metadata */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif-heading text-slate-900 tracking-normal leading-[1.25]">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-200 text-xs text-slate-500">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2 text-slate-900 font-medium">
                <User className="w-4 h-4 text-[#9A7B4F]" />
                {article.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#9A7B4F]" />
                {article.publishedAt}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#9A7B4F]" />
                {article.readTime}
              </span>
            </div>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Paylaş</span>
            </button>
          </div>
        </div>

        {/* Featured Image */}
        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md h-80 sm:h-[420px] relative bg-slate-100">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Summary Lead */}
        <div className="p-6 rounded-xl bg-white border border-slate-200 border-l-4 border-l-[#C5A880] text-slate-800 text-base sm:text-lg leading-relaxed italic shadow-xs">
          {article.summary}
        </div>

        {/* Article Body */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 sm:p-10">
          <div
            className="prose max-w-none text-slate-700 leading-relaxed text-base sm:text-lg space-y-4"
            dangerouslySetInnerHTML={{ __html: renderRichContent(article.content, { theme: 'light' }) }}
          />
        </div>

        {/* Mandatory Legal Disclaimer */}
        <div className="p-5 rounded-xl bg-amber-50/60 border border-amber-300 text-xs text-amber-900 flex items-start gap-3 mt-10">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p>
            <strong>Hukuki Sorumluluk Reddi Beyanı:</strong> Bu makale Türkiye Barolar Birliği Reklam Yasağı Yönetmeliği ve Avukatlık Kanunu çerçevesinde yalnızca genel bilgilendirme amacıyla kaleme alınmıştır. Somut olayın delil ve zaman aşımı durumuna göre hukuki sonuçlar farklılık gösterebilir. Herhangi bir hak kaybına uğramamak adına somut uyuşmazlığınız için avukat danışmanlığı almanız şarttır.
          </p>
        </div>

        {/* Consultation Callout */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-[#1C2E4A] to-[#0B132B] text-white border border-[#C5A880]/40 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl font-bold font-serif-heading text-white">
              Bu Konuda Hukuki Desteğe mi İhtiyacınız Var?
            </h3>
            <p className="text-xs text-slate-300">
              Dosyanızın detaylarını incelememiz için hemen avukatlarımızla iletişime geçin.
            </p>
          </div>
          <button
            onClick={() => navigate('contact')}
            className="px-6 py-3 rounded-xl gold-btn text-xs font-semibold uppercase tracking-wider shrink-0 shadow-lg"
          >
            Danışma Talebi Oluştur
          </button>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="pt-10 border-t border-slate-200 space-y-6">
            <h3 className="text-2xl font-bold font-serif-heading text-slate-900">
              İlginizi Çekebilecek Diğer Makaleler
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedArticles.map(rel => (
                <div
                  key={rel.id}
                  onClick={() => navigate('article-detail', rel.slug)}
                  className="bg-white border border-slate-200 hover:border-[#C5A880] shadow-sm rounded-xl overflow-hidden p-4 cursor-pointer group transition-all"
                >
                  <span className="text-[11px] text-[#9A7B4F] font-semibold block mb-1">
                    {rel.category}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#9A7B4F] transition-colors line-clamp-2">
                    {rel.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                    {rel.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
