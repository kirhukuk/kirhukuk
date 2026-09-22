import React, { useState, useEffect } from 'react';
import { useCms } from '../../context/CmsContext';
import { Plus, Trash2, Edit2, Scale, Check, X, Search, AlertCircle } from 'lucide-react';
import { PracticeArea } from '../../types';
import { ImageInputWithPicker } from './ImageInputWithPicker';

export const PracticeManagerTab: React.FC = () => {
  const {
    practiceAreas,
    addPracticeArea,
    updatePracticeArea,
    deletePracticeArea,
    editingPracticeId,
    setEditingPracticeId
  } = useCms();

  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [search, setSearch] = useState('');
  const [deletingPractice, setDeletingPractice] = useState<PracticeArea | null>(null);

  const initialForm: Partial<PracticeArea> = {
    title: '',
    slug: '',
    shortDesc: '',
    longDesc: '',
    icon: 'Scale',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
    services: [],
    order: practiceAreas.length + 1,
    isActive: true
  };

  const [form, setForm] = useState<Partial<PracticeArea>>(initialForm);
  const [servicesInput, setServicesInput] = useState('');

  // Automatically open edit mode if editingPracticeId is set
  useEffect(() => {
    if (editingPracticeId) {
      const target = practiceAreas.find(p => p.id === editingPracticeId || p.slug === editingPracticeId);
      if (target) {
        setIsEditing(target.id);
        setForm({ ...target });
        setServicesInput(target.services ? target.services.join(', ') : '');
        setIsAdding(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      setEditingPracticeId(null);
    }
  }, [editingPracticeId, practiceAreas, setEditingPracticeId]);

  const handleStartAdd = () => {
    setForm({ ...initialForm, order: practiceAreas.length + 1 });
    setServicesInput('');
    setIsAdding(true);
    setIsEditing(null);
  };

  const handleStartEdit = (practice: PracticeArea) => {
    setIsEditing(practice.id);
    setForm({ ...practice });
    setServicesInput(practice.services ? practice.services.join(', ') : '');
    setIsAdding(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;

    // Generate slug from title if empty
    const autoSlug =
      form.slug ||
      form.title
        .toLocaleLowerCase('tr-TR')
        .replace(/ı/g, 'i')
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

    const servicesList = servicesInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (isEditing) {
      updatePracticeArea(isEditing, {
        ...form,
        slug: autoSlug,
        services: servicesList
      });
      setIsEditing(null);
    } else {
      addPracticeArea({
        title: form.title!,
        slug: autoSlug,
        shortDesc: form.shortDesc || '',
        longDesc: form.longDesc || '',
        icon: form.icon || 'Scale',
        image: form.image || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
        services: servicesList,
        order: Number(form.order) || practiceAreas.length + 1,
        isActive: form.isActive !== undefined ? form.isActive : true
      });
      setIsAdding(false);
    }
  };

  const availableIcons = [
    'Scale',
    'HeartHandshake',
    'Briefcase',
    'Building2',
    'Home',
    'FileText',
    'Gavel',
    'ShieldAlert',
    'ScrollText',
    'ShieldCheck',
    'Landmark'
  ];

  const filtered = practiceAreas.filter(p =>
    p.title.toLocaleLowerCase('tr-TR').includes(search.toLocaleLowerCase('tr-TR'))
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold font-serif-heading text-white">
            Faaliyet Alanları Yönetimi ({practiceAreas.length})
          </h2>
          <p className="text-xs text-slate-400">
            Hukuki uzmanlık ve faaliyet alanlarının başlık, özet ve detaylı hukuki içeriklerini yönetin.
          </p>
        </div>

        <button
          onClick={handleStartAdd}
          className="px-4 py-2.5 rounded-xl gold-btn text-xs font-bold flex items-center gap-2 shadow-lg cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Faaliyet Alanı Ekle</span>
        </button>
      </div>

      {/* Add / Edit Form Modal */}
      {(isAdding || isEditing) && (
        <form noValidate onSubmit={handleSubmit} className="p-6 rounded-2xl bg-[#1C2E4A] border border-[#C5A880]/50 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-serif-heading flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#C5A880]" />
              <span>{isEditing ? `Faaliyet Alanı İçeriğini Düzenle: ${form.title}` : 'Yeni Faaliyet Alanı Ekle'}</span>
            </h3>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setIsEditing(null);
              }}
              className="text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Alan Başlığı *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="Örn: Bilişim ve Siber Hukuk"
                className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">URL / Slug (Opsiyonel)</label>
              <input
                type="text"
                value={form.slug}
                onChange={e => setForm({ ...form, slug: e.target.value })}
                placeholder="Örn: bilisim-hukuku"
                className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">İkon Seçimi</label>
              <select
                value={form.icon}
                onChange={e => setForm({ ...form, icon: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
              >
                {availableIcons.map(ic => (
                  <option key={ic} value={ic}>
                    {ic}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Kısa Özet (Kartlarda görünür)</label>
            <textarea
              rows={2}
              required
              value={form.shortDesc}
              onChange={e => setForm({ ...form, shortDesc: e.target.value })}
              placeholder="Örn: Bilişim suçları, e-ticaret sözleşmeleri ve telif hakları davalarında hukuki vekillik..."
              className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Detaylı Açıklama (Sayfa içinde görünür)</label>
            <textarea
              rows={4}
              required
              value={form.longDesc}
              onChange={e => setForm({ ...form, longDesc: e.target.value })}
              placeholder="Bu alanın mevzuatı, usul pratikleri ve büromuzun yaklaşımı..."
              className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <ImageInputWithPicker
                label="Faaliyet Alanı Kapak Görseli"
                value={form.image || ''}
                onChange={val => setForm({ ...form, image: val })}
                placeholder="https://... veya galeriden seçin"
                category="Hukuk"
                helperText="Uzmanlık alanı detay sayfasında ve ana sayfa kartında gösterilir."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Alt Hizmetler & Dava Tipleri (Virgülle ayırın)
              </label>
              <input
                type="text"
                value={servicesInput}
                onChange={e => setServicesInput(e.target.value)}
                placeholder="Örn: Ağır Ceza Davaları, Tutukluluk İtirazı, Temyiz Başvurusu"
                className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Görüntüleme Sırası</label>
              <input
                type="number"
                value={form.order}
                onChange={e => setForm({ ...form, order: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div className="flex items-center gap-2 pt-5">
              <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={e => setForm({ ...form, isActive: e.target.checked })}
                  className="rounded bg-[#0B132B] border-white/20 text-[#C5A880]"
                />
                <span>Sitede Aktif Olarak Yayınla</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setIsEditing(null);
              }}
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg gold-btn text-xs font-bold"
            >
              {isEditing ? 'Değişiklikleri Kaydet' : 'Alanı Ekle'}
            </button>
          </div>
        </form>
      )}

      {/* Filter / Search bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Hukuk alanı ara..."
            className="w-full pl-9 pr-3 py-2 bg-[#1C2E4A] border border-white/10 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#C5A880]"
          />
        </div>
      </div>

      {/* Grid of Practice Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(practice => (
          <div
            key={practice.id}
            className="p-5 rounded-xl bg-[#1C2E4A] border border-white/10 flex flex-col justify-between space-y-4 hover:border-white/20 transition-colors shadow-lg"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#C5A880] px-2 py-0.5 rounded bg-[#0B132B]">
                  İkon: {practice.icon}
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    practice.isActive
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-slate-700/40 text-slate-400'
                  }`}
                >
                  {practice.isActive ? 'Aktif' : 'Pasif'}
                </span>
              </div>

              <h3 className="text-base font-bold text-white font-serif-heading">
                {practice.title}
              </h3>

              <p className="text-xs text-slate-300 line-clamp-2">
                {practice.shortDesc}
              </p>

              <div className="text-[11px] text-slate-400 pt-1">
                Slug: <span className="font-mono text-slate-300">/calisma-alanlarimiz/{practice.slug}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">Sıra: {practice.order}</span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleStartEdit(practice)}
                  className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-[#C5A880]/20 text-[#C5A880] hover:text-[#e4cfb2] border border-[#C5A880]/30 hover:border-[#C5A880] transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                  title="Faaliyet Alanı İçeriğini Düzenle"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>İçeriği Düzenle</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeletingPractice(practice)}
                  className="p-1.5 rounded-lg text-rose-400 hover:text-rose-200 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Faaliyet Alanını Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Faaliyet Alanı Silme Onay Modalı */}
      {deletingPractice && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setDeletingPractice(null)}
        >
          <div
            className="bg-[#1C2E4A] border border-rose-500/40 rounded-xl p-5 max-w-md w-full shadow-2xl relative text-left animate-in fade-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center flex-shrink-0 text-rose-400">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-white mb-1">
                  Faaliyet Alanını Sil
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-rose-300">"{deletingPractice.title}"</strong> faaliyet alanını ve buna bağlı alt hizmetleri silmek istediğinize emin misiniz?
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setDeletingPractice(null)}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-slate-200 font-semibold transition-colors cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={() => {
                  deletePracticeArea(deletingPractice.id);
                  setDeletingPractice(null);
                }}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs text-white font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg shadow-rose-900/40"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Evet, Sil</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
