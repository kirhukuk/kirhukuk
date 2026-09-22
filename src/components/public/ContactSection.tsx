import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Navigation,
  Car,
  ShieldCheck,
  Paperclip
} from 'lucide-react';
import { WhatsAppIcon } from '../common/WhatsAppIcon';

export const ContactSection: React.FC = () => {
  const { settings, practiceAreas, addContactMessage, navigate } = useCms();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    practiceArea: '',
    message: '',
    kvkkConsent: false,
    securityAnswer: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const activePractices = practiceAreas.filter(p => p.isActive);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!formData.name.trim()) {
      setErrorMessage('Lütfen adınızı ve soyadınızı belirtiniz.');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage('Lütfen geçerli bir telefon numarası giriniz.');
      return;
    }
    if (!formData.email.trim()) {
      setErrorMessage('Lütfen geçerli bir e-posta adresi giriniz.');
      return;
    }
    if (!formData.message.trim()) {
      setErrorMessage('Lütfen danışmak istediğiniz konuyu özetleyen mesajınızı yazınız.');
      return;
    }
    if (!formData.kvkkConsent) {
      setErrorMessage('Devam edebilmek için KVKK Aydınlatma Metnini onaylamanız gerekmektedir.');
      return;
    }
    // Anti-spam math check (Mobil klavyeler ve boşluklar için toleranslı)
    const normSecurity = formData.securityAnswer.trim().toLowerCase();
    if (normSecurity !== '7' && normSecurity !== 'yedi' && normSecurity !== 'seven') {
      setErrorMessage('Güvenlik doğrulaması hatalı. Lütfen 3 + 4 işleminin sonucunu (7) yazınız.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const isMobileDevice = typeof window !== 'undefined' && (window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent));
      await addContactMessage({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        subject: formData.subject || 'Hukuki Danışmanlık Talebi',
        practiceArea: formData.practiceArea || 'Genel Hukuki Uyuşmazlık',
        message: formData.message,
        kvkkConsent: true,
        type: 'contact',
        source: isMobileDevice ? 'Mobil Cihaz İletişim Formu' : 'Web Sitesi İletişim Formu'
      });

      setIsSubmitting(false);
      setSuccessMessage(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        subject: '',
        practiceArea: '',
        message: '',
        kvkkConsent: false,
        securityAnswer: ''
      });
    } catch (err) {
      setIsSubmitting(false);
      setErrorMessage('Mesajınız kaydedilirken bir bağlantı gecikmesi yaşandı. Lütfen tekrar deneyiniz.');
    }
  };

  const cleanWaNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <section id="contact-section" className="py-10 sm:py-14 px-4 sm:px-6 bg-white border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#B94A26]/10 border border-[#B94A26]/20 text-xs text-[#B94A26] font-semibold tracking-wide">
            <Mail className="w-3.5 h-3.5" />
            <span>Hukuki Danışmanlık ve Randevu</span>
          </div>
          <h2 className="text-[30px] sm:text-[36px] md:text-[42px] font-bold font-serif-heading text-slate-900 tracking-tight leading-[1.25]">
            Hukuki Danışmanlık ve İletişim
          </h2>
          <p className="text-slate-600 text-[16px] sm:text-[17px] leading-[1.7]">
            Hukuki uyuşmazlığınız veya randevu talebiniz için formu doldurabilir veya telefon ve WhatsApp üzerinden avukatlarımıza doğrudan ulaşabilirsiniz.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10">
          {/* Left Column: Contact Form */}
          <div className="lg:col-span-7 bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h3 className="text-[20px] sm:text-[22px] font-semibold font-serif-heading text-slate-900 mb-2">
              Hukuki Danışma ve Randevu Formu
            </h3>
            <p className="text-sm text-slate-600 mb-6 leading-[1.6]">
              Mesajınız doğrudan büromuzun nöbetçi avukatına iletilir. İletilen tüm bilgiler avukatlık sır saklama yükümlülüğü altındadır.
            </p>

            {successMessage && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-3 animate-in fade-in shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-emerald-900">Mesajınız & Danışma Talebiniz Başarıyla Alındı!</p>
                  <p className="text-xs text-emerald-700 mt-1">
                    Bilgileriniz kaydedildi. Nöbetçi avukatlarımız en kısa sürede belirttiğiniz telefon veya e-posta üzerinden sizinle irtibata geçecektir.
                  </p>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-start gap-3 animate-in fade-in">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-xs">{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Adınız Soyadınız <span className="text-[#B94A26]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Örn: Mehmet Özkan"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-[#B94A26] focus:ring-1 focus:ring-[#B94A26]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Telefon Numaranız <span className="text-[#B94A26]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Örn: 0532 000 00 00"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-[#B94A26] focus:ring-1 focus:ring-[#B94A26]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    E-posta Adresiniz <span className="text-[#B94A26]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ornek@alanadi.com"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-[#B94A26] focus:ring-1 focus:ring-[#B94A26]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    İlgili Hukuki Alan
                  </label>
                  <select
                    value={formData.practiceArea}
                    onChange={e => setFormData({ ...formData, practiceArea: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#B94A26] focus:ring-1 focus:ring-[#B94A26]"
                  >
                    <option value="">Lütfen seçiniz (opsiyonel)</option>
                    {activePractices.map(p => (
                      <option key={p.id} value={p.title}>
                        {p.title}
                      </option>
                    ))}
                    <option value="Diğer">Diğer Hukuki Uyuşmazlık</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Konu Başlığı
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Örn: Boşanma davası protokolü hakkında danışmanlık"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-[#B94A26] focus:ring-1 focus:ring-[#B94A26]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Hukuki Meselenizin Özeti <span className="text-[#B94A26]">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Lütfen durumunuzu, önemli tarihleri ve talep ettiğiniz hukuki desteği kısaca açıklayınız..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-[#B94A26] focus:ring-1 focus:ring-[#B94A26]"
                />
              </div>

              {/* Spam Security Question */}
              <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between gap-4">
                <label className="text-xs text-slate-700">
                  Güvenlik Doğrulaması: <strong>3 + 4 = ?</strong>
                </label>
                <input
                  type="text"
                  required
                  value={formData.securityAnswer}
                  onChange={e => setFormData({ ...formData, securityAnswer: e.target.value })}
                  placeholder="Sonuç"
                  className="w-20 px-3 py-1.5 rounded bg-[#F8FAFC] border border-slate-300 text-slate-900 text-center text-sm focus:outline-none focus:border-[#B94A26]"
                />
              </div>

              {/* KVKK Consent */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={formData.kvkkConsent}
                    onChange={e => setFormData({ ...formData, kvkkConsent: e.target.checked })}
                    className="mt-0.5 rounded border-slate-300 text-[#B94A26] focus:ring-[#B94A26]"
                  />
                  <span>
                    KIR HUKUK tarafından paylaştığım kişisel verilerimin{' '}
                    <button
                      type="button"
                      onClick={() => navigate('custom-page', 'kvkk-aydinlatma-metni')}
                      className="text-[#B94A26] underline hover:text-[#96381a]"
                    >
                      KVKK Aydınlatma Metni
                    </button>{' '}
                    kapsamında iletişim kurmak üzere işlenmesini onaylıyorum.
                  </span>
                </label>
              </div>

              {/* Submit button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'İletiliyor...' : 'Danışma Talebini Gönder'}</span>
                </button>
              </div>

              {/* Legal Note on form */}
              <p className="text-[11px] text-slate-500 text-center pt-2 leading-relaxed">
                * Bu formun iletilmesi taraflar arasında vekâlet ilişkisi kurmaz. Ön değerlendirme ve randevu planlaması amacıyla kullanılır.
              </p>
            </form>
          </div>

          {/* Right Column: Office Address, Map & Direct Lines */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Cards */}
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
              <h3 className="text-[20px] font-semibold font-serif-heading text-slate-900">
                İletişim & Ulaşım Bilgileri
              </h3>

              <div className="space-y-4 text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#B94A26] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">Büro Adresi</strong>
                    <span>{settings.address}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#B94A26] shrink-0" />
                  <div>
                    <strong className="block text-slate-900">Telefon</strong>
                    <a href={`tel:${settings.phoneRaw}`} className="hover:text-[#B94A26] transition-colors">
                      {settings.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-[#25D366] shrink-0">
                      <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
                    </div>
                    <div>
                      <strong className="block text-slate-900 text-xs sm:text-sm">WhatsApp Danışma Hattı</strong>
                      <span className="text-xs text-slate-600">{settings.whatsappNumber}</span>
                    </div>
                  </div>
                  <a
                    id="contact-whatsapp-chat-btn"
                    href={`https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(settings.whatsappDefaultMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold transition-all shadow-xs shrink-0 flex items-center gap-1.5"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5 text-white" />
                    <span>Mesaj Yaz</span>
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#B94A26] shrink-0" />
                  <div>
                    <strong className="block text-slate-900">E-Posta</strong>
                    <a href={`mailto:${settings.email}`} className="hover:text-[#B94A26] transition-colors">
                      {settings.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#B94A26] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">Çalışma Saatleri</strong>
                    <span>{settings.workingHours}</span>
                  </div>
                </div>
              </div>

              {/* Transit & Parking Details */}
              <div className="pt-3 border-t border-slate-200 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-[#B94A26]" />
                  <span>Levent Metro ve Otobüs duraklarına 2 dakika yürüme mesafesindedir.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-[#B94A26]" />
                  <span>Müvekkillerimiz için plazada kapalı vale & otopark hizmeti mevcuttur.</span>
                </div>
              </div>
            </div>

            {/* Interactive Map & Directions */}
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <div className="p-4 bg-white flex items-center justify-between border-b border-slate-200">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-800">
                  Ofis Konumu (Levent / İstanbul)
                </span>
                <a
                  id="google-maps-directions-btn"
                  href={settings.googleMapsDirectionsUrl || `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(settings.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Yol Tarifi Al</span>
                </a>
              </div>

              <div className="h-64 w-full bg-slate-100 relative">
                <iframe
                  title="KIR HUKUK Ofis Konumu"
                  src={settings.mapEmbedUrl || `https://maps.google.com/maps?q=${encodeURIComponent(settings.address)}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
