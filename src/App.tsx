import React, { useEffect } from 'react';
import { CmsProvider, useCms } from './context/CmsContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { FloatingContact } from './components/common/FloatingContact';
import { MobileNavigation } from './components/common/MobileNavigation';
import { CookieConsent } from './components/common/CookieConsent';
import { SpecialDayModal } from './components/common/SpecialDayModal';
import { SearchModal } from './components/common/SearchModal';
import { AppointmentModal } from './components/common/AppointmentModal';

// Public Homepage Sections
import { HomeTopBannerSlider } from './components/public/HomeTopBannerSlider';
import { Hero } from './components/public/Hero';
import { AboutPreview } from './components/public/AboutPreview';
import { PracticeAreasSection } from './components/public/PracticeAreasSection';
import { WhyUsSection } from './components/public/WhyUsSection';
import { TeamSection } from './components/public/TeamSection';
import { ArticlesSection } from './components/public/ArticlesSection';
import { AnnouncementsSection } from './components/public/AnnouncementsSection';
import { CustomPagesSection } from './components/public/CustomPagesSection';
import { ContactSection } from './components/public/ContactSection';

// Public Dedicated Pages
import { AboutPage } from './components/public/AboutPage';
import { PracticeDetailPage } from './components/public/PracticeDetailPage';
import { TeamDetailPage } from './components/public/TeamDetailPage';
import { ArticleDetailPage } from './components/public/ArticleDetailPage';
import { GalleryPage } from './components/public/GalleryPage';
import { CustomPageView } from './components/public/CustomPageView';
import {
  PracticesPage,
  TeamPage,
  ArticlesPage,
  FaqPage,
  ContactPage,
  AnnouncementsPage
} from './components/public/StandalonePages';

// CMS Admin Dashboard
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminErrorBoundary } from './components/admin/AdminErrorBoundary';

interface GlobalErrorBoundaryProps {
  children: React.ReactNode;
}

interface GlobalErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

class GlobalErrorBoundary extends React.Component<GlobalErrorBoundaryProps, GlobalErrorBoundaryState> {
  constructor(props: GlobalErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: unknown): GlobalErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error instanceof Error ? error.message : String(error)
    };
  }

  componentDidCatch(error: unknown, errorInfo: React.ErrorInfo) {
    console.error('[Global App Hatası]:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B132B] text-slate-100 flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full p-6 rounded-2xl bg-[#1C2E4A] border border-white/10 shadow-2xl space-y-4">
            <h2 className="text-xl font-bold text-[#C5A880]">KIR Hukuk & Danışmanlık</h2>
            <p className="text-sm text-slate-300">
              Sayfa yüklenirken geçici bir bağlantı sorunu oluştu. Lütfen sayfayı yenileyiniz.
            </p>
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="w-full py-3 px-4 rounded-xl bg-[#C5A880] text-[#0B132B] font-bold text-sm shadow-md hover:bg-[#d4b992] transition-colors cursor-pointer"
            >
              Sayfayı Yenile
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const AppContent: React.FC = () => {
  const { activeView, activeSlug, navigate } = useCms();

  // Scroll to top when route/view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeView, activeSlug]);

  // If viewing admin panel, show admin layout without public header/footer
  if (
    activeView === 'admin' ||
    activeView === 'kontrol-paneli' ||
    activeView === 'yonetim-paneli' ||
    activeView === 'panel' ||
    activeView === 'dashboard'
  ) {
    return (
      <AdminErrorBoundary onResetToHome={() => navigate('home')}>
        <AdminDashboard />
      </AdminErrorBoundary>
    );
  }

  // Render public views
  const renderPublicView = () => {
    switch (activeView) {
      case 'home':
        return (
          <>
            <Hero />
            <PracticeAreasSection />
            <AboutPreview />
            <TeamSection />
            <ArticlesSection />
            <WhyUsSection />
            <ContactSection />
            <AnnouncementsSection />
          </>
        );
      case 'about':
        return <AboutPage />;
      case 'practices':
      case 'practice-areas':
        return <PracticesPage />;
      case 'practice-detail':
        return <PracticeDetailPage slug={activeSlug || ''} />;
      case 'team':
        return <TeamPage />;
      case 'team-detail':
        return <TeamDetailPage id={activeSlug || ''} />;
      case 'articles':
        return <ArticlesPage />;
      case 'article-detail':
        return <ArticleDetailPage slug={activeSlug || ''} />;
      case 'announcements':
        return <AnnouncementsPage />;
      case 'gallery':
        return <GalleryPage />;
      case 'contact':
        return <ContactPage />;
      case 'faq':
      case 'sss':
        return <FaqPage />;
      case 'page':
      case 'custom-page':
        return <CustomPageView slug={activeSlug || ''} />;
      default:
        return (
          <>
            <Hero />
            <PracticeAreasSection />
            <AboutPreview />
            <TeamSection />
            <ArticlesSection />
            <WhyUsSection />
            <ContactSection />
            <AnnouncementsSection />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans selection:bg-[#B94A26]/20 selection:text-[#B94A26]">
      {/* Public Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 pb-20 lg:pb-0 bg-white">{renderPublicView()}</main>

      {/* Public Footer */}
      <Footer />

      {/* Mobile Bottom Navigation & Drawer Menu */}
      <MobileNavigation />

      {/* Floating Speed Dials, Cookie and Modals */}
      <FloatingContact />
      <CookieConsent />
      <SpecialDayModal />
      <SearchModal />
      <AppointmentModal />
    </div>
  );
};

export default function App() {
  return (
    <GlobalErrorBoundary>
      <CmsProvider>
        <AppContent />
      </CmsProvider>
    </GlobalErrorBoundary>
  );
}
