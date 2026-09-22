import React, { useState, useRef } from 'react';
import { useCms } from '../../context/CmsContext';
import { Plus, Trash2, Camera, X, Upload, Image as ImageIcon, FolderOpen, Check } from 'lucide-react';
import { GalleryItem } from '../../types';
import { MediaPickerModal } from './MediaPickerModal';
import { compressImageFile } from '../../lib/imageCompressor';

export const GalleryManagerTab: React.FC = () => {
  const { galleryItems, addGalleryItem, deleteGalleryItem, addMediaItem } = useCms();

  const [isAdding, setIsAdding] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<Partial<GalleryItem>>({
    title: '',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    category: 'Ofis',
    caption: '',
    order: galleryItems.length + 1,
    isActive: true
  });

  const handleDeviceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { dataUrl, sizeStr } = await compressImageFile(file);
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");

      // Form görsel URL'sini güncelle
      setForm(prev => ({
        ...prev,
        imageUrl: dataUrl,
        title: prev.title || nameWithoutExt
      }));

      // Ayrıca kütüphaneye de kaydet
      addMediaItem({
        title: nameWithoutExt,
        url: dataUrl,
        thumbnailUrl: dataUrl,
        category: form.category || 'Ofis',
        size: sizeStr,
        uploadedAt: new Date().toISOString().split('T')[0]
      });
    } catch (err) {
      console.error('Fotoğraf yükleme hatası:', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSelectFromLibrary = (url: string, title?: string) => {
    setForm(prev => ({
      ...prev,
      imageUrl: url,
      title: prev.title || title || ''
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.imageUrl) return;

    addGalleryItem({
      title: form.title!,
      imageUrl: form.imageUrl!,
      category: form.category || 'Ofis',
      caption: form.caption || '',
      order: Number(form.order) || galleryItems.length + 1,
      isActive: true
    });

    setIsAdding(false);
    setForm({
      title: '',
      imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      category: 'Ofis',
      caption: '',
      order: galleryItems.length + 2,
      isActive: true
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold font-serif-heading text-white">
            Ofis Galerisi Yönetimi ({galleryItems.length})
          </h2>
          <p className="text-xs text-slate-400">
            Hukuk bürosu çalışma alanları, kütüphane ve toplantı odası fotoğraflarını yönetin.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2.5 rounded-xl gold-btn text-xs font-bold flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Fotoğraf Ekle</span>
        </button>
      </div>

      {/* Add Modal / Form */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-[#1C2E4A] border border-[#C5A880]/50 space-y-5 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#C5A880]" />
              <h3 className="text-sm font-bold text-white font-serif-heading">Yeni Fotoğraf Ekle</h3>
            </div>
            <button type="button" onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Fotoğraf Ekleme & Kütüphaneden Seçme Aksiyon Alanı */}
          <div className="p-3.5 rounded-xl bg-[#0B132B]/80 border border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-[#1C2E4A] border border-white/15 overflow-hidden shrink-0 flex items-center justify-center">
                {form.imageUrl ? (
                  <img
                    src={form.imageUrl}
                    alt="Önizleme"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <ImageIcon className="w-6 h-6 text-slate-500" />
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-white">Fotoğraf Kaynağı</p>
                <p className="text-[11px] text-slate-400">Cihazınızdan yeni fotoğraf yükleyin veya kütüphaneden seçin</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Cihazdan Fotoğraf Yükle Butonu */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex-1 sm:flex-none px-3.5 py-2 rounded-lg bg-[#C5A880] hover:bg-[#b59972] text-[#0B132B] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploading ? 'Yükleniyor...' : 'Cihazdan Fotoğraf Yükle'}</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleDeviceUpload}
                className="hidden"
              />

              {/* Kütüphaneden Seç Butonu */}
              <button
                type="button"
                onClick={() => setIsMediaPickerOpen(true)}
                className="flex-1 sm:flex-none px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors border border-white/10"
              >
                <FolderOpen className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Kütüphaneden Seç</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Fotoğraf Başlığı *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="Örn: VIP Arabuluculuk ve Müzakere Odası"
                className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Kategori</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
              >
                <option value="Ofis">Ofis</option>
                <option value="Toplantı Odaları">Toplantı Odaları</option>
                <option value="Kütüphane">Kütüphane</option>
                <option value="Tören">Tören & Etkinlik</option>
              </select>
            </div>

            {/* Görselde İşaretli Yer Kalsın: Görsel URL Adresi * */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Görsel URL Adresi *</label>
              <input
                type="text"
                required
                value={form.imageUrl}
                onChange={e => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Açıklama (Opsiyonel)</label>
            <input
              type="text"
              value={form.caption}
              onChange={e => setForm({ ...form, caption: e.target.value })}
              placeholder="Görsel altında görüntülenecek kısa not..."
              className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 transition-colors"
            >
              Vazgeç
            </button>
            <button type="submit" className="px-5 py-2 rounded-lg gold-btn text-xs font-bold">
              Fotoğrafı Ekle
            </button>
          </div>
        </form>
      )}

      {/* Medya Kütüphanesi Seçici Modalı */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={handleSelectFromLibrary}
      />

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {galleryItems.map(item => (
          <div
            key={item.id}
            className="group relative rounded-xl overflow-hidden bg-[#1C2E4A] border border-white/10 shadow-lg flex flex-col justify-between"
          >
            <div className="h-44 w-full relative overflow-hidden bg-slate-800">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-2 left-2 bg-[#0B132B]/85 text-[#C5A880] text-[10px] font-bold px-2 py-0.5 rounded">
                {item.category}
              </span>
            </div>

            <div className="p-3 space-y-1">
              <h4 className="text-xs font-bold text-white font-serif-heading truncate">{item.title}</h4>
              {item.caption && <p className="text-[11px] text-slate-400 line-clamp-1">{item.caption}</p>}
            </div>

            <div className="p-3 pt-0 flex justify-end">
              <button
                onClick={() => {
                  if (confirm(`"${item.title}" görselini silmek istediğinize emin misiniz?`)) {
                    deleteGalleryItem(item.id);
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
  );
};
