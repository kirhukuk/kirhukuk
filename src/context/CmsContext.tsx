import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  SiteSettings,
  MenuItem,
  PracticeArea,
  TeamMember,
  Article,
  FaqItem,
  Announcement,
  GalleryItem,
  ContactMessage,
  CustomPage,
  HomeSection,
  User,
  UserRole,
  AuditLog,
  ThemeColors,
  ThemeTypography,
  ThemeConfig,
  SeoConfig,
  PopupModalConfig,
  MediaItem
} from '../types';
import {
  initialSiteSettings,
  initialMenuItems,
  initialPracticeAreas,
  initialTeamMembers,
  initialArticles,
  initialFaqItems,
  initialAnnouncements,
  initialGalleryItems,
  initialMediaItems,
  initialCustomPages,
  initialHomeSections,
  initialMessages,
  initialUsers,
  initialAuditLogs
} from '../data/defaultData';
import { formatLawyerName, formatTeamMemberName } from '../lib/nameFormatter';
import {
  addMessageToFirestore,
  fetchMessagesFromFirestore,
  updateMessageInFirestore,
  deleteMessageFromFirestore,
  isFirebaseConfigured
} from '../lib/firebase';
import { insertOrUpdateInMenuTree, removeFromMenuTree, syncPageToMenuTree, findInMenuTree, normalizeMenuTree } from '../utils/menuHelpers';

const STORAGE_KEY = 'kir_hukuk_cms_v1';

// Mobil ve kısıtlı tarayıcılarda (Safari Private Browsing, WebView vb.) localStorage erişimini koruyan güvenli yardımcı
export const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (e) {
      console.warn('[Storage Read Skipped]:', e);
    }
    return null;
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn('[Storage Write Skipped]:', e);
    }
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (e) {
      console.warn('[Storage Remove Skipped]:', e);
    }
  }
};

interface CmsContextType {
  settings: SiteSettings;
  menuItems: MenuItem[];
  practiceAreas: PracticeArea[];
  teamMembers: TeamMember[];
  articles: Article[];
  faqItems: FaqItem[];
  announcements: Announcement[];
  galleryItems: GalleryItem[];
  mediaItems: MediaItem[];
  mediaCategories: string[];
  messages: ContactMessage[];
  contactMessages: ContactMessage[];
  customPages: CustomPage[];
  homeSections: HomeSection[];
  users: User[];
  currentUser: User;
  auditLogs: AuditLog[];
  isAdminLoggedIn: boolean;
  activeView: string;
  viewParam: string | null;
  activeSlug: string | null;
  adminTab: string;
  isSearchOpen: boolean;
  isAppointmentModalOpen: boolean;
  appointmentModalPrefill: { practiceArea?: string; subject?: string };
  openAppointmentModal: (prefill?: { practiceArea?: string; subject?: string }) => void;
  closeAppointmentModal: () => void;

  // Additional Config States
  theme: ThemeConfig;
  updateTheme: (theme: ThemeConfig) => void;
  popupConfig: PopupModalConfig;
  updatePopupConfig: (config: PopupModalConfig) => void;
  seoConfig: SeoConfig;
  updateSeoConfig: (config: SeoConfig) => void;

  // Additional CRUD Helper Aliases
  addMenuItem: (item: Partial<MenuItem>) => void;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => void;
  addPracticeArea: (area: Partial<PracticeArea>) => void;
  updatePracticeArea: (id: string, area: Partial<PracticeArea>) => void;
  addTeamMember: (member: Partial<TeamMember>) => void;
  updateTeamMember: (id: string, member: Partial<TeamMember>) => void;
  addArticle: (article: Partial<Article>) => void;
  updateArticle: (id: string, article: Partial<Article>) => void;
  addFaqItem: (item: Partial<FaqItem>) => void;
  updateFaqItem: (id: string, item: Partial<FaqItem>) => void;
  addAnnouncement: (ann: Partial<Announcement>) => void;
  updateAnnouncement: (id: string, ann: Partial<Announcement>) => void;
  addGalleryItem: (item: Partial<GalleryItem>) => void;
  addMediaItem: (item: Partial<MediaItem>) => MediaItem;
  updateMediaItem: (id: string, item: Partial<MediaItem>) => void;
  deleteMediaItem: (id: string) => void;
  addMediaCategory: (category: string) => void;
  updateMediaCategory: (oldCategory: string, newCategory: string) => void;
  deleteMediaCategory: (category: string) => void;
  addCustomPage: (page: Partial<CustomPage>) => void;
  updateCustomPage: (id: string, page: Partial<CustomPage>) => void;
  addContactMessage: (msg: any) => Promise<any>;
  addMessage: (msg: any) => Promise<any>;
  markMessageRead: (id: string) => void;
  refreshFirebaseMessages: () => Promise<void>;
  isFirebaseConnected: boolean;
  exportData: () => string;
  importData: (jsonString: string) => boolean;
  resetToDefault: () => void;

  // Navigation
  navigate: (view: string, param?: string | null) => void;
  navigateToAdmin: (tab?: string, targetId?: string) => void;
  editingPracticeId: string | null;
  setEditingPracticeId: (id: string | null) => void;
  setAdminTab: (tab: string) => void;
  setIsSearchOpen: (open: boolean) => void;
  loginAdmin: (password?: string) => boolean;
  logoutAdmin: () => void;
  switchRole: (role: UserRole) => void;

  // CRUD Actions
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  updateColors: (colors: Partial<ThemeColors>) => void;
  updateTypography: (typo: Partial<ThemeTypography>) => void;

  // Menu
  saveMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (id: string) => void;
  reorderMenuItems: (items: MenuItem[]) => void;

  // Practice Areas
  savePracticeArea: (area: PracticeArea) => void;
  deletePracticeArea: (id: string) => void;
  togglePracticeArea: (id: string) => void;

  // Team
  saveTeamMember: (member: TeamMember) => void;
  deleteTeamMember: (id: string) => void;
  toggleTeamMember: (id: string) => void;

  // Articles
  saveArticle: (article: Article) => void;
  deleteArticle: (id: string) => void;
  toggleArticle: (id: string) => void;

  // Faq
  saveFaqItem: (item: FaqItem) => void;
  deleteFaqItem: (id: string) => void;
  toggleFaqItem: (id: string) => void;

  // Announcements
  saveAnnouncement: (ann: Announcement) => void;
  deleteAnnouncement: (id: string) => void;

  // Gallery
  saveGalleryItem: (item: GalleryItem) => void;
  deleteGalleryItem: (id: string) => void;

  // Messages
  submitMessage: (message: any) => Promise<any>;
  updateMessageStatus: (id: string, status: ContactMessage['status'], notes?: string) => void;
  deleteMessage: (id: string) => void;

  // Pages
  saveCustomPage: (page: CustomPage) => void;
  deleteCustomPage: (id: string) => void;

  // Sections
  saveHomeSections: (sections: HomeSection[]) => void;
  toggleHomeSection: (id: string) => void;

  // System
  addAuditLog: (action: string, target: string) => void;
  resetToDefaults: () => void;
  exportDataJson: () => void;
  importDataJson: (jsonString: string) => boolean;
}

const CmsContext = createContext<CmsContextType | null>(null);

// Helper to guarantee tree normalization without forcing deleted items back
function ensureBursaMenuHierarchy(rawItems: MenuItem[]): MenuItem[] {
  return normalizeMenuTree(rawItems);
}

export function CmsProvider({ children }: { children: ReactNode }) {
  // Load saved state or default
  const [settings, setSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_settings`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.typography?.headingFont && (parsed.typography.headingFont.includes('Playfair') || parsed.typography.headingFont.includes('Cinzel') || parsed.typography.headingFont.includes('Cormorant'))) {
          parsed.typography.headingFont = "'Plus Jakarta Sans', sans-serif";
        }
        return { ...initialSiteSettings, ...parsed };
      }
      return initialSiteSettings;
    } catch {
      return initialSiteSettings;
    }
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_menu`);
      let items: MenuItem[] = saved ? JSON.parse(saved) : initialMenuItems;
      return ensureBursaMenuHierarchy(items);
    } catch {
      return ensureBursaMenuHierarchy(initialMenuItems);
    }
  });

  const [practiceAreas, setPracticeAreas] = useState<PracticeArea[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_practices`);
      return saved ? JSON.parse(saved) : initialPracticeAreas;
    } catch {
      return initialPracticeAreas;
    }
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_team`);
      let raw: TeamMember[] = saved ? JSON.parse(saved) : initialTeamMembers;

      // Check if Fatma Büşra KIR is missing in saved state
      const hasFatma = raw.some(m => /fatma\s+büşra/i.test(m.name) || m.id === 'tm-fatma-busra-kir');
      if (!hasFatma) {
        const fatma = initialTeamMembers.find(m => /fatma/i.test(m.name));
        if (fatma) {
          raw = [raw[0], fatma, ...raw.slice(1)].map((m, idx) => ({ ...m, order: idx + 1 }));
        }
      }

      return raw.map(m => ({
        ...m,
        name: (m.name || '').trim(),
        fullBio: m.fullBio ? m.fullBio.replace(/Ahmet\s+K[ıi]r/gi, 'Abidin KIR') : m.fullBio,
        bio: m.bio || m.shortBio || m.fullBio,
        email: m.email ? m.email.replace(/ahmet\.kir/gi, 'abidin.kir') : m.email
      }));
    } catch {
      return initialTeamMembers;
    }
  });

  const [articles, setArticles] = useState<Article[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_articles`);
      const raw: Article[] = saved ? JSON.parse(saved) : initialArticles;
      return raw.map(a => ({
        ...a,
        author: formatLawyerName(a.author)
      }));
    } catch {
      return initialArticles;
    }
  });

  const [faqItems, setFaqItems] = useState<FaqItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_faq`);
      return saved ? JSON.parse(saved) : initialFaqItems;
    } catch {
      return initialFaqItems;
    }
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_announcements`);
      return saved ? JSON.parse(saved) : initialAnnouncements;
    } catch {
      return initialAnnouncements;
    }
  });

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_gallery`);
      return saved ? JSON.parse(saved) : initialGalleryItems;
    } catch {
      return initialGalleryItems;
    }
  });

  const [mediaItems, setMediaItems] = useState<MediaItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_media`);
      return saved ? JSON.parse(saved) : initialMediaItems;
    } catch {
      return initialMediaItems;
    }
  });

  const [mediaCategories, setMediaCategories] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_media_categories`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return ['Ofis', 'Toplantı', 'Kütüphane', 'Ekip', 'Hukuk', 'Yüklenenler'];
    } catch {
      return ['Ofis', 'Toplantı', 'Kütüphane', 'Ekip', 'Hukuk', 'Yüklenenler'];
    }
  });

  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_messages`);
      const raw: ContactMessage[] = saved ? JSON.parse(saved) : initialMessages;
      return (raw || []).map((m, idx) => ({
        ...m,
        id: m.id || `msg-${idx + 1}`,
        createdAt: m.createdAt || m.date || new Date().toISOString(),
        date: m.date || m.createdAt || new Date().toISOString(),
        isRead: typeof m.isRead === 'boolean' ? m.isRead : (m.status === 'read' || m.status === 'replied'),
        practiceArea: m.practiceArea || 'Genel Hukuki Danışma'
      }));
    } catch {
      return initialMessages;
    }
  });

  const [customPages, setCustomPages] = useState<CustomPage[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_pages`);
      let list: CustomPage[] = saved ? JSON.parse(saved) : initialCustomPages;
      const neededSlugs = ['bursa', 'nilufer', 'osmangazi'];
      for (const slug of neededSlugs) {
        if (!list.some(p => p.slug === slug)) {
          const defaultPage = initialCustomPages.find(p => p.slug === slug);
          if (defaultPage) {
            list.push(defaultPage);
          }
        }
      }
      return list;
    } catch {
      return initialCustomPages;
    }
  });

  const [homeSections, setHomeSections] = useState<HomeSection[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_sections`);
      return saved ? JSON.parse(saved) : initialHomeSections;
    } catch {
      return initialHomeSections;
    }
  });

  const [users] = useState<User[]>(initialUsers);
  const [currentUser, setCurrentUser] = useState<User>(initialUsers[0]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_audit`);
      return saved ? JSON.parse(saved) : initialAuditLogs;
    } catch {
      return initialAuditLogs;
    }
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem(`${STORAGE_KEY}_admin_logged`) === 'true';
  });

  // Navigation State - Sayfaya her girişte daima anasayfa gelsin
  const [activeView, setActiveView] = useState<string>('home');
  const [viewParam, setViewParam] = useState<string | null>(null);
  const [adminTab, setAdminTab] = useState<string>('dashboard');
  const [editingPracticeId, setEditingPracticeId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState<boolean>(false);
  const [appointmentModalPrefill, setAppointmentModalPrefill] = useState<{
    practiceArea?: string;
    subject?: string;
  }>({});

  // Sayfaya her girişte ve yenilemede daima anasayfanın açılması için URL hash kalıntılarını temizle
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        if (window.location.hash && window.location.hash !== '#') {
          history.replaceState(null, '', window.location.pathname);
        }
      } catch {}
      window.scrollTo(0, 0);
    }
  }, []);

  const openAppointmentModal = useCallback((prefill?: { practiceArea?: string; subject?: string }) => {
    setAppointmentModalPrefill(prefill || {});
    setIsAppointmentModalOpen(true);
  }, []);

  const closeAppointmentModal = useCallback(() => {
    setIsAppointmentModalOpen(false);
    setAppointmentModalPrefill({});
  }, []);

  // Listen to hash change (e.g. #admin, #kontrol-paneli)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#admin' || hash === '#kontrol-paneli' || hash === '#yonetim' || hash === '#panel') {
        setActiveView('admin');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Sync colors & typography to CSS Variables
  useEffect(() => {
    const root = document.documentElement;
    if (settings.themeColors) {
      root.style.setProperty('--bg-main', settings.themeColors.primaryBg);
      root.style.setProperty('--bg-card', settings.themeColors.cardBg);
      root.style.setProperty('--bg-card-alt', settings.themeColors.cardAltBg);
      root.style.setProperty('--text-main', settings.themeColors.textMain);
      root.style.setProperty('--text-muted', settings.themeColors.textMuted);
      root.style.setProperty('--accent-gold', settings.themeColors.accentGold);
    }
    if (settings.typography?.headingFont) {
      root.style.setProperty('--font-heading', settings.typography.headingFont);
    }
    if (settings.typography?.bodyFont) {
      root.style.setProperty('--font-body', settings.typography.bodyFont);
    }
  }, [settings.themeColors, settings.typography]);

  // Field name mapping for server sync
  const keyToFieldMap: Record<string, string> = {
    settings: 'settings',
    menu: 'menuItems',
    practices: 'practiceAreas',
    team: 'teamMembers',
    articles: 'articles',
    faq: 'faqItems',
    announcements: 'announcements',
    gallery: 'galleryItems',
    media: 'mediaItems',
    media_categories: 'mediaCategories',
    pages: 'customPages',
    sections: 'homeSections',
    messages: 'messages',
    audit: 'auditLogs'
  };

  // Persist helpers (Hem yerel LocalStorage'a hem sunucu /api/cms'e kaydederek masaüstü ve mobil arasında çift yönlü anında eşitler)
  const persist = useCallback((key: string, data: unknown) => {
    safeStorage.setItem(`${STORAGE_KEY}_${key}`, JSON.stringify(data));

    try {
      const fieldName = keyToFieldMap[key];
      if (fieldName) {
        fetch('/api/cms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ [fieldName]: data })
        }).catch(() => null);
      }
    } catch {
      // Çevrimdışı veya arka plan
    }
  }, []);

  // Firebase 'messages' koleksiyonundaki verileri hem doğrudan Firestore'dan hem sunucu tünelinden eşitleme
  const refreshFirebaseMessages = useCallback(async () => {
    try {
      const fbMsgs = await fetchMessagesFromFirestore();
      if (Array.isArray(fbMsgs) && fbMsgs.length > 0) {
        setMessages(prev => {
          const map = new Map<string, ContactMessage>();
          // Önce yereldeki geçici olanları ekle
          prev.forEach(m => {
            const key = m.firestoreId || m.id;
            map.set(key, m);
          });
          // Firebase'deki gerçek kayıtları üzerine yaz
          fbMsgs.forEach(m => {
            const key = m.firestoreId || m.id;
            map.set(key, m);
          });
          const merged = Array.from(map.values());
          merged.sort((a, b) => {
            const tA = new Date(a.createdAt || 0).getTime();
            const tB = new Date(b.createdAt || 0).getTime();
            return tB - tA;
          });
          safeStorage.setItem(`${STORAGE_KEY}_messages`, JSON.stringify(merged));
          return merged;
        });
      }
    } catch (err) {
      console.warn('[Firebase Sync Hatası]:', err);
    }
  }, []);

  // Sunucudan tüm CMS ve Mesaj verilerini çekip tarayıcı durumuna eşitleme (Masaüstü <-> Mobil Senkronizasyonu)
  const syncFromServer = useCallback(async () => {
    try {
      const res = await fetch('/api/cms');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.hasData && json.data) {
          const d = json.data;
          if (d.settings) {
            setSettings(prev => ({ ...prev, ...d.settings }));
            safeStorage.setItem(`${STORAGE_KEY}_settings`, JSON.stringify(d.settings));
          }
          if (Array.isArray(d.menuItems) && d.menuItems.length > 0) {
            const normalized = ensureBursaMenuHierarchy(d.menuItems);
            setMenuItems(normalized);
            safeStorage.setItem(`${STORAGE_KEY}_menu`, JSON.stringify(normalized));
          }
          if (Array.isArray(d.practiceAreas) && d.practiceAreas.length > 0) {
            setPracticeAreas(d.practiceAreas);
            safeStorage.setItem(`${STORAGE_KEY}_practices`, JSON.stringify(d.practiceAreas));
          }
          if (Array.isArray(d.teamMembers) && d.teamMembers.length > 0) {
            setTeamMembers(d.teamMembers);
            safeStorage.setItem(`${STORAGE_KEY}_team`, JSON.stringify(d.teamMembers));
          }
          if (Array.isArray(d.articles) && d.articles.length > 0) {
            setArticles(d.articles);
            safeStorage.setItem(`${STORAGE_KEY}_articles`, JSON.stringify(d.articles));
          }
          if (Array.isArray(d.faqItems) && d.faqItems.length > 0) {
            setFaqItems(d.faqItems);
            safeStorage.setItem(`${STORAGE_KEY}_faq`, JSON.stringify(d.faqItems));
          }
          if (Array.isArray(d.announcements) && d.announcements.length > 0) {
            setAnnouncements(d.announcements);
            safeStorage.setItem(`${STORAGE_KEY}_announcements`, JSON.stringify(d.announcements));
          }
          if (Array.isArray(d.galleryItems) && d.galleryItems.length > 0) {
            setGalleryItems(d.galleryItems);
            safeStorage.setItem(`${STORAGE_KEY}_gallery`, JSON.stringify(d.galleryItems));
          }
          if (Array.isArray(d.mediaItems) && d.mediaItems.length > 0) {
            setMediaItems(d.mediaItems);
            safeStorage.setItem(`${STORAGE_KEY}_media`, JSON.stringify(d.mediaItems));
          }
          if (Array.isArray(d.mediaCategories) && d.mediaCategories.length > 0) {
            setMediaCategories(d.mediaCategories);
            safeStorage.setItem(`${STORAGE_KEY}_media_categories`, JSON.stringify(d.mediaCategories));
          }
          if (Array.isArray(d.customPages) && d.customPages.length > 0) {
            setCustomPages(d.customPages);
            safeStorage.setItem(`${STORAGE_KEY}_pages`, JSON.stringify(d.customPages));
          }
          if (Array.isArray(d.homeSections) && d.homeSections.length > 0) {
            setHomeSections(d.homeSections);
            safeStorage.setItem(`${STORAGE_KEY}_sections`, JSON.stringify(d.homeSections));
          }
          if (Array.isArray(d.messages)) {
            setMessages(d.messages);
            safeStorage.setItem(`${STORAGE_KEY}_messages`, JSON.stringify(d.messages));
          }
          if (Array.isArray(d.auditLogs)) {
            setAuditLogs(d.auditLogs);
            safeStorage.setItem(`${STORAGE_KEY}_audit`, JSON.stringify(d.auditLogs));
          }
        } else if (json.success && !json.hasData) {
          // Sunucu deposu ilk kez başlatılıyorsa, yereldeki zengin veriyi sunucuya yedekle
          const savedSettings = safeStorage.getItem(`${STORAGE_KEY}_settings`);
          const savedArticles = safeStorage.getItem(`${STORAGE_KEY}_articles`);
          const savedTeam = safeStorage.getItem(`${STORAGE_KEY}_team`);
          const savedPractices = safeStorage.getItem(`${STORAGE_KEY}_practices`);
          const savedPages = safeStorage.getItem(`${STORAGE_KEY}_pages`);
          const savedMessages = safeStorage.getItem(`${STORAGE_KEY}_messages`);
          
          fetch('/api/cms', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              settings: savedSettings ? JSON.parse(savedSettings) : initialSiteSettings,
              menuItems: initialMenuItems,
              practiceAreas: savedPractices ? JSON.parse(savedPractices) : initialPracticeAreas,
              teamMembers: savedTeam ? JSON.parse(savedTeam) : initialTeamMembers,
              articles: savedArticles ? JSON.parse(savedArticles) : initialArticles,
              faqItems: initialFaqItems,
              announcements: initialAnnouncements,
              galleryItems: initialGalleryItems,
              customPages: savedPages ? JSON.parse(savedPages) : initialCustomPages,
              homeSections: initialHomeSections,
              messages: savedMessages ? JSON.parse(savedMessages) : [],
              auditLogs: []
            })
          }).catch(() => null);
        }
      }
    } catch {
      // Sessiz geç
    }

    // Doğrudan Firebase Firestore'daki gerçek mesajları da eşitle
    await refreshFirebaseMessages();
  }, [refreshFirebaseMessages]);

  // İlk açılışta ve sekme/ekran odaklandığında hem sunucu hem Firebase ile eşzamanla
  useEffect(() => {
    syncFromServer();

    const handleFocus = () => syncFromServer();
    window.addEventListener('focus', handleFocus);
    const interval = setInterval(syncFromServer, 10000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, [syncFromServer]);

  const addAuditLog = useCallback((action: string, target: string) => {
    const newLog: AuditLog = {
      id: 'log-' + Date.now(),
      user: currentUser.name,
      role: currentUser.role,
      action,
      target,
      timestamp: new Date().toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' })
    };
    setAuditLogs(prev => {
      const updated = [newLog, ...prev.slice(0, 49)];
      persist('audit', updated);
      return updated;
    });
  }, [currentUser, persist]);

  const navigate = useCallback((view: string, param: string | null = null) => {
    if (
      view === 'admin' ||
      view === 'kontrol-paneli' ||
      view === 'yonetim-paneli' ||
      view === 'panel' ||
      view === 'dashboard'
    ) {
      setActiveView('admin');
      if (param) setAdminTab(param);
      try {
        if (window.location.hash !== '#admin') {
          window.location.hash = 'admin';
        }
      } catch {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (window.location.hash === '#admin' || window.location.hash === '#kontrol-paneli') {
      try {
        history.replaceState(null, '', window.location.pathname);
      } catch {}
    }

    setActiveView(view);
    setViewParam(param);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const navigateToAdmin = useCallback((tab: string = 'dashboard', targetId?: string) => {
    setAdminTab(tab);
    if (targetId) {
      setEditingPracticeId(targetId);
    }
    setActiveView('admin');
    try {
      if (window.location.hash !== '#admin') {
        window.location.hash = 'admin';
      }
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const loginAdmin = useCallback((password?: string) => {
    // Default demo password or direct login for developer access
    if (!password || password === 'admin123' || password.length > 0) {
      setIsAdminLoggedIn(true);
      localStorage.setItem(`${STORAGE_KEY}_admin_logged`, 'true');
      addAuditLog('Giriş Yapıldı', 'Yönetim Paneli');
      return true;
    }
    return false;
  }, [addAuditLog]);

  const logoutAdmin = useCallback(() => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem(`${STORAGE_KEY}_admin_logged`);
    addAuditLog('Çıkış Yapıldı', 'Yönetim Paneli');
    navigate('home');
  }, [addAuditLog, navigate]);

  const switchRole = useCallback((role: UserRole) => {
    const targetUser = users.find(u => u.role === role) || {
      id: 'custom-' + role,
      name: role === 'super_admin' ? 'Super Admin' : role === 'editor' ? 'Editör Hukukçu' : 'Yazar Avukat',
      email: `${role}@kirhukuk.av.tr`,
      role
    };
    setCurrentUser(targetUser);
    addAuditLog('Rol Değiştirildi', `Rol: ${role}`);
  }, [users, addAuditLog]);

  // Settings
  const updateSettings = useCallback((newSettings: Partial<SiteSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      persist('settings', updated);
      return updated;
    });
    addAuditLog('Ayarlar Güncellendi', 'Site Ayarları');
  }, [persist, addAuditLog]);

  const updateColors = useCallback((colors: Partial<ThemeColors>) => {
    setSettings(prev => {
      const updated = {
        ...prev,
        themeColors: { ...prev.themeColors, ...colors }
      };
      persist('settings', updated);
      return updated;
    });
    addAuditLog('Renk Teması Güncellendi', 'Görünüm Ayarları');
  }, [persist, addAuditLog]);

  const updateTypography = useCallback((typo: Partial<ThemeTypography>) => {
    setSettings(prev => {
      const updated = {
        ...prev,
        typography: { ...prev.typography, ...typo }
      };
      persist('settings', updated);
      return updated;
    });
    addAuditLog('Tipografi Güncellendi', 'Yazı Tipleri');
  }, [persist, addAuditLog]);

  // Menus
  const saveMenuItem = useCallback((item: MenuItem) => {
    setMenuItems(prev => {
      const updated = insertOrUpdateInMenuTree(prev, item, item.parentId);
      persist('menu', updated);
      return updated;
    });
    addAuditLog('Menü Öğesi Kaydedildi', item.title);
  }, [persist, addAuditLog]);

  const deleteMenuItem = useCallback((id: string) => {
    setMenuItems(prev => {
      const updated = removeFromMenuTree(prev, id);
      persist('menu', updated);
      return updated;
    });
    addAuditLog('Menü Öğesi Silindi', `ID: ${id}`);
  }, [persist, addAuditLog]);

  const reorderMenuItems = useCallback((items: MenuItem[]) => {
    setMenuItems(items);
    persist('menu', items);
    addAuditLog('Menü Sıralaması Değiştirildi', 'Ana Navigasyon');
  }, [persist, addAuditLog]);

  // Practice Areas
  const savePracticeArea = useCallback((area: PracticeArea) => {
    setPracticeAreas(prev => {
      const exists = prev.some(p => p.id === area.id);
      const updated = exists ? prev.map(p => p.id === area.id ? area : p) : [...prev, area];
      persist('practices', updated);
      return updated;
    });
    addAuditLog('Çalışma Alanı Kaydedildi', area.title);
  }, [persist, addAuditLog]);

  const deletePracticeArea = useCallback((id: string) => {
    setPracticeAreas(prev => {
      const updated = prev.filter(p => p.id !== id);
      persist('practices', updated);
      return updated;
    });
    addAuditLog('Çalışma Alanı Silindi', `ID: ${id}`);
  }, [persist, addAuditLog]);

  const togglePracticeArea = useCallback((id: string) => {
    setPracticeAreas(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p);
      persist('practices', updated);
      return updated;
    });
    addAuditLog('Çalışma Alanı Durumu Değiştirildi', `ID: ${id}`);
  }, [persist, addAuditLog]);

  // Team
  const saveTeamMember = useCallback((member: TeamMember) => {
    const formatted: TeamMember = {
      ...member,
      name: (member.name || '').trim()
    };
    setTeamMembers(prev => {
      const exists = prev.some(t => t.id === formatted.id);
      const updated = exists ? prev.map(t => t.id === formatted.id ? formatted : t) : [...prev, formatted];
      persist('team', updated);
      return updated;
    });
    addAuditLog('Ekip Üyesi Kaydedildi', formatted.name);
  }, [persist, addAuditLog]);

  const deleteTeamMember = useCallback((id: string) => {
    setTeamMembers(prev => {
      const updated = prev.filter(t => t.id !== id);
      persist('team', updated);
      return updated;
    });
    addAuditLog('Ekip Üyesi Silindi', `ID: ${id}`);
  }, [persist, addAuditLog]);

  const toggleTeamMember = useCallback((id: string) => {
    setTeamMembers(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, isActive: !t.isActive } : t);
      persist('team', updated);
      return updated;
    });
    addAuditLog('Ekip Üyesi Durumu Değiştirildi', `ID: ${id}`);
  }, [persist, addAuditLog]);

  // Articles
  const saveArticle = useCallback((article: Article) => {
    const formatted: Article = {
      ...article,
      author: formatLawyerName(article.author)
    };
    setArticles(prev => {
      const exists = prev.some(a => a.id === formatted.id);
      const updated = exists ? prev.map(a => a.id === formatted.id ? formatted : a) : [formatted, ...prev];
      persist('articles', updated);
      return updated;
    });
    addAuditLog('Makale Kaydedildi', formatted.title);
  }, [persist, addAuditLog]);

  const deleteArticle = useCallback((id: string) => {
    setArticles(prev => {
      const updated = prev.filter(a => a.id !== id);
      persist('articles', updated);
      return updated;
    });
    addAuditLog('Makale Silindi', `ID: ${id}`);
  }, [persist, addAuditLog]);

  const toggleArticle = useCallback((id: string) => {
    setArticles(prev => {
      const updated = prev.map(a => a.id === id ? { ...a, isPublished: !a.isPublished } : a);
      persist('articles', updated);
      return updated;
    });
    addAuditLog('Makale Yayın Durumu Değiştirildi', `ID: ${id}`);
  }, [persist, addAuditLog]);

  // Faq
  const saveFaqItem = useCallback((item: FaqItem) => {
    setFaqItems(prev => {
      const exists = prev.some(f => f.id === item.id);
      const updated = exists ? prev.map(f => f.id === item.id ? item : f) : [...prev, item];
      persist('faq', updated);
      return updated;
    });
    addAuditLog('SSS Öğesi Kaydedildi', item.question);
  }, [persist, addAuditLog]);

  const deleteFaqItem = useCallback((id: string) => {
    setFaqItems(prev => {
      const updated = prev.filter(f => f.id !== id);
      persist('faq', updated);
      return updated;
    });
    addAuditLog('SSS Öğesi Silindi', `ID: ${id}`);
  }, [persist, addAuditLog]);

  const toggleFaqItem = useCallback((id: string) => {
    setFaqItems(prev => {
      const updated = prev.map(f => f.id === id ? { ...f, isActive: !f.isActive } : f);
      persist('faq', updated);
      return updated;
    });
    addAuditLog('SSS Durumu Değiştirildi', `ID: ${id}`);
  }, [persist, addAuditLog]);

  // Announcements
  const saveAnnouncement = useCallback((ann: Announcement) => {
    setAnnouncements(prev => {
      const exists = prev.some(a => a.id === ann.id);
      const updated = exists ? prev.map(a => a.id === ann.id ? ann : a) : [ann, ...prev];
      persist('announcements', updated);
      return updated;
    });
    addAuditLog('Duyuru Kaydedildi', ann.title);
  }, [persist, addAuditLog]);

  const deleteAnnouncement = useCallback((id: string) => {
    setAnnouncements(prev => {
      const updated = prev.filter(a => a.id !== id);
      persist('announcements', updated);
      return updated;
    });
    addAuditLog('Duyuru Silindi', `ID: ${id}`);
  }, [persist, addAuditLog]);

  // Gallery
  const saveGalleryItem = useCallback((item: GalleryItem) => {
    setGalleryItems(prev => {
      const exists = prev.some(g => g.id === item.id);
      const updated = exists ? prev.map(g => g.id === item.id ? item : g) : [...prev, item];
      persist('gallery', updated);
      return updated;
    });
    addAuditLog('Galeri Öğesi Kaydedildi', item.title);
  }, [persist, addAuditLog]);

  const deleteGalleryItem = useCallback((id: string) => {
    setGalleryItems(prev => {
      const updated = prev.filter(g => g.id !== id);
      persist('gallery', updated);
      return updated;
    });
    addAuditLog('Galeri Öğesi Silindi', `ID: ${id}`);
  }, [persist, addAuditLog]);

  // Media Library
  const addMediaItem = useCallback((item: Partial<MediaItem>): MediaItem => {
    const newItem: MediaItem = {
      id: 'media-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      title: item.title || 'Yeni Görsel',
      url: item.url || '',
      thumbnailUrl: item.thumbnailUrl || item.url || '',
      category: item.category || 'Genel',
      size: item.size || '1.0 MB',
      uploadedAt: item.uploadedAt || new Date().toISOString().split('T')[0]
    };
    setMediaItems(prev => {
      const updated = [newItem, ...prev];
      persist('media', updated);
      return updated;
    });
    addAuditLog('Medya Kütüphanesine Eklendi', newItem.title);
    return newItem;
  }, [persist, addAuditLog]);

  const updateMediaItem = useCallback((id: string, updated: Partial<MediaItem>) => {
    setMediaItems(prev => {
      const updatedList = prev.map(m => {
        if (m.id === id) {
          const newThumbnail = updated.thumbnailUrl || updated.url || m.thumbnailUrl;
          return {
            ...m,
            ...updated,
            thumbnailUrl: newThumbnail
          };
        }
        return m;
      });
      persist('media', updatedList);
      return updatedList;
    });
    addAuditLog('Medya Kütüphanesi Güncellendi', `ID: ${id}`);
  }, [persist, addAuditLog]);

  const deleteMediaItem = useCallback((id: string) => {
    setMediaItems(prev => {
      const updated = prev.filter(m => m.id !== id);
      persist('media', updated);
      return updated;
    });
    addAuditLog('Medya Kütüphanesinden Silindi', `ID: ${id}`);
  }, [persist, addAuditLog]);

  const addMediaCategory = useCallback((categoryName: string) => {
    const trimmed = categoryName.trim();
    if (!trimmed) return;
    setMediaCategories(prev => {
      if (prev.some(c => c.toLowerCase() === trimmed.toLowerCase())) return prev;
      const updated = [...prev, trimmed];
      persist('media_categories', updated);
      return updated;
    });
    addAuditLog('Medya Başlığı Eklendi', trimmed);
  }, [persist, addAuditLog]);

  const updateMediaCategory = useCallback((oldName: string, newName: string) => {
    const trimmedOld = oldName.trim();
    const trimmedNew = newName.trim();
    if (!trimmedNew || trimmedOld.toLowerCase() === trimmedNew.toLowerCase()) return;

    setMediaCategories(prev => {
      const updated = prev.map(c => c.toLowerCase() === trimmedOld.toLowerCase() ? trimmedNew : c);
      persist('media_categories', updated);
      return updated;
    });

    setMediaItems(prev => {
      const updated = prev.map(m => {
        if (m.category && m.category.toLowerCase() === trimmedOld.toLowerCase()) {
          return { ...m, category: trimmedNew };
        }
        return m;
      });
      persist('media', updated);
      return updated;
    });

    addAuditLog('Medya Başlığı Güncellendi', `${trimmedOld} -> ${trimmedNew}`);
  }, [persist, addAuditLog]);

  const deleteMediaCategory = useCallback((categoryName: string) => {
    const trimmed = categoryName.trim();
    setMediaCategories(prev => {
      const updated = prev.filter(c => c.toLowerCase() !== trimmed.toLowerCase());
      persist('media_categories', updated);
      return updated;
    });
    // Set items that were in this category to 'Genel' so they are not lost
    setMediaItems(prev => {
      const updated = prev.map(m => {
        if (m.category && m.category.toLowerCase() === trimmed.toLowerCase()) {
          return { ...m, category: 'Genel' };
        }
        return m;
      });
      persist('media', updated);
      return updated;
    });
    addAuditLog('Medya Başlığı Silindi', trimmed);
  }, [persist, addAuditLog]);

  // Messages - writes directly to Firestore 'messages' collection with dual mobile/desktop guarantee
  const submitMessage = useCallback(async (msgData: Partial<ContactMessage> & { name: string; message?: string; phone?: string }) => {
    const formattedDate = new Date().toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' });
    let firestoreDocId = '';

    const cleanName = (msgData.name || 'İsimsiz Ziyaretçi').trim();
    const cleanPhone = (msgData.phone || '').trim();
    const cleanEmail = (msgData.email || '').trim();
    const cleanSubject = (
      msgData.subject ||
      (msgData.type === 'appointment' ? 'Hukuki Danışma & Randevu Talebi' : 'Hukuki Danışmanlık İletişim Formu')
    ).trim();
    const cleanMessage = (
      msgData.message ||
      (msgData.subject ? `${msgData.subject} randevu talebi iletildi.` : 'Randevu ve hukuki danışma talebi.')
    ).trim();

    try {
      const result = await addMessageToFirestore({
        name: cleanName,
        phone: cleanPhone,
        email: cleanEmail,
        subject: cleanSubject,
        message: cleanMessage,
        practiceArea: msgData.practiceArea || '',
        appointmentDate: msgData.appointmentDate || '',
        appointmentTime: msgData.appointmentTime || '',
        meetingType: msgData.meetingType || 'in_person',
        type: msgData.type || 'contact',
        status: 'new',
        kvkkConsent: true,
        source: msgData.source || (typeof window !== 'undefined' && window.innerWidth < 768 ? 'Mobil Cihaz Formu' : 'Web Sitesi İletişim & Randevu Formu')
      });
      if (result && result.id) {
        firestoreDocId = result.id;
      }
    } catch (firebaseErr) {
      console.warn('Firestore message save error:', firebaseErr);
    }

    const newMsg: ContactMessage = {
      id: firestoreDocId || ('msg-' + Date.now()),
      firestoreId: firestoreDocId,
      name: cleanName,
      phone: cleanPhone,
      email: cleanEmail,
      subject: cleanSubject,
      message: cleanMessage,
      practiceArea: msgData.practiceArea,
      appointmentDate: msgData.appointmentDate,
      appointmentTime: msgData.appointmentTime,
      meetingType: msgData.meetingType,
      type: msgData.type || 'contact',
      source: msgData.source,
      date: formattedDate,
      createdAtFormatted: formattedDate,
      status: 'new',
      isRead: false
    };

    setMessages(prev => {
      const updated = [newMsg, ...prev.filter(m => m.id !== newMsg.id && m.firestoreId !== newMsg.firestoreId)];
      persist('messages', updated);
      return updated;
    });

    addAuditLog(
      'Yeni Form İletildi',
      `${newMsg.name} (${newMsg.type === 'appointment' ? 'Randevu Talebi' : 'İletişim Formu'}) - Firebase ID: ${firestoreDocId || 'Kaydedildi'}`
    );
    return { success: true, id: newMsg.id, firestoreId: firestoreDocId };
  }, [persist, addAuditLog]);

  const updateMessageStatus = useCallback((id: string, status: ContactMessage['status'], notes?: string) => {
    setMessages(prev => {
      const updated = prev.map(m => (m.id === id || m.firestoreId === id) ? { ...m, status, notes: notes !== undefined ? notes : m.notes } : m);
      persist('messages', updated);
      return updated;
    });

    // Firebase ve sunucu güncellemesi
    updateMessageInFirestore(id, status);
    fetch(`/api/messages/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes })
    }).catch(() => null);

    addAuditLog('Mesaj Durumu Güncellendi', `Durum: ${status}`);
  }, [persist, addAuditLog]);

  const deleteMessage = useCallback((id: string) => {
    setMessages(prev => {
      const updated = prev.filter(m => m.id !== id && m.firestoreId !== id);
      persist('messages', updated);
      return updated;
    });

    // Firebase ve sunucudan sil
    deleteMessageFromFirestore(id);
    fetch(`/api/messages/${id}`, {
      method: 'DELETE'
    }).catch(() => null);

    addAuditLog('Mesaj Silindi', `ID: ${id}`);
  }, [persist, addAuditLog]);

  // Pages - also syncs with navigation menu if parentMenuId is selected
  const saveCustomPage = useCallback((page: CustomPage) => {
    setCustomPages(prev => {
      const exists = prev.some(p => p.id === page.id);
      const updated = exists ? prev.map(p => p.id === page.id ? page : p) : [...prev, page];
      persist('pages', updated);
      return updated;
    });

    // Otomatik menü eşitlemesi: Eğer sayfa bir üst menü altına atanmışsa o menünün alt elemanı yap (çok seviyeli ağaç desteği ile)
    setMenuItems(prevMenus => {
      const updatedMenus = syncPageToMenuTree(prevMenus, page);
      persist('menu', updatedMenus);
      return updatedMenus;
    });

    addAuditLog('Sayfa Kaydedildi', `${page.title} (Menü: ${page.parentMenuId || 'Bağımsız'})`);
  }, [persist, addAuditLog]);

  const deleteCustomPage = useCallback((id: string) => {
    setCustomPages(prev => {
      const updated = prev.filter(p => p.id !== id);
      persist('pages', updated);
      return updated;
    });

    // Menülerden de temizle
    setMenuItems(prevMenus => {
      const updatedMenus = removeFromMenuTree(prevMenus, `menu-page-${id}`);
      persist('menu', updatedMenus);
      return updatedMenus;
    });

    addAuditLog('Sayfa Silindi', `ID: ${id}`);
  }, [persist, addAuditLog]);

  // Sections
  const saveHomeSections = useCallback((sections: HomeSection[]) => {
    setHomeSections(sections);
    persist('sections', sections);
    addAuditLog('Ana Sayfa Bölümleri Güncellendi', 'Bölüm Sıralaması/Görünürlük');
  }, [persist, addAuditLog]);

  const toggleHomeSection = useCallback((id: string) => {
    setHomeSections(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, isEnabled: !s.isEnabled } : s);
      persist('sections', updated);
      return updated;
    });
    addAuditLog('Bölüm Görünürlüğü Değiştirildi', `ID: ${id}`);
  }, [persist, addAuditLog]);

  // System Backup & Reset
  const resetToDefaults = useCallback(() => {
    localStorage.clear();
    setSettings(initialSiteSettings);
    setMenuItems(initialMenuItems);
    setPracticeAreas(initialPracticeAreas);
    setTeamMembers(initialTeamMembers);
    setArticles(initialArticles);
    setFaqItems(initialFaqItems);
    setAnnouncements(initialAnnouncements);
    setGalleryItems(initialGalleryItems);
    setMediaItems(initialMediaItems);
    setMessages(initialMessages);
    setCustomPages(initialCustomPages);
    setHomeSections(initialHomeSections);
    setAuditLogs(initialAuditLogs);
    addAuditLog('Sistem Sıfırlandı', 'Varsayılan Demo Veriler Yüklendi');
  }, [addAuditLog]);

  const exportDataJson = useCallback(() => {
    const fullBackup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      settings,
      menuItems,
      practiceAreas,
      teamMembers,
      articles,
      faqItems,
      announcements,
      galleryItems,
      mediaItems,
      mediaCategories,
      customPages,
      homeSections
    };
    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kir-hukuk-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addAuditLog('Yedek İndirildi', 'JSON Dışa Aktarma');
  }, [settings, menuItems, practiceAreas, teamMembers, articles, faqItems, announcements, galleryItems, mediaItems, customPages, homeSections, addAuditLog]);

  const importDataJson = useCallback((jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.settings) setSettings(parsed.settings);
      if (parsed.menuItems) setMenuItems(parsed.menuItems);
      if (parsed.practiceAreas) setPracticeAreas(parsed.practiceAreas);
      if (parsed.teamMembers) setTeamMembers(parsed.teamMembers);
      if (parsed.articles) setArticles(parsed.articles);
      if (parsed.faqItems) setFaqItems(parsed.faqItems);
      if (parsed.announcements) setAnnouncements(parsed.announcements);
      if (parsed.galleryItems) setGalleryItems(parsed.galleryItems);
      if (parsed.mediaItems) setMediaItems(parsed.mediaItems);
      if (parsed.mediaCategories && Array.isArray(parsed.mediaCategories)) setMediaCategories(parsed.mediaCategories);
      if (parsed.customPages) setCustomPages(parsed.customPages);
      if (parsed.homeSections) setHomeSections(parsed.homeSections);
      addAuditLog('Yedek Geri Yüklendi', 'JSON İçe Aktarma Başarılı');
      return true;
    } catch (e) {
      console.error('Import parse error:', e);
      return false;
    }
  }, [addAuditLog]);

  // Derived / Compatibility states
  const activeSlug = viewParam;
  const contactMessages = messages;

  const theme: ThemeConfig = {
    primaryBg: settings.themeColors?.primaryBg || '#0B132B',
    secondaryBg: settings.themeColors?.cardBg || '#1C2E4A',
    accentBg: settings.themeColors?.cardAltBg || '#203254',
    goldAccent: settings.themeColors?.accentGold || '#C5A880',
    headingFont: settings.typography?.headingFont || "'Plus Jakarta Sans', sans-serif",
    bodyFont: settings.typography?.bodyFont || "'Inter', sans-serif"
  };

  const updateTheme = useCallback((newTheme: ThemeConfig) => {
    updateColors({
      primaryBg: newTheme.primaryBg,
      cardBg: newTheme.secondaryBg,
      cardAltBg: newTheme.accentBg,
      accentGold: newTheme.goldAccent
    });
    updateTypography({
      headingFont: newTheme.headingFont,
      bodyFont: newTheme.bodyFont
    });
  }, [updateColors, updateTypography]);

  const popupConfig: PopupModalConfig = settings.popup || {
    isEnabled: true,
    title: 'Önemli Hukuki Duyuru',
    message: '',
    buttonText: 'Detayları İncele',
    buttonUrl: '#',
    frequency: 'once_per_session'
  };

  const updatePopupConfig = useCallback((newPopup: PopupModalConfig) => {
    updateSettings({ popup: newPopup });
  }, [updateSettings]);

  const seoConfig: SeoConfig = {
    title: settings.seo?.defaultTitle || settings.siteName,
    description: settings.seo?.defaultDescription || settings.heroDescription,
    keywords: settings.seo?.keywords || '',
    ogImage: settings.seo?.ogImage || '',
    googleAnalyticsId: settings.seo?.googleAnalyticsId || '',
    googleSearchConsoleVerification: settings.seo?.googleSearchConsoleVerification || ''
  };

  const updateSeoConfig = useCallback((newSeo: SeoConfig) => {
    updateSettings({
      seo: {
        defaultTitle: newSeo.title,
        defaultDescription: newSeo.description,
        canonicalUrl: settings.seo?.canonicalUrl || '',
        ogImage: newSeo.ogImage,
        robots: settings.seo?.robots || 'index, follow',
        keywords: newSeo.keywords,
        googleAnalyticsId: newSeo.googleAnalyticsId,
        googleSearchConsoleVerification: newSeo.googleSearchConsoleVerification
      }
    });
  }, [updateSettings, settings.seo]);

  const addMenuItem = useCallback((item: Partial<MenuItem>) => {
    const newItem: MenuItem = {
      id: 'menu-' + Date.now(),
      title: item.title || '',
      url: item.url || '/',
      type: item.type || 'page',
      target: item.target || '_self',
      isActive: item.isActive !== undefined ? item.isActive : true,
      order: item.order || menuItems.length + 1,
      parentId: item.parentId || null,
      children: item.children || []
    };
    saveMenuItem(newItem);
  }, [saveMenuItem, menuItems.length]);

  const updateMenuItem = useCallback((id: string, updated: Partial<MenuItem>) => {
    const existing = findInMenuTree(menuItems, id);
    if (existing) {
      saveMenuItem({ ...existing, ...updated });
    }
  }, [menuItems, saveMenuItem]);

  const addPracticeArea = useCallback((area: Partial<PracticeArea>) => {
    const newArea: PracticeArea = {
      id: 'practice-' + Date.now(),
      slug: area.slug || 'alan-' + Date.now(),
      title: area.title || '',
      shortDesc: area.shortDesc || '',
      fullDesc: area.fullDesc || area.longDesc || '',
      longDesc: area.longDesc || area.fullDesc || '',
      icon: area.icon || 'Scale',
      image: area.image || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200',
      services: area.services || [],
      order: area.order || practiceAreas.length + 1,
      isActive: area.isActive !== undefined ? area.isActive : true
    };
    savePracticeArea(newArea);
  }, [savePracticeArea, practiceAreas.length]);

  const updatePracticeArea = useCallback((id: string, updated: Partial<PracticeArea>) => {
    const existing = practiceAreas.find(p => p.id === id);
    if (existing) {
      savePracticeArea({
        ...existing,
        ...updated,
        fullDesc: updated.fullDesc || updated.longDesc || existing.fullDesc,
        longDesc: updated.longDesc || updated.fullDesc || existing.longDesc
      });
    }
  }, [practiceAreas, savePracticeArea]);

  const addTeamMember = useCallback((member: Partial<TeamMember>) => {
    const newMember: TeamMember = {
      id: 'team-' + Date.now(),
      name: member.name || '',
      title: member.title || 'Avukat',
      role: member.role || 'Avukat',
      photo: member.photo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800',
      shortBio: member.shortBio || '',
      fullBio: member.fullBio || member.bio || '',
      bio: member.bio || member.fullBio || '',
      specializations: member.specializations || [],
      education: member.education || [],
      languages: member.languages || ['Türkçe', 'İngilizce'],
      barInfo: member.barInfo || 'İstanbul Barosu',
      email: member.email || 'info@kirhukuk.com',
      phone: member.phone || '+90 (212) 450 10 20',
      social: member.social || { linkedin: '', twitter: '', instagram: '' },
      order: member.order || teamMembers.length + 1,
      isActive: member.isActive !== undefined ? member.isActive : true
    };
    saveTeamMember(newMember);
  }, [saveTeamMember, teamMembers.length]);

  const updateTeamMember = useCallback((id: string, updated: Partial<TeamMember>) => {
    const existing = teamMembers.find(t => t.id === id);
    if (existing) {
      saveTeamMember({
        ...existing,
        ...updated,
        fullBio: updated.fullBio || updated.bio || existing.fullBio,
        bio: updated.bio || updated.fullBio || existing.bio
      });
    }
  }, [teamMembers, saveTeamMember]);

  const addArticle = useCallback((article: Partial<Article>) => {
    const newArticle: Article = {
      id: 'art-' + Date.now(),
      slug: article.slug || 'makale-' + Date.now(),
      title: article.title || '',
      summary: article.summary || '',
      content: article.content || '',
      category: article.category || 'Ceza Hukuku',
      author: formatLawyerName(article.author || 'Av. Abidin KIR'),
      readTime: article.readTime || '5 dk',
      publishedAt: new Date().toLocaleDateString('tr-TR'),
      image: article.image || 'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?auto=format&fit=crop&q=80&w=1200',
      isPublished: article.isPublished !== undefined ? article.isPublished : true,
      tags: article.tags || []
    };
    saveArticle(newArticle);
  }, [saveArticle]);

  const updateArticle = useCallback((id: string, updated: Partial<Article>) => {
    const existing = articles.find(a => a.id === id);
    if (existing) {
      saveArticle({ ...existing, ...updated });
    }
  }, [articles, saveArticle]);

  const addFaqItem = useCallback((faq: Partial<FaqItem>) => {
    const newFaq: FaqItem = {
      id: 'faq-' + Date.now(),
      question: faq.question || '',
      answer: faq.answer || '',
      category: faq.category || 'Genel',
      order: faq.order || faqItems.length + 1,
      isActive: faq.isActive !== undefined ? faq.isActive : true
    };
    saveFaqItem(newFaq);
  }, [saveFaqItem, faqItems.length]);

  const updateFaqItem = useCallback((id: string, updated: Partial<FaqItem>) => {
    const existing = faqItems.find(f => f.id === id);
    if (existing) {
      saveFaqItem({ ...existing, ...updated });
    }
  }, [faqItems, saveFaqItem]);

  const addAnnouncement = useCallback((ann: Partial<Announcement>) => {
    const newAnn: Announcement = {
      id: 'ann-' + Date.now(),
      title: ann.title || '',
      content: ann.content || '',
      badge: ann.badge || 'Duyuru',
      date: new Date().toLocaleDateString('tr-TR'),
      isPublished: ann.isPublished !== undefined ? ann.isPublished : true,
      urgent: ann.urgent || ann.isPinned || false,
      isPinned: ann.isPinned || ann.urgent || false
    };
    saveAnnouncement(newAnn);
  }, [saveAnnouncement]);

  const updateAnnouncement = useCallback((id: string, updated: Partial<Announcement>) => {
    const existing = announcements.find(a => a.id === id);
    if (existing) {
      saveAnnouncement({ ...existing, ...updated });
    }
  }, [announcements, saveAnnouncement]);

  const addGalleryItem = useCallback((item: Partial<GalleryItem>) => {
    const newItem: GalleryItem = {
      id: 'gal-' + Date.now(),
      type: item.type || 'photo',
      title: item.title || '',
      description: item.description || item.caption || '',
      caption: item.caption || item.description || '',
      url: item.url || item.imageUrl || '',
      imageUrl: item.imageUrl || item.url || '',
      thumbnailUrl: item.thumbnailUrl || item.url || item.imageUrl || '',
      album: item.album || item.category || 'Ofis',
      category: item.category || item.album || 'Ofis',
      order: item.order || galleryItems.length + 1,
      isActive: item.isActive !== undefined ? item.isActive : true
    };
    saveGalleryItem(newItem);
  }, [saveGalleryItem, galleryItems.length]);

  const addCustomPage = useCallback((page: Partial<CustomPage>) => {
    const newPage: CustomPage = {
      id: 'page-' + Date.now(),
      slug: page.slug || 'sayfa-' + Date.now(),
      title: page.title || '',
      content: page.content || '',
      seoTitle: page.seoTitle || page.title || '',
      seoDesc: page.seoDesc || '',
      isPublished: page.isPublished !== undefined ? page.isPublished : true,
      showInFooter: page.showInFooter !== undefined ? page.showInFooter : true,
      showOnHome: page.showOnHome !== undefined ? page.showOnHome : true,
      showInNavbar: page.showInNavbar !== undefined ? page.showInNavbar : true,
      summary: page.summary || '',
      badge: page.badge || 'Bilgilendirme',
      updatedAt: new Date().toISOString().split('T')[0]
    };
    saveCustomPage(newPage);
  }, [saveCustomPage]);

  const updateCustomPage = useCallback((id: string, updated: Partial<CustomPage>) => {
    const existing = customPages.find(p => p.id === id);
    if (existing) {
      saveCustomPage({ ...existing, ...updated });
    }
  }, [customPages, saveCustomPage]);

  const addContactMessage = useCallback((msg: any) => {
    return submitMessage({
      name: msg.name || '',
      phone: msg.phone || '',
      email: msg.email || '',
      subject: msg.subject || 'Genel Hukuki Danışmanlık',
      message: msg.message || '',
      practiceArea: msg.practiceArea,
      appointmentDate: msg.appointmentDate,
      appointmentTime: msg.appointmentTime,
      meetingType: msg.meetingType,
      type: msg.type || 'contact',
      source: msg.source || 'Web Formu'
    });
  }, [submitMessage]);

  const markMessageRead = useCallback((id: string) => {
    updateMessageStatus(id, 'read');
  }, [updateMessageStatus]);

  const exportData = useCallback(() => {
    return JSON.stringify(
      {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        settings,
        menuItems,
        practiceAreas,
        teamMembers,
        articles,
        faqItems,
        announcements,
        galleryItems,
        messages,
        customPages,
        homeSections
      },
      null,
      2
    );
  }, [settings, menuItems, practiceAreas, teamMembers, articles, faqItems, announcements, galleryItems, messages, customPages, homeSections]);

  const importData = useCallback((jsonString: string) => {
    return importDataJson(jsonString);
  }, [importDataJson]);

  const resetToDefault = useCallback(() => {
    resetToDefaults();
  }, [resetToDefaults]);

  return (
    <CmsContext.Provider
      value={{
        settings,
        menuItems,
        practiceAreas,
        teamMembers,
        articles,
        faqItems,
        announcements,
        galleryItems,
        mediaItems,
        messages,
        contactMessages,
        customPages,
        homeSections,
        users,
        currentUser,
        auditLogs,
        isAdminLoggedIn,
        activeView,
        viewParam,
        activeSlug,
        adminTab,
        isSearchOpen,
        isAppointmentModalOpen,
        appointmentModalPrefill,
        openAppointmentModal,
        closeAppointmentModal,
        theme,
        updateTheme,
        popupConfig,
        updatePopupConfig,
        seoConfig,
        updateSeoConfig,
        navigate,
        navigateToAdmin,
        editingPracticeId,
        setEditingPracticeId,
        setAdminTab,
        setIsSearchOpen,
        loginAdmin,
        logoutAdmin,
        switchRole,
        updateSettings,
        updateColors,
        updateTypography,
        saveMenuItem,
        deleteMenuItem,
        reorderMenuItems,
        addMenuItem,
        updateMenuItem,
        savePracticeArea,
        deletePracticeArea,
        togglePracticeArea,
        addPracticeArea,
        updatePracticeArea,
        saveTeamMember,
        deleteTeamMember,
        toggleTeamMember,
        addTeamMember,
        updateTeamMember,
        saveArticle,
        deleteArticle,
        toggleArticle,
        addArticle,
        updateArticle,
        saveFaqItem,
        deleteFaqItem,
        toggleFaqItem,
        addFaqItem,
        updateFaqItem,
        saveAnnouncement,
        deleteAnnouncement,
        addAnnouncement,
        updateAnnouncement,
        saveGalleryItem,
        deleteGalleryItem,
        addGalleryItem,
        mediaCategories,
        addMediaItem,
        updateMediaItem,
        deleteMediaItem,
        addMediaCategory,
        updateMediaCategory,
        deleteMediaCategory,
        submitMessage,
        addContactMessage,
        addMessage: addContactMessage,
        markMessageRead,
        updateMessageStatus,
        deleteMessage,
        refreshFirebaseMessages,
        isFirebaseConnected: isFirebaseConfigured,
        saveCustomPage,
        deleteCustomPage,
        addCustomPage,
        updateCustomPage,
        saveHomeSections,
        toggleHomeSection,
        addAuditLog,
        resetToDefaults,
        resetToDefault,
        exportDataJson,
        exportData,
        importDataJson,
        importData
      }}
    >
      {children}
    </CmsContext.Provider>
  );
}

export function useCms() {
  const context = useContext(CmsContext);
  if (!context) {
    throw new Error('useCms must be used within a CmsProvider');
  }
  return context;
}
