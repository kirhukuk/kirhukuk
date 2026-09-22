import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { Phone, X, Send, MessageCircle } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

export const FloatingContact: React.FC = () => {
  const { settings, activeView } = useCms();
  const [isOpen, setIsOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const [senderName, setSenderName] = useState('');

  // Hide in admin view
  if (activeView === 'admin' || !settings.modules.quickContactBar) {
    return null;
  }

  const cleanWaNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');

  const quickTemplates = [
    'Hukuki danışmanlık ve dava süreci hakkında bilgi almak istiyorum.',
    'Av. Abidin KIR ile yüz yüze randevu talep ediyorum.',
    'Ceza hukuku dosyam için acil hukuki desteğe ihtiyacım var.',
    'İşçi alacağı ve kıdem tazminatı hesaplaması danışmak istiyorum.'
  ];

  const handleSendWhatsApp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    let textToSend = customMessage.trim() || settings.whatsappDefaultMessage || 'Merhaba Av. Abidin KIR, hukuki danışmanlık almak istiyorum.';
    if (senderName.trim()) {
      textToSend = `Adım: ${senderName.trim()}\n\n${textToSend}`;
    }
    const url = `https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(textToSend)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
    setCustomMessage('');
  };

  return (
    <div
      id="floating-contact-container"
      className="hidden lg:flex fixed bottom-6 right-6 z-40 flex-col items-end gap-3 pointer-events-auto select-none"
    >
      {/* WhatsApp Mesaj Yazma Penceresi / Popover */}
      {isOpen && settings.modules.whatsapp && (
        <div
          id="whatsapp-chat-box"
          className="w-[330px] sm:w-[360px] bg-[#0B132B] border border-[#25D366]/40 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 text-white"
        >
          {/* Header */}
          <div className="bg-[#128C7E] px-4 py-3.5 flex items-center justify-between text-white shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/15 border border-white/30 flex items-center justify-center text-white shrink-0">
                <WhatsAppIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-bold tracking-wide">
                  KIR HUKUK • WhatsApp
                </h4>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-100">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
                  <span>Çevrimiçi | Hukuki Danışma Hattı</span>
                </div>
              </div>
            </div>
            <button
              id="whatsapp-box-close-btn"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-black/20 text-white/90 hover:text-white transition-colors"
              aria-label="Kapat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3.5 bg-[#0F1B38] text-xs">
            <div className="bg-[#1C2E4A]/90 p-3 rounded-xl border border-white/10 text-slate-200 leading-relaxed shadow-sm">
              <p className="font-semibold text-[#C5A880] mb-1">
                Sayın Ziyaretçimiz,
              </p>
              <p>
                Mesajınızı aşağıya yazarak tek tıkla doğrudan büromuzun WhatsApp hattına iletebilir ve yetkili avukatımızla hemen görüşebilirsiniz.
              </p>
            </div>

            {/* Quick Templates */}
            <div>
              <span className="text-[11px] text-slate-400 font-medium block mb-1.5">
                Hızlı Mesaj Şablonları:
              </span>
              <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                {quickTemplates.map((tpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCustomMessage(tpl)}
                    className="w-full text-left p-2 rounded-lg bg-white/5 hover:bg-[#25D366]/15 hover:border-[#25D366]/40 border border-white/5 text-[11px] text-slate-300 hover:text-white transition-all line-clamp-1"
                  >
                    💬 {tpl}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendWhatsApp} className="space-y-2.5 pt-1">
              <input
                id="wa-sender-name-input"
                type="text"
                value={senderName}
                onChange={e => setSenderName(e.target.value)}
                placeholder="Adınız Soyadınız (opsiyonel)"
                className="w-full px-3 py-2 bg-[#080E1F] border border-white/15 rounded-lg text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#25D366]"
              />

              <div className="relative">
                <textarea
                  id="wa-message-textarea"
                  rows={3}
                  value={customMessage}
                  onChange={e => setCustomMessage(e.target.value)}
                  placeholder="Mesajınızı veya danışmak istediğiniz konuyu yazınız..."
                  className="w-full px-3 py-2 bg-[#080E1F] border border-white/15 rounded-lg text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#25D366] resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  id="wa-send-submit-btn"
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-[#080E1F] font-bold text-xs flex items-center justify-center gap-2 shadow-lg hover:shadow-[#25D366]/25 transition-all"
                >
                  <WhatsAppIcon className="w-4 h-4 text-[#080E1F]" />
                  <span>WhatsApp ile Gönder</span>
                  <Send className="w-3.5 h-3.5" />
                </button>

                <a
                  id="wa-direct-open-link"
                  href={`https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(settings.whatsappDefaultMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white"
                  title="Doğrudan WhatsApp'ta Aç"
                >
                  <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                </a>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Telephone Call Button */}
        <a
          id="floating-call-btn"
          href={`tel:${settings.phoneRaw}`}
          className="w-12 h-12 rounded-full bg-[#1C2E4A] hover:bg-[#253A5E] border border-white/20 text-white flex items-center justify-center shadow-xl hover:scale-105 transition-all group"
          title={`Hemen Ara: ${settings.phone}`}
          aria-label="Hemen Ara"
        >
          <Phone className="w-5 h-5 text-[#C5A880] group-hover:rotate-12 transition-transform" />
        </a>

        {/* WhatsApp Icon / Action Trigger */}
        {settings.modules.whatsapp && (
          <div className="relative flex items-center">
            {/* Quick label pill */}
            {!isOpen && (
              <button
                id="floating-whatsapp-pill-btn"
                onClick={() => setIsOpen(true)}
                className="hidden sm:flex items-center gap-2 mr-3 px-3.5 py-2 rounded-full bg-[#0B132B]/95 hover:bg-[#1C2E4A] border border-[#25D366]/40 text-xs font-semibold text-white shadow-xl hover:border-[#25D366] transition-all group"
              >
                <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
                <span>WhatsApp'la Mesaj Yazın</span>
              </button>
            )}

            <button
              id="floating-whatsapp-btn"
              onClick={() => setIsOpen(!isOpen)}
              className="relative w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-2xl hover:scale-105 transition-all focus:outline-none"
              title="WhatsApp ile Mesaj Yazın"
              aria-label="WhatsApp ile Mesaj Yazın"
            >
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-[#0B132B] animate-ping"></span>
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-[#0B132B]"></span>
              {isOpen ? (
                <X className="w-7 h-7 text-[#080E1F]" />
              ) : (
                <WhatsAppIcon className="w-7 h-7 text-[#080E1F]" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
