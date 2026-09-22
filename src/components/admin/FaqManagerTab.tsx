import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { Plus, Trash2, Edit2, HelpCircle, X, Search } from 'lucide-react';
import { FaqItem } from '../../types';

export const FaqManagerTab: React.FC = () => {
  const { faqItems, addFaqItem, updateFaqItem, deleteFaqItem } = useCms();

  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [search, setSearch] = useState('');

  const initialForm: Partial<FaqItem> = {
    question: '',
    answer: '',
    category: 'Genel & Vekaletname',
    order: faqItems.length + 1,
    isActive: true
  };

  const [form, setForm] = useState<Partial<FaqItem>>(initialForm);

  const handleStartAdd = () => {
    setForm({ ...initialForm, order: faqItems.length + 1 });
    setIsAdding(true);
    setIsEditing(null);
  };

  const handleStartEdit = (item: FaqItem) => {
    setIsEditing(item.id);
    setForm({ ...item });
    setIsAdding(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.question || !form.answer) return;

    if (isEditing) {
      updateFaqItem(isEditing, form);
      setIsEditing(null);
    } else {
      addFaqItem({
        question: form.question!,
        answer: form.answer!,
        category: form.category || 'Genel & Vekaletname',
        order: Number(form.order) || faqItems.length + 1,
        isActive: form.isActive !== undefined ? form.isActive : true
      });
      setIsAdding(false);
    }
  };

  const filtered = faqItems.filter(
    f =>
      f.question.toLocaleLowerCase('tr-TR').includes(search.toLocaleLowerCase('tr-TR')) ||
      f.answer.toLocaleLowerCase('tr-TR').includes(search.toLocaleLowerCase('tr-TR'))
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold font-serif-heading text-white">
            Sık Sorulan Sorular (SSS) Yönetimi ({faqItems.length})
          </h2>
          <p className="text-xs text-slate-400">
            Müvekkillerin en çok merak ettiği soruları ve hukuki aydınlatma yanıtlarını yönetin.
          </p>
        </div>

        <button
          onClick={handleStartAdd}
          className="px-4 py-2.5 rounded-xl gold-btn text-xs font-bold flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Soru Ekle</span>
        </button>
      </div>

      {/* Add / Edit Form Modal */}
      {(isAdding || isEditing) && (
        <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-[#1C2E4A] border border-[#C5A880]/50 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-serif-heading">
              {isEditing ? 'Soruyu Düzenle' : 'Yeni Soru & Cevap Ekle'}
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
              <label className="block text-xs font-medium text-slate-300 mb-1">Soru Metni *</label>
              <input
                type="text"
                required
                value={form.question}
                onChange={e => setForm({ ...form, question: e.target.value })}
                placeholder="Örn: Avukatlık vekaletnamesi nasıl çıkarılır?"
                className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Kategori</label>
              <input
                type="text"
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                placeholder="Örn: Genel & Vekaletname"
                className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Hukuki Yanıt / Açıklama *</label>
            <textarea
              rows={4}
              required
              value={form.answer}
              onChange={e => setForm({ ...form, answer: e.target.value })}
              placeholder="Sorunun hukuki prosedürlere uygun ayrıntılı yanıtı..."
              className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Sıralama</label>
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
                <span>Aktif Olarak Sitede Yayınla</span>
              </label>
            </div>
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
              {isEditing ? 'Kaydet' : 'Soruyu Ekle'}
            </button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="bg-[#1C2E4A] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 bg-[#0B132B]/80 border-b border-white/5 flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Kayıtlı Sorular ({filtered.length})
          </span>
          <div className="relative max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Sorularda ara..."
              className="pl-8 pr-3 py-1.5 bg-[#1C2E4A] border border-white/10 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#C5A880]"
            />
          </div>
        </div>

        <div className="divide-y divide-white/5">
          {filtered.map(faq => (
            <div
              key={faq.id}
              className="p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3 hover:bg-white/5 transition-colors"
            >
              <div className="space-y-1 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white">{faq.question}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-[#C5A880]">
                    {faq.category}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{faq.answer}</p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    faq.isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700/40 text-slate-400'
                  }`}
                >
                  {faq.isActive ? 'Aktif' : 'Pasif'}
                </span>

                <button
                  onClick={() => handleStartEdit(faq)}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
                  title="Düzenle"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    if (confirm('Bu soruyu silmek istediğinize emin misiniz?')) {
                      deleteFaqItem(faq.id);
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
