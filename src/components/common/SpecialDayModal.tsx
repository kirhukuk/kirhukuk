import React, { useState, useEffect } from 'react';
import { useCms } from '../../context/CmsContext';
import { X, Sparkles, ArrowRight } from 'lucide-react';

export const SpecialDayModal: React.FC = () => {
  const { settings, activeView, navigate } = useCms();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!settings.popup || !settings.popup.isEnabled) return;

    if (settings.popup.showOnlyOnHome && activeView !== 'home') {
      setIsVisible(false);
      return;
    }

    const storageKey = 'kir_popup_dismissed_v1';
    if (settings.popup.frequency === 'once_per_session') {
      const dismissed = sessionStorage.getItem(storageKey);
      if (dismissed) return;
    } else if (settings.popup.frequency === 'once_per_day') {
      const dismissedDate = localStorage.getItem(storageKey);
      const today = new Date().toDateString();
      if (dismissedDate === today) return;
    }

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, [settings.popup, activeView]);

  const handleClose = () => {
    setIsVisible(false);
    const storageKey = 'kir_popup_dismissed_v1';
    if (settings.popup.frequency === 'once_per_session') {
      sessionStorage.setItem(storageKey, 'true');
    } else if (settings.popup.frequency === 'once_per_day') {
      localStorage.setItem(storageKey, new Date().toDateString());
    }
  };

  const handleAction = () => {
    handleClose();
    if (settings.popup.buttonUrl) {
      if (settings.popup.buttonUrl.startsWith('http')) {
        window.open(settings.popup.buttonUrl, '_blank');
      } else if (settings.popup.buttonUrl === '/iletisim') {
        navigate('contact');
      } else {
        navigate('home');
      }
    }
  };

  if (!isVisible || !settings.popup.isEnabled) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#1C2E4A] border border-[#C5A880]/50 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative text-slate-100 animate-in zoom-in-95 duration-200">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/40 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          aria-label="Kapat"
        >
          <X className="w-4 h-4" />
        </button>

        {settings.popup.imageUrl && (
          <div className="h-44 w-full relative overflow-hidden">
            <img
              src={settings.popup.imageUrl}
              alt={settings.popup.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C2E4A] via-transparent to-transparent"></div>
          </div>
        )}

        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C5A880]">
            <Sparkles className="w-4 h-4" />
            <span>KIR HUKUK Duyurusu</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-white font-serif-heading">
            {settings.popup.title}
          </h3>

          <p className="text-sm text-slate-300 leading-relaxed">
            {settings.popup.message}
          </p>

          <div className="pt-4 flex items-center gap-3">
            <button
              id="popup-action-btn"
              onClick={handleAction}
              className="flex-1 py-3 px-5 rounded-lg gold-btn text-sm font-semibold flex items-center justify-center gap-2 shadow-lg"
            >
              <span>{settings.popup.buttonText || 'Devamını Gör'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleClose}
              className="py-3 px-5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-sm font-medium"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
