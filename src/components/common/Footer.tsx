import React from 'react';
import { useCms } from '../../context/CmsContext';
import {
  Scale,
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Shield,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Youtube
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

export const Footer: React.FC = () => {
  const { settings, practiceAreas, customPages, navigate, navigateToAdmin } = useCms();

  const activePractices = practiceAreas.filter(p => p.isActive).slice(0, 6);
  const footerCustomPages = customPages.filter(p => p.isPublished && p.showInFooter !== false);

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin':
        return <Linkedin className="w-4 h-4" />;
      case 'x':
      case 'twitter':
        return <Twitter className="w-4 h-4" />;
      case 'instagram':
        return <Instagram className="w-4 h-4" />;
      case 'facebook':
        return <Facebook className="w-4 h-4" />;
      case 'youtube':
        return <Youtube className="w-4 h-4" />;
      default:
        return <Scale className="w-4 h-4" />;
    }
  };

  return (
    <footer id="site-footer" className="bg-[#080E1F] border-t border-white/10 pt-16 pb-12 text-slate-300 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Column 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {settings.logoImageUrl ? (
                <img
                  src={settings.logoImageUrl}
                  alt={settings.logoAltText || `${settings.logoText} - ${settings.logoSubtext}`}
                  className="h-10 w-auto max-w-[150px] object-contain"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-[#1C2E4A] border border-[#C5A880]/50 flex items-center justify-center shrink-0">
                  <Scale className="w-5 h-5 text-[#C5A880]" />
                </div>
              )}
              <div className="flex flex-col justify-center">
                <span className="block text-xl font-bold font-serif-heading text-white tracking-wider leading-tight">
                  {settings.logoText}
                </span>
                {settings.logoSubtext && (
                  <span className="block text-[10px] text-[#C5A880] tracking-wider uppercase font-semibold mt-0.5">
                    {settings.logoSubtext}
                  </span>
                )}
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {settings.footerCorporateText}
            </p>
            {/* Social Links */}
            {settings.modules.socialMedia && (
              <div className="flex items-center gap-2 pt-2">
                {settings.socialLinks
                  .filter(s => s.isActive)
                  .map((s, idx) => (
                    <a
                      key={idx}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#C5A880] hover:text-[#0B132B] border border-white/10 flex items-center justify-center transition-all"
                      aria-label={s.platform}
                      title={s.platform}
                    >
                      {getSocialIcon(s.platform)}
                    </a>
                  ))}
              </div>
            )}
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C5A880]"></span>
              Hızlı Menü
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => navigate('home')}
                  className="hover:text-[#C5A880] transition-colors"
                >
                  Ana Sayfa
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('about')}
                  className="hover:text-[#C5A880] transition-colors"
                >
                  Hakkımızda
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('team')}
                  className="hover:text-[#C5A880] transition-colors"
                >
                  Ekibimiz
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('practice-areas')}
                  className="hover:text-[#C5A880] transition-colors"
                >
                  Çalışma Alanlarımız
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('articles')}
                  className="hover:text-[#C5A880] transition-colors"
                >
                  Makaleler
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('faq')}
                  className="hover:text-[#C5A880] transition-colors"
                >
                  Sık Sorulan Sorular
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('contact')}
                  className="hover:text-[#C5A880] transition-colors"
                >
                  İletişim
                </button>
              </li>

              {/* Bilgilendirme ve Özel Sayfalarımız */}
              {footerCustomPages.length > 0 && (
                <li className="pt-3 border-t border-white/10 mt-2 space-y-2">
                  <span className="text-[11px] font-semibold tracking-wider text-[#C5A880] uppercase block">
                    Bilgilendirme & Özel Sayfalar
                  </span>
                  <div className="space-y-2 pl-0.5">
                    {footerCustomPages.map(page => (
                      <button
                        key={page.id}
                        id={`footer-menu-page-${page.slug}`}
                        onClick={() => navigate('page', page.slug)}
                        className="block w-full text-left text-sm text-slate-300 hover:text-[#C5A880] transition-colors cursor-pointer"
                      >
                        {page.title}
                      </button>
                    ))}
                  </div>
                </li>
              )}
            </ul>
          </div>

          {/* Column 3: Practice Areas */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C5A880]"></span>
              Çalışma Alanları
            </h4>
            <ul className="space-y-2.5 text-sm">
              {activePractices.map(practice => (
                <li key={practice.id}>
                  <button
                    onClick={() => navigate('practice-detail', practice.slug)}
                    className="hover:text-[#C5A880] transition-colors text-left"
                  >
                    {practice.title}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => navigate('practice-areas')}
                  className="text-xs text-[#C5A880] hover:underline font-medium pt-1"
                >
                  Tüm Alanları İncele →
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact info */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C5A880]"></span>
              İletişim & Konum
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C5A880] shrink-0 mt-1" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#C5A880] shrink-0" />
                <a href={`tel:${settings.phoneRaw}`} className="hover:text-[#C5A880]">
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <WhatsAppIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#C5A880]"
                >
                  {settings.whatsappNumber} (WhatsApp)
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#C5A880] shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-[#C5A880]">
                  {settings.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-xs text-slate-300">
                <Clock className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <span>{settings.workingHours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="py-6 border-b border-white/5 text-xs text-slate-300 leading-relaxed text-center max-w-4xl mx-auto">
          <p>{settings.legalDisclaimerText}</p>
        </div>

        {/* Subfooter */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300">
          <p>{settings.copyrightText}</p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {footerCustomPages.map((page, idx) => (
              <React.Fragment key={page.id}>
                {idx > 0 && <span className="text-slate-600">•</span>}
                <button
                  id={`footer-page-btn-${page.slug}`}
                  onClick={() => navigate('page', page.slug)}
                  className="hover:text-[#C5A880] transition-colors"
                >
                  {page.title}
                </button>
              </React.Fragment>
            ))}
            {footerCustomPages.length > 0 && <span className="text-slate-600">•</span>}
            <button
              id="footer-admin-btn"
              onClick={() => navigateToAdmin('dashboard')}
              className="text-[#C5A880] hover:text-white flex items-center gap-1.5 font-sans transition-colors cursor-pointer"
              title="KIR HUKUK Kontrol Paneli"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Kontrol Paneli</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
