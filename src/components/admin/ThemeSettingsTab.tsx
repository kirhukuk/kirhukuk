import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { Palette, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import { ThemeConfig } from '../../types';

export const ThemeSettingsTab: React.FC = () => {
  const { theme, updateTheme } = useCms();
  const [form, setForm] = useState<ThemeConfig>({ ...theme });
  const [saved, setSaved] = useState(false);

  const presets = [
    {
      name: 'KIR HUKUK Klasik (Koyu Lacivert & Şampanya Altını)',
      bg: '#0B132B',
      card: '#2B3E60',
      accent: '#304368',
      gold: '#C5A880'
    },
    {
      name: 'Prestij Bordo & Altın',
      bg: '#1A0B12',
      card: '#3D1E2A',
      accent: '#4C2836',
      gold: '#D4AF37'
    },
    {
      name: 'Asil Gece & Platin',
      bg: '#0D0E12',
      card: '#1F2430',
      accent: '#2B3242',
      gold: '#C0C0C0'
    },
    {
      name: 'Safir Zümrüt Hukuk',
      bg: '#071618',
      card: '#123035',
      accent: '#194046',
      gold: '#D8B26E'
    }
  ];

  const handleApplyPreset = (p: typeof presets[0]) => {
    const updated = {
      ...form,
      primaryBg: p.bg,
      secondaryBg: p.card,
      accentBg: p.accent,
      goldAccent: p.gold
    };
    setForm(updated);
    updateTheme(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateTheme(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold font-serif-heading text-white">
            Tema, Renk & Tipografi Ayarları
          </h2>
          <p className="text-xs text-slate-400">
            Web sitesinin genel renk paletini, kart tonlarını, vurgu renklerini ve kurumsal fontlarını özelleştirin.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl gold-btn text-xs font-bold flex items-center gap-2 shadow-lg"
        >
          <Palette className="w-4 h-4" />
          <span>Temayı Uygula</span>
        </button>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 flex items-center gap-2 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Tema başarıyla kaydedildi! Sitedeki tüm bileşenler yeni renklerle güncellendi.</span>
        </div>
      )}

      {/* Preset Palettes */}
      <div className="bg-[#1C2E4A] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#C5A880] flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>Hukuk Bürolarına Özel Hazır Renk Paletleri</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {presets.map((p, idx) => (
            <div
              key={idx}
              onClick={() => handleApplyPreset(p)}
              className="p-4 rounded-xl bg-[#0B132B] border border-white/10 hover:border-[#C5A880] cursor-pointer transition-all space-y-3 group"
            >
              <div className="flex items-center gap-1.5 h-8 rounded-lg overflow-hidden border border-white/10">
                <div className="flex-1 h-full" style={{ backgroundColor: p.bg }} title="Ana Arka Plan" />
                <div className="flex-1 h-full" style={{ backgroundColor: p.card }} title="Kart Rengi" />
                <div className="flex-1 h-full" style={{ backgroundColor: p.accent }} title="Vurgulu Kart" />
                <div className="w-6 h-full" style={{ backgroundColor: p.gold }} title="Vurgulu Altın" />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white group-hover:text-[#C5A880] transition-colors">
                  {p.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Color Pickers */}
      <form onSubmit={handleSave} className="bg-[#1C2E4A] border border-white/10 rounded-2xl p-6 space-y-6 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#C5A880]">
          Özel Renk Kodu Tanımlamaları (HEX)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Ana Arka Plan (Primary Dark)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.primaryBg}
                onChange={e => setForm({ ...form, primaryBg: e.target.value })}
                className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0"
              />
              <input
                type="text"
                value={form.primaryBg}
                onChange={e => setForm({ ...form, primaryBg: e.target.value })}
                className="flex-1 px-3 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Kart Arka Planı (Secondary Dark)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.secondaryBg}
                onChange={e => setForm({ ...form, secondaryBg: e.target.value })}
                className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0"
              />
              <input
                type="text"
                value={form.secondaryBg}
                onChange={e => setForm({ ...form, secondaryBg: e.target.value })}
                className="flex-1 px-3 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Vurgulu Kart Arka Planı (Accent Dark)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.accentBg}
                onChange={e => setForm({ ...form, accentBg: e.target.value })}
                className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0"
              />
              <input
                type="text"
                value={form.accentBg}
                onChange={e => setForm({ ...form, accentBg: e.target.value })}
                className="flex-1 px-3 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Altın Vurgu Rengi (Champagne Gold)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.goldAccent}
                onChange={e => setForm({ ...form, goldAccent: e.target.value })}
                className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0"
              />
              <input
                type="text"
                value={form.goldAccent}
                onChange={e => setForm({ ...form, goldAccent: e.target.value })}
                className="flex-1 px-3 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Font Family Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-white/5">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Başlık Yazı Tipi (Yüksek Okunurluk)
            </label>
            <select
              value={form.headingFont}
              onChange={e => setForm({ ...form, headingFont: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
            >
              <option value="'Plus Jakarta Sans', sans-serif">Plus Jakarta Sans (Önerilen - En Yüksek Okunurluk & Prestij)</option>
              <option value="'Lora', serif">Lora (Yüksek Okunurluk & Dengeli Serif)</option>
              <option value="'Merriweather', serif">Merriweather (Klasik & Güçlü Okunabilir Serif)</option>
              <option value="'Inter', sans-serif">Inter (Sade & Kurumsal)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Gövde Metin Yazı Tipi (Net Okunurluk)
            </label>
            <select
              value={form.bodyFont}
              onChange={e => setForm({ ...form, bodyFont: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
            >
              <option value="'Inter', sans-serif">Inter (Önerilen - Kusursuz Metin Okunurluğu)</option>
              <option value="'Plus Jakarta Sans', sans-serif">Plus Jakarta Sans (Modern & Ferah)</option>
            </select>
          </div>
        </div>

        {/* Live Preview Box */}
        <div className="p-6 rounded-xl border border-white/10 space-y-3" style={{ backgroundColor: form.primaryBg }}>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
            Canlı Önizleme Kutusu
          </span>
          <div className="p-5 rounded-xl border border-white/10 flex items-center justify-between" style={{ backgroundColor: form.secondaryBg }}>
            <div>
              <h4 className="text-base font-bold font-serif-heading text-white">
                KIR HUKUK DANIŞMANLIK
              </h4>
              <p className="text-xs text-slate-300 mt-1">
                Adalet, dürüstlük ve gizlilik ilkeleriyle müvekkillerimizin yanındayız.
              </p>
            </div>
            <button
              type="button"
              className="px-4 py-2 rounded-lg font-bold text-xs"
              style={{ backgroundColor: form.goldAccent, color: form.primaryBg }}
            >
              Örnek Buton
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-8 py-3 rounded-xl gold-btn text-xs font-bold flex items-center gap-2 shadow-xl"
          >
            <Palette className="w-4 h-4" />
            <span>Yeni Renk ve Fontları Kaydet</span>
          </button>
        </div>
      </form>
    </div>
  );
};
