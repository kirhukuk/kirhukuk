import React, { useState, useRef } from 'react';
import { useCms } from '../../context/CmsContext';
import {
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  Check,
  X,
  CornerDownRight,
  GitBranch,
  FolderTree,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Info,
  AlertCircle,
  Layers,
  Scale
} from 'lucide-react';
import { MenuItem } from '../../types';
import { flattenMenuTree } from '../../utils/menuHelpers';

const MAX_SUBMENUS = 10;

export const MenuManagerTab: React.FC = () => {
  const {
    menuItems,
    customPages,
    practiceAreas,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    navigateToAdmin
  } = useCms();

  const formRef = useRef<HTMLFormElement | null>(null);

  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Quick "+ Alt Menü Ekle" Modal State
  const [quickSubmenuParent, setQuickSubmenuParent] = useState<MenuItem | null>(null);
  const [quickSubmenuForm, setQuickSubmenuForm] = useState<{
    title: string;
    url: string;
    type: 'page' | 'external' | 'tel' | 'whatsapp';
    target: '_self' | '_blank';
    order: number;
    isActive: boolean;
  }>({
    title: '',
    url: '/',
    type: 'page',
    target: '_self',
    order: 1,
    isActive: true
  });

  // Track expanded/collapsed nodes (default all expanded)
  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({});

  // Item pending deletion confirmation modal (tarayıcı/iframe window.confirm engellerini aşar)
  const [deletingItem, setDeletingItem] = useState<MenuItem | null>(null);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'warning'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'warning' = 'success') => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Flattened tree for parent selector (excludes the item being edited to prevent cyclical loops)
  const flatMenuOptions = flattenMenuTree(menuItems);

  const initialForm: Partial<MenuItem> = {
    title: '',
    url: '/',
    type: 'page',
    target: '_self',
    isActive: true,
    parentId: null,
    order: menuItems.length + 1
  };

  const [form, setForm] = useState<Partial<MenuItem>>(initialForm);

  // Quick open direct modal for adding submenu under any item (up to 10 submenus)
  const handleOpenQuickSubmenu = (parentItem: MenuItem) => {
    const currentChildrenCount = parentItem.children?.length || 0;
    setQuickSubmenuParent(parentItem);
    setQuickSubmenuForm({
      title: '',
      url: '/',
      type: 'page',
      target: '_self',
      order: currentChildrenCount + 1,
      isActive: true
    });
  };

  // Submit quick submenu modal
  const handleQuickSubmenuSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickSubmenuParent) return;

    const currentCount = quickSubmenuParent.children?.length || 0;
    if (currentCount >= MAX_SUBMENUS) {
      showToast(`Bu menü altında izin verilen maksimum ${MAX_SUBMENUS} alt menü sınırına ulaşıldı.`, 'warning');
      return;
    }

    if (!quickSubmenuForm.title.trim() || !quickSubmenuForm.url.trim()) {
      showToast('Lütfen menü başlığını ve bağlantı adresini (URL) doldurun.', 'warning');
      return;
    }

    addMenuItem({
      title: quickSubmenuForm.title.trim(),
      url: quickSubmenuForm.url.trim(),
      type: quickSubmenuForm.type,
      target: quickSubmenuForm.target,
      order: Number(quickSubmenuForm.order) || currentCount + 1,
      isActive: quickSubmenuForm.isActive,
      parentId: quickSubmenuParent.id
    });

    // Ensure parent is expanded so new item is seen
    setCollapsedNodes(prev => ({ ...prev, [quickSubmenuParent.id]: false }));

    showToast(`"${quickSubmenuForm.title.trim()}" alt menüsü "${quickSubmenuParent.title}" altına başarıyla eklendi (${currentCount + 1}/${MAX_SUBMENUS}).`);
    setQuickSubmenuParent(null);
  };

  const handleStartAdd = (preselectedParentId: string | null = null) => {
    setForm({
      ...initialForm,
      parentId: preselectedParentId,
      order: menuItems.length + 1
    });
    setIsAdding(true);
    setEditingItem(null);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);
  };

  const handleStartEdit = (item: MenuItem) => {
    setEditingItem(item);
    setForm({
      ...item,
      parentId: item.parentId || null
    });
    setIsAdding(false);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);
  };

  const handleApplyPreset = (type: 'page' | 'practice', idOrSlug: string, isQuickModal = false) => {
    if (type === 'page') {
      const page = customPages.find(p => p.slug === idOrSlug || p.id === idOrSlug);
      if (page) {
        if (isQuickModal) {
          setQuickSubmenuForm(prev => ({
            ...prev,
            title: page.title,
            url: `/sayfa/${page.slug}`,
            type: 'page'
          }));
        } else {
          setForm(prev => ({
            ...prev,
            title: page.title,
            url: `/sayfa/${page.slug}`,
            type: 'page'
          }));
        }
      }
    } else if (type === 'practice') {
      const area = practiceAreas.find(a => a.slug === idOrSlug || a.id === idOrSlug);
      if (area) {
        if (isQuickModal) {
          setQuickSubmenuForm(prev => ({
            ...prev,
            title: area.title,
            url: `/calisma-alani/${area.slug}`,
            type: 'page'
          }));
        } else {
          setForm(prev => ({
            ...prev,
            title: area.title,
            url: `/calisma-alani/${area.slug}`,
            type: 'page'
          }));
        }
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.url) return;

    if (editingItem) {
      updateMenuItem(editingItem.id, {
        title: form.title,
        url: form.url,
        type: form.type || 'page',
        target: form.target || '_self',
        isActive: form.isActive !== undefined ? form.isActive : true,
        order: Number(form.order) || 1,
        parentId: form.parentId || null
      });
      showToast(`"${form.title}" menü öğesi güncellendi.`);
      setEditingItem(null);
    } else {
      // If target parent already has 10 submenus, prevent addition
      if (form.parentId) {
        const parentOpt = flatMenuOptions.find(o => o.id === form.parentId);
        const parent = menuItems.find(m => m.id === form.parentId);
        const childrenCount = parent?.children?.length || 0;
        if (childrenCount >= MAX_SUBMENUS) {
          showToast(`Seçilen üst menü altına en fazla ${MAX_SUBMENUS} alt menü eklenebilir.`, 'warning');
          return;
        }
      }

      addMenuItem({
        title: form.title!,
        url: form.url!,
        type: form.type || 'page',
        target: form.target || '_self',
        isActive: form.isActive !== undefined ? form.isActive : true,
        order: Number(form.order) || 1,
        parentId: form.parentId || null
      });
      showToast(`"${form.title}" menü öğesi başarıyla eklendi.`);
      setIsAdding(false);
    }
  };

  // Move items order
  const handleMove = (itemsList: MenuItem[], item: MenuItem, direction: 'up' | 'down') => {
    const sorted = [...itemsList].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex(i => i.id === item.id);
    if (direction === 'up' && index > 0) {
      const prev = sorted[index - 1];
      updateMenuItem(item.id, { order: prev.order });
      updateMenuItem(prev.id, { order: item.order });
      showToast(`"${item.title}" yukarı taşındı.`);
    } else if (direction === 'down' && index < sorted.length - 1) {
      const next = sorted[index + 1];
      updateMenuItem(item.id, { order: next.order });
      updateMenuItem(next.id, { order: item.order });
      showToast(`"${item.title}" aşağı taşındı.`);
    }
  };

  // Toggle node collapse
  const toggleCollapse = (id: string) => {
    setCollapsedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Render recursive menu tree row
  const renderTreeItem = (item: MenuItem, depth: number = 0, siblingList: MenuItem[] = menuItems) => {
    const hasChildren = item.children && item.children.length > 0;
    const sortedChildren = hasChildren
      ? [...item.children!].sort((a, b) => a.order - b.order)
      : [];

    const isCurrentEditing = editingItem?.id === item.id;
    const parentBreadcrumb = flatMenuOptions.find(o => o.id === item.parentId)?.path;
    const isCollapsed = !!collapsedNodes[item.id];
    const childrenCount = item.children?.length || 0;
    const isMaxSubmenusReached = childrenCount >= MAX_SUBMENUS;

    // Determine position in sibling list for enabling/disabling reorder arrows
    const sortedSiblings = [...siblingList].sort((a, b) => a.order - b.order);
    const itemIndex = sortedSiblings.findIndex(s => s.id === item.id);
    const isFirst = itemIndex === 0;
    const isLast = itemIndex === sortedSiblings.length - 1;

    return (
      <div key={item.id} className="space-y-2">
        <div
          className={`p-3.5 sm:p-4 rounded-xl transition-all border ${
            isCurrentEditing
              ? 'bg-[#C5A880]/15 border-[#C5A880] shadow-md ring-1 ring-[#C5A880]'
              : depth === 0
              ? 'bg-[#1C2E4A] border-white/10 hover:border-white/20'
              : depth === 1
              ? 'bg-[#152338] border-white/10 ml-3 sm:ml-8 border-l-2 border-l-[#C5A880]'
              : 'bg-[#0E1B2E] border-white/10 ml-6 sm:ml-16 border-l-2 border-l-sky-400'
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Left: Tree Depth Indicator + Title + Meta */}
            <div className="flex items-start sm:items-center gap-2.5">
              {/* Expand/Collapse Chevron for parents */}
              {hasChildren ? (
                <button
                  type="button"
                  onClick={() => toggleCollapse(item.id)}
                  className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title={isCollapsed ? 'Alt menüleri göster' : 'Alt menüleri gizle'}
                >
                  {isCollapsed ? (
                    <ChevronRight className="w-4 h-4 text-[#C5A880]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#C5A880]" />
                  )}
                </button>
              ) : depth > 0 ? (
                <CornerDownRight
                  className={`w-4 h-4 mt-0.5 sm:mt-0 shrink-0 ${
                    depth === 1 ? 'text-[#C5A880]' : 'text-sky-400'
                  }`}
                />
              ) : (
                <span className="w-6 h-6 flex items-center justify-center rounded-lg bg-white/5 text-[#C5A880] text-xs font-bold shrink-0">
                  {item.order}
                </span>
              )}

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-white font-serif-heading">
                    {item.title}
                  </span>

                  <span className="text-[10px] font-mono text-slate-300 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                    {item.url}
                  </span>

                  {/* Level Badge */}
                  {depth === 0 ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#C5A880]/20 text-[#C5A880] border border-[#C5A880]/30">
                      Üst Menü (Header)
                    </span>
                  ) : depth === 1 ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      1. Seviye Alt Menü
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      {depth}. Seviye Alt Menü
                    </span>
                  )}

                  {parentBreadcrumb && (
                    <span className="text-[10px] text-slate-400">
                      (Üst: <strong className="text-slate-200">{parentBreadcrumb}</strong>)
                    </span>
                  )}

                  {/* Children / Submenu Count Badge (X / 10) */}
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 ${
                      childrenCount === 0
                        ? 'bg-slate-700/40 text-slate-400 border border-white/5'
                        : isMaxSubmenusReached
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    <Layers className="w-3 h-3" />
                    <span>{childrenCount}/{MAX_SUBMENUS} Alt Menü</span>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 mt-1">
                  <span>Sıra: <strong className="text-slate-300">{item.order}</strong></span>
                  <span>•</span>
                  <span>Hedef: {item.target === '_blank' ? 'Yeni Sekme' : 'Aynı Sekme'}</span>
                  <span>•</span>
                  <span>Tür: {item.type}</span>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex flex-wrap items-center gap-1.5 self-end lg:self-auto shrink-0">
              {/* Order Up / Down Reorder Icons */}
              <div className="flex items-center bg-black/20 rounded-lg p-0.5 border border-white/5 mr-1">
                <button
                  type="button"
                  onClick={() => handleMove(siblingList, item, 'up')}
                  disabled={isFirst}
                  className={`p-1.5 rounded-md transition-colors ${
                    isFirst
                      ? 'text-slate-600 cursor-not-allowed'
                      : 'text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer'
                  }`}
                  title={isFirst ? 'Zaten ilk sırada' : 'Yukarı Taşı'}
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(siblingList, item, 'down')}
                  disabled={isLast}
                  className={`p-1.5 rounded-md transition-colors ${
                    isLast
                      ? 'text-slate-600 cursor-not-allowed'
                      : 'text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer'
                  }`}
                  title={isLast ? 'Zaten son sırada' : 'Aşağı Taşı'}
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Direct "+ Alt Menü Ekle" Button (Opens instant modal) */}
              <button
                type="button"
                id={`btn-add-submenu-${item.id}`}
                onClick={() => handleOpenQuickSubmenu(item)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer shadow-xs ${
                  isMaxSubmenusReached
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                    : 'bg-[#C5A880]/15 hover:bg-[#C5A880]/25 text-[#C5A880] border-[#C5A880]/30 hover:border-[#C5A880]/60'
                }`}
                title={
                  isMaxSubmenusReached
                    ? `Maksimum ${MAX_SUBMENUS} alt menü sınırına ulaşıldı`
                    : `"${item.title}" altına yeni bir alt menü ekleyin (Kalan: ${MAX_SUBMENUS - childrenCount})`
                }
              >
                <Plus className="w-3.5 h-3.5" />
                <span>
                  {isMaxSubmenusReached ? `Maks. ${MAX_SUBMENUS} Alt Menü` : `Alt Menü Ekle (${childrenCount}/${MAX_SUBMENUS})`}
                </span>
              </button>

              {/* Status Toggle */}
              <button
                type="button"
                onClick={() => updateMenuItem(item.id, { isActive: !item.isActive })}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                  item.isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-700/40 text-slate-400 border border-white/5'
                }`}
                title="Aktif / Pasif yap"
              >
                {item.isActive ? 'Aktif' : 'Pasif'}
              </button>

              {/* Faaliyet Alanı İçeriğini Kontrol Panelinde Düzenleme İkonu */}
              {(() => {
                const itemLower = item.title.toLocaleLowerCase('tr-TR');
                const urlLower = (item.url || '').toLocaleLowerCase('tr-TR');
                const matchedPractice = practiceAreas.find(p => 
                  urlLower.includes(p.slug.toLocaleLowerCase('tr-TR')) ||
                  itemLower === p.title.toLocaleLowerCase('tr-TR')
                );
                const isPracticeRelated = matchedPractice ||
                  urlLower.includes('calisma-alan') ||
                  urlLower.includes('faaliyet') ||
                  itemLower.includes('faaliyet') ||
                  itemLower.includes('çalışma alan');

                if (!isPracticeRelated) return null;

                return (
                  <button
                    type="button"
                    onClick={() => {
                      if (matchedPractice) {
                        navigateToAdmin('practices', matchedPractice.id);
                      } else {
                        navigateToAdmin('practices');
                      }
                    }}
                    className="p-1.5 rounded-lg text-amber-400 hover:text-amber-200 hover:bg-amber-500/20 bg-amber-500/10 border border-amber-500/30 transition-colors cursor-pointer"
                    title={
                      matchedPractice
                        ? `"${matchedPractice.title}" Faaliyet Alanı İçeriğini Kontrol Panelinde Düzenle`
                        : 'Faaliyet Alanları İçeriğini Kontrol Panelinde Düzenle'
                    }
                  >
                    <Scale className="w-4 h-4" />
                  </button>
                );
              })()}

              {/* Edit */}
              <button
                type="button"
                onClick={() => handleStartEdit(item)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Menü Öğesini Düzenle"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              {/* Delete */}
              <button
                type="button"
                onClick={() => setDeletingItem(item)}
                className="p-1.5 rounded-lg text-rose-400 hover:text-rose-200 hover:bg-rose-500/10 transition-colors cursor-pointer"
                title="Menüyü Sil"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Render nested children if present and not collapsed */}
        {hasChildren && !isCollapsed && (
          <div className="space-y-2">
            {sortedChildren.map(child => renderTreeItem(child, depth + 1, sortedChildren))}
          </div>
        )}
      </div>
    );
  };

  const sortedRootMenus = [...menuItems].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border animate-in slide-in-from-top-2 duration-200 ${
            toastMessage.type === 'warning'
              ? 'bg-amber-900/90 text-amber-200 border-amber-500/50'
              : 'bg-[#1C2E4A] text-emerald-300 border-emerald-500/50'
          }`}
        >
          {toastMessage.type === 'warning' ? (
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
          ) : (
            <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          <span className="text-xs font-medium text-white">{toastMessage.text}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white p-1 rounded"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold font-serif-heading text-white flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-[#C5A880]" />
            <span>Navigasyon & Çok Seviyeli Menü Yönetimi</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Üst menüler ve her menü altında 10 adede kadar alt menü (Örn: Hizmetlerimiz &gt; Boşanma Hukuku) oluşturun ve düzenleyin.
          </p>
        </div>

        <button
          onClick={() => handleStartAdd(null)}
          className="px-4 py-2.5 rounded-xl gold-btn text-xs font-bold flex items-center gap-2 shadow-lg cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Üst Menü Ekle</span>
        </button>
      </div>

      {/* Rehber & Bilgilendirme */}
      <div className="p-4 rounded-xl bg-[#0B132B] border border-[#C5A880]/30 flex items-start gap-3 text-xs text-slate-300">
        <Info className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-white">
            Alt Menü Ekleme & 10 Adede Kadar İzin Verilen Hiyerarşik Yapı
          </p>
          <p className="text-slate-300 leading-relaxed">
            Listedeki dilediğiniz bir menünün sağındaki <strong className="text-[#C5A880]">"+ Alt Menü Ekle"</strong> butonuna tıkladığınızda açılan pencereden ilgili menüye <strong className="text-emerald-400">10 adede kadar</strong> alt menü bağlayabilirsiniz. Yukarı/Aşağı ok ikonlarıyla sıralamayı değiştirebilirsiniz.
          </p>
        </div>
      </div>

      {/* Add / Edit Form Modal/Box */}
      {(isAdding || editingItem) && (
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="p-6 rounded-2xl bg-[#1C2E4A] border border-[#C5A880]/60 space-y-4 shadow-2xl animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-sm font-bold text-white font-serif-heading flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-[#C5A880]" />
              <span>{editingItem ? `Menüyü Düzenle: ${editingItem.title}` : 'Yeni Menü Öğesi Oluştur'}</span>
            </h3>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setEditingItem(null);
              }}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Preset Quick Fill */}
          <div className="p-3.5 rounded-xl bg-[#0B132B]/80 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#C5A880] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hızlı Doldur (Özel Sayfalar ve Çalışma Alanlarından Seçin)</span>
              </label>
              <span className="text-[10px] text-slate-400">Opsiyonel</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="block text-[11px] text-slate-400 mb-1">Kayıtlı Özel Sayfalar</span>
                <select
                  onChange={e => {
                    if (e.target.value) handleApplyPreset('page', e.target.value);
                  }}
                  defaultValue=""
                  className="w-full px-3 py-2 rounded-lg bg-[#1C2E4A] border border-white/15 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                >
                  <option value="">-- Bir Özel Sayfa Seçin --</option>
                  {customPages.map(p => (
                    <option key={p.id} value={p.slug}>
                      {p.title} (/sayfa/{p.slug})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="block text-[11px] text-slate-400 mb-1">Çalışma Alanları</span>
                <select
                  onChange={e => {
                    if (e.target.value) handleApplyPreset('practice', e.target.value);
                  }}
                  defaultValue=""
                  className="w-full px-3 py-2 rounded-lg bg-[#1C2E4A] border border-white/15 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                >
                  <option value="">-- Bir Çalışma Alanı Seçin --</option>
                  {practiceAreas.map(a => (
                    <option key={a.id} value={a.slug}>
                      {a.title} (/calisma-alani/{a.slug})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Hierarchy: Parent Menu Selection */}
          <div className="p-3.5 rounded-xl bg-[#0B132B] border border-[#C5A880]/30 space-y-2">
            <label className="block text-xs font-bold text-[#C5A880] flex items-center gap-2">
              <CornerDownRight className="w-4 h-4 text-[#C5A880]" />
              <span>Üst Menü / Konum (Bu öge hangi menünün altında yer alacak?)</span>
            </label>

            <select
              value={form.parentId || ''}
              onChange={e => setForm({ ...form, parentId: e.target.value || null })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#1C2E4A] border border-white/20 text-white text-xs focus:outline-none focus:border-[#C5A880] font-medium"
            >
              <option value="">📁 [ANA MENÜ] - En Üst Düzeyde (Doğrudan Üst Çubukta Görünsün)</option>
              {flatMenuOptions
                .filter(opt => !editingItem || opt.id !== editingItem.id)
                .map(opt => {
                  const parentItem = menuItems.find(m => m.id === opt.id);
                  const subCount = parentItem?.children?.length || 0;
                  const isFull = subCount >= MAX_SUBMENUS;
                  return (
                    <option
                      key={opt.id}
                      value={opt.id}
                      disabled={isFull && (!editingItem || editingItem.parentId !== opt.id)}
                    >
                      {opt.depth === 0 ? '📁 ' : '\u00A0\u00A0\u00A0\u00A0'.repeat(opt.depth) + '↳ 📄 '}
                      {opt.path} {isFull ? `[DOLU - ${MAX_SUBMENUS}/${MAX_SUBMENUS} Alt Menü]` : `(${subCount}/${MAX_SUBMENUS} Alt Menü)`}
                    </option>
                  );
                })}
            </select>

            <p className="text-[11px] text-slate-300">
              Her menünün altında en fazla <strong className="text-[#C5A880]">{MAX_SUBMENUS} adede kadar</strong> alt menü eklenebilir.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Menü Başlığı *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="Örn: Boşanma Hukuku veya İletişim"
                className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Bağlantı (URL) *</label>
              <input
                type="text"
                required
                value={form.url}
                onChange={e => setForm({ ...form, url: e.target.value })}
                placeholder="Örn: /sayfa/bosanma-hukuku veya /iletisim"
                className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Bağlantı Türü</label>
              <select
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value as any })}
                className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
              >
                <option value="page">Dahili Sayfa</option>
                <option value="external">Harici Web Sitesi</option>
                <option value="tel">Telefon Arama (tel:)</option>
                <option value="whatsapp">WhatsApp Hattı</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Hedef (Target)</label>
              <select
                value={form.target}
                onChange={e => setForm({ ...form, target: e.target.value as any })}
                className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
              >
                <option value="_self">Aynı Sekmede Aç (_self)</option>
                <option value="_blank">Yeni Sekmede Aç (_blank)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Sıralama</label>
              <input
                type="number"
                value={form.order}
                onChange={e => setForm({ ...form, order: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <label className="flex items-center gap-2 text-xs text-white cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={e => setForm({ ...form, isActive: e.target.checked })}
                className="rounded bg-[#0B132B] border-white/20 text-[#C5A880] w-4 h-4 cursor-pointer"
              />
              <span className="font-semibold text-slate-200">Menüde Aktif Olarak Göster</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setEditingItem(null);
              }}
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 cursor-pointer"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg gold-btn text-xs font-bold cursor-pointer"
            >
              {editingItem ? 'Değişiklikleri Kaydet' : 'Öğeyi Ekle'}
            </button>
          </div>
        </form>
      )}

      {/* Menu Tree List */}
      <div className="bg-[#1C2E4A] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 bg-[#0B132B]/80 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-[#C5A880]" />
              <span>Menü Ağacı ve Hiyerarşik Yapı</span>
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Üst ve alt menüler ağaç şeklinde listelenmektedir. Her menünün altına 10 adede kadar alt menü ekleyebilirsiniz.
            </p>
          </div>

          <span className="text-[11px] text-slate-400 font-mono">
            {sortedRootMenus.length} Ana Menü Öğesi
          </span>
        </div>

        <div className="p-4 sm:p-6 space-y-3">
          {sortedRootMenus.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Henüz menü ögesi bulunmuyor. Yeni bir üst menü ekleyerek başlayabilirsiniz.
            </div>
          ) : (
            sortedRootMenus.map(item => renderTreeItem(item, 0, sortedRootMenus))
          )}
        </div>
      </div>

      {/* DEDICATED MODAL: "+ Alt Menü Ekle" Popup (Allows up to 10 submenus) */}
      {quickSubmenuParent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#1C2E4A] border border-[#C5A880]/60 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="text-sm font-bold text-white font-serif-heading flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-[#C5A880]" />
                  <span>Alt Menü Ekle: "{quickSubmenuParent.title}"</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Bu menünün altına yeni bir alt menü öğesi ekleyin.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setQuickSubmenuParent(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quota Tracker Badge & Status */}
            <div className="p-3.5 rounded-xl bg-[#0B132B] border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>Alt Menü Kotası (Maks. {MAX_SUBMENUS})</span>
                </span>
                <span
                  className={`font-bold font-mono px-2 py-0.5 rounded-full text-xs ${
                    (quickSubmenuParent.children?.length || 0) >= MAX_SUBMENUS
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {quickSubmenuParent.children?.length || 0} / {MAX_SUBMENUS}
                </span>
              </div>

              {/* Visual Progress Bar (10 steps) */}
              <div className="grid grid-cols-10 gap-1 pt-1">
                {Array.from({ length: MAX_SUBMENUS }).map((_, idx) => {
                  const isFilled = idx < (quickSubmenuParent.children?.length || 0);
                  return (
                    <div
                      key={idx}
                      className={`h-1.5 rounded-full transition-colors ${
                        isFilled
                          ? 'bg-[#C5A880]'
                          : 'bg-white/10'
                      }`}
                    />
                  );
                })}
              </div>

              {(quickSubmenuParent.children?.length || 0) >= MAX_SUBMENUS ? (
                <p className="text-[11px] text-amber-300 flex items-center gap-1.5 pt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Bu menü altına eklenebilecek maksimum 10 alt menü sınırına ulaşıldı. Yeni eklemek için listeden mevcut bir alt menüyü silebilirsiniz.</span>
                </p>
              ) : (
                <p className="text-[11px] text-slate-400">
                  Bu menünün altına <strong className="text-emerald-400">{MAX_SUBMENUS - (quickSubmenuParent.children?.length || 0)} adet daha</strong> alt menü ekleyebilirsiniz.
                </p>
              )}
            </div>

            {/* If limit is not reached, show form */}
            {(quickSubmenuParent.children?.length || 0) < MAX_SUBMENUS ? (
              <form onSubmit={handleQuickSubmenuSubmit} className="space-y-4">
                {/* Preset quick selector */}
                <div className="p-3 rounded-xl bg-[#0B132B]/60 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#C5A880] flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Hazır Şablonlardan Doldur (İsteğe Bağlı)</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <select
                        onChange={e => {
                          if (e.target.value) handleApplyPreset('page', e.target.value, true);
                        }}
                        defaultValue=""
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#1C2E4A] border border-white/15 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                      >
                        <option value="">-- Özel Sayfalardan Seç --</option>
                        {customPages.map(p => (
                          <option key={p.id} value={p.slug}>
                            {p.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <select
                        onChange={e => {
                          if (e.target.value) handleApplyPreset('practice', e.target.value, true);
                        }}
                        defaultValue=""
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#1C2E4A] border border-white/15 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                      >
                        <option value="">-- Çalışma Alanlarından Seç --</option>
                        {practiceAreas.map(a => (
                          <option key={a.id} value={a.slug}>
                            {a.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Submenu Title */}
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Alt Menü Başlığı *
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={quickSubmenuForm.title}
                    onChange={e => setQuickSubmenuForm({ ...quickSubmenuForm, title: e.target.value })}
                    placeholder="Örn: Boşanma Davaları, Nilüfer Şubesi veya Arabuluculuk"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B132B] border border-white/15 text-white text-xs focus:outline-none focus:border-[#C5A880] font-medium"
                  />
                </div>

                {/* Submenu URL */}
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Bağlantı (URL) *
                  </label>
                  <input
                    type="text"
                    required
                    value={quickSubmenuForm.url}
                    onChange={e => setQuickSubmenuForm({ ...quickSubmenuForm, url: e.target.value })}
                    placeholder="Örn: /sayfa/bosanma-davalari veya /iletisim"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B132B] border border-white/15 text-white text-xs focus:outline-none focus:border-[#C5A880] font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">Hedef Pencere</label>
                    <select
                      value={quickSubmenuForm.target}
                      onChange={e => setQuickSubmenuForm({ ...quickSubmenuForm, target: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-lg bg-[#0B132B] border border-white/15 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                    >
                      <option value="_self">Aynı Sekmede Aç (_self)</option>
                      <option value="_blank">Yeni Sekmede Aç (_blank)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">Sıra Numarası</label>
                    <input
                      type="number"
                      value={quickSubmenuForm.order}
                      onChange={e => setQuickSubmenuForm({ ...quickSubmenuForm, order: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg bg-[#0B132B] border border-white/15 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                <div className="pt-1">
                  <label className="flex items-center gap-2 text-xs text-white cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={quickSubmenuForm.isActive}
                      onChange={e => setQuickSubmenuForm({ ...quickSubmenuForm, isActive: e.target.checked })}
                      className="rounded bg-[#0B132B] border-white/20 text-[#C5A880] w-4 h-4 cursor-pointer"
                    />
                    <span className="font-semibold text-slate-200">Menüde Aktif Olarak Göster</span>
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setQuickSubmenuParent(null)}
                    className="px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 font-semibold cursor-pointer"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg gold-btn text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Alt Menüyü Ekle</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex justify-end pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setQuickSubmenuParent(null)}
                  className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white font-semibold cursor-pointer"
                >
                  Kapat
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Silme Onay Modalı (window.confirm engellerini aşan güvenli diyalog) */}
      {deletingItem && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setDeletingItem(null)}
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
                  Menü Öğesini Sil
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-rose-300">"{deletingItem.title}"</strong> menü öğesini silmek istediğinize emin misiniz?
                </p>
                {deletingItem.children && deletingItem.children.length > 0 && (
                  <p className="text-xs text-amber-300/90 mt-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2.5 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
                    <span>Bu menünün altında yer alan <strong>{deletingItem.children.length} adet alt menü</strong> de silinecektir.</span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-slate-200 font-semibold transition-colors cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={() => {
                  const targetTitle = deletingItem.title;
                  const targetId = deletingItem.id;
                  deleteMenuItem(targetId);
                  showToast(`"${targetTitle}" silindi.`);
                  setDeletingItem(null);
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
