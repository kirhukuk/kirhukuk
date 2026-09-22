import React, { useState, useEffect, useRef } from 'react';
import { useCms } from '../../context/CmsContext';
import {
  Home,
  Phone,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

export const MobileNavigation: React.FC = () => {
  const {
    settings,
    activeView,
    navigate,
    openAppointmentModal
  } = useCms();

  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      );

      // 1. Sayfa en sona geldiğinde çıksın
      const isAtBottom = windowHeight + currentScrollY >= documentHeight - 60;
      if (isAtBottom) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      // 2. Sayfanın en başındayken çıksın
      if (currentScrollY <= 40) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      const diff = currentScrollY - lastScrollY.current;

      // 3. Aşağı kaydırırken kaybolsun (durunca çıkmaz)
      if (diff > 6) {
        setIsVisible(false);
      } else if (diff < -6) {
        // 4. Yukarı kaydırırken çıksın
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Yönetim / Admin panelinde alt barı gizle
  if (
    activeView === 'admin' ||
    activeView === 'kontrol-paneli' ||
    activeView === 'yonetim-paneli' ||
    activeView === 'panel' ||
    activeView === 'dashboard'
  ) {
    return null;
  }

  const cleanWaNumber = (settings.whatsappNumber || '').replace(/[^0-9]/g, '');

  return (
    <nav
      id="mobile-bottom-nav"
      className={`lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0B152B]/98 backdrop-blur-2xl rounded-t-[26px] border-t border-white/15 shadow-[0_-10px_35px_rgba(0,0,0,0.65)] px-2.5 pt-1.5 transition-all duration-300 ease-in-out select-none ${
        !isVisible
          ? 'translate-y-full shadow-none pointer-events-none'
          : 'translate-y-0'
      }`}
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 6px)' }}
      aria-label="Mobil Hızlı Eylem Çubuğu"
    >
      <div className="max-w-md mx-auto grid grid-cols-4 items-center gap-1.5">
        {/* 1. Ana Sayfa */}
        <button
          id="mobile-nav-home-btn"
          onClick={() => {
            navigate('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer ${
            activeView === 'home'
              ? 'bg-[#18284F] border border-blue-400/30 text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <Home className={`w-5 h-5 ${activeView === 'home' ? 'text-blue-400' : 'text-slate-400'}`} />
          <span className={`text-[10.5px] font-semibold tracking-tight mt-0.5 ${activeView === 'home' ? 'text-white' : 'text-slate-400'}`}>
            Ana Sayfa
          </span>
        </button>

        {/* 2. İletişim */}
        <button
          id="mobile-nav-contact-btn"
          onClick={() => {
            navigate('contact');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer ${
            activeView === 'contact'
              ? 'bg-[#18284F] border border-blue-400/30 text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
          title="İletişim"
        >
          <MessageSquare className={`w-5 h-5 ${activeView === 'contact' ? 'text-blue-400' : 'text-slate-400'}`} />
          <span className={`text-[10.5px] font-semibold tracking-tight mt-0.5 ${activeView === 'contact' ? 'text-white' : 'text-slate-400'}`}>
            İletişim
          </span>
        </button>

        {/* 3. Hemen Ara */}
        <a
          id="mobile-nav-phone-btn"
          href={`tel:${settings.phoneRaw || settings.phone}`}
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all cursor-pointer"
          title={`Hemen Ara: ${settings.phone}`}
        >
          <Phone className="w-5 h-5 text-[#C5A880]" />
          <span className="text-[10.5px] font-medium text-[#C5A880] tracking-tight mt-0.5">
            Hemen Ara
          </span>
        </a>

        {/* 4. WhatsApp veya Hızlı Randevu */}
        {settings.modules.whatsapp && cleanWaNumber ? (
          <a
            id="mobile-nav-whatsapp-btn"
            href={`https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(
              settings.whatsappDefaultMessage || 'Merhaba, hukuki danışmanlık almak istiyorum.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-slate-400 hover:text-emerald-300 hover:bg-white/5 transition-all cursor-pointer"
            title="WhatsApp ile İletişim"
          >
            <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
            <span className="text-[10.5px] font-medium text-emerald-400 tracking-tight mt-0.5">
              WhatsApp
            </span>
          </a>
        ) : (
          <button
            id="mobile-nav-appointment-btn"
            onClick={() => openAppointmentModal()}
            className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all cursor-pointer"
          >
            <Calendar className="w-5 h-5 text-[#C5A880]" />
            <span className="text-[10.5px] font-medium text-slate-300 tracking-tight mt-0.5">
              Randevu
            </span>
          </button>
        )}
      </div>
    </nav>
  );
};
