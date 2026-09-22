import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { Plus, Trash2, Edit2, Bell, Pin, Check, X } from 'lucide-react';
import { Announcement } from '../../types';

export const AnnouncementManagerTab: React.FC = () => {
  const { announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement } = useCms();

  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const initialForm: Partial<Announcement> = {
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    isPinned: false,
    isActive: true
  };

  const [form, setForm] = useState<Partial<Announcement>>(initialForm);

  const handleStartAdd = () => {
    setForm(initialForm);
    setIsAdding(true);
    setIsEditing(null);
  };

  const handleStartEdit = (item: Announcement) => {
    setIsEditing(item.id);
    setForm({ ...item });
    setIsAdding(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content) return;

    if (isEditing) {
      updateAnnouncement(isEditing, form);
      setIsEditing(null);
    } else {
      addAnnouncement({
        title: form.title!,
        content: form.content!,
        date: form.date || new Date().toISOString().split('T')[0],
        isPinned: !!form.isPinned,
        isActive: form.isActive !== undefined ? form.isActive : true
      });
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold font-serif-heading text-white">
            Duyuru & Büro Bülteni Yönetimi ({announcements.length})
          </h2>
          <p className="text-xs text-slate-400">
            Adli tatil, mesai düzeni, yasal uyarı ve büro haberlerini yönetin.
          </p>
        </div>

        <button
          onClick={handleStartAdd}
          className="px-4 py-2.5 rounded-xl gold-btn text-xs font-bold flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Duyuru Ekle</span>
        </button>
      </div>

      {/* Form Modal */}
      {(isAdding || isEditing) && (
        <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-[#1C2E4A] border border-[#C5A880]/50 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-serif-heading">
              {isEditing ? 'Duyuruyu Düzenle' : 'Yeni Duyuru Oluştur'}
            </h3>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setIsEditing(null);
              }}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">Duyuru Başlığı *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="Örn: 2026 Adli Tatil ve Nöbetçi Duruşma Takvimi"
                className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Duyuru Tarihi</label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Duyuru Metni / İçerik *</label>
            <textarea
              rows={4}
              required
              value={form.content}
              onChange={e => setForm({ ...form, content: e.target.value })}
              placeholder="Duyurunun detaylarını buraya yazabilirsiniz..."
              className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
              <input
                type="checkbox"
                checked={form.isPinned}
                onChange={e => setForm({ ...form, isPinned: e.target.checked })}
                className="rounded bg-[#0B132B] border-white/20 text-[#C5A880]"
              />
              <span className="flex items-center gap-1 text-[#C5A880]">
                <Pin className="w-3.5 h-3.5" />
                <span>En Üste Sabitle (Öne Çıkar)</span>
              </span>
            </label>

            <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={e => setForm({ ...form, isActive: e.target.checked })}
                className="rounded bg-[#0B132B] border-white/20 text-[#C5A880]"
              />
              <span>Aktif Olarak Yayınla</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
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
              {isEditing ? 'Kaydet' : 'Duyuruyu Ekle'}
            </button>
          </div>
        </form>
      )}

      {/* Announcements List */}
      <div className="bg-[#1C2E4A] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="divide-y divide-white/5">
          {announcements.map(ann => (
            <div
              key={ann.id}
              className="p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:bg-white/5 transition-colors"
            >
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  {ann.isPinned && (
                    <span className="flex items-center gap-1 text-[#C5A880] text-[10px] font-bold px-2 py-0.5 rounded bg-[#0B132B] border border-[#C5A880]/30">
                      <Pin className="w-3 h-3" />
                      Sabit
                    </span>
                  )}
                  <h4 className="text-sm font-bold text-white font-serif-heading">
                    {ann.title}
                  </h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{ann.content}</p>
                <span className="text-[11px] text-slate-400 block font-mono">Tarih: {ann.date}</span>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <button
                  onClick={() => updateAnnouncement(ann.id, { isPinned: !ann.isPinned })}
                  className={`p-1.5 rounded-lg border text-xs ${
                    ann.isPinned ? 'border-[#C5A880] text-[#C5A880] bg-[#C5A880]/10' : 'border-white/10 text-slate-400'
                  }`}
                  title="Sabitle / Kaldır"
                >
                  <Pin className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleStartEdit(ann)}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
                  title="Düzenle"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    if (confirm(`"${ann.title}" duyurusunu silmek istediğinize emin misiniz?`)) {
                      deleteAnnouncement(ann.id);
                    }
                  }}
                  className="p-1.5 rounded-lg text-rose-400 hover:text-rose-200 hover:bg-rose-500/10"
                  title="Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
