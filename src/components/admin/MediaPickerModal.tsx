import React, { useState, useRef } from 'react';
import { useCms } from '../../context/CmsContext';
import { X, Upload, Search, Check, Image as ImageIcon, Sparkles } from 'lucide-react';
import { compressImageFile } from '../../lib/imageCompressor';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string, title?: string) => void;
  title?: string;
}

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  title = 'Kütüphaneden Fotoğraf Seçin'
}) => {
  const { mediaItems, mediaCategories, addMediaItem } = useCms();
  const [activeCategory, setActiveCategory] = useState<string>('Tümü');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const { dataUrl, sizeStr } = await compressImageFile(file);
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
        const added = addMediaItem({
          title: nameWithoutExt,
          url: dataUrl,
          thumbnailUrl: dataUrl,
          category: 'Yüklenenler',
          size: sizeStr,
          uploadedAt: new Date().toISOString().split('T')[0]
        });

        // Eğer tek dosya yüklendiyse otomatik seç
        if (files.length === 1) {
          onSelect(added.url, added.title);
          onClose();
          setIsUploading(false);
          return;
        }
      }
    } catch (err) {
      console.error('Yükleme hatası:', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#0B132B] border border-[#C5A880]/40 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Başlığı */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#1C2E4A]/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#C5A880]/15 border border-[#C5A880]/40 flex items-center justify-center text-[#C5A880]">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white font-serif-heading">{title}</h3>
              <p className="text-[11px] text-slate-400">Görsele tıklayarak anında seçebilir veya cihazınızdan yeni fotoğraf yükleyebilirsiniz</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-3 py-1.5 rounded-lg bg-[#C5A880] hover:bg-[#b0936b] text-[#0B132B] font-bold text-xs flex items-center gap-1.5 transition-colors shadow"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{isUploading ? 'Yükleniyor...' : 'Cihazdan Yükle'}</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filtre ve Arama Barı */}
        <div className="p-3 sm:p-4 border-b border-white/10 bg-[#080E1F]/50 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap transition-colors font-medium ${
                  activeCategory === cat
                    ? 'bg-[#C5A880] text-[#0B132B] font-bold shadow'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Görsel ara..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#1C2E4A] border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#C5A880]"
            />
          </div>
        </div>

        {/* Görsel Izgarası */}
        <div className="p-4 overflow-y-auto flex-1 max-h-[60vh]">
          {filteredItems.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <ImageIcon className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-medium">Bu kategoride görsel bulunamadı.</p>
              <p className="text-xs text-slate-500 mt-1">Yukarıdaki "Cihazdan Yükle" butonuyla yeni fotoğraf ekleyebilirsiniz.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelect(item.url, item.title);
                    onClose();
                  }}
                  className="group relative rounded-xl overflow-hidden bg-[#1C2E4A] border border-white/10 hover:border-[#C5A880] cursor-pointer transition-all duration-200 hover:scale-[1.02] shadow-md flex flex-col"
                >
                  <div className="aspect-[4/3] w-full relative bg-slate-900 overflow-hidden">
                    <img
                      src={item.thumbnailUrl || item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="px-3 py-1 rounded-lg bg-[#C5A880] text-[#0B132B] font-bold text-xs flex items-center gap-1 shadow-lg">
                        <Check className="w-3.5 h-3.5" />
                        Seç
                      </span>
                    </div>
                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[10px] text-slate-300 font-medium">
                      {item.category}
                    </span>
                  </div>
                  <div className="p-2 bg-[#1C2E4A]">
                    <p className="text-xs font-medium text-white truncate group-hover:text-[#C5A880] transition-colors">
                      {item.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Altlığı */}
        <div className="p-3 sm:p-4 border-t border-white/10 bg-[#1C2E4A]/40 flex items-center justify-between text-xs text-slate-400">
          <span>Toplam {mediaItems.length} görsel kayıtlı</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
