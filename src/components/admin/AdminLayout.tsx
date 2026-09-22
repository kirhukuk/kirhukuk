import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import {
  LayoutDashboard,
  Settings,
  Menu as MenuIcon,
  Scale,
  Users,
  FileText,
  HelpCircle,
  Bell,
  Camera,
  Images,
  Mail,
  Palette,
  Sparkles,
  Layers,
  Search,
  Database,
  ExternalLink,
  LogOut,
  ChevronRight,
  Shield
} from 'lucide-react';
import { AdminTab } from '../../types';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const {
    adminTab,
    setAdminTab,
    navigate,
    contactMessages,
    settings
  } = useCms();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const unreadMessagesCount = contactMessages.filter(m => !m.isRead).length;

  const navItems: { id: AdminTab; label: string; icon: any; badge?: number }[] = [
    { id: 'dashboard', label: 'Genel Bakış', icon: LayoutDashboard },
    { id: 'settings', label: 'Genel Büro Ayarları', icon: Settings },
    { id: 'menus', label: 'Menü Yönetimi', icon: MenuIcon },
    { id: 'pages', label: 'Sayfa Yönetimi', icon: Layers },
    { id: 'practices', label: 'Faaliyet Alanları', icon: Scale },
    { id: 'team', label: 'Avukat & Ekip', icon: Users },
    { id: 'articles', label: 'Makale & Bilgiler', icon: FileText },
    { id: 'faq', label: 'Sık Sorulan Sorular', icon: HelpCircle },
    { id: 'announcements', label: 'Duyurular & Bülten', icon: Bell },
    { id: 'gallery', label: 'Ofis Galerisi', icon: Camera },
    { id: 'media', label: 'Medya Kütüphanesi', icon: Images },
    { id: 'messages', label: 'İletişim Mesajları', icon: Mail, badge: unreadMessagesCount },
    { id: 'theme', label: 'Tema & Renkler', icon: Palette },
    { id: 'popup', label: 'Özel Gün & Karşılama', icon: Sparkles },
    { id: 'seo', label: 'SEO & Analitik', icon: Search },
    { id: 'backup', label: 'Yedekleme & Sıfırlama', icon: Database }
  ];

  return (
    <div className="min-h-screen bg-[#080E1F] text-slate-200 flex flex-col md:flex-row font-sans">
      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div
          id="admin-sidebar-backdrop"
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 md:hidden"
        />
      )}

      {/* Sidebar Desktop */}
      <aside
        id="admin-sidebar"
        className={`w-64 bg-[#0B132B] border-r border-white/10 flex flex-col justify-between shrink-0 z-30 ${
          mobileSidebarOpen ? 'fixed inset-y-0 left-0 flex shadow-2xl' : 'hidden md:flex'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Brand Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1C2E4A] border border-[#C5A880]/50 flex items-center justify-center">
                <Shield className="w-4 h-4 text-[#C5A880]" />
              </div>
              <div>
                <span className="block text-sm font-bold font-serif-heading text-white tracking-wider">
                  KIR HUKUK CMS
                </span>
                <span className="block text-[10px] text-amber-400 font-mono">
                  Yönetim Portalı
                </span>
              </div>
            </div>

            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-white"
            >
              ×
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = adminTab === item.id;

              return (
                <button
                  key={item.id}
                  id={`admin-nav-${item.id}`}
                  onClick={() => {
                    setAdminTab(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#C5A880] text-[#0B132B] font-bold shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#0B132B]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive ? 'bg-[#0B132B] text-[#C5A880]' : 'bg-red-500 text-white animate-pulse'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom Live Website Link */}
          <div className="p-4 border-t border-white/10 space-y-2 bg-[#080E1F]/50">
            <button
              id="admin-view-live-site-btn"
              onClick={() => navigate('home')}
              className="w-full py-2.5 px-3 rounded-lg bg-white/5 hover:bg-[#C5A880] hover:text-[#0B132B] border border-white/10 text-xs font-semibold flex items-center justify-center gap-2 transition-all text-slate-200"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Canlı Siteyi Görüntüle</span>
            </button>

            <p className="text-[10px] text-center text-slate-400 font-mono">
              v2.4 • KIR HUKUK CMS Engine
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-[#0B132B] border-b border-white/10 px-4 sm:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
            >
              <MenuIcon className="w-5 h-5" />
            </button>
            <h2 className="text-base font-bold text-white font-serif-heading">
              {navItems.find(i => i.id === adminTab)?.label || 'Yönetim Paneli'}
            </h2>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="admin-top-live-site-btn"
              onClick={() => navigate('home')}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs text-slate-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              title="Canlı Web Sitesine Dön"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#C5A880]" />
              <span className="hidden xs:inline sm:inline">Canlı Site</span>
            </button>

            <button
              id="admin-top-logout-btn"
              onClick={() => navigate('home')}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs text-rose-400 hover:text-white hover:bg-rose-500/20 border border-rose-500/30 transition-colors"
              title="Panelden Çık ve Ana Sayfaya Dön"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Çıkış</span>
            </button>
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
