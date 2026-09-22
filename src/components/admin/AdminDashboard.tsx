import React from 'react';
import { useCms } from '../../context/CmsContext';
import { AdminLayout } from './AdminLayout';
import { DashboardOverview } from './DashboardOverview';
import { GeneralSettingsTab } from './GeneralSettingsTab';
import { MenuManagerTab } from './MenuManagerTab';
import { PracticeManagerTab } from './PracticeManagerTab';
import { TeamManagerTab } from './TeamManagerTab';
import { ArticleManagerTab } from './ArticleManagerTab';
import { FaqManagerTab } from './FaqManagerTab';
import { AnnouncementManagerTab } from './AnnouncementManagerTab';
import { GalleryManagerTab } from './GalleryManagerTab';
import { MediaLibraryTab } from './MediaLibraryTab';
import { MessagesTab } from './MessagesTab';
import { ThemeSettingsTab } from './ThemeSettingsTab';
import { PopupManagerTab } from './PopupManagerTab';
import { PagesManagerTab } from './PagesManagerTab';
import { SeoSettingsTab } from './SeoSettingsTab';
import { BackupTab } from './BackupTab';

export const AdminDashboard: React.FC = () => {
  const { adminTab } = useCms();

  const renderActiveTab = () => {
    switch (adminTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'settings':
        return <GeneralSettingsTab />;
      case 'menus':
        return <MenuManagerTab />;
      case 'pages':
        return <PagesManagerTab />;
      case 'practices':
        return <PracticeManagerTab />;
      case 'team':
        return <TeamManagerTab />;
      case 'articles':
        return <ArticleManagerTab />;
      case 'faq':
        return <FaqManagerTab />;
      case 'announcements':
        return <AnnouncementManagerTab />;
      case 'gallery':
        return <GalleryManagerTab />;
      case 'media':
        return <MediaLibraryTab />;
      case 'messages':
        return <MessagesTab />;
      case 'theme':
        return <ThemeSettingsTab />;
      case 'popup':
        return <PopupManagerTab />;
      case 'seo':
        return <SeoSettingsTab />;
      case 'backup':
        return <BackupTab />;
      default:
        return <DashboardOverview />;
    }
  };

  return <AdminLayout>{renderActiveTab()}</AdminLayout>;
};
