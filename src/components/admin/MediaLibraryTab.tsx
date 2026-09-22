import React, { useState, useRef } from 'react';
import { useCms } from '../../context/CmsContext';
import {
  Upload,
  Plus,
  Trash2,
  Edit2,
  Copy,
  Check,
  Search,
  Image as ImageIcon,
  FolderOpen,
  Eye,
  ExternalLink,
  Sparkles,
  Camera,
  X,
  AlertCircle
} from 'lucide-react';
import { compressImageFile } from '../../lib/imageCompressor';
import { MediaItem } from '../../types';

export const MediaLibraryTab: React.FC = () => {
  const {
    mediaItems,
    mediaCategories,
    addMediaItem,
    updateMediaItem,
    deleteMediaItem,
    addMediaCategory,
    updateMediaCategory,
    deleteMediaCategory,
    addGalleryItem,
    galleryItems
  } = useCms();

  const [activeCategory, setActiveCategory] = useState<string>('Tümü');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [addedToGalleryId, setAddedToGalleryId] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);

  // Kategori Yönetim Modalları
  const [isAddCatModalOpen, setIsAddCatModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [editingCatOldName, setEditingCatOldName] = useState<string | null>(null);
  const [editingCatNewName, setEditingCatNewName] = useState('');
  const [deletingCatName, setDeletingCatName] = useState<string | null>(null);

  // Düzenleme Modalı
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    category: 'Ofis',
    url: ''
  });
  const [isEditUploading, setIsEditUploading] = useState(false);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Silme Onay Modalı
  const [deletingItem, setDeletingItem] = useState<MediaItem | null>(null);

  // URL ile ekleme modalı
  const [isAddingUrl, setIsAddingUrl] = useState(false);
  const [urlForm, setUrlForm] = useState({
    title: '',
    url: '',
    category: 'Ofis'
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const availableCategories = mediaCategories && mediaCategories.length > 0
    ? mediaCategories
    : ['Ofis', 'Toplantı', 'Kütüphane', 'Ekip', 'Hukuk', 'Yüklenenler'];

  const categories = ['Tümü', ...availableCategories];

  const filteredItems = mediaItems.filter(item => {
    const itemCat = (item.category || '').toLowerCase();
    const activeLower = activeCategory.toLowerCase();

    const matchesCat =
      activeCategory === 'Tümü' ||
      itemCat === activeLower ||
      itemCat.includes(activeLower) ||
      (activeCategory === 'Toplantı' && itemCat.includes('toplantı')) ||
      (activeCategory === 'Ekip' && itemCat.includes('ekip')) ||
      (activeCategory === 'Yüklenenler' && (item.id.startsWith('media-') && !item.id.startsWith('media-1') && !item.id.startsWith('media-2')));

    const matchesSearch =
      !searchTerm ||
      (item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      itemCat.includes(searchTerm.toLowerCase());

    return matchesCat && matchesSearch;
  });

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const { dataUrl, sizeStr } = await compressImageFile(file);
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");

        addMediaItem({
          title: nameWithoutExt,
          url: dataUrl,
          thumbnailUrl: dataUrl,
          category: 'Yüklenenler',
          size: sizeStr,
          uploadedAt: new Date().toISOString().split('T')[0]
        });
      }
    } catch (err) {
      console.error('Yükleme hatası:', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddToGallery = (item: MediaItem) => {
    addGalleryItem({
      title: item.title,
      imageUrl: item.url,
      category: item.category === 'Toplantı' ? 'Toplantı Odaları' : item.category,
      caption: `${item.title} - KIR HUKUK Arşivi`,
      isActive: true,
      order: galleryItems.length + 1
    });
    setAddedToGalleryId(item.id);
    setTimeout(() => setAddedToGalleryId(null), 2500);
  };

  const handleAddUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlForm.title || !urlForm.url) return;

    addMediaItem({
      title: urlForm.title,
      url: urlForm.url,
      thumbnailUrl: urlForm.url,
      category: urlForm.category,
      size: 'Harici URL',
      uploadedAt: new Date().toISOString().split('T')[0]
    });

    setIsAddingUrl(false);
    setUrlForm({ title: '', url: '', category: 'Ofis' });
  };

  const handleStartEdit = (item: MediaItem) => {
    setEditingItem(item);
    setEditForm({
      title: item.title,
      category: item.category || 'Ofis',
      url: item.url
    });
  };

  const handleReplaceEditFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsEditUploading(true);
    try {
      const file = files[0];
      const { dataUrl } = await compressImageFile(file);
      setEditForm(prev => ({
        ...prev,
        url: dataUrl
      }));
    } catch (err) {
      console.error('Fotoğraf değiştirme hatası:', err);
    } finally {
      setIsEditUploading(false);
      if (editFileInputRef.current) editFileInputRef.current.value = '';
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    if (!editForm.title.trim() || !editForm.url.trim()) return;

    updateMediaItem(editingItem.id, {
      title: editForm.title.trim(),
      category: editForm.category.trim() || 'Genel',
      url: editForm.url.trim(),
      thumbnailUrl: editForm.url.trim()
    });
    setEditingItem(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingItem) return;
    deleteMediaItem(deletingItem.id);
    setDeletingItem(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Başlık ve İşlemler */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-serif-heading text-white">
              Medya & Fotoğraf Kütüphanesi
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#C5A880]/20 text-[#C5A880] text-xs font-bold border border-[#C5A880]/30">
              {mediaItems.length} Görsel
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Hukuk bürosu çalışma alanları, kütüphane, toplantı salonları ve dilediğiniz fotoğrafları yükleyip yönetin.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAddingUrl(true)}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>URL ile Ekle</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-4 py-2 rounded-xl gold-btn text-xs font-bold flex items-center gap-2 shadow-lg"
          >
            <Upload className="w-4 h-4" />
            <span>{isUploading ? 'Yükleniyor...' : 'Cihazdan Fotoğraf Yükle'}</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={e => handleFiles(e.target.files)}
            className="hidden"
          />
        </div>
      </div>

      {/* Sürükle Bırak Yükleme Alanı */}
      <div
        onDragOver={e => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={e => {
          e.preventDefault();
          setIsDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragOver
            ? 'border-[#C5A880] bg-[#C5A880]/10 scale-[1.005]'
            : 'border-white/15 bg-[#1C2E4A]/40 hover:border-[#C5A880]/60 hover:bg-[#1C2E4A]/70'
        }`}
      >
        <div className="w-12 h-12 rounded-full bg-[#C5A880]/15 border border-[#C5A880]/30 flex items-center justify-center mx-auto text-[#C5A880] mb-3">
          <Upload className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-white">
          Fotoğrafları buraya sürükleyip bırakın veya <span className="text-[#C5A880] underline">dosya seçin</span>
        </p>
        <p className="text-xs text-slate-400 mt-1">
          JPG, PNG, WebP formatları desteklenir. Mobil galerinizden veya bilgisayarınızdan doğrudan yükleyebilirsiniz.
        </p>
      </div>

      {/* Filtreleme ve Arama */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none py-1">
          {/* Tümü Sekmesi */}
          <button
            type="button"
            onClick={() => setActiveCategory('Tümü')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0 ${
              activeCategory === 'Tümü'
                ? 'bg-[#C5A880] text-[#0B132B] font-bold shadow-md'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
            }`}
          >
            <span>Tümü</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              activeCategory === 'Tümü' ? 'bg-[#0B132B]/15 text-[#0B132B] font-bold' : 'bg-white/10 text-slate-400'
            }`}>
              {mediaItems.length}
            </span>
          </button>

          {/* Dinamik Başlıklar (Kategoriler) ve Düzenleme/Silme İkonları */}
          {availableCategories.map(cat => {
            const count = mediaItems.filter(m => (m.category || '').toLowerCase() === cat.toLowerCase()).length;
            const isActive = activeCategory.toLowerCase() === cat.toLowerCase();

            return (
              <div
                key={cat}
                className={`inline-flex items-center rounded-lg text-xs whitespace-nowrap transition-all flex-shrink-0 border ${
                  isActive
                    ? 'bg-[#C5A880] text-[#0B132B] border-[#C5A880] shadow-md font-bold'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                }`}
              >
                {/* Başlık İsmi ve Görsel Sayısı */}
                <button
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className="px-2.5 py-1.5 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-[#0B132B]/20 text-[#0B132B] font-bold' : 'bg-white/10 text-slate-400'
                  }`}>
                    {count}
                  </span>
                </button>

                {/* Başlık Düzenleme ve Silme İkonları */}
                <div className={`flex items-center gap-0.5 pr-1.5 pl-0.5 border-l ${
                  isActive ? 'border-[#0B132B]/20' : 'border-white/10'
                }`}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingCatOldName(cat);
                      setEditingCatNewName(cat);
                    }}
                    title={`"${cat}" Başlığını Düzenle`}
                    className={`p-1 rounded-md transition-colors cursor-pointer ${
                      isActive
                        ? 'hover:bg-[#0B132B]/15 text-[#0B132B]'
                        : 'hover:bg-white/10 text-slate-400 hover:text-[#C5A880]'
                    }`}
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeletingCatName(cat);
                    }}
                    title={`"${cat}" Başlığını Sil`}
                    className={`p-1 rounded-md transition-colors cursor-pointer ${
                      isActive
                        ? 'hover:bg-rose-950/20 text-rose-950'
                        : 'hover:bg-rose-500/20 text-slate-400 hover:text-rose-400'
                    }`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Yeni Başlık Ekleme İkonu / Butonu */}
          <button
            type="button"
            onClick={() => {
              setNewCatName('');
              setIsAddCatModalOpen(true);
            }}
            title="Yeni Medya Başlığı / Kategori Ekle"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap bg-[#C5A880]/15 hover:bg-[#C5A880]/25 text-[#C5A880] border border-[#C5A880]/40 flex items-center gap-1.5 transition-colors cursor-pointer flex-shrink-0 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Başlık Ekle</span>
          </button>
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Kütüphanede ara..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#1C2E4A] border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#C5A880]"
          />
        </div>
      </div>

      {/* Medya Izgarası */}
      {filteredItems.length === 0 ? (
        <div className="py-16 text-center text-slate-400 bg-[#1C2E4A]/20 rounded-2xl border border-white/5">
          <FolderOpen className="w-12 h-12 mx-auto text-slate-600 mb-2" />
          <p className="text-sm font-medium">Bu kategoride fotoğraf bulunamadı.</p>
          <p className="text-xs text-slate-500 mt-1">Yukarıdaki yükleme alanından fotoğraf ekleyebilirsiniz.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="group relative rounded-xl overflow-hidden bg-[#1C2E4A] border border-white/10 hover:border-[#C5A880]/50 shadow-lg flex flex-col justify-between transition-all duration-200"
            >
              <div className="aspect-[4/3] w-full relative bg-slate-900 overflow-hidden">
                <img
                  src={item.thumbnailUrl || item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-[#C5A880] text-[10px] font-bold px-2 py-0.5 rounded">
                  {item.category}
                </span>

                {/* Hızlı İşlem Düğmeleri - Görsel Üzeri */}
                <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
                  <button
                    type="button"
                    onClick={() => setPreviewItem(item)}
                    title="Büyük Görseli İncele"
                    className="p-1.5 rounded-lg bg-black/75 hover:bg-black text-white transition-colors cursor-pointer shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStartEdit(item)}
                    title="Görseli / Bilgileri Düzenle"
                    className="p-1.5 rounded-lg bg-black/75 hover:bg-[#C5A880] text-white hover:text-[#0B132B] transition-colors cursor-pointer shadow-xs"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingItem(item)}
                    title="Kütüphaneden Sil"
                    className="p-1.5 rounded-lg bg-black/75 hover:bg-rose-600 text-white transition-colors cursor-pointer shadow-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Bilgiler ve Aksiyonlar */}
              <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white font-serif-heading truncate" title={item.title}>
                    {item.title}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                    <span>{item.size || 'Görsel'}</span>
                    <span>{item.uploadedAt}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(item.url, item.id)}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 text-[11px] font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    title="URL Adresini Kopyala"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold">Kopyalandı</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>URL Kopyala</span>
                      </>
                    )}
                  </button>

                  {/* Düzenleme İkonu */}
                  <button
                    type="button"
                    onClick={() => handleStartEdit(item)}
                    title="Görsel Bilgilerini Düzenle"
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-[#C5A880]/20 text-slate-300 hover:text-[#C5A880] border border-white/10 hover:border-[#C5A880]/40 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Silme İkonu */}
                  <button
                    type="button"
                    onClick={() => setDeletingItem(item)}
                    title="Görseli Kütüphaneden Sil"
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-white/10 hover:border-rose-500/40 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAddToGallery(item)}
                    title="Ofis Galerisine Ekle"
                    className="p-1.5 rounded-lg bg-[#C5A880]/15 hover:bg-[#C5A880]/25 text-[#C5A880] text-[11px] font-medium flex items-center justify-center transition-colors border border-[#C5A880]/30 cursor-pointer"
                  >
                    {addedToGalleryId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Camera className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* URL ile Görsel Ekle Modal */}
      {isAddingUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <form
            onSubmit={handleAddUrlSubmit}
            className="bg-[#0B132B] border border-[#C5A880]/40 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-bold text-white font-serif-heading">URL ile Kütüphaneye Ekle</h3>
              <button
                type="button"
                onClick={() => setIsAddingUrl(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Görsel Başlığı *</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Hukuk Kütüphanesi Arşivi"
                  value={urlForm.title}
                  onChange={e => setUrlForm({ ...urlForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#1C2E4A] border border-white/10 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Kategori</label>
                <select
                  value={urlForm.category}
                  onChange={e => setUrlForm({ ...urlForm, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#1C2E4A] border border-white/10 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                >
                  {availableCategories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  {!availableCategories.includes('Genel') && <option value="Genel">Genel</option>}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Görsel URL Adresi *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={urlForm.url}
                  onChange={e => setUrlForm({ ...urlForm, url: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#1C2E4A] border border-white/10 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsAddingUrl(false)}
                className="px-4 py-2 rounded-lg bg-white/5 text-xs text-slate-300 hover:bg-white/10"
              >
                Vazgeç
              </button>
              <button type="submit" className="px-4 py-2 rounded-lg gold-btn text-xs font-bold">
                Kütüphaneye Kaydet
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Büyük Önizleme Modal */}
      {previewItem && (
        <div
          onClick={() => setPreviewItem(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm cursor-pointer"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="max-w-3xl w-full bg-[#0B132B] rounded-2xl overflow-hidden border border-[#C5A880]/30 shadow-2xl"
          >
            <div className="p-4 flex items-center justify-between border-b border-white/10 bg-[#1C2E4A]">
              <div>
                <h4 className="text-sm font-bold text-white font-serif-heading">{previewItem.title}</h4>
                <p className="text-[11px] text-[#C5A880]">{previewItem.category} • {previewItem.uploadedAt}</p>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={previewItem.url}
                alt={previewItem.title}
                className="max-w-full max-h-[70vh] object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-3 bg-[#1C2E4A] flex items-center justify-between">
              <span className="text-xs text-slate-300 truncate max-w-md">{previewItem.url}</span>
              <button
                onClick={() => handleCopyUrl(previewItem.url, previewItem.id)}
                className="px-3 py-1 rounded bg-[#C5A880] text-[#0B132B] font-bold text-xs"
              >
                URL Kopyala
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Medya Düzenleme Modalı */}
      {editingItem && (
        <div
          onClick={() => setEditingItem(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="max-w-md w-full bg-[#0B132B] rounded-2xl overflow-hidden border border-[#C5A880]/40 shadow-2xl animate-in zoom-in-95 duration-150"
          >
            <div className="p-4 flex items-center justify-between border-b border-white/10 bg-[#1C2E4A]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#C5A880]/20 text-[#C5A880]">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-serif-heading">Medyayı Düzenle</h4>
                  <p className="text-[11px] text-[#C5A880]">Görsel başlığı, kategori ve bağlantı ayarları</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-4">
              {/* Görsel Önizleme ve Değiştirme */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="w-20 h-16 rounded-lg bg-black/40 overflow-hidden flex-shrink-0 border border-white/10">
                  <img
                    src={editForm.url || editingItem.thumbnailUrl || editingItem.url}
                    alt="Önizleme"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{editForm.title || editingItem.title}</p>
                  <p className="text-[11px] text-slate-400 mb-2">{editingItem.size || 'Görsel'} • {editingItem.uploadedAt}</p>
                  <input
                    type="file"
                    ref={editFileInputRef}
                    onChange={handleReplaceEditFile}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={isEditUploading}
                    onClick={() => editFileInputRef.current?.click()}
                    className="text-[11px] font-semibold text-[#C5A880] hover:text-[#e0c9a6] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Upload className="w-3 h-3" />
                    <span>{isEditUploading ? 'İşleniyor...' : 'Cihazdan Yeni Fotoğraf Seç'}</span>
                  </button>
                </div>
              </div>

              {/* Başlık */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Görsel Başlığı / Açıklama *</label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                  placeholder="Örn: KIR HUKUK Bursa Yönetim Ofisi"
                  className="w-full px-3.5 py-2 rounded-lg bg-[#1C2E4A] border border-white/10 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Kategori *</label>
                <select
                  value={editForm.category}
                  onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg bg-[#1C2E4A] border border-white/10 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                >
                  {availableCategories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  {!availableCategories.includes(editForm.category) && editForm.category && (
                    <option value={editForm.category}>{editForm.category}</option>
                  )}
                  {!availableCategories.includes('Genel') && <option value="Genel">Genel</option>}
                </select>
              </div>

              {/* Görsel URL */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Görsel URL Adresi *</label>
                <input
                  type="text"
                  required
                  value={editForm.url}
                  onChange={e => setEditForm({ ...editForm, url: e.target.value })}
                  placeholder="https://... veya data:image/..."
                  className="w-full px-3.5 py-2 rounded-lg bg-[#1C2E4A] border border-white/10 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-lg bg-white/5 text-xs text-slate-300 hover:bg-white/10 cursor-pointer transition-colors"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg gold-btn text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Değişiklikleri Kaydet</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Silme Onay Modalı */}
      {deletingItem && (
        <div
          onClick={() => setDeletingItem(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="max-w-md w-full bg-[#0B132B] rounded-2xl overflow-hidden border border-rose-500/40 shadow-2xl animate-in zoom-in-95 duration-150"
          >
            <div className="p-4 flex items-center justify-between border-b border-white/10 bg-[#1C2E4A]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
                  <Trash2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-serif-heading">Medyayı Sil</h4>
                  <p className="text-[11px] text-rose-300">Bu işlem görseli kütüphaneden kaldırır</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <div className="w-16 h-14 rounded-lg bg-black/40 overflow-hidden flex-shrink-0 border border-white/10">
                  <img
                    src={deletingItem.thumbnailUrl || deletingItem.url}
                    alt={deletingItem.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-bold text-white truncate">{deletingItem.title}</h5>
                  <p className="text-[11px] text-slate-400">{deletingItem.category} • {deletingItem.size || 'Görsel'}</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>"{deletingItem.title}"</strong> başlıklı görsel medya kütüphanesinden silinecektir. Silmek istediğinizden emin misiniz?
              </p>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setDeletingItem(null)}
                  className="px-4 py-2 rounded-lg bg-white/5 text-xs text-slate-300 hover:bg-white/10 cursor-pointer transition-colors"
                >
                  Vazgeç
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Evet, Görseli Sil</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Yeni Medya Başlığı / Kategori Ekle */}
      {isAddCatModalOpen && (
        <div
          onClick={() => setIsAddCatModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="max-w-md w-full bg-[#0B132B] rounded-2xl overflow-hidden border border-[#C5A880]/40 shadow-2xl animate-in zoom-in-95 duration-150"
          >
            <div className="p-4 flex items-center justify-between border-b border-white/10 bg-[#1C2E4A]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#C5A880]/20 text-[#C5A880]">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-serif-heading">Yeni Başlık Ekle</h4>
                  <p className="text-[11px] text-slate-300">Medya kütüphanesine yeni bir kategori başlığı ekleyin</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddCatModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const trimmed = newCatName.trim();
                if (!trimmed) return;
                addMediaCategory(trimmed);
                setActiveCategory(trimmed);
                setNewCatName('');
                setIsAddCatModalOpen(false);
              }}
              className="p-5 space-y-4"
            >
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Başlık / Kategori İsmi *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="Örn: Arşiv, Duruşma Odaları, Sertifikalar..."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#1C2E4A] border border-white/15 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#C5A880]"
                />
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Bu başlık kütüphanenin üst sekmesinde ve görsel yükleme menülerinde yer alacaktır.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddCatModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-white/5 text-xs text-slate-300 hover:bg-white/10 cursor-pointer transition-colors"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={!newCatName.trim()}
                  className="px-5 py-2 rounded-lg bg-[#C5A880] hover:bg-[#b0936d] text-[#0B132B] text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-colors disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  <span>Başlığı Ekle</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Başlığı Düzenle */}
      {editingCatOldName && (
        <div
          onClick={() => setEditingCatOldName(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="max-w-md w-full bg-[#0B132B] rounded-2xl overflow-hidden border border-[#C5A880]/40 shadow-2xl animate-in zoom-in-95 duration-150"
          >
            <div className="p-4 flex items-center justify-between border-b border-white/10 bg-[#1C2E4A]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#C5A880]/20 text-[#C5A880]">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-serif-heading">Başlığı Düzenle</h4>
                  <p className="text-[11px] text-slate-300">"{editingCatOldName}" başlığını yeniden adlandırın</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingCatOldName(null)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const trimmed = editingCatNewName.trim();
                if (!trimmed || !editingCatOldName) return;
                updateMediaCategory(editingCatOldName, trimmed);
                if (activeCategory.toLowerCase() === editingCatOldName.toLowerCase()) {
                  setActiveCategory(trimmed);
                }
                setEditingCatOldName(null);
                setEditingCatNewName('');
              }}
              className="p-5 space-y-4"
            >
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Yeni Başlık İsmi *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={editingCatNewName}
                  onChange={(e) => setEditingCatNewName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#1C2E4A] border border-white/15 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                />
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Başlığı değiştirdiğinizde, bu başlığa ait tüm fotoğraflar otomatik olarak yeni başlığa aktarılır.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingCatOldName(null)}
                  className="px-4 py-2 rounded-lg bg-white/5 text-xs text-slate-300 hover:bg-white/10 cursor-pointer transition-colors"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={!editingCatNewName.trim() || editingCatNewName.trim() === editingCatOldName}
                  className="px-5 py-2 rounded-lg bg-[#C5A880] hover:bg-[#b0936d] text-[#0B132B] text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-colors disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>Değişikliği Kaydet</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Başlığı Sil Onayı */}
      {deletingCatName && (
        <div
          onClick={() => setDeletingCatName(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="max-w-md w-full bg-[#0B132B] rounded-2xl overflow-hidden border border-rose-500/40 shadow-2xl animate-in zoom-in-95 duration-150"
          >
            <div className="p-4 flex items-center justify-between border-b border-white/10 bg-[#1C2E4A]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
                  <Trash2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-serif-heading">Başlığı Sil</h4>
                  <p className="text-[11px] text-rose-300">"{deletingCatName}" başlığını kaldırmak üzeresiniz</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDeletingCatName(null)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">
                <strong>"{deletingCatName}"</strong> başlığını silmek istediğinizden emin misiniz? Bu başlık altındaki mevcut fotoğraflarınız <strong>silinmez</strong>; güvenle saklanarak <strong>Genel</strong> başlığına aktarılır.
              </p>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setDeletingCatName(null)}
                  className="px-4 py-2 rounded-lg bg-white/5 text-xs text-slate-300 hover:bg-white/10 cursor-pointer transition-colors"
                >
                  Vazgeç
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteMediaCategory(deletingCatName);
                    if (activeCategory.toLowerCase() === deletingCatName.toLowerCase()) {
                      setActiveCategory('Tümü');
                    }
                    setDeletingCatName(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Evet, Başlığı Sil</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
