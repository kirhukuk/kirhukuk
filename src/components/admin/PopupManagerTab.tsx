import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { Sparkles, Save, CheckCircle2, Eye, Check } from 'lucide-react';
import { PopupModalConfig } from '../../types';
import { ImageInputWithPicker } from './ImageInputWithPicker';

export const PopupManagerTab: React.FC = () => {
  const { popupConfig, updatePopupConfig } = useCms();
  const [form, setForm] = useState<PopupModalConfig>({ ...popupConfig });
  const [saved, setSaved] = useState(false);

  const preMadeTemplates = [
    {
      name: '29 Ekim Cumhuriyet Bayramı',
      title: '29 Ekim Cumhuriyet Bayramımız Kutlu Olsun',
      message: 'Gazi Mustafa Kemal Atatürk ve silah arkadaşlarını saygı, minnet ve rahmetle anıyoruz. Cumhuriyetimizin 103. yılı kutlu olsun.',
      image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
      buttonText: 'Saygıyla Anıyoruz',
      buttonUrl: '/'
    },
    {
      name: 'Adli Tatil Duyurusu',
      title: 'Adli Tatil ve Büro Çalışma Düzeni',
      message: '20 Temmuz - 31 Ağustos tarihleri arasındaki adli tatil sürecinde acil işler, tutukluluk itirazları ve yürütmeyi durdurma talepleri için nöbetçi avukatlarımız görev başındadır.',
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
      buttonText: 'Nöbetçi Avukata Ulaşın',
      buttonUrl: '/iletisim'
    },
    {
      name: 'Ramazan Bayramı Tebriği',
      title: 'Hayırlı ve Huzurlu Bayramlar Dileriz',
      message: 'Mübarek Ramazan Bayramı’nın tüm müvekkillerimize, çalışma ortaklarımıza ve milletimize sağlık, huzur ve adalet getirmesini temenni ederiz.',
      image: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80',
      buttonText: 'Teşekkürler',
      buttonUrl: '/'
    }
  ];

  const handleApplyTemplate = (tmpl: typeof preMadeTemplates[0]) => {
    const updated = {
      ...form,
      title: tmpl.title,
      message: tmpl.message,
      image: tmpl.image,
      buttonText: tmpl.buttonText,
      buttonUrl: tmpl.buttonUrl,
      isActive: true
    };
    setForm(updated);
    updatePopupConfig(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePopupConfig(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold font-serif-heading text-white">
            Özel Gün, Tebrik & Karşılama Pop-up Yönetimi
          </h2>
          <p className="text-xs text-slate-400">
            Resmi bayramlar, adli tatil duyuruları veya önemli büro bildirimleri için açılır pencere (modal).
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl gold-btn text-xs font-bold flex items-center gap-2 shadow-lg"
        >
          <Save className="w-4 h-4" />
          <span>Ayarları Kaydet</span>
        </button>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 flex items-center gap-2 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Pop-up ayarları kaydedildi.</span>
        </div>
      )}

      {/* Quick Templates */}
      <div className="bg-[#1C2E4A] border border-white/10 rounded-2xl p-6 space-y-3 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#C5A880] flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>Hızlı Şablonlar</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {preMadeTemplates.map((tmpl, idx) => (
            <div
              key={idx}
              onClick={() => handleApplyTemplate(tmpl)}
              className="p-4 rounded-xl bg-[#0B132B] border border-white/10 hover:border-[#C5A880] cursor-pointer transition-all space-y-2 group"
            >
              <h4 className="text-xs font-bold text-white group-hover:text-[#C5A880]">
                {tmpl.name}
              </h4>
              <p className="text-[11px] text-slate-400 line-clamp-2">{tmpl.message}</p>
              <span className="text-[10px] text-[#C5A880] font-semibold block pt-1">
                Şablonu Yükle &rarr;
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Form */}
      <form noValidate onSubmit={handleSave} className="bg-[#1C2E4A] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#C5A880]">
            Pop-up İçeriği ve Gösterim Kuralları
          </h3>

          <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={e => setForm({ ...form, isActive: e.target.checked })}
              className="rounded bg-[#0B132B] border-white/20 text-[#C5A880] w-4 h-4"
            />
            <span className="font-semibold text-emerald-400">Pop-up Şu Anda Aktif</span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Pop-up Başlığı *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
            />
          </div>

          <div>
            <ImageInputWithPicker
              label="Karşılama Penceresi Görseli"
              value={form.image || ''}
              onChange={val => setForm({ ...form, image: val })}
              placeholder="https://... veya galeriden seçin"
              category="Genel"
              helperText="Özel gün veya karşılama kutusunun üstünde gösterilir."
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Açıklama Mesajı *</label>
          <textarea
            rows={3}
            required
            value={form.message}
            onChange={e => setForm({ ...form, message: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Buton Metni</label>
            <input
              type="text"
              value={form.buttonText}
              onChange={e => setForm({ ...form, buttonText: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Buton Bağlantısı (URL)</label>
            <input
              type="text"
              value={form.buttonUrl}
              onChange={e => setForm({ ...form, buttonUrl: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Gösterim Sıklığı</label>
            <select
              value={form.frequency}
              onChange={e => setForm({ ...form, frequency: e.target.value as any })}
              className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
            >
              <option value="once_per_session">Oturum Başına Bir Kez (Önerilen)</option>
              <option value="once_per_day">Günde Bir Kez</option>
              <option value="always">Her Sayfa Yenilemede</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <button
            type="submit"
            className="px-8 py-3 rounded-xl gold-btn text-xs font-bold flex items-center gap-2 shadow-xl"
          >
            <Save className="w-4 h-4" />
            <span>Pop-up Ayarlarını Kaydet</span>
          </button>
        </div>
      </form>
    </div>
  );
};
