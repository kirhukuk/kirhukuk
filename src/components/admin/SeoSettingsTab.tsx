import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { Search, Save, CheckCircle2, Globe, FileCode, Check } from 'lucide-react';
import { SeoConfig } from '../../types';

export const SeoSettingsTab: React.FC = () => {
  const { seoConfig, updateSeoConfig } = useCms();
  const [form, setForm] = useState<SeoConfig>({ ...seoConfig });
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSeoConfig(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold font-serif-heading text-white">
            SEO & Arama Motoru Optimizasyonu
          </h2>
          <p className="text-xs text-slate-400">
            Google arama sonuçları, meta etiketler, Search Console ve Google Analytics entegrasyonları.
          </p>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl gold-btn text-xs font-bold flex items-center gap-2 shadow-lg"
        >
          <Save className="w-4 h-4" />
          <span>SEO Ayarlarını Kaydet</span>
        </button>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 flex items-center gap-2 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>SEO ayarları güncellendi.</span>
        </div>
      )}

      {/* Google Live Search Result Preview */}
      <div className="bg-[#1C2E4A] border border-white/10 rounded-2xl p-6 space-y-3 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#C5A880] flex items-center gap-2">
          <Globe className="w-4 h-4" />
          <span>Google Arama Sonucu Canlı Önizlemesi (SERP)</span>
        </h3>

        <div className="p-4 rounded-xl bg-[#202124] border border-white/10 space-y-1 font-sans">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-4 h-4 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-white">
              ⚖
            </span>
            <span className="text-[11px] text-slate-300">https://www.kirhukuk.com</span>
          </div>
          <h4 className="text-base text-[#8ab4f8] hover:underline cursor-pointer font-medium">
            {form.title || 'KIR HUKUK | Ceza, Şirketler ve Aile Hukuku Bürosu'}
          </h4>
          <p className="text-xs text-[#bdc1c6] leading-relaxed line-clamp-2">
            {form.description || 'Kır Hukuk Bürosu, ceza, şirketler, ticaret, gayrimenkul ve aile hukuku alanlarında Türkiye genelinde müvekkillerine stratejik avukatlık ve danışmanlık hizmeti sunar.'}
          </p>
        </div>
      </div>

      {/* Meta Tag Fields */}
      <div className="bg-[#1C2E4A] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#C5A880]">
          Meta Başlık & Açıklamalar
        </h3>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Meta Başlık (Title Tag - Önerilen: 50-60 karakter)
          </label>
          <input
            type="text"
            required
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
          />
          <span className="text-[10px] text-slate-400 block mt-1">
            Karakter sayısı: {form.title.length} / 60
          </span>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Meta Açıklama (Meta Description - Önerilen: 140-160 karakter)
          </label>
          <textarea
            rows={3}
            required
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
          />
          <span className="text-[10px] text-slate-400 block mt-1">
            Karakter sayısı: {form.description.length} / 160
          </span>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Anahtar Kelimeler (Keywords - Virgülle ayırın)
          </label>
          <input
            type="text"
            value={form.keywords}
            onChange={e => setForm({ ...form, keywords: e.target.value })}
            placeholder="hukuk bürosu, avukat, ceza avukatı, boşanma davası, şirketler hukuku"
            className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Sosyal Medya Paylaşım Görseli (Open Graph Image URL)
          </label>
          <input
            type="text"
            value={form.ogImage}
            onChange={e => setForm({ ...form, ogImage: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
          />
        </div>
      </div>

      {/* Analytics & Search Console */}
      <div className="bg-[#1C2E4A] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#C5A880]">
          Google Analytics & Doğrulama Kodları
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Google Analytics Takip Kodu (Örn: G-XXXXXXXXXX)
            </label>
            <input
              type="text"
              value={form.googleAnalyticsId}
              onChange={e => setForm({ ...form, googleAnalyticsId: e.target.value })}
              placeholder="G-1234567890"
              className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Google Search Console Doğrulama Meta Kodu
            </label>
            <input
              type="text"
              value={form.googleSearchConsoleVerification}
              onChange={e => setForm({ ...form, googleSearchConsoleVerification: e.target.value })}
              placeholder="google-site-verification=..."
              className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="px-8 py-3 rounded-xl gold-btn text-xs font-bold flex items-center gap-2 shadow-xl"
        >
          <Save className="w-4 h-4" />
          <span>SEO Ayarlarını Kaydet</span>
        </button>
      </div>
    </form>
  );
};
