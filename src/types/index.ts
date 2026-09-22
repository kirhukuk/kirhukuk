export type UserRole = 'super_admin' | 'editor' | 'author';

export type AdminTab =
  | 'dashboard'
  | 'settings'
  | 'menus'
  | 'pages'
  | 'practices'
  | 'team'
  | 'articles'
  | 'faq'
  | 'announcements'
  | 'gallery'
  | 'media'
  | 'messages'
  | 'theme'
  | 'popup'
  | 'seo'
  | 'backup';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface MenuItem {
  id: string;
  title: string;
  url: string;
  type: 'page' | 'category' | 'external' | 'tel' | 'whatsapp';
  target?: '_self' | '_blank';
  isActive: boolean;
  order: number;
  parentId?: string | null;
  children?: MenuItem[];
}

export interface PracticeArea {
  id: string;
  slug: string;
  title: string;
  shortDesc: string;
  fullDesc?: string;
  longDesc?: string;
  icon: string;
  image: string;
  services: string[];
  order: number;
  isActive: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  role?: string;
  photo: string;
  shortBio: string;
  fullBio?: string;
  bio?: string;
  specializations: string[];
  education: string | string[];
  experience?: string[];
  languages?: string[];
  barInfo: string;
  email: string;
  phone: string;
  social: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
  order: number;
  isActive: boolean;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  readTime: string;
  publishedAt: string;
  updatedAt?: string;
  image: string;
  tags?: string[];
  isPublished: boolean;
  seoTitle?: string;
  seoDesc?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  badge?: string;
  date: string;
  isPublished?: boolean;
  isActive?: boolean;
  urgent?: boolean;
  isPinned?: boolean;
}

export interface GalleryItem {
  id: string;
  type?: 'photo' | 'video';
  title: string;
  description?: string;
  caption?: string;
  url?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  album?: string;
  category?: string;
  order: number;
  isActive?: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  date?: string;
  createdAt?: any;
  createdAtFormatted?: string;
  practiceArea?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  meetingType?: string;
  type?: 'contact' | 'appointment' | 'consultation';
  isRead?: boolean;
  status?: 'new' | 'unread' | 'read' | 'replied' | 'archived';
  notes?: string;
  source?: string;
  firestoreId?: string;
}

export interface CustomPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  seoTitle?: string;
  seoDesc?: string;
  isPublished: boolean;
  showInFooter?: boolean;
  showInNavbar?: boolean;
  showOnHome?: boolean;
  summary?: string;
  badge?: string;
  updatedAt?: string;
  parentMenuId?: string;
  menuPosition?: string;
}

export interface HomeSection {
  id: string;
  key: string;
  name: string;
  title: string;
  subtitle: string;
  isEnabled: boolean;
  order: number;
}

export interface SpecialDayPopup {
  isEnabled: boolean;
  isActive?: boolean;
  title: string;
  message: string;
  image?: string;
  imageUrl?: string;
  buttonText: string;
  buttonUrl: string;
  showOnlyOnHome?: boolean;
  frequency: 'always' | 'once_per_session' | 'once_per_day';
  startDate?: string;
  endDate?: string;
}

export type PopupModalConfig = SpecialDayPopup;

export interface SiteModules {
  team: boolean;
  articles: boolean;
  gallery: boolean;
  announcements: boolean;
  faq: boolean;
  whatsapp: boolean;
  socialMedia: boolean;
  contactForm: boolean;
  popup: boolean;
  quickContactBar: boolean;
  about?: boolean;
  practices?: boolean;
}

export interface ThemeColors {
  primaryBg: string;
  cardBg: string;
  cardAltBg: string;
  textMain: string;
  textMuted: string;
  accentGold: string;
  borderSubtle: string;
}

export interface ThemeTypography {
  headingFont: string;
  bodyFont: string;
  menuFontSize?: string;
  buttonFontSize?: string;
}

export interface ThemeConfig {
  primaryBg: string;
  secondaryBg: string;
  accentBg: string;
  goldAccent: string;
  headingFont: string;
  bodyFont: string;
}

export interface SeoConfig {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  googleAnalyticsId?: string;
  googleSearchConsoleVerification?: string;
}

export interface HeroStatItem {
  id: string;
  value: string;
  label: string;
  highlight?: boolean;
  isActive?: boolean;
}

export interface SiteSettings {
  siteName: string;
  slogan: string;
  heroEyebrow?: string;
  heroTitle?: string;
  heroTitleHighlight?: string;
  heroTitleSuffix?: string;
  heroDescription: string;
  heroImageUrl?: string;
  heroImageAlt?: string;
  heroPillTeamText?: string;
  heroPillTeamActive?: boolean;
  heroPillArticlesText?: string;
  heroPillArticlesActive?: boolean;
  heroPillToolsText?: string;
  heroPillToolsActive?: boolean;
  heroButtonPrimaryText?: string;
  heroButtonSecondaryText?: string;
  showHeroStats?: boolean;
  heroStats?: HeroStatItem[];
  logoText: string;
  logoSubtext: string;
  logoImageUrl?: string;
  logoAltText?: string;
  phone: string;
  phoneRaw: string;
  whatsappNumber: string;
  whatsappDefaultMessage: string;
  email: string;
  address: string;
  workingHours: string;
  mapEmbedUrl?: string;
  googleMapsDirectionsUrl?: string;
  googleMapsUrl?: string;
  footerCorporateText: string;
  copyrightText: string;
  legalDisclaimerText: string;
  socialLinks: {
    platform: string;
    url: string;
    isActive: boolean;
    order?: number;
  }[];
  modules: SiteModules;
  popup?: SpecialDayPopup;
  themeColors?: ThemeColors;
  typography?: ThemeTypography;
  seo?: {
    defaultTitle: string;
    defaultDescription: string;
    canonicalUrl?: string;
    ogImage: string;
    robots?: string;
    keywords?: string;
    googleAnalyticsId?: string;
    googleSearchConsoleVerification?: string;
  };
}

export interface AuditLog {
  id: string;
  user: string;
  role: string;
  action: string;
  target: string;
  timestamp: string;
}

export interface MediaItem {
  id: string;
  title: string;
  url: string;
  thumbnailUrl?: string;
  category: string;
  size?: string;
  uploadedAt: string;
}

