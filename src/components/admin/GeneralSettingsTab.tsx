import React, { useState, useEffect } from 'react';
import { useCms } from '../../context/CmsContext';
import {
  Save,
  CheckCircle2,
  Shield,
  Globe,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Scale,
  Image as ImageIcon,
  TrendingUp,
  Plus,
  Trash2,
  Sparkles,
  RotateCcw,
  SlidersHorizontal,
  Eye,
  EyeOff,
  Layout,
  Users,
  FileText,
  Wrench,
  Type
} from 'lucide-react';
import { SiteSettings, HeroStatItem } from '../../types';
import { ImageInputWithPicker } from './ImageInputWithPicker';

const defaultHeroStats: HeroStatItem[] = [
  { id: 'stat-1', value: '20+', label: 'Yıllık Mesleki Tecrübe', highlight: false, isActive: true },
  { id: 'stat-2', value: '3.500+', label: 'Tamamlanan Dava & Dosya', highlight: false, isActive: true },
  { id: 'stat-3', value: '11', label: 'Hukuki Uzmanlık Alanı', highlight: false, isActive: true },
  { id: 'stat-4', value: '%98', label: 'Müvekkil Memnuniyeti', highlight: true, isActive: true }
];

const MODULE_METADATA: Record<
  string,
  { turkishName: string; turkishTitle: string; subtitle: string; desc: string }
> = {
  team: {
    turkishName: 'Avukat Kadrosu & Ekip',
    turkishTitle: 'Ekibimiz & Avukat Kadrosu',
    subtitle: 'team',
    desc: 'Büro avukatları, ortaklar ve danışman ekibinin tanıtım kartları ve özgeçmişleri'
  },
  articles: {
    turkishName: 'Hukuki Makaleler & Yayınlar',
    turkishTitle: 'Makaleler & Hukuki Bilgiler',
    subtitle: 'articles',
    desc: 'Hukuki bültenler, yargıtay kararları, makaleler ve bilgilendirici blog yazıları'
  },
  gallery: {
    turkishName: 'Fotoğraf Galerisi',
    turkishTitle: 'Fotoğraf Galerisi & Ofisimiz',
    subtitle: 'gallery',
    desc: 'Hukuk bürosu çalışma alanları, kütüphane ve toplantı salonu görselleri'
  },
  announcements: {
    turkishName: 'Duyurular & Yasal Bültenler',
    turkishTitle: 'Duyurular & Basın Bülteni',
    subtitle: 'announcements',
    desc: 'Büro duyuruları, resmi mevzuat değişiklikleri, adli tatil ve çalışma bildirimleri'
  },
  faq: {
    turkishName: 'Sıkça Sorulan Sorular',
    turkishTitle: 'Sıkça Sorulan Sorular (SSS)',
    subtitle: 'faq',
    desc: 'Müvekkillerin dava süreçleri ve hukuki danışmanlık hakkında en çok sorduğu sorular'
  },
  whatsapp: {
    turkishName: 'Canlı WhatsApp Destek Butonu',
    turkishTitle: 'WhatsApp Hızlı Mesaj & İletişim',
    subtitle: 'whatsapp',
    desc: 'Sitede sağ altta ve üst çubukta yer alan tek tıkla doğrudan WhatsApp mesaj başlatma butonu'
  },
  socialMedia: {
    turkishName: 'Sosyal Medya Bağlantıları',
    turkishTitle: 'Sosyal Medya Hesapları',
    subtitle: 'socialMedia',
    desc: 'Header üst çubuğu ve Footer alt bilgi alanındaki sosyal medya ikonları'
  },
  contactForm: {
    turkishName: 'İletişim & Danışma Formu',
    turkishTitle: 'Online Hukuki Danışma Formu',
    subtitle: 'contactForm',
    desc: 'Ziyaretçilerin doğrudan hukuki danışma talebi ve mesaj gönderebildiği form'
  },
  popup: {
    turkishName: 'Özel Gün & Açılır Karşılama Penceresi',
    turkishTitle: 'Özel Gün & Karşılama (Popup)',
    subtitle: 'popup',
    desc: 'Milli/dini bayramlar veya acil yasal duyurular için ekranda beliren karşılama penceresi'
  },
  quickContactBar: {
    turkishName: 'Hızlı İletişim & Arama Çubuğu',
    turkishTitle: 'Üst Hızlı İletişim Çubuğu (Hemen Ara)',
    subtitle: 'quickContactBar',
    desc: 'Sayfanın en üstünde yer alan telefon, çalışma saati ve WhatsApp buton çubuğu'
  },
  about: {
    turkishName: 'Hakkımızda & Kurumsal Tanıtım',
    turkishTitle: 'Hakkımızda & Kurumsal Bilgiler',
    subtitle: 'about',
    desc: 'Hukuk bürosunun misyonu, vizyonu, kuruluş felsefesi ve kurumsal ilkeleri'
  },
  practices: {
    turkishName: 'Faaliyet & Uzmanlık Alanları',
    turkishTitle: 'Çalışma & Hukuki Uzmanlık Alanları',
    subtitle: 'practices',
    desc: 'Ceza, Aile, Ticaret, Gayrimenkul, İş vb. hukuki faaliyet alanları ve hizmet detayları'
  }
};

export const GeneralSettingsTab: React.FC = () => {
  const { settings, updateSettings } = useCms();
  const [form, setForm] = useState<SiteSettings>({
    ...settings,
    heroEyebrow: settings.heroEyebrow !== undefined ? settings.heroEyebrow : 'KIR HUKUK OFİSİ',
    heroTitle: settings.heroTitle !== undefined ? settings.heroTitle : 'Hukuki Süreçlerinizde',
    heroTitleHighlight: settings.heroTitleHighlight !== undefined ? settings.heroTitleHighlight : 'Güvenilir',
    heroTitleSuffix: settings.heroTitleSuffix !== undefined ? settings.heroTitleSuffix : 'Çözüm Ortağınız',
    heroDescription: settings.heroDescription || 'Bursa, İstanbul ve Türkiye geneli avukat desteği için KIR Hukuk Ofisi yanınızda. Boşanma, ceza, iş, şirketler ve gayrimenkul davalarında hızlı, güvenilir ve sonuç odaklı çözümler.',
    heroImageUrl: settings.heroImageUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85',
    heroImageAlt: settings.heroImageAlt || 'KIR Hukuk Bürosu Modern Genel Merkez & Hukuk Kulesi',
    heroPillTeamText: settings.heroPillTeamText || 'Ekibimiz',
    heroPillTeamActive: settings.heroPillTeamActive !== false,
    heroPillArticlesText: settings.heroPillArticlesText || 'Makaleler',
    heroPillArticlesActive: settings.heroPillArticlesActive !== false,
    heroPillToolsText: settings.heroPillToolsText || 'Araçlar',
    heroPillToolsActive: settings.heroPillToolsActive !== false,
    heroStats: settings.heroStats && settings.heroStats.length > 0 ? settings.heroStats : defaultHeroStats
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm({
      ...settings,
      heroEyebrow: settings.heroEyebrow !== undefined ? settings.heroEyebrow : 'KIR HUKUK OFİSİ',
      heroTitle: settings.heroTitle !== undefined ? settings.heroTitle : 'Hukuki Süreçlerinizde',
      heroTitleHighlight: settings.heroTitleHighlight !== undefined ? settings.heroTitleHighlight : 'Güvenilir',
      heroTitleSuffix: settings.heroTitleSuffix !== undefined ? settings.heroTitleSuffix : 'Çözüm Ortağınız',
      heroDescription: settings.heroDescription || 'Bursa, İstanbul ve Türkiye geneli avukat desteği için KIR Hukuk Ofisi yanınızda. Boşanma, ceza, iş, şirketler ve gayrimenkul davalarında hızlı, güvenilir ve sonuç odaklı çözümler.',
      heroImageUrl: settings.heroImageUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85',
      heroImageAlt: settings.heroImageAlt || 'KIR Hukuk Bürosu Modern Genel Merkez & Hukuk Kulesi',
      heroPillTeamText: settings.heroPillTeamText || 'Ekibimiz',
      heroPillTeamActive: settings.heroPillTeamActive !== false,
      heroPillArticlesText: settings.heroPillArticlesText || 'Makaleler',
      heroPillArticlesActive: settings.heroPillArticlesActive !== false,
      heroPillToolsText: settings.heroPillToolsText || 'Araçlar',
      heroPillToolsActive: settings.heroPillToolsActive !== false,
      heroStats: settings.heroStats && settings.heroStats.length > 0 ? settings.heroStats : defaultHeroStats
    });
  }, [settings]);

  const currentHeroStats: HeroStatItem[] =
    form.heroStats && form.heroStats.length > 0 ? form.heroStats : defaultHeroStats;

  const handleUpdateStat = (id: string, updates: Partial<HeroStatItem>) => {
    const updated = currentHeroStats.map(item => (item.id === id ? { ...item, ...updates } : item));
    setForm({ ...form, heroStats: updated });
  };

  const handleAddStat = () => {
    const newId = 'stat-' + Date.now();
    const newStat: HeroStatItem = {
      id: newId,
      value: '100+',
      label: 'Yeni Başarı Kriteri',
      highlight: false,
      isActive: true
    };
    setForm({ ...form, heroStats: [...currentHeroStats, newStat] });
  };

  const handleRemoveStat = (id: string) => {
    if (currentHeroStats.length <= 1) {
      alert('En az 1 adet başarı kartı bulunmalıdır.');
      return;
    }
    const filtered = currentHeroStats.filter(item => item.id !== id);
    setForm({ ...form, heroStats: filtered });
  };

  const handleResetStats = () => {
    setForm({ ...form, heroStats: defaultHeroStats });
  };

  const handleDisableAllStats = () => {
    const updated = currentHeroStats.map(s => ({ ...s, isActive: false }));
    setForm({ ...form, heroStats: updated });
  };

  const handleEnableAllStats = () => {
    const updated = currentHeroStats.map(s => ({ ...s, isActive: true }));
    setForm({ ...form, heroStats: updated, showHeroStats: true });
  };

  const executeSave = () => {
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    executeSave();
  };

  const handleSocialChange = (index: number, field: string, val: any) => {
    const updated = [...form.socialLinks];
    updated[index] = { ...updated[index], [field]: val };
    setForm({ ...form, socialLinks: updated });
  };

  return (
    <form noValidate onSubmit={handleSave} className="space-y-8 animate-in fade-in duration-200">
      {/* Header with Save Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold font-serif-heading text-white">
            Genel Büro & Site Ayarları
          </h2>
          <p className="text-xs text-slate-400">
            Hukuk bürosu kimliği, iletişim hatları, çalışma saatleri ve modül kontrolleri.
          </p>
        </div>

        <button
          type="button"
          onClick={executeSave}
          className="px-6 py-2.5 rounded-xl gold-btn text-xs font-bold flex items-center gap-2 shadow-lg"
        >
          {saved ? <CheckCircle2 className="w-4 h-4 text-[#0B132B]" /> : <Save className="w-4 h-4" />}
          <span>{saved ? 'Ayarlar Kaydedildi ✓' : 'Ayarları Kaydet'}</span>
        </button>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 flex items-center gap-2 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Tüm ayarlar başarıyla kaydedildi ve anında sitede güncellendi.</span>
        </div>
      )}

      {/* Group 1: Corporate Identity */}
      <div className="bg-[#1C2E4A] border border-white/10 rounded-2xl p-6 space-y-5">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#C5A880] flex items-center gap-2">
          <Globe className="w-4 h-4" />
          <span>Kurumsal Kimlik & Başlıklar</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Site Adı</label>
            <input
              type="text"
              value={form.siteName}
              onChange={e => setForm({ ...form, siteName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Slogan</label>
            <input
              type="text"
              value={form.slogan}
              onChange={e => setForm({ ...form, slogan: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Logo Ana Metni <span className="text-[#C5A880]">*</span>
            </label>
            <input
              type="text"
              value={form.logoText}
              onChange={e => setForm({ ...form, logoText: e.target.value })}
              placeholder="Örn: KIR HUKUK"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Logo Alt Metni (Görünen Alt Başlık) <span className="text-[#C5A880]">*</span>
            </label>
            <input
              type="text"
              value={form.logoSubtext}
              onChange={e => setForm({ ...form, logoSubtext: e.target.value })}
              placeholder="Örn: HUKUK & DANIŞMANLIK BÜROSU"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Header ve Footer alanlarında ana logonun hemen altında yer alır.
            </p>
          </div>

          <div>
            <ImageInputWithPicker
              label="Logo Görseli (Opsiyonel PNG / SVG)"
              value={form.logoImageUrl || ''}
              onChange={val => setForm({ ...form, logoImageUrl: val })}
              placeholder="https://... veya galeriden seçin (boşsa adalet terazisi ikonu kullanılır)"
              category="Genel"
              helperText="Özel logo yükleyebilir veya boş bırakarak standart kurumsal adalet terazisi ikonunu kullanabilirsiniz."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Logo Görseli Alt Metni (SEO & Erişilebilirlik - HTML Alt Attribute)
            </label>
            <input
              type="text"
              value={form.logoAltText || ''}
              onChange={e => setForm({ ...form, logoAltText: e.target.value })}
              placeholder="Örn: KIR HUKUK Bürosu Resmi Logosu"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Arama motorları (Google) ve ekran okuyucular için resim açıklama metni.
            </p>
          </div>
        </div>

        {/* Canlı Logo Önizleme Kartı */}
        <div className="p-4 rounded-xl bg-[#0B132B]/80 border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#C5A880] flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" />
              Canlı Logo & Alt Metin Önizlemesi
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Header & Footer Görünümü</span>
          </div>

          <div className="p-4 rounded-lg bg-[#080E1F] border border-white/5 flex items-center gap-3">
            {form.logoImageUrl ? (
              <img
                src={form.logoImageUrl}
                alt={form.logoAltText || `${form.logoText} - ${form.logoSubtext}`}
                className="h-10 w-auto max-w-[140px] object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-[#1C2E4A] border border-[#C5A880]/50 flex items-center justify-center shrink-0">
                <Scale className="w-5 h-5 text-[#C5A880]" />
              </div>
            )}
            <div className="flex flex-col justify-center">
              <span className="block text-lg font-bold font-serif-heading text-white tracking-wider leading-tight">
                {form.logoText || 'KIR HUKUK'}
              </span>
              {(form.logoSubtext || 'HUKUK & DANIŞMANLIK BÜROSU') && (
                <span className="block text-[9px] font-semibold text-[#C5A880] tracking-widest uppercase leading-none mt-0.5">
                  {form.logoSubtext || 'HUKUK & DANIŞMANLIK BÜROSU'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Group: Anasayfa Hero (Giriş Vitrini) İçerik & Görsel Yönetimi */}
      <div className="bg-[#1C2E4A] border border-white/10 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#C5A880] flex items-center gap-2">
              <Layout className="w-4 h-4" />
              <span>Anasayfa Hero (Giriş Vitrini) İçerik & Görsel Yönetimi</span>
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Görselde işaretli olan üst etiket, ana manşet başlığı, açıklama paragrafı, hızlı butonlar ve sağdaki büyük mimari fotoğrafı buradan yönetebilirsiniz.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setForm({
                ...form,
                heroEyebrow: 'KIR HUKUK OFİSİ',
                heroTitle: 'Hukuki Süreçlerinizde',
                heroTitleHighlight: 'Güvenilir',
                heroTitleSuffix: 'Çözüm Ortağınız',
                heroDescription: 'Bursa, İstanbul ve Türkiye geneli avukat desteği için KIR Hukuk Ofisi yanınızda. Boşanma, ceza, iş, şirketler ve gayrimenkul davalarında hızlı, güvenilir ve sonuç odaklı çözümler.',
                heroImageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85',
                heroImageAlt: 'KIR Hukuk Bürosu Modern Genel Merkez & Hukuk Kulesi',
                heroPillTeamText: 'Ekibimiz',
                heroPillTeamActive: true,
                heroPillArticlesText: 'Makaleler',
                heroPillArticlesActive: true,
                heroPillToolsText: 'Araçlar',
                heroPillToolsActive: true
              });
            }}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors border border-white/10 shrink-0 self-start sm:self-center"
            title="Hero alanlarını orijinal varsayılan metin ve görsele geri döndür"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Varsayılana Sıfırla</span>
          </button>
        </div>

        {/* 1. Üst Çizgili Etiket (Eyebrow Tag) */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#B94A26]"></span>
            <span>1. Üst Etiket / Rozet (Görselde en üstte işaretli alan)</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <input
                type="text"
                value={form.heroEyebrow ?? 'KIR HUKUK OFİSİ'}
                onChange={e => setForm({ ...form, heroEyebrow: e.target.value })}
                placeholder="Örn: KIR HUKUK OFİSİ"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Ana manşetin hemen üzerinde ince kiremit çizgiyle birlikte gösterilen kurumsal etiket. Boş bırakırsanız gizlenir.
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0B132B]/80 border border-white/5 flex items-center gap-2">
              <span className="w-5 h-[2.5px] bg-[#B94A26] inline-block rounded-full"></span>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#B94A26]">
                {form.heroEyebrow || 'ETİKET GİZLİ'}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Ana Manşet Başlığı */}
        <div className="space-y-3 pt-3 border-t border-white/10">
          <label className="block text-xs font-semibold text-white flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>2. Ana Manşet Başlığı (Görselde büyük harflerle işaretli başlık)</span>
          </label>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                Başlık Girişi (1. Kısım)
              </label>
              <input
                type="text"
                value={form.heroTitle ?? 'Hukuki Süreçlerinizde'}
                onChange={e => setForm({ ...form, heroTitle: e.target.value })}
                placeholder="Örn: Hukuki Süreçlerinizde"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-amber-300 mb-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B94A26]"></span>
                Vurgulu Kelime (Kiremit Rengi)
              </label>
              <input
                type="text"
                value={form.heroTitleHighlight ?? 'Güvenilir'}
                onChange={e => setForm({ ...form, heroTitleHighlight: e.target.value })}
                placeholder="Örn: Güvenilir"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B132B] border border-[#B94A26]/50 text-white text-xs focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                Başlık Devamı (Alt Satır)
              </label>
              <input
                type="text"
                value={form.heroTitleSuffix ?? 'Çözüm Ortağınız'}
                onChange={e => setForm({ ...form, heroTitleSuffix: e.target.value })}
                placeholder="Örn: Çözüm Ortağınız"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
              />
            </div>
          </div>

          {/* Canlı Başlık Önizleme Kutusu */}
          <div className="p-3.5 rounded-xl bg-[#080E1F] border border-white/5">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1.5 font-mono">
              Canlı Başlık Önizlemesi:
            </span>
            <div className="text-base sm:text-lg font-bold font-serif-heading text-white">
              {form.heroTitle ?? 'Hukuki Süreçlerinizde'}{' '}
              {form.heroTitleHighlight && (
                <span className="text-[#B94A26]">{form.heroTitleHighlight}</span>
              )}{' '}
              {form.heroTitleSuffix && (
                <span>{form.heroTitleSuffix}</span>
              )}
            </div>
          </div>
        </div>

        {/* 3. Açıklama & Alt Metin */}
        <div className="space-y-2 pt-3 border-t border-white/10">
          <label className="block text-xs font-semibold text-white flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>3. Tanıtım Açıklama Metni (Görselde başlık altındaki paragraf)</span>
          </label>
          <textarea
            rows={3}
            value={form.heroDescription}
            onChange={e => setForm({ ...form, heroDescription: e.target.value })}
            placeholder="Hukuk büronuzun uzmanlıklarını ve hizmet coğrafyasını anlatan özet metin..."
            className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880] leading-relaxed"
          />
          <p className="text-[11px] text-slate-400">
            Ziyaretçilere hukuk büronuzun sunduğu hukuki alanları ve vizyonu anlatan 1-2 cümlelik açıklama metnidir.
          </p>
        </div>

        {/* 4. Hızlı Gezinme Butonları (Pills) */}
        <div className="space-y-3 pt-3 border-t border-white/10">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-white flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>4. Hızlı Gezinme Butonları / Etiketleri (Görselde butonların olduğu alan)</span>
            </label>
            <span className="text-[11px] text-slate-400">Her butonu ayrı ayrı isimlendirebilir ve açıp kapatabilirsiniz</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Buton 1: Ekibimiz */}
            <div className="p-3.5 rounded-xl bg-[#0B132B]/80 border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#B94A26]" />
                  1. Buton (Ekip)
                </span>
                <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.heroPillTeamActive !== false}
                    onChange={e => setForm({ ...form, heroPillTeamActive: e.target.checked })}
                    className="rounded bg-[#1C2E4A] border-white/20 text-[#C5A880] w-4 h-4"
                  />
                  <span className={`text-[11px] font-medium ${form.heroPillTeamActive !== false ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {form.heroPillTeamActive !== false ? 'Aktif' : 'Gizli'}
                  </span>
                </label>
              </div>
              <input
                type="text"
                value={form.heroPillTeamText ?? 'Ekibimiz'}
                onChange={e => setForm({ ...form, heroPillTeamText: e.target.value })}
                placeholder="Örn: Ekibimiz"
                className="w-full px-3 py-2 rounded-lg bg-[#080E1F] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
              />
              <p className="text-[10px] text-slate-400">Tıklandığında Avukat & Ekip sayfasına götürür.</p>
            </div>

            {/* Buton 2: Makaleler */}
            <div className="p-3.5 rounded-xl bg-[#0B132B]/80 border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#B94A26]" />
                  2. Buton (Makaleler)
                </span>
                <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.heroPillArticlesActive !== false}
                    onChange={e => setForm({ ...form, heroPillArticlesActive: e.target.checked })}
                    className="rounded bg-[#1C2E4A] border-white/20 text-[#C5A880] w-4 h-4"
                  />
                  <span className={`text-[11px] font-medium ${form.heroPillArticlesActive !== false ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {form.heroPillArticlesActive !== false ? 'Aktif' : 'Gizli'}
                  </span>
                </label>
              </div>
              <input
                type="text"
                value={form.heroPillArticlesText ?? 'Makaleler'}
                onChange={e => setForm({ ...form, heroPillArticlesText: e.target.value })}
                placeholder="Örn: Makaleler"
                className="w-full px-3 py-2 rounded-lg bg-[#080E1F] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
              />
              <p className="text-[10px] text-slate-400">Tıklandığında Hukuki Makaleler sayfasına götürür.</p>
            </div>

            {/* Buton 3: Araçlar */}
            <div className="p-3.5 rounded-xl bg-[#0B132B]/80 border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-[#B94A26]" />
                  3. Buton (Araçlar)
                </span>
                <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.heroPillToolsActive !== false}
                    onChange={e => setForm({ ...form, heroPillToolsActive: e.target.checked })}
                    className="rounded bg-[#1C2E4A] border-white/20 text-[#C5A880] w-4 h-4"
                  />
                  <span className={`text-[11px] font-medium ${form.heroPillToolsActive !== false ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {form.heroPillToolsActive !== false ? 'Aktif' : 'Gizli'}
                  </span>
                </label>
              </div>
              <input
                type="text"
                value={form.heroPillToolsText ?? 'Araçlar'}
                onChange={e => setForm({ ...form, heroPillToolsText: e.target.value })}
                placeholder="Örn: Araçlar"
                className="w-full px-3 py-2 rounded-lg bg-[#080E1F] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
              />
              <p className="text-[10px] text-slate-400">Tıklandığında Hukuki Hesaplama Araçları penceresini açar.</p>
            </div>
          </div>
        </div>

        {/* 5. Sağ Sütun Büyük Mimari Görsel (Fotoğraf) */}
        <div className="space-y-4 pt-3 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="block text-xs font-semibold text-white flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>5. Sağ Taraf Büyük Mimari Görsel (Görselde sağda daire içine alınan bina fotoğrafı)</span>
            </label>
            <button
              type="button"
              onClick={() => {
                setForm({
                  ...form,
                  heroImageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85',
                  heroImageAlt: 'KIR Hukuk Bürosu Modern Genel Merkez & Hukuk Kulesi'
                });
              }}
              className="text-[11px] text-[#C5A880] hover:underline self-start sm:self-auto cursor-pointer"
            >
              Varsayılan Gökdelen Fotoğrafını Geri Yükle
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-3">
              <ImageInputWithPicker
                label="Hero Sağ Görsel URL'si"
                value={form.heroImageUrl || ''}
                onChange={val => setForm({ ...form, heroImageUrl: val })}
                placeholder="https://images.unsplash.com/... veya medya kütüphanesinden seçin"
                category="Genel"
                helperText="Masaüstü ekranda sağ tarafta diyagonal kiremit çizgiyle birlikte gösterilen yüksek çözünürlüklü bina/ofis görseli."
              />

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Görsel Alt Metni (SEO & Erişilebilirlik)
                </label>
                <input
                  type="text"
                  value={form.heroImageAlt ?? 'KIR Hukuk Bürosu Modern Genel Merkez & Hukuk Kulesi'}
                  onChange={e => setForm({ ...form, heroImageAlt: e.target.value })}
                  placeholder="Örn: KIR Hukuk Bürosu Modern Genel Merkez"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
                />
              </div>
            </div>

            {/* Görsel Önizleme Kutusu */}
            <div className="p-3 rounded-xl bg-[#0B132B]/80 border border-white/10 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] text-slate-400 font-mono mb-2">Canlı Görsel Önizlemesi</span>
              <div className="relative w-full h-40 rounded-lg overflow-hidden border border-white/10 bg-slate-900">
                <img
                  src={form.heroImageUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85'}
                  alt={form.heroImageAlt || 'Önizleme'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85';
                  }}
                />
                <div className="absolute left-0 top-0 bottom-0 w-8 -ml-4 bg-[#080E1F]/50 transform -skew-x-[6deg] origin-top-left border-r-2 border-[#B94A26]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Group: Anasayfa İstatistik & Başarı Kartları (Hero Stats) */}
      <div className="bg-[#1C2E4A] border border-white/10 rounded-2xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#C5A880] flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>Anasayfa İstatistik & Başarı Kartları (Hero Metrikleri)</span>
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Anasayfada gösterilen "Yıllık Mesleki Tecrübe", "Tamamlanan Dava & Dosya", "Uzmanlık Alanı" ve "Memnuniyet" kartlarını buradan güncelleyebilir, tek tıkla aktif/pasif yapabilir veya yeni kartlar ekleyebilirsiniz.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleResetStats}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors border border-white/10"
              title="Varsayılan 4 karta geri döndür"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Varsayılana Dön</span>
            </button>
            <button
              type="button"
              onClick={handleAddStat}
              className="px-3.5 py-1.5 rounded-lg bg-[#C5A880] hover:bg-[#b0936b] text-[#0B132B] text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Yeni Kart Ekle</span>
            </button>
          </div>
        </div>

        {/* Genel Bölüm Aktif / Pasif Seçeneği */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#0B132B]/70 border border-white/10">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${form.showHeroStats !== false ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700/50 text-slate-400'}`}>
              {form.showHeroStats !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </div>
            <div>
              <p className="text-xs font-bold text-white">
                İstatistik & Başarı Kartları Bölümünü Anasayfada Göster
              </p>
              <p className="text-[11px] text-slate-400">
                Bu ayar pasif yapıldığında tüm istatistik kartları anasayfada tamamen gizlenir.
              </p>
            </div>
          </div>
          <label className="inline-flex items-center gap-2 cursor-pointer select-none shrink-0">
            <input
              type="checkbox"
              checked={form.showHeroStats !== false}
              onChange={e => setForm({ ...form, showHeroStats: e.target.checked })}
              className="rounded bg-[#1C2E4A] border-white/20 text-[#C5A880] w-5 h-5 focus:ring-0 cursor-pointer"
            />
            <span className={`text-xs font-bold ${form.showHeroStats !== false ? 'text-emerald-400' : 'text-slate-400'}`}>
              {form.showHeroStats !== false ? 'Bölüm Aktif' : 'Bölüm Pasif'}
            </span>
          </label>
        </div>

        {/* Toplu İşlem & Hızlı Kontrol Butonları (Hem tek tek hem hepsi aynı anda) */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-xl bg-[#0B132B]/60 border border-white/10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-300">Toplu İşlemler:</span>
            <button
              type="button"
              onClick={handleDisableAllStats}
              className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Tüm istatistik kartlarını tek tıkla pasife al"
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>Hepsini Pasife Al (Tümünü Gizle)</span>
            </button>
            <button
              type="button"
              onClick={handleEnableAllStats}
              className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Tüm istatistik kartlarını tek tıkla aktif et"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Hepsini Aktif Et (Tümünü Göster)</span>
            </button>
          </div>
          <span className="text-[11px] text-slate-400">
            {currentHeroStats.filter(s => s.isActive !== false).length} / {currentHeroStats.length} kart aktif
          </span>
        </div>

        {/* Kart Düzenleme Form Alanları */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentHeroStats.map((item, index) => {
            const isItemActive = item.isActive !== false;
            return (
              <div
                key={item.id || index}
                className={`p-4 rounded-xl border space-y-3 relative group transition-all ${
                  isItemActive
                    ? 'bg-[#0B132B]/80 border-white/10 hover:border-white/20'
                    : 'bg-[#0B132B]/50 border-dashed border-amber-500/30 opacity-80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#C5A880] flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-[#1C2E4A] border border-[#C5A880]/40 flex items-center justify-center text-[10px] text-white">
                        {index + 1}
                      </span>
                      <span>Kart #{index + 1}</span>
                    </span>
                    {isItemActive ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        <Eye className="w-3 h-3" /> Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        <EyeOff className="w-3 h-3" /> Pasif
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleUpdateStat(item.id, { isActive: !isItemActive })}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors border ${
                        isItemActive
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25'
                          : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                      }`}
                      title={isItemActive ? 'Kartı Pasife Al (Gizle)' : 'Kartı Aktif Yap (Göster)'}
                    >
                      {isItemActive ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Aktif</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Pasif</span>
                        </>
                      )}
                    </button>
                    {currentHeroStats.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveStat(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Bu Kartı Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Rakam / Değer
                    </label>
                    <input
                      type="text"
                      value={item.value}
                      onChange={e => handleUpdateStat(item.id, { value: e.target.value })}
                      placeholder="Örn: 20+ veya %98"
                      className="w-full px-3 py-2 rounded-lg bg-[#1C2E4A] border border-white/10 text-white font-bold text-sm focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Açıklama / Metin
                    </label>
                    <input
                      type="text"
                      value={item.label}
                      onChange={e => handleUpdateStat(item.id, { label: e.target.value })}
                      placeholder="Örn: Yıllık Mesleki Tecrübe"
                      className="w-full px-3 py-2 rounded-lg bg-[#1C2E4A] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-slate-300 select-none">
                    <input
                      type="checkbox"
                      checked={!!item.highlight}
                      onChange={e => handleUpdateStat(item.id, { highlight: e.target.checked })}
                      className="rounded bg-[#1C2E4A] border-white/20 text-[#C5A880] w-4 h-4 focus:ring-0"
                    />
                    <span className="text-[11px] text-slate-300">Altın Sarısı ile Vurgula</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs select-none">
                    <input
                      type="checkbox"
                      checked={isItemActive}
                      onChange={e => handleUpdateStat(item.id, { isActive: e.target.checked })}
                      className="rounded bg-[#1C2E4A] border-white/20 text-emerald-400 w-4 h-4 focus:ring-0"
                    />
                    <span className={`text-[11px] font-semibold ${isItemActive ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {isItemActive ? 'Sitede Göster (Aktif)' : 'Gizle (Pasif)'}
                    </span>
                  </label>
                </div>
              </div>
            );
          })}
        </div>

        {/* Canlı Önizleme Alanı - Yatay & Dikey Ortalı */}
        <div className="p-4 rounded-xl bg-[#080E1F]/90 border border-white/10 space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-slate-400">
            <span className="font-semibold text-[#C5A880] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Anasayfadaki Canlı Önizleme (Yatay & Dikey Ortalı)
            </span>
            <span className="text-[11px] text-slate-400">
              {form.showHeroStats === false ? (
                <span className="text-amber-400 font-semibold">[Genel Bölüm Pasif - Anasayfada Gösterilmez]</span>
              ) : (
                <span>{currentHeroStats.filter(s => s.isActive !== false).length} adet aktif kart anasayfada yayınlanacak</span>
              )}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            {currentHeroStats.map((item, idx) => {
              const isItemActive = item.isActive !== false;
              return (
                <div
                  key={item.id || idx}
                  className={`w-[calc(50%-0.5rem)] sm:w-44 p-3.5 rounded-xl border shadow-md flex flex-col items-center justify-center text-center min-h-[96px] transition-all ${
                    !isItemActive
                      ? 'bg-[#1C2E4A]/30 border-white/5 opacity-40 border-dashed'
                      : 'bg-[#1C2E4A]/90 border-white/15'
                  }`}
                >
                  <p className={`text-xl sm:text-2xl font-bold font-serif-heading leading-tight text-center ${item.highlight ? 'text-[#C5A880]' : 'text-white'}`}>
                    {item.value || '0'}
                  </p>
                  <p className="text-[11px] text-slate-300 font-medium mt-1.5 leading-snug text-center max-w-[160px]">
                    {item.label || 'Başlık'}
                  </p>
                  {!isItemActive && (
                    <span className="text-[10px] text-amber-300/90 font-mono mt-1 font-semibold uppercase">
                      [Pasif - Gizli]
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Group 2: Contact & Location */}
      <div className="bg-[#1C2E4A] border border-white/10 rounded-2xl p-6 space-y-5">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#C5A880] flex items-center gap-2">
          <Phone className="w-4 h-4" />
          <span>İletişim, WhatsApp & Konum</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Telefon (Görünen)</label>
            <input
              type="text"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Telefon (Arama Formatı: +90...)</label>
            <input
              type="text"
              value={form.phoneRaw}
              onChange={e => setForm({ ...form, phoneRaw: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">E-Posta Adresi</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">WhatsApp Numarası</label>
            <input
              type="text"
              value={form.whatsappNumber}
              onChange={e => setForm({ ...form, whatsappNumber: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">WhatsApp Otomatik Karşılama Mesajı</label>
            <input
              type="text"
              value={form.whatsappDefaultMessage}
              onChange={e => setForm({ ...form, whatsappDefaultMessage: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Açık Adres</label>
            <input
              type="text"
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Çalışma Saatleri</label>
            <input
              type="text"
              value={form.workingHours}
              onChange={e => setForm({ ...form, workingHours: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Google Haritalar Yol Tarifi Bağlantısı</label>
          <input
            type="text"
            value={form.googleMapsUrl}
            onChange={e => setForm({ ...form, googleMapsUrl: e.target.value })}
            className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
          />
        </div>
      </div>

      {/* Group 3: Social Media Links */}
      <div className="bg-[#1C2E4A] border border-white/10 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#C5A880]">
          Sosyal Medya Hesapları
        </h3>

        <div className="space-y-3">
          {form.socialLinks.map((s, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 bg-[#0B132B]/60 rounded-lg border border-white/5">
              <span className="w-24 text-xs font-semibold text-white uppercase">{s.platform}</span>
              <input
                type="text"
                value={s.url}
                onChange={e => handleSocialChange(idx, 'url', e.target.value)}
                placeholder="https://..."
                className="flex-1 px-3 py-1.5 rounded bg-[#1C2E4A] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
              />
              <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={s.isActive}
                  onChange={e => handleSocialChange(idx, 'isActive', e.target.checked)}
                  className="rounded bg-[#0B132B] border-white/20 text-[#C5A880]"
                />
                <span>Aktif</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Group 4: Module Toggles */}
      <div className="bg-[#1C2E4A] border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#C5A880] flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Modül & Özellik Açma / Kapatma (Türkçe Adları & Açıklamaları)</span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Sitede görüntülenmesini istediğiniz tüm modüllerin Türkçe adları ve açıklamaları aşağıdadır. Tek tıkla aktif veya pasif yapabilirsiniz.
            </p>
          </div>

          {/* Modül Toplu İşlem Butonları */}
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => {
                const updated = { ...form.modules };
                Object.keys(updated).forEach(k => {
                  (updated as any)[k] = true;
                });
                setForm({ ...form, modules: updated });
              }}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold transition-all cursor-pointer"
              title="Tüm modülleri sitede aktif et"
            >
              Tümünü Aç
            </button>
            <button
              type="button"
              onClick={() => {
                const updated = { ...form.modules };
                Object.keys(updated).forEach(k => {
                  (updated as any)[k] = false;
                });
                setForm({ ...form, modules: updated });
              }}
              className="px-2.5 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 text-[11px] font-semibold transition-all cursor-pointer"
              title="Tüm modülleri pasife al"
            >
              Tümünü Kapat
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {Object.entries(form.modules).map(([key, val]) => {
            const meta = MODULE_METADATA[key] || {
              turkishName: `${key.charAt(0).toUpperCase() + key.slice(1)}`,
              turkishTitle: `${key.charAt(0).toUpperCase() + key.slice(1)} Modülü`,
              subtitle: key,
              desc: 'Sistem modül bileşeni'
            };

            return (
              <label
                key={key}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 select-none ${
                  val
                    ? 'bg-[#0B132B]/80 border-[#C5A880]/30 hover:border-[#C5A880]/60 shadow-sm'
                    : 'bg-[#0B132B]/40 border-white/5 hover:border-white/15 opacity-70'
                }`}
              >
                <div className="flex-1 min-w-0 pr-2 space-y-1">
                  {/* Türkçe Ad Vurgusu */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-white leading-snug">
                      {meta.turkishName}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#C5A880]/15 text-[#C5A880] border border-[#C5A880]/30 font-medium">
                      TR
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-snug">
                    {meta.desc}
                  </p>

                  <div className="pt-1 flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="font-mono text-slate-400">Modül Kodu: {meta.subtitle}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0 pt-0.5">
                  <input
                    type="checkbox"
                    checked={val}
                    onChange={e =>
                      setForm({
                        ...form,
                        modules: { ...form.modules, [key]: e.target.checked }
                      })
                    }
                    className="rounded bg-[#1C2E4A] border-white/20 text-[#C5A880] w-5 h-5 focus:ring-0 cursor-pointer"
                  />
                  <span className={`text-[10px] font-semibold mt-1.5 ${val ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {val ? 'Aktif' : 'Pasif'}
                  </span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Group 5: Footer & Legal Texts */}
      <div className="bg-[#1C2E4A] border border-white/10 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#C5A880]">
          Footer & Yasal Metinler
        </h3>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Footer Kurumsal Açıklama Metni</label>
          <textarea
            rows={2}
            value={form.footerCorporateText}
            onChange={e => setForm({ ...form, footerCorporateText: e.target.value })}
            className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">TBB Yasal Uyarı Metni (Disclaimer)</label>
          <textarea
            rows={2}
            value={form.legalDisclaimerText}
            onChange={e => setForm({ ...form, legalDisclaimerText: e.target.value })}
            className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Telif Hakkı Metni</label>
          <input
            type="text"
            value={form.copyrightText}
            onChange={e => setForm({ ...form, copyrightText: e.target.value })}
            className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-4 pt-4 border-t border-white/10">
        <div>
          {saved ? (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 flex items-center gap-2 text-xs animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Tüm ayarlar ve değişiklikler başarıyla kaydedildi!</span>
            </div>
          ) : (
            <p className="text-xs text-slate-400">
              Yapılan tüm değişiklikler anında kaydedilir ve sitede yayınlanır.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={executeSave}
          className="px-8 py-3 rounded-xl gold-btn text-xs font-bold flex items-center gap-2 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          {saved ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-[#0B132B]" />
              <span>Değişiklikler Kaydedildi ✓</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Tüm Değişiklikleri Kaydet</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
