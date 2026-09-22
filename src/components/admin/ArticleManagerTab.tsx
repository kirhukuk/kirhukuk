import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { Plus, Trash2, Edit2, FileText, Check, X, Search, Calendar, User } from 'lucide-react';
import { Article } from '../../types';
import { RichTextEditor } from '../common/RichTextEditor';
import { ImageInputWithPicker } from './ImageInputWithPicker';

export const ArticleManagerTab: React.FC = () => {
  const { articles, addArticle, updateArticle, deleteArticle } = useCms();

  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');

  const initialForm: Partial<Article> = {
    title: '',
    slug: '',
    category: 'Ceza Hukuku',
    author: 'Av. Abidin KIR',
    summary: '',
    content: '',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
    publishedAt: new Date().toISOString().split('T')[0],
    readTime: '5 dk okuma',
    isPublished: true
  };

  const [form, setForm] = useState<Partial<Article>>(initialForm);

  const handleStartAdd = () => {
    setForm(initialForm);
    setIsAdding(true);
    setIsEditing(null);
  };

  const handleStartEdit = (art: Article) => {
    setIsEditing(art.id);
    setForm({ ...art });
    setIsAdding(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.summary) return;

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

    if (isEditing) {
      updateArticle(isEditing, {
        ...form,
        slug: autoSlug
      });
      setIsEditing(null);
    } else {
      addArticle({
        title: form.title!,
        slug: autoSlug,
        category: form.category || 'Ceza Hukuku',
        author: form.author || 'Av. Abidin KIR',
        summary: form.summary!,
        content: form.content || form.summary!,
        image: form.image || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
        publishedAt: form.publishedAt || new Date().toISOString().split('T')[0],
        readTime: form.readTime || '5 dk okuma',
        isPublished: form.isPublished !== undefined ? form.isPublished : true
      });
      setIsAdding(false);
    }
  };

  const categories = ['all', ...Array.from(new Set(articles.map(a => a.category)))];

  const filtered = articles.filter(a => {
    const matchSearch = a.title.toLocaleLowerCase('tr-TR').includes(search.toLocaleLowerCase('tr-TR'));
    const matchCat = filterCat === 'all' || a.category === filterCat;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold font-serif-heading text-white">
            Makale & Hukuki Bilgi Yönetimi ({articles.length})
          </h2>
          <p className="text-xs text-slate-400">
            Hukuki makaleler, yargı kararı incelemeleri ve müvekkil bilgilendirme rehberlerini yönetin.
          </p>
        </div>

        <button
          onClick={handleStartAdd}
          className="px-4 py-2.5 rounded-xl gold-btn text-xs font-bold flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Makale Yaz</span>
        </button>
      </div>

      {/* Add / Edit Form Modal with Rich Text Editor */}
      {(isAdding || isEditing) && (
        <form noValidate onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl bg-[#1C2E4A] border border-[#C5A880]/50 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-serif-heading">
              {isEditing ? `Makaleyi Düzenle: ${form.title}` : 'Yeni Hukuki Makale Oluştur'}
            </h3>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setIsEditing(null);
              }}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Makale Başlığı *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="Örn: 2026 Yılı Kıdem ve İhbar Tazminatı Hesaplama Esasları"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">URL / Slug (Opsiyonel)</label>
              <input
                type="text"
                value={form.slug}
                onChange={e => setForm({ ...form, slug: e.target.value })}
                placeholder="Örn: kidem-tazminati-hesaplama-2026"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Hukuk Kategorisi</label>
              <input
                type="text"
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                placeholder="Örn: İş Hukuku"
                className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Yazar Avukat</label>
              <input
                type="text"
                value={form.author}
                onChange={e => setForm({ ...form, author: e.target.value })}
                placeholder="Örn: Av. Abidin KIR"
                className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Yayın Tarihi</label>
              <input
                type="date"
                value={form.publishedAt}
                onChange={e => setForm({ ...form, publishedAt: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Tahmini Okuma Süresi</label>
              <input
                type="text"
                value={form.readTime}
                onChange={e => setForm({ ...form, readTime: e.target.value })}
                placeholder="Örn: 6 dk okuma"
                className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
              />
            </div>
          </div>

          <div>
            <ImageInputWithPicker
              label="Öne Çıkan Kapak Görseli URL"
              value={form.image || ''}
              onChange={val => setForm({ ...form, image: val })}
              placeholder="https://... veya galeriden seçin"
              category="Hukuk"
              helperText="Makale kartında ve detay sayfasında kapak resmi olarak gösterilir."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Kısa Özet (Arama motorları ve kartlar için)</label>
            <textarea
              rows={2}
              required
              value={form.summary}
              onChange={e => setForm({ ...form, summary: e.target.value })}
              placeholder="Makalenin ana fikrini özetleyen 1-2 cümle..."
              className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
            />
          </div>

          {/* Rich Text Editor Component */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Makale Detaylı İçeriği (Zengin Metin / Markdown)
            </label>
            <RichTextEditor
              value={form.content || ''}
              onChange={val => setForm({ ...form, content: val })}
              placeholder="Hukuki değerlendirme, kanun maddeleri ve içtihat analizlerinizi buraya yazabilirsiniz..."
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={e => setForm({ ...form, isPublished: e.target.checked })}
                className="rounded bg-[#0B132B] border-white/20 text-[#C5A880]"
              />
              <span>Hemen Yayına Al (İşaret kaldırılırsa taslak olarak kalır)</span>
            </label>

            <div className="flex items-center gap-2">
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
                className="px-6 py-2.5 rounded-lg gold-btn text-xs font-bold shadow-lg"
              >
                {isEditing ? 'Makaleyi Güncelle' : 'Makaleyi Yayınla'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Makale başlığında ara..."
            className="w-full pl-9 pr-3 py-2 bg-[#1C2E4A] border border-white/10 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#C5A880]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setFilterCat(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                filterCat === c
                  ? 'bg-[#C5A880] text-[#0B132B] font-bold'
                  : 'bg-[#1C2E4A] text-slate-300 hover:text-white border border-white/10'
              }`}
            >
              {c === 'all' ? 'Tümü' : c}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-[#1C2E4A] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="divide-y divide-white/5">
          {filtered.map(article => (
            <div
              key={article.id}
              className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-start gap-4">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-20 h-16 rounded-lg object-cover border border-white/10 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-[#C5A880] font-semibold">
                      {article.category}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        article.isPublished
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {article.isPublished ? 'Yayında' : 'Taslak'}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white font-serif-heading">
                    {article.title}
                  </h4>

                  <div className="flex items-center gap-4 text-[11px] text-slate-400">
                    <span>Yazar: {article.author}</span>
                    <span>•</span>
                    <span>Tarih: {article.publishedAt}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto">
                <button
                  onClick={() => updateArticle(article.id, { isPublished: !article.isPublished })}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 transition-colors"
                >
                  {article.isPublished ? 'Taslağa Al' : 'Yayınla'}
                </button>

                <button
                  onClick={() => handleStartEdit(article)}
                  className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
                  title="Düzenle"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    if (confirm(`"${article.title}" başlıklı makaleyi silmek istediğinize emin misiniz?`)) {
                      deleteArticle(article.id);
                    }
                  }}
                  className="p-2 rounded-lg text-rose-400 hover:text-rose-200 hover:bg-rose-500/10"
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
