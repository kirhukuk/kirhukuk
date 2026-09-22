import React, { useState, useEffect } from 'react';
import { useCms } from '../../context/CmsContext';
import { Cookie, ShieldCheck, X } from 'lucide-react';

export const CookieConsent: React.FC = () => {
  const { navigate } = useCms();
  const [isOpen, setIsOpen] = useState(false);
  const [preferencesModal, setPreferencesModal] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem('kir_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsOpen(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('kir_cookie_consent', JSON.stringify({ necessary: true, analytics: true }));
    setIsOpen(false);
    setPreferencesModal(false);
  };

  const handleReject = () => {
    localStorage.setItem('kir_cookie_consent', JSON.stringify({ necessary: true, analytics: false }));
    setIsOpen(false);
    setPreferencesModal(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('kir_cookie_consent', JSON.stringify({ necessary: true, analytics: analyticsEnabled }));
    setIsOpen(false);
    setPreferencesModal(false);
  };

  if (!isOpen && !preferencesModal) return null;

  return (
    <>
      {/* Bottom Floating Banner */}
      {isOpen && !preferencesModal && (
        <div
          id="cookie-consent-bar"
          className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-xl z-50 bg-[#1C2E4A]/98 backdrop-blur-md border border-[#C5A880]/30 rounded-xl p-5 shadow-2xl text-slate-200 animate-in slide-in-from-bottom duration-300"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-[#C5A880]/20 border border-[#C5A880]/40 flex items-center justify-center shrink-0 mt-0.5">
              <Cookie className="w-5 h-5 text-[#C5A880]" />
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-white font-serif-heading">
                Çerez ve Gizlilik Bildirimi
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Sitemizde deneyiminizi geliştirmek, site trafiğini analiz etmek ve temel fonksiyonları sağlamak amacıyla 6698 sayılı KVKK kapsamında çerezler kullanılmaktadır. Ayrıntılar için{' '}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate('custom-page', 'cerez-politikasi');
                  }}
                  className="text-[#C5A880] underline hover:text-white"
                >
                  Çerez Politikamızı
                </button>{' '}
                inceleyebilirsiniz.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  id="cookie-accept-all-btn"
                  onClick={handleAcceptAll}
                  className="px-4 py-2 rounded-lg gold-btn text-xs font-semibold"
                >
                  Kabul Et
                </button>
                <button
                  id="cookie-reject-btn"
                  onClick={handleReject}
                  className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-medium"
                >
                  Reddet
                </button>
                <button
                  id="cookie-manage-btn"
                  onClick={() => setPreferencesModal(true)}
                  className="px-3 py-2 rounded-lg text-xs text-[#C5A880] hover:text-[#D8BD97] underline font-medium"
                >
                  Tercihleri Yönet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      {preferencesModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1C2E4A] border border-[#C5A880]/40 rounded-xl max-w-lg w-full p-6 shadow-2xl relative text-slate-200 animate-in fade-in zoom-in-95">
            <button
              onClick={() => setPreferencesModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="w-6 h-6 text-[#C5A880]" />
              <h3 className="text-lg font-bold text-white font-serif-heading">
                Çerez Tercihleri Yönetimi
              </h3>
            </div>

            <p className="text-xs text-slate-300 mb-6 leading-relaxed">
              Ziyaretçilerimizin gizliliğine saygı duyuyoruz. Aşağıdaki kategorilerden tercihlerinizi belirleyebilirsiniz.
            </p>

            <div className="space-y-4 mb-6">
              <div className="p-3.5 rounded-lg bg-[#0B132B]/60 border border-white/5 flex items-center justify-between">
                <div>
                  <h5 className="text-sm font-medium text-white">Zorunlu Çerezler</h5>
                  <p className="text-xs text-slate-400">Sitenin güvenli çalışması için vazgeçilmezdir.</p>
                </div>
                <span className="text-xs text-[#C5A880] font-semibold uppercase px-2 py-1 bg-white/5 rounded">
                  Her Zaman Aktif
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-[#0B132B]/60 border border-white/5 flex items-center justify-between">
                <div>
                  <h5 className="text-sm font-medium text-white">Performans & Analitik Çerezleri</h5>
                  <p className="text-xs text-slate-400">Sayfa ziyaretlerini anonim olarak ölçümlememize yarar.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={analyticsEnabled}
                    onChange={e => setAnalyticsEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C5A880]"></div>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                onClick={handleSavePreferences}
                className="px-4 py-2 rounded-lg gold-btn text-xs font-semibold"
              >
                Tercihleri Kaydet
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium"
              >
                Tümünü Kabul Et
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
