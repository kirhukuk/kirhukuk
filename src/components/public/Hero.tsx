import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import {
  Users,
  FileText,
  Wrench,
  User,
  Phone,
  ArrowRight,
  Search,
  MessageCircle,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { LegalToolsModal } from '../common/LegalToolsModal';

export const Hero: React.FC = () => {
  const { settings, navigate, openAppointmentModal, setIsSearchOpen, addContactMessage } = useCms();

  const [consultName, setConsultName] = useState('');
  const [consultPhone, setConsultPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consultSuccess, setConsultSuccess] = useState(false);
  const [isLegalToolsOpen, setIsLegalToolsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const heroEyebrow = settings.heroEyebrow !== undefined ? settings.heroEyebrow : 'KIR HUKUK OFİSİ';
  const heroTitle = settings.heroTitle !== undefined ? settings.heroTitle : 'Hukuki Süreçlerinizde';
  const heroHighlight = settings.heroTitleHighlight !== undefined ? settings.heroTitleHighlight : 'Güvenilir';
  const heroSuffix = settings.heroTitleSuffix !== undefined ? settings.heroTitleSuffix : 'Çözüm Ortağınız';
  const heroDesc = settings.heroDescription || 'Bursa, İstanbul ve Türkiye geneli avukat desteği için KIR Hukuk Ofisi yanınızda. Boşanma, ceza, iş, şirketler ve gayrimenkul davalarında hızlı, güvenilir ve sonuç odaklı çözümler.';
  const heroImage = settings.heroImageUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85';
  const heroImageAlt = settings.heroImageAlt || 'KIR Hukuk Bürosu Modern Genel Merkez & Hukuk Kulesi';
  const pillTeamText = settings.heroPillTeamText || 'Ekibimiz';
  const pillTeamActive = settings.heroPillTeamActive !== false;
  const pillArticlesText = settings.heroPillArticlesText || 'Makaleler';
  const pillArticlesActive = settings.heroPillArticlesActive !== false;
  const pillToolsText = settings.heroPillToolsText || 'Araçlar';
  const pillToolsActive = settings.heroPillToolsActive !== false;

  const cleanWaNumber = (settings.whatsappNumber || settings.phoneRaw || '').replace(/\D/g, '');

  const handleQuickConsult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultName.trim() || !consultPhone.trim()) return;

    setIsSubmitting(true);
    try {
      await addContactMessage({
        name: consultName.trim(),
        phone: consultPhone.trim(),
        email: 'hizli-danisma@kirhukuk.av.tr',
        subject: 'Anasayfa Hızlı Hukuki Danışma Talebi',
        message: `Anasayfa hızlı formundan randevu talebi. İsim: ${consultName.trim()}, Telefon: ${consultPhone.trim()}`,
        status: 'unread',
        createdAt: new Date().toISOString()
      });
      setConsultSuccess(true);
      setConsultName('');
      setConsultPhone('');
      setTimeout(() => setConsultSuccess(false), 5000);
    } catch (err) {
      console.error('Hızlı danışma hatası:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchOpen(true);
  };

  return (
    <>
      <section
        id="hero-section"
        className="relative w-full bg-white overflow-hidden border-b border-slate-200 pt-20 sm:pt-24 lg:pt-32"
      >
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch">
          {/* Left Column: Content & Quick Actions */}
          <div className="w-full lg:w-[57%] xl:w-[55%] px-5 sm:px-8 md:px-12 lg:px-14 py-6 sm:py-8 lg:py-9 flex flex-col justify-center space-y-5 z-10">
            <div>
              {/* Eyebrow */}
              {heroEyebrow && (
                <div className="flex items-center gap-2 text-[#B94A26] font-semibold text-xs sm:text-sm tracking-wider uppercase">
                  <span className="w-5 sm:w-6 h-[2.5px] bg-[#B94A26] inline-block rounded-full"></span>
                  <span>{heroEyebrow}</span>
                </div>
              )}

              {/* Main Headline */}
              <h1 className="text-[28px] sm:text-[34px] md:text-[40px] lg:text-[44px] font-bold font-serif-heading text-slate-900 tracking-tight leading-[1.18] mt-2 sm:mt-2.5">
                {heroTitle}
                {heroHighlight && (
                  <>
                    {' '}
                    <span className="text-[#B94A26]">{heroHighlight}</span>
                  </>
                )}
                {heroSuffix && (
                  <>
                    {' '}
                    <br className="hidden sm:inline" />
                    {heroSuffix}
                  </>
                )}
              </h1>

              {/* Subtitle / Description */}
              {heroDesc && (
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mt-2.5 max-w-xl">
                  {heroDesc}
                </p>
              )}

              {/* Quick Navigation Pills */}
              {(pillTeamActive || pillArticlesActive || pillToolsActive) && (
                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mt-3.5">
                  {pillTeamActive && (
                    <button
                      id="hero-pill-team"
                      type="button"
                      onClick={() => navigate('team')}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 hover:border-[#B94A26] hover:text-[#B94A26] text-xs font-semibold text-slate-700 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5 text-[#B94A26]" />
                      <span>{pillTeamText}</span>
                    </button>
                  )}

                  {pillArticlesActive && (
                    <button
                      id="hero-pill-articles"
                      type="button"
                      onClick={() => navigate('articles')}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 hover:border-[#B94A26] hover:text-[#B94A26] text-xs font-semibold text-slate-700 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#B94A26]" />
                      <span>{pillArticlesText}</span>
                    </button>
                  )}

                  {pillToolsActive && (
                    <button
                      id="hero-pill-tools"
                      type="button"
                      onClick={() => setIsLegalToolsOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 hover:border-[#B94A26] hover:text-[#B94A26] text-xs font-semibold text-slate-700 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                    >
                      <Wrench className="w-3.5 h-3.5 text-[#B94A26]" />
                      <span>{pillToolsText}</span>
                    </button>
                  )}
                </div>
              )}

              {/* HIZLI HUKUKİ DANIŞMA Form Box */}
              <div className="mt-4 pt-4 border-t border-slate-200/90">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">
                    HIZLI HUKUKİ DANIŞMA
                  </p>
                  {consultSuccess && (
                    <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-medium animate-in fade-in">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Talebiniz alındı, en kısa sürede aranacaksınız!
                    </span>
                  )}
                </div>

                <form onSubmit={handleQuickConsult} className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2.5">
                  <div className="flex-1 space-y-1">
                    <label className="block text-[11px] font-medium text-slate-600">
                      Adınız Soyadınız
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={consultName}
                        onChange={e => setConsultName(e.target.value)}
                        placeholder="Örn. Ahmet Yılmaz"
                        className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#B94A26] shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="flex-1 space-y-1">
                    <label className="block text-[11px] font-medium text-slate-600">
                      Telefon Numaranız
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={consultPhone}
                        onChange={e => setConsultPhone(e.target.value)}
                        placeholder="05XX XXX XX XX"
                        className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#B94A26] shadow-2xs"
                      />
                    </div>
                  </div>

                  <button
                    id="hero-quick-consult-submit"
                    type="submit"
                    disabled={isSubmitting}
                    className="h-[38px] px-5 rounded-lg bg-[#B94A26] hover:bg-[#A33D1C] text-white text-xs font-bold tracking-wide flex items-center justify-center gap-1.5 shadow-sm transition-all whitespace-nowrap cursor-pointer disabled:opacity-70"
                  >
                    <span>{isSubmitting ? 'Gönderiliyor...' : 'Randevu Al'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>

            {/* Bottom Floating Action Strip: Search Input & Direct Contact Buttons */}
            <div className="pt-3 border-t border-slate-200/90 flex flex-wrap items-center gap-2.5 justify-between">
              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-[160px] max-w-xs">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Ara..."
                  className="w-full pl-3 pr-8 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#B94A26] shadow-2xs"
                />
                <button
                  type="submit"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#B94A26] transition-colors"
                  title="Sitede Ara"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Direct Quick Action Buttons */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* WhatsApp Button */}
                <a
                  id="hero-quick-whatsapp"
                  href={`https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(
                    settings.whatsappDefaultMessage
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold shadow-xs transition-all"
                  title="WhatsApp ile İletişime Geçin"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>

                {/* Online Randevu Button */}
                <button
                  id="hero-quick-appointment"
                  type="button"
                  onClick={() => openAppointmentModal()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#B94A26] hover:bg-[#A33D1C] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                  title="Hukuki Randevu Alın"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Randevu</span>
                </button>

                {/* Call Button */}
                <a
                  id="hero-quick-call"
                  href={`tel:${settings.phoneRaw}`}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold shadow-xs transition-all"
                  title={`Hemen Arayın: ${settings.phone}`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Ara</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Prestigious Modern Architectural Tower Skyscraper with Terracotta Diagonal Sorter */}
          <div className="hidden lg:block lg:w-[43%] xl:w-[45%] relative overflow-hidden">
            {/* Architectural Skyscraper Image */}
            <img
              src={heroImage}
              alt={heroImageAlt}
              className="w-full h-full object-cover object-center filter brightness-[0.98]"
              referrerPolicy="no-referrer"
            />

            {/* Subtle Gradient overlay for crystal-clear depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent pointer-events-none"></div>

            {/* Slanted Terracotta Divider matching the photo */}
            <div
              className="absolute left-0 top-0 bottom-0 w-16 -ml-8 bg-white transform -skew-x-[6deg] origin-top-left z-10 border-r-[3.5px] border-[#B94A26] shadow-sm pointer-events-none"
            ></div>
          </div>
        </div>
      </section>

      {/* Interactive Calculation Tools Modal */}
      <LegalToolsModal
        isOpen={isLegalToolsOpen}
        onClose={() => setIsLegalToolsOpen(false)}
      />
    </>
  );
};
