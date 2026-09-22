import React, { useState, useRef } from 'react';
import { Upload, FolderOpen, Image as ImageIcon, X } from 'lucide-react';
import { MediaPickerModal } from './MediaPickerModal';
import { compressImageFile } from '../../lib/imageCompressor';
import { useCms } from '../../context/CmsContext';

interface ImageInputWithPickerProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  helperText?: string;
  category?: string;
  required?: boolean;
}

export const ImageInputWithPicker: React.FC<ImageInputWithPickerProps> = ({
  label,
  value,
  onChange,
  placeholder = 'https://... veya galeriden seçin',
  helperText,
  category = 'Genel',
  required = false
}) => {
  const { addMediaItem } = useCms();
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDeviceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { dataUrl, sizeStr } = await compressImageFile(file);
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");

      // 1. Doğrudan inputa aktar
      onChange(dataUrl);

      // 2. Medya Kütüphanesine de ekle ki gelecekte tekrar kullanılabilsin
      addMediaItem({
        title: nameWithoutExt,
        url: dataUrl,
        thumbnailUrl: dataUrl,
        category: category || 'Yüklenenler',
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

  const handleSelectFromLibrary = (url: string) => {
    onChange(url);
  };

  return (
    <div className="space-y-1.5">
      {/* Etiket ve Hızlı Aksiyon Butonları */}
      <div className="flex items-center justify-between gap-2">
        <label className="block text-xs font-medium text-slate-300">
          {label} {required && <span className="text-[#C5A880]">*</span>}
        </label>

        <div className="flex items-center gap-1.5">
          {/* Galeriden / Kütüphaneden Seç Butonu */}
          <button
            type="button"
            onClick={() => setIsMediaPickerOpen(true)}
            className="px-2.5 py-1 rounded-md bg-[#C5A880]/15 hover:bg-[#C5A880]/25 text-[#C5A880] text-[11px] font-semibold flex items-center gap-1 transition-colors border border-[#C5A880]/30 shadow-xs"
            title="Kütüphane / Galeriden Seç"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Galeriden Seç</span>
          </button>

          {/* Cihazdan / Telefondan Yükle Butonu */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/15 text-white text-[11px] font-semibold flex items-center gap-1 transition-colors border border-white/10 shadow-xs"
            title="Telefon Galerisinden veya Bilgisayardan Fotoğraf Yükle"
          >
            <Upload className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>{isUploading ? 'Yükleniyor...' : 'Cihazdan Yükle'}</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleDeviceUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Input ve Önizleme Kutusu */}
      <div className="flex items-center gap-2">
        {/* Önizleme Thumbnail */}
        <div className="w-10 h-10 rounded-lg bg-[#0B132B] border border-white/15 flex items-center justify-center shrink-0 overflow-hidden relative group">
          {value ? (
            <>
              <img
                src={value}
                alt="Önizleme"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button
                type="button"
                onClick={() => onChange('')}
                className="absolute inset-0 bg-black/70 text-rose-400 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                title="Görseli Temizle"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <ImageIcon className="w-4 h-4 text-slate-500" />
          )}
        </div>

        {/* URL Input */}
        <div className="flex-1 relative">
          <input
            type="text"
            required={required}
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
          />
        </div>
      </div>

      {helperText && (
        <p className="text-[11px] text-slate-400">{helperText}</p>
      )}

      {/* Medya Seçici Modalı */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={handleSelectFromLibrary}
        title={`${label} için Görsel Seçin`}
      />
    </div>
  );
};
