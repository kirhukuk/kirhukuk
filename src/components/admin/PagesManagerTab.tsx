import React, { useState, useRef } from 'react';
import { useCms } from '../../context/CmsContext';
import { Plus, Trash2, Edit2, Layers, Check, X, Eye, Home, Compass, FileText, Info, GitBranch } from 'lucide-react';
import { CustomPage } from '../../types';
import { RichTextEditor } from '../common/RichTextEditor';
import { flattenMenuTree } from '../../utils/menuHelpers';

export const PagesManagerTab: React.FC = () => {
  const { customPages, menuItems, addCustomPage, updateCustomPage, deleteCustomPage, navigate } = useCms();

  const formRef = useRef<HTMLFormElement | null>(null);

  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const flatMenuOptions = flattenMenuTree(menuItems);

  const initialForm: Partial<CustomPage> = {
    title: '',
    slug: '',
    summary: '',
    badge: 'Bilgilendirme',
    content: '',
    isPublished: true,
    showOnHome: true,
    showInNavbar: true,
    showInFooter: true,
    parentMenuId: ''
  };

  const [form, setForm] = useState<Partial<CustomPage>>(initialForm);

  const handleStartAdd = () => {
    setForm(initialForm);
    setIsAdding(true);
    setIsEditing(null);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);
  };

  const handleStartEdit = (page: CustomPage) => {
    setIsEditing(page.id);
    setForm({
      ...page,
      showOnHome: page.showOnHome !== false,
      showInNavbar: page.showInNavbar !== false,
      showInFooter: page.showInFooter !== false,
      badge: page.badge || 'Bilgilendirme',
      parentMenuId: page.parentMenuId || ''
    });
    setIsAdding(false);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content) return;

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
      updateCustomPage(isEditing, {
        ...form,
        slug: autoSlug,
        parentMenuId: form.parentMenuId || undefined
      });
      setIsEditing(null);
    } else {
      addCustomPage({
        title: form.title!,
        slug: autoSlug,
        content: form.content!,
        summary: form.summary || '',
        badge: form.badge || 'Bilgilendirme',
        isPublished: form.isPublished !== undefined ? form.isPublished : true,
        showOnHome: form.showOnHome !== undefined ? form.showOnHome : true,
        showInNavbar: form.showInNavbar !== undefined ? form.showInNavbar : true,
        showInFooter: form.showInFooter !== undefined ? form.showInFooter : true,
        parentMenuId: form.parentMenuId || undefined
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
            Özel Sayfa & İçerik Yönetimi ({customPages.length})
          </h2>
          <p className="text-xs text-slate-400">
            KVKK aydınlatma metni, gizlilik politikası, rehberler ve özel bilgilendirme sayfalarını yönetin.
          </p>
        </div>

        <button
          onClick={handleStartAdd}
          className="px-4 py-2.5 rounded-xl gold-btn text-xs font-bold flex items-center gap-2 shadow-lg cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Sayfa Oluştur</span>
        </button>
      </div>

      {/* Bilgilendirme Kutusu */}
      <div className="p-4 rounded-xl bg-[#0B132B] border border-[#C5A880]/30 flex items-start gap-3 text-xs text-slate-300">
        <Info className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-white">
            Sayfalarınız Sitede Nerede Görünür?
          </p>
          <p className="text-slate-300 leading-relaxed">
            Burada eklediğiniz veya düzenlediğiniz tüm sayfalar; <strong className="text-[#C5A880]">Anasayfa Vitrini</strong>'nde ("Bilgilendirme ve Özel Sayfalarımız"), <strong className="text-[#C5A880]">Üst Menüde</strong> ve <strong className="text-[#C5A880]">Alt Bilgide (Footer)</strong> otomatik olarak görünür. Her sayfanın görünürlüğünü aşağıdaki formdan veya tek tıkla liste üzerinden değiştirebilirsiniz.
          </p>
        </div>
      </div>

      {/* Add / Edit Form Modal */}
      {(isAdding || isEditing) && (
        <form ref={formRef} onSubmit={handleSubmit} className="p-6 rounded-2xl bg-[#1C2E4A] border border-[#C5A880]/50 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-serif-heading">
              {isEditing ? `Sayfayı Düzenle: ${form.title}` : 'Yeni Özel Sayfa Oluştur'}
            </h3>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setIsEditing(null);
              }}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Sayfa Başlığı *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="Örn: Arabuluculuk Rehberi veya KVKK Politikası"
                className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">URL / Slug (Opsiyonel)</label>
              <input
                type="text"
                value={form.slug}
                onChange={e => setForm({ ...form, slug: e.target.value })}
                placeholder="Örn: arabuluculuk-rehberi (boş bırakılırsa başlıktan otomatik üretilir)"
                className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Kısa Özet (Anasayfa Kartında Görünen Metin)
              </label>
              <input
                type="text"
                value={form.summary || ''}
                onChange={e => setForm({ ...form, summary: e.target.value })}
                placeholder="Örn: Hukuki uyuşmazlıkların çözümünde arabuluculuk süreci..."
                className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Boş bırakılırsa sayfa içeriğinden ilk 140 karakter otomatik alınır.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Rozet / Etiket
              </label>
              <input
                type="text"
                value={form.badge || ''}
                onChange={e => setForm({ ...form, badge: e.target.value })}
                placeholder="Örn: Bilgilendirme, Yasal, Rehber, Duyuru"
                className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Sayfa İçeriği (Markdown & Zengin Metin) *
            </label>
            <RichTextEditor
              value={form.content || ''}
              onChange={val => setForm({ ...form, content: val })}
              placeholder="Yasal maddeler, başlıklar ve paragraflar..."
            />
          </div>

          {/* Menü Konumu & Alt Menü Bağlantısı */}
          <div className="p-4 rounded-xl bg-[#0B132B]/90 border border-[#C5A880]/30 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#C5A880] flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-[#C5A880]" />
                <span>Bu Sayfa Hangi Menü Altında Görünsün? (Menü Listesi Seçimi)</span>
              </label>
              {form.parentMenuId && (
                <button
                  type="button"
                  onClick={() => setForm({ ...form, parentMenuId: '' })}
                  className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
                >
                  Bağlantıyı Kaldır (Bağımsız Yap)
                </button>
              )}
            </div>

            <select
              value={form.parentMenuId || ''}
              onChange={e => setForm({ ...form, parentMenuId: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#1C2E4A] border border-white/20 text-white text-xs focus:outline-none focus:border-[#C5A880] font-medium"
            >
              <option value="">-- Bağımsız Sayfa (Menüye Bağlama, Doğrudan URL ile Erişilsin) --</option>
              {flatMenuOptions.map(opt => (
                <option key={opt.id} value={opt.id}>
                  {opt.depth === 0 ? '📁 ' : '\u00A0\u00A0\u00A0\u00A0'.repeat(opt.depth) + '↳ 📄 '}
                  {opt.path}
                </option>
              ))}
            </select>

            <p className="text-[11px] text-slate-300">
              💡 <strong>Nasıl Çalışır?</strong> Örneğin <code className="text-[#C5A880]">Hakkımızda</code> veya onun altındaki <code className="text-[#C5A880]">Bursa</code> menüsünü seçtiğinizde, bu sayfa doğrudan o menünün altında alt açılır menü öğesi olarak yayına alınır.
            </p>
          </div>

          {/* Görünürlük Ayarları */}
          <div className="p-3.5 rounded-xl bg-[#0B132B]/80 border border-white/10 space-y-2">
            <p className="text-xs font-bold text-[#C5A880]">Yayın & Görünürlük Kanalları</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              <label className="flex items-center gap-2 text-xs text-white cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={e => setForm({ ...form, isPublished: e.target.checked })}
                  className="rounded bg-[#0B132B] border-white/20 text-emerald-400 w-4 h-4 cursor-pointer"
                />
                <span className="font-semibold text-emerald-300">Yayında Göster (Aktif)</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-white cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.showOnHome !== false}
                  onChange={e => setForm({ ...form, showOnHome: e.target.checked })}
                  className="rounded bg-[#0B132B] border-white/20 text-[#C5A880] w-4 h-4 cursor-pointer"
                />
                <span className="font-medium text-slate-200">Anasayfa Vitrininde Göster</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-white cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.showInNavbar !== false}
                  onChange={e => setForm({ ...form, showInNavbar: e.target.checked })}
                  className="rounded bg-[#0B132B] border-white/20 text-[#C5A880] w-4 h-4 cursor-pointer"
                />
                <span className="font-medium text-slate-200">Üst Menüye (Header) Ekle</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-white cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.showInFooter !== false}
                  onChange={e => setForm({ ...form, showInFooter: e.target.checked })}
                  className="rounded bg-[#0B132B] border-white/20 text-[#C5A880] w-4 h-4 cursor-pointer"
                />
                <span className="font-medium text-slate-200">Alt Menüye (Footer) Ekle</span>
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
              className="px-5 py-2 rounded-lg gold-btn text-xs font-bold cursor-pointer"
            >
              {isEditing ? 'Değişiklikleri Kaydet' : 'Sayfayı Oluştur'}
            </button>
          </div>
        </form>
      )}

      {/* Pages List */}
      <div className="bg-[#1C2E4A] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 bg-[#0B132B]/80 border-b border-white/10 flex items-center justify-between">
          <span className="text-xs font-bold text-white">Kayıtlı Özel Sayfalar</span>
          <span className="text-xs text-slate-400">Toplam {customPages.length} sayfa</span>
        </div>
        <div className="divide-y divide-white/5">
          {customPages.map(page => {
            const isHomeActive = page.showOnHome !== false;
            return (
              <div
                key={page.id}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/5 transition-colors"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-bold text-white font-serif-heading">
                      {page.title}
                    </h4>
                    <span className="text-[11px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                      /{page.slug}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        page.isPublished
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-700/40 text-slate-400 border border-white/10'
                      }`}
                    >
                      {page.isPublished ? 'Yayında' : 'Taslak'}
                    </span>
                    {page.badge && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-[#C5A880]/15 text-[#C5A880] border border-[#C5A880]/30">
                        {page.badge}
                      </span>
                    )}
                    {page.parentMenuId ? (
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full font-medium bg-[#C5A880]/20 text-[#C5A880] border border-[#C5A880]/40 flex items-center gap-1">
                        <GitBranch className="w-3 h-3 text-[#C5A880]" />
                        <span>Menü: {flatMenuOptions.find(m => m.id === page.parentMenuId)?.path || 'Alt Menü'}</span>
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full text-slate-400 bg-white/5 border border-white/10">
                        Bağımsız Sayfa
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                    <button
                      type="button"
                      onClick={() => updateCustomPage(page.id, { showOnHome: !isHomeActive })}
                      className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded transition-colors ${
                        isHomeActive
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : 'bg-white/5 text-slate-400 border border-white/10'
                      }`}
                      title="Anasayfada göster / gizle"
                    >
                      <Home className="w-3 h-3" />
                      <span>Anasayfa: {isHomeActive ? 'Açık' : 'Gizli'}</span>
                    </button>

                    <span className="text-slate-400 text-[11px]">
                      Üst Menü: {page.showInNavbar !== false ? 'Evet' : 'Hayır'}
                    </span>
                    <span className="text-slate-400 text-[11px]">•</span>
                    <span className="text-slate-400 text-[11px]">
                      Footer: {page.showInFooter !== false ? 'Evet' : 'Hayır'}
                    </span>
                    <span className="text-slate-400 text-[11px]">•</span>
                    <span className="text-slate-400 text-[11px]">
                      Güncelleme: {page.updatedAt || '2026-01-01'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                  <button
                    onClick={() => navigate('page', page.slug)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors border border-white/10 cursor-pointer"
                    title="Sayfa Detayını Gör"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>Sayfayı Gör</span>
                  </button>

                  <button
                    onClick={() => navigate('home')}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors border border-white/10 cursor-pointer"
                    title="Anasayfada Gör"
                  >
                    <Home className="w-3.5 h-3.5 text-slate-400" />
                    <span className="hidden sm:inline">Anasayfa</span>
                  </button>

                  <button
                    onClick={() => handleStartEdit(page)}
                    className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 border border-white/5"
                    title="Düzenle"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`"${page.title}" sayfasını silmek istediğinize emin misiniz?`)) {
                        deleteCustomPage(page.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-rose-400 hover:text-rose-200 hover:bg-rose-500/10 border border-rose-500/10"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
