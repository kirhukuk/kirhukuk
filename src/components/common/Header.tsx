import React, { useState, useEffect, useRef } from 'react';
import { useCms } from '../../context/CmsContext';
import {
  Phone,
  Search,
  ChevronDown,
  Scale,
  Shield,
  Menu,
  X,
  ChevronRight,
  FileText,
  Calendar,
  MessageSquare,
  Instagram,
  Linkedin,
  Facebook,
  Youtube
} from 'lucide-react';
import { MenuItem } from '../../types';
import { WhatsAppIcon } from './WhatsAppIcon';
import { LegalToolsModal } from './LegalToolsModal';
import { PetitionsModal } from './PetitionsModal';

export const Header: React.FC = () => {
  const {
    settings,
    menuItems,
    practiceAreas,
    articles,
    teamMembers,
    customPages,
    navigate,
    navigateToAdmin,
    setIsSearchOpen,
    openAppointmentModal,
    activeView
  } = useCms();

  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeNestedDropdown, setActiveNestedDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobileSubmenu, setExpandedMobileSubmenu] = useState<string | null>(null);
  const [expandedMobileNested, setExpandedMobileNested] = useState<Record<string, boolean>>({});
  const [isLegalToolsOpen, setIsLegalToolsOpen] = useState(false);
  const [isPetitionsOpen, setIsPetitionsOpen] = useState(false);
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nestedDropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleDropdownEnter = (itemId: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setActiveDropdown(itemId);
  };

  const handleDropdownLeave = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
      setActiveNestedDropdown(null);
    }, 250);
  };

  const handleNestedEnter = (childId: string) => {
    if (nestedDropdownTimeoutRef.current) {
      clearTimeout(nestedDropdownTimeoutRef.current);
      nestedDropdownTimeoutRef.current = null;
    }
    setActiveNestedDropdown(childId);
  };

  const handleNestedLeave = () => {
    if (nestedDropdownTimeoutRef.current) {
      clearTimeout(nestedDropdownTimeoutRef.current);
    }
    nestedDropdownTimeoutRef.current = setTimeout(() => {
      setActiveNestedDropdown(null);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
      if (nestedDropdownTimeoutRef.current) {
        clearTimeout(nestedDropdownTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter active menus ordered (only root items at the top-level, children are nested)
  const sortedMenuItems = [...menuItems]
    .filter(item => item.isActive && (!item.parentId || item.parentId === null))
    .sort((a, b) => a.order - b.order);

  // Unlinked published custom pages for navbar
  const unlinkedNavbarPages = customPages.filter(
    page =>
      page.isPublished &&
      page.showInNavbar !== false &&
      !menuItems.some(m => m.url.includes(page.slug))
  );

  // Combined menu items: include "Sayfalar" dropdown if unlinked custom pages exist
  const allNavItems: MenuItem[] = [...sortedMenuItems];
  if (unlinkedNavbarPages.length > 0) {
    allNavItems.push({
      id: 'menu-sayfalar-dropdown',
      title: 'Sayfalar',
      url: '#',
      type: 'page',
      isActive: true,
      order: 99,
      children: unlinkedNavbarPages.map((p, idx) => ({
        id: `custom-page-nav-${p.id}`,
        title: p.title,
        url: `/page/${p.slug}`,
        type: 'page',
        isActive: true,
        order: idx + 1
      }))
    });
  }

  const handleNavClick = (item: MenuItem) => {
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);

    if (item.type === 'tel') {
      window.location.href = `tel:${item.url}`;
      return;
    }
    if (item.type === 'whatsapp') {
      window.open(`https://wa.me/${item.url.replace(/[^0-9]/g, '')}`, '_blank');
      return;
    }
    if (item.type === 'external') {
      window.open(item.url, item.target || '_blank');
      return;
    }

    const rawUrl = (item.url || '').trim();
    // Normalize path by stripping leading/trailing slashes
    const cleanPath = rawUrl.replace(/^\/+|\/+$/g, '');
    const segments = cleanPath.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1] || '';

    // 0. Admin / Kontrol Paneli
    if (
      cleanPath === 'admin' ||
      cleanPath === 'kontrol-paneli' ||
      cleanPath === 'yonetim-paneli' ||
      cleanPath === 'panel' ||
      cleanPath === 'dashboard' ||
      rawUrl === '#admin' ||
      /kontrol\s*paneli/i.test(item.title) ||
      /y[öo]netim\s*paneli/i.test(item.title)
    ) {
      navigateToAdmin('dashboard');
      return;
    }

    // Hukuki Araçlar / Hesaplama
    if (cleanPath === 'araclar' || rawUrl === '#araclar' || /ara[cç]lar/i.test(item.title)) {
      setIsLegalToolsOpen(true);
      return;
    }

    // Dilekçeler
    if (cleanPath === 'dilekceler' || rawUrl === '#dilekceler' || /dilek[cç]e/i.test(item.title)) {
      setIsPetitionsOpen(true);
      return;
    }

    // 1. Home
    if (!cleanPath || rawUrl === '/') {
      navigate('home');
      return;
    }

    // 2. About
    if (cleanPath === 'hakkimizda' || cleanPath === 'about') {
      navigate('about');
      return;
    }

    // 3. Practice Areas (All)
    if (
      cleanPath === 'calisma-alanlarimiz' ||
      cleanPath === 'calisma-alanlari' ||
      cleanPath === 'practices' ||
      cleanPath === 'practice-areas'
    ) {
      navigate('practices');
      return;
    }

    // 4. Practice Area detail (under /calisma-alanlarimiz/slug or matching practice area slug)
    if (
      cleanPath.startsWith('calisma-alanlarimiz/') ||
      cleanPath.startsWith('calisma-alanlari/') ||
      cleanPath.startsWith('practices/')
    ) {
      navigate('practice-detail', lastSegment);
      return;
    }
    const matchedPractice = practiceAreas.find(
      p => p.slug === lastSegment || (cleanPath && cleanPath.includes(p.slug))
    );
    if (matchedPractice) {
      navigate('practice-detail', matchedPractice.slug);
      return;
    }

    // 5. Team / Ekibimiz
    if (cleanPath === 'ekibimiz' || cleanPath === 'team') {
      navigate('team');
      return;
    }
    if (cleanPath.startsWith('ekip/') || cleanPath.startsWith('team/')) {
      navigate('team-detail', lastSegment);
      return;
    }
    const matchedTeam = teamMembers.find(
      t => t.id === lastSegment || (('slug' in t) && (t as any).slug === lastSegment)
    );
    if (matchedTeam) {
      navigate('team-detail', matchedTeam.id);
      return;
    }

    // 6. Articles / Makaleler / Hukuki Bilgiler
    if (
      cleanPath === 'hukuki-bilgiler' ||
      cleanPath === 'makaleler' ||
      cleanPath === 'articles'
    ) {
      navigate('articles');
      return;
    }
    if (cleanPath.startsWith('makale/') || cleanPath.startsWith('articles/')) {
      navigate('article-detail', lastSegment);
      return;
    }
    const matchedArticle = articles.find(
      a => a.slug === lastSegment || (cleanPath && cleanPath.includes(a.slug))
    );
    if (matchedArticle) {
      navigate('article-detail', matchedArticle.slug);
      return;
    }

    // 7. Sık Sorulan Sorular / SSS
    if (
      cleanPath === 'sss' ||
      cleanPath === 'faq' ||
      cleanPath === 'sik-sorulan-sorular'
    ) {
      navigate('faq');
      return;
    }

    // 8. Duyurular
    if (cleanPath === 'duyurular' || cleanPath === 'announcements') {
      navigate('announcements');
      return;
    }

    // 9. Galeri
    if (cleanPath === 'galeri' || cleanPath === 'gallery') {
      navigate('gallery');
      return;
    }

    // 10. İletişim
    if (cleanPath === 'iletisim' || cleanPath === 'contact') {
      navigate('contact');
      return;
    }

    // 11. Custom Page
    const matchedPage = customPages.find(
      p => p.slug === lastSegment || (cleanPath && cleanPath.includes(p.slug))
    );
    if (matchedPage) {
      navigate('page', matchedPage.slug);
      return;
    }

    // Fallback: try as custom page or home
    if (lastSegment) {
      navigate('page', lastSegment);
    } else {
      navigate('home');
    }
  };

  const cleanWaNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <header
      id="main-site-header"
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-200 ease-in-out bg-[#0B132B] border-b border-white/10 shadow-lg ${
        isScrolled ? 'py-2.5 shadow-2xl' : 'py-3'
      }`}
    >
      {/* Top Bar with Phone, WhatsApp, Online Randevu, Avukata Sor, Social Media - Mobilde gizli, masaüstünde görünür */}
      <div className="hidden lg:block border-b border-white/10 pb-2 mb-2 text-xs text-slate-300 w-full px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-3">
          {/* Left: Phone & WhatsApp */}
          <div className="flex items-center gap-4 sm:gap-6">
            <a
              id="topbar-call-btn"
              href={`tel:${settings.phoneRaw}`}
              className="inline-flex items-center gap-1.5 text-slate-200 hover:text-white transition-colors"
              title={`Hemen Ara: ${settings.phone}`}
            >
              <Phone className="w-3.5 h-3.5 text-[#B94A26]" />
              <span className="font-semibold">{settings.phone}</span>
            </a>

            {settings.modules.whatsapp && (
              <a
                id="topbar-whatsapp-btn"
                href={`https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(
                  settings.whatsappDefaultMessage
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-slate-200 hover:text-white transition-colors"
                title="WhatsApp ile İletişim"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
                <span className="font-semibold">WhatsApp</span>
              </a>
            )}
          </div>

          {/* Center: Online Randevu, Avukata Sor & Kontrol Paneli */}
          <div className="flex items-center gap-3 text-xs font-medium">
            <button
              id="topbar-online-randevu-btn"
              onClick={() => openAppointmentModal()}
              className="inline-flex items-center gap-1.5 text-slate-200 hover:text-white transition-colors cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Online Randevu</span>
            </button>

            <span className="text-white/20">|</span>

            <button
              id="topbar-avukata-sor-btn"
              onClick={() => openAppointmentModal({ subject: 'Avukata Soru & Danışma Talebi' })}
              className="inline-flex items-center gap-1.5 text-slate-200 hover:text-white transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#B94A26]" />
              <span>Avukata Sor</span>
            </button>

            <span className="text-white/20">|</span>

            <button
              id="topbar-admin-btn"
              onClick={() => navigateToAdmin('dashboard')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 hover:bg-[#C5A880]/20 text-slate-300 hover:text-[#C5A880] border border-white/10 hover:border-[#C5A880]/40 transition-all cursor-pointer"
              title="KIR HUKUK Kontrol Paneli"
            >
              <Shield className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Kontrol Paneli</span>
            </button>
          </div>

          {/* Right: Social Media Icons - Üst menünün sağ tarafı (arama butonu) ile tam aynı hizada en sağda */}
          <div className="flex items-center gap-1 text-slate-400">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 sm:p-2 rounded-lg hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center cursor-pointer"
              title="Instagram"
            >
              <Instagram className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 sm:p-2 rounded-lg hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center cursor-pointer"
              title="LinkedIn"
            >
              <Linkedin className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 sm:p-2 rounded-lg hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center cursor-pointer"
              title="Facebook"
            >
              <Facebook className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 sm:p-2 rounded-lg hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center cursor-pointer"
              title="YouTube"
            >
              <Youtube className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-start justify-between">
        {/* Brand Logo - KIR (Turkuaz) | (Turuncu Çizgi) HUKUK OFİSİ (Beyaz, Arial, İnce) - Üst tarafı Ana Sayfa ile aynı hizada */}
        <button
          id="brand-logo-btn"
          onClick={() => navigate('home')}
          className="flex items-center text-left group focus:outline-none shrink-0 cursor-pointer pt-2 pb-2"
          title={settings.logoAltText || 'KIR HUKUK OFİSİ'}
        >
          {settings.logoImageUrl ? (
            <img
              src={settings.logoImageUrl}
              alt={settings.logoAltText || 'KIR HUKUK OFİSİ'}
              className="h-8 sm:h-9 w-auto max-w-[160px] object-contain block"
            />
          ) : (
            <div className="flex items-center">
              <span className="text-base sm:text-lg lg:text-xl font-bold tracking-wider text-[#FFE600] group-hover:text-[#00C4CC] transition-colors duration-200 leading-none">
                KIR
              </span>
              <span className="w-[2px] h-4 sm:h-4.5 bg-[#F97316] rounded-full inline-block mx-2 self-center shrink-0" aria-hidden="true" />
              <span className="text-sm sm:text-base lg:text-lg font-light sm:font-normal text-white tracking-wider font-['Arial',sans-serif] group-hover:text-[#00C4CC] transition-colors duration-200 whitespace-nowrap leading-none">
                HUKUK OFİSİ
              </span>
            </div>
          )}
        </button>

        {/* Right Section: Navigation Menu (Sağa Yaslı) & Actions */}
        <div className="flex items-start justify-end gap-1.5 sm:gap-2 flex-1 ml-6">
          {/* Navigation Menu (Masaüstü görünüm - Sağa Yaslı) */}
          <nav className="hidden lg:flex items-center flex-wrap justify-end gap-1 xl:gap-2">
            {allNavItems.map(item => {
              const hasChildren = item.children && item.children.length > 0;
              const isOpen = activeDropdown === item.id;

              return (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => hasChildren && handleDropdownEnter(item.id)}
                  onMouseLeave={() => hasChildren && handleDropdownLeave()}
                >
                  <button
                    id={`nav-item-${item.id}`}
                    onClick={() => {
                      if (hasChildren && (item.url === '#' || item.url === '')) {
                        setActiveDropdown(isOpen ? null : item.id);
                      } else {
                        handleNavClick(item);
                      }
                    }}
                    className={`px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center gap-1 ${
                      activeView === item.url.replace('/', '') ||
                      (item.url === '/' && activeView === 'home') ||
                      isOpen
                        ? 'text-[#C5A880] bg-white/5 font-semibold'
                        : 'text-slate-200 hover:text-white hover:bg-white/5'
                    }`}
                    aria-expanded={isOpen}
                    aria-haspopup={hasChildren ? 'true' : undefined}
                  >
                    <span>{item.title}</span>
                    {hasChildren && (
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#C5A880]' : 'text-slate-400'
                        }`}
                      />
                    )}
                  </button>

                  {/* Dropdown Menu with hover bridge and safe transition */}
                  {hasChildren && isOpen && (
                    <div
                      className="absolute top-full left-0 pt-1.5 w-64 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                      onMouseEnter={() => handleDropdownEnter(item.id)}
                      onMouseLeave={handleDropdownLeave}
                    >
                      <div className="bg-[#1C2E4A] border border-[#C5A880]/30 rounded-lg shadow-2xl shadow-black/70 py-2 backdrop-blur-md overflow-visible">
                        {item.children!.map(child => {
                          const hasSubChildren = child.children && child.children.length > 0;
                          const isSubOpen = activeNestedDropdown === child.id;

                          return (
                            <div
                              key={child.id}
                              className="relative group/sub"
                              onMouseEnter={() => hasSubChildren && handleNestedEnter(child.id)}
                              onMouseLeave={() => hasSubChildren && handleNestedLeave()}
                            >
                              <div className="flex items-center justify-between hover:bg-white/5 transition-colors">
                                <button
                                  id={`subnav-${child.id}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleNavClick(child);
                                  }}
                                  className="w-full text-left px-4 py-2.5 text-xs sm:text-sm text-slate-200 hover:text-[#C5A880] transition-colors flex items-center justify-between group cursor-pointer"
                                >
                                  <span>{child.title}</span>
                                  {hasSubChildren ? (
                                    <ChevronRight className="w-3.5 h-3.5 text-[#C5A880]/80 group-hover:text-[#C5A880] transition-transform group-hover:translate-x-0.5" />
                                  ) : (
                                    <span className="opacity-0 group-hover:opacity-100 text-[#C5A880] transition-opacity text-xs">
                                      →
                                    </span>
                                  )}
                                </button>
                              </div>

                              {/* 2. Seviye Alt Menü (Örn: Hakkımızda > Bursa > Nilüfer & Osmangazi) - Yan Flyout Menü */}
                              {hasSubChildren && (
                                <div
                                  className={`absolute left-full top-0 pl-1.5 w-60 z-50 transition-all duration-150 ${
                                    isSubOpen ? 'block' : 'hidden group-hover/sub:block'
                                  }`}
                                  onMouseEnter={() => handleNestedEnter(child.id)}
                                  onMouseLeave={handleNestedLeave}
                                >
                                  {/* Mouse geçiş köprüsü (hover kaybını önler) */}
                                  <div className="absolute -left-2 top-0 bottom-0 w-3.5 bg-transparent" />
                                  <div className="bg-[#1C2E4A] border border-[#C5A880]/40 rounded-lg shadow-2xl shadow-black/80 py-1.5 backdrop-blur-md overflow-visible">
                                    {child.children!.map(subChild => (
                                      <button
                                        key={subChild.id}
                                        id={`subnav-nested-${subChild.id}`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleNavClick(subChild);
                                        }}
                                        className="w-full text-left px-3.5 py-2 text-xs text-slate-200 hover:text-[#C5A880] hover:bg-white/5 transition-colors flex items-center justify-between group cursor-pointer"
                                      >
                                        <span>{subChild.title}</span>
                                        <span className="opacity-0 group-hover:opacity-100 text-[#C5A880] transition-opacity text-xs">
                                          →
                                        </span>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Action Buttons: Global Search & Mobile Menu Hamburger */}
          <button
            id="global-search-btn"
            onClick={() => setIsSearchOpen(true)}
            className="p-1.5 sm:p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors focus:outline-none cursor-pointer flex items-center justify-center"
            aria-label="Sitede Ara"
            title="Sitede Ara (Ctrl + K)"
          >
            <Search className="w-4.5 sm:w-5 h-4.5 sm:h-5" />
          </button>

          {/* Mobile Menu Hamburger Button */}
          <button
            id="mobile-menu-toggle-btn"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }}
            className="lg:hidden p-2.5 rounded-xl text-slate-200 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all focus:outline-none cursor-pointer touch-manipulation active:scale-95"
            aria-label={isMobileMenuOpen ? 'Menüyü Kapat' : 'Menüyü Aç'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-[#C5A880]" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>

      {/* Full-Screen Mobile Navigation Drawer Overlay (Ultra Responsive & Touch Friendly) */}
      {isMobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="lg:hidden fixed inset-0 z-[100] bg-[#080E1F] flex flex-col animate-in fade-in duration-200"
          style={{ height: '100dvh' }}
        >
          {/* Mobile Drawer Top Bar */}
          <div
            className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-[#0B132B]/95 backdrop-blur-md shrink-0"
            style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#1C2E4A] to-[#2B3E60] border border-[#C5A880]/40 flex items-center justify-center shadow-md">
                <Scale className="w-5 h-5 text-[#C5A880]" />
              </div>
              <div className="text-left">
                <h3 className="text-base font-bold text-white font-serif-heading leading-tight tracking-tight">
                  {settings.logoText || 'KIR HUKUK'}
                </h3>
                <p className="text-[10px] text-[#C5A880] tracking-wider uppercase font-medium">
                  {settings.logoSubtext || 'HUKUK & DANIŞMANLIK'}
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              id="mobile-nav-close-btn"
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-white/10 border border-white/15 text-[#C5A880] hover:text-white hover:bg-white/20 transition-all cursor-pointer touch-manipulation active:scale-95"
              aria-label="Menüyü Kapat"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Drawer Scrollable Content */}
          <div
            className="flex-1 overflow-y-auto px-5 py-4 space-y-4 pb-28 overscroll-contain"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {/* Quick Actions: Hemen Ara & WhatsApp */}
            <div className="grid grid-cols-2 gap-2.5">
              <a
                href={`tel:${settings.phoneRaw || settings.phone}`}
                className="flex items-center justify-center gap-2 py-3 px-3.5 rounded-xl bg-white/5 border border-[#C5A880]/30 text-white text-xs font-semibold hover:bg-white/10 active:scale-98 transition-all shadow-sm"
              >
                <Phone className="w-4 h-4 text-[#C5A880]" />
                <span>Hemen Ara</span>
              </a>
              {settings.modules.whatsapp && (
                <a
                  href={`https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(
                    settings.whatsappDefaultMessage || 'Merhaba, danışmanlık almak istiyorum.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-3.5 rounded-xl bg-[#25D366] text-[#080E1F] text-xs font-bold shadow-md hover:bg-[#20bd5a] active:scale-98 transition-all"
                >
                  <WhatsAppIcon className="w-4 h-4 text-[#080E1F]" />
                  <span>WhatsApp</span>
                </a>
              )}
            </div>

            {/* Mobile Search Button */}
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsSearchOpen(true);
              }}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-[#0B132B] border border-white/10 text-xs text-slate-300 hover:text-white hover:border-[#C5A880]/50 transition-all text-left cursor-pointer active:scale-99"
            >
              <span className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-[#C5A880]" />
                <span>Mevzuat, makale veya dava konusu ara...</span>
              </span>
              <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                Ara
              </span>
            </button>

            {/* Navigation Links with Collapsible Submenus */}
            <div className="space-y-1.5 pt-2 border-t border-white/10">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2 px-1">
                Site Gezinme Menüsü
              </span>

              {allNavItems.map(item => {
                const hasChildren = item.children && item.children.length > 0;
                const isExpanded = expandedMobileSubmenu === item.id;
                const isActive =
                  activeView === item.url.replace('/', '') ||
                  (item.url === '/' && activeView === 'home');

                return (
                  <div
                    key={item.id}
                    className="rounded-xl overflow-hidden border border-white/5 bg-[#0B132B]/70"
                  >
                    {hasChildren ? (
                      <div>
                        <button
                          type="button"
                          onClick={() => setExpandedMobileSubmenu(isExpanded ? null : item.id)}
                          className="w-full flex items-center justify-between p-3.5 text-sm font-medium text-slate-200 hover:text-white transition-colors cursor-pointer touch-manipulation"
                        >
                          <span className={isActive ? 'text-[#C5A880] font-bold' : ''}>
                            {item.title}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                              isExpanded ? 'rotate-180 text-[#C5A880]' : ''
                            }`}
                          />
                        </button>
                        {isExpanded && (
                          <div className="bg-[#1C2E4A]/80 border-t border-white/10 py-1.5 px-2 space-y-1">
                            {item.children!.map(child => {
                              const hasNestedChildren = child.children && child.children.length > 0;
                              // Alt menüleri olan öğeler (örneğin Bursa) varsayılan olarak açık gelsin
                              const isNestedExpanded = expandedMobileNested[child.id] !== undefined 
                                ? !!expandedMobileNested[child.id] 
                                : true;

                              return (
                                <div key={child.id} className="rounded-lg overflow-hidden">
                                  {hasNestedChildren ? (
                                    <div>
                                      <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/5 bg-white/[0.02]">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            setExpandedMobileNested(prev => ({
                                              ...prev,
                                              [child.id]: !isNestedExpanded
                                            }))
                                          }
                                          className="text-left text-xs font-semibold text-slate-200 hover:text-[#C5A880] flex-1 cursor-pointer flex items-center gap-1.5"
                                        >
                                          <span>{child.title}</span>
                                          <span className="text-[10px] text-[#C5A880]/70 font-normal">({child.children?.length} alt bölge)</span>
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            setExpandedMobileNested(prev => ({
                                              ...prev,
                                              [child.id]: !isNestedExpanded
                                            }))
                                          }
                                          className="p-1 text-[#C5A880] hover:text-white cursor-pointer"
                                          aria-label={`${child.title} alt menüsünü aç/kapat`}
                                        >
                                          <ChevronDown
                                            className={`w-4 h-4 transition-transform duration-200 ${
                                              isNestedExpanded ? 'rotate-180 text-[#C5A880]' : ''
                                            }`}
                                          />
                                        </button>
                                      </div>

                                      {isNestedExpanded && (
                                        <div className="pl-3 pr-1 py-1 space-y-1 border-l-2 border-[#C5A880]/60 ml-4 my-1 bg-black/20 rounded-r">
                                          {child.children!.map(subChild => (
                                            <button
                                              key={subChild.id}
                                              type="button"
                                              onClick={() => handleNavClick(subChild)}
                                              className="w-full text-left py-2 px-2.5 rounded text-xs text-slate-200 hover:text-[#C5A880] hover:bg-white/5 flex items-center justify-between cursor-pointer"
                                            >
                                              <span>{subChild.title}</span>
                                              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                                            </button>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => handleNavClick(child)}
                                      className="w-full text-left py-2 px-3 rounded-lg text-xs text-slate-300 hover:text-[#C5A880] hover:bg-white/5 flex items-center justify-between cursor-pointer"
                                    >
                                      <span>{child.title}</span>
                                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleNavClick(item)}
                        className={`w-full flex items-center justify-between p-3.5 text-sm font-medium transition-colors cursor-pointer touch-manipulation ${
                          isActive
                            ? 'text-[#C5A880] bg-[#C5A880]/10 font-bold'
                            : 'text-slate-200 hover:text-white'
                        }`}
                      >
                        <span>{item.title}</span>
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mobile Randevu Talebi & Admin Link */}
            <div className="pt-2 border-t border-white/10 space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openAppointmentModal();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl gold-btn text-[#0B132B] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md active:scale-98"
              >
                <Calendar className="w-4 h-4" />
                <span>Hemen Randevu Talebi Oluştur</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigateToAdmin('dashboard');
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 hover:bg-[#C5A880]/20 text-[#C5A880] border border-[#C5A880]/30 text-xs font-bold transition-colors cursor-pointer active:scale-98"
              >
                <Shield className="w-4 h-4" />
                <span>Yönetici / Kontrol Paneli</span>
              </button>
            </div>

            {/* Mobile Office Info */}
            <div className="p-4 rounded-xl bg-[#0B132B] border border-white/5 space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block mt-1.5 shrink-0 animate-pulse"></span>
                <div>
                  <span className="text-white font-medium block">Çalışma Saatleri</span>
                  <span className="text-slate-400 text-[11px]">{settings.workingHours}</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5 pt-1 border-t border-white/5">
                <span className="text-[#C5A880] font-bold text-xs mt-0.5">📍</span>
                <div>
                  <span className="text-white font-medium block">Büro Adresi</span>
                  <span className="text-slate-400 text-[11px]">{settings.address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modals for Legal Tools and Petitions */}
      <LegalToolsModal
        isOpen={isLegalToolsOpen}
        onClose={() => setIsLegalToolsOpen(false)}
      />
      <PetitionsModal
        isOpen={isPetitionsOpen}
        onClose={() => setIsPetitionsOpen(false)}
      />
    </header>
  );
};
