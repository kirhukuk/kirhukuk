import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { Camera, X, ZoomIn } from 'lucide-react';
import { GalleryItem } from '../../types';

export const GalleryPage: React.FC = () => {
  const { galleryItems, navigate } = useCms();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeImage, setActiveImage] = useState<GalleryItem | null>(null);

  const activeGallery = galleryItems.filter(g => g.isActive);
  const categories = ['all', ...Array.from(new Set(activeGallery.map(g => g.category)))];

  const filtered =
    activeCategory === 'all'
      ? activeGallery
      : activeGallery.filter(g => g.category === activeCategory);

  return (
    <div id="gallery-page" className="pt-28 pb-24 px-4 sm:px-6 bg-[#F8FAFC] min-h-screen text-slate-800">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button onClick={() => navigate('home')} className="hover:text-[#9A7B4F] transition-colors">
            Ana Sayfa
          </button>
          <span>/</span>
          <span className="text-[#9A7B4F] font-semibold">Ofis Galerisi</span>
        </div>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#C5A880]/40 text-xs text-[#9A7B4F] font-semibold uppercase tracking-wider shadow-xs">
            <Camera className="w-3.5 h-3.5 text-[#9A7B4F]" />
            <span>Büromuzdan Kareler</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif-heading text-slate-900 tracking-normal leading-[1.25]">
            Ofis Galerisi
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Müvekkillerimizi ağırladığımız modern çalışma ofisimiz, kütüphanemiz ve toplantı odalarımız.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-[#9A7B4F] text-white font-semibold shadow-xs'
                  : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {cat === 'all' ? 'Tüm Fotoğraflar' : cat}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(item => (
            <div
              key={item.id}
              onClick={() => setActiveImage(item)}
              className="group relative h-72 rounded-2xl overflow-hidden border border-slate-200 cursor-pointer shadow-sm bg-slate-100"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5">
                <span className="text-[11px] text-[#C5A880] font-semibold uppercase tracking-wider">
                  {item.category}
                </span>
                <h4 className="text-base font-bold text-white font-serif-heading">
                  {item.title}
                </h4>
                {item.caption && (
                  <p className="text-xs text-slate-200 mt-1 line-clamp-2">
                    {item.caption}
                  </p>
                )}
                <div className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white">
                  <ZoomIn className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {activeImage && (
          <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setActiveImage(null)}
          >
            <div
              className="relative max-w-4xl w-full bg-[#1C2E4A] border border-[#C5A880]/40 rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveImage(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="max-h-[75vh] w-full overflow-hidden bg-black flex items-center justify-center">
                <img
                  src={activeImage.imageUrl}
                  alt={activeImage.title}
                  className="max-h-[75vh] w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-6 bg-[#1C2E4A] space-y-1">
                <span className="text-xs text-[#C5A880] uppercase tracking-wider font-semibold">
                  {activeImage.category}
                </span>
                <h3 className="text-lg font-bold text-white font-serif-heading">
                  {activeImage.title}
                </h3>
                {activeImage.caption && (
                  <p className="text-xs text-slate-300">
                    {activeImage.caption}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
