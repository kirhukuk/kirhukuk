import React, { useState, useEffect } from 'react';
import { useCms } from '../../context/CmsContext';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Scale,
  Video,
  Building2,
  PhoneCall,
  CheckCircle2,
  X,
  Send,
  AlertCircle
} from 'lucide-react';

export const AppointmentModal: React.FC = () => {
  const {
    isAppointmentModalOpen,
    closeAppointmentModal,
    appointmentModalPrefill,
    practiceAreas,
    submitMessage
  } = useCms();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [practiceArea, setPracticeArea] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('14:00 - 16:00');
  const [meetingType, setMeetingType] = useState<'in_person' | 'online' | 'phone'>('in_person');
  const [notes, setNotes] = useState('');
  const [kvkkConsent, setKvkkConsent] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (appointmentModalPrefill) {
      if (appointmentModalPrefill.practiceArea) {
        setPracticeArea(appointmentModalPrefill.practiceArea);
      }
      if (appointmentModalPrefill.subject) {
        setNotes(prev => prev || appointmentModalPrefill.subject || '');
      }
    }
  }, [appointmentModalPrefill, isAppointmentModalOpen]);

  if (!isAppointmentModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setErrorMessage('Lütfen adınızı ve telefon numaranızı giriniz.');
      return;
    }
    if (!kvkkConsent) {
      setErrorMessage('Lütfen KVKK Aydınlatma Metnini onaylayınız.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const selectedAreaTitle = practiceAreas.find(p => p.id === practiceArea || p.slug === practiceArea)?.title || practiceArea || 'Genel Hukuki Uyuşmazlık';

      const isMobileDevice = typeof window !== 'undefined' && (window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent));

      await submitMessage({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        subject: `Randevu Talebi: ${selectedAreaTitle}`,
        message: notes.trim() || `${selectedAreaTitle} alanında ${meetingType === 'in_person' ? 'Ofiste yüz yüze' : meetingType === 'online' ? 'Online görüntülü' : 'Telefonla'} randevu talep edildi. Tarih: ${appointmentDate || 'En yakın müsait zaman'}, Saat: ${appointmentTime}.`,
        practiceArea: selectedAreaTitle,
        appointmentDate: appointmentDate || new Date().toISOString().split('T')[0],
        appointmentTime,
        meetingType,
        type: 'appointment',
        source: isMobileDevice ? 'Mobil Cihaz Randevu Modalı' : 'Web Sitesi Randevu Modalı'
      });

      setIsSuccess(true);
      setName('');
      setPhone('');
      setEmail('');
      setNotes('');
    } catch (err) {
      setErrorMessage('Randevu talebiniz kaydedilirken bir hata oluştu. Lütfen telefon ile ulaşınız.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setErrorMessage('');
    closeAppointmentModal();
  };

  return (
    <div
      id="appointment-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={handleClose}
    >
      <div
        id="appointment-modal-content"
        className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 text-slate-900 shadow-2xl overflow-y-auto max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-8 space-y-4 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600 shadow-xs">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold font-serif-heading text-slate-900">
                Randevu Talebiniz Başarıyla Alındı!
              </h3>
              <p className="text-xs text-emerald-700 font-semibold uppercase tracking-wider">
                Talebiniz Sisteme Kaydedildi
              </p>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed pt-2">
                Hukuki uyuşmazlığınız ve randevu bilgileriniz nöbetçi avukatımıza iletildi. Randevu saati ve görüşme detayları için en kısa sürede sizinle irtibata geçeceğiz.
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={handleClose}
                className="px-6 py-3 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-bold uppercase tracking-wider shadow-xs cursor-pointer"
              >
                Tamam / Kapat
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-1.5 border-b border-slate-200 pb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B94A26]/10 border border-[#B94A26]/20 text-xs text-[#B94A26] font-semibold uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5" />
                <span>Hukuki Danışmanlık & Randevu Formu</span>
              </div>
              <h2 className="text-2xl font-bold font-serif-heading text-slate-900">
                Danışma Randevusu Oluşturun
              </h2>
              <p className="text-xs text-slate-600">
                Aşağıdaki formu doldurduğunuzda randevu talebiniz anında sistemimize kaydedilir ve avukatlarımız teyit için arar.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#B94A26]" />
                    <span>Adınız Soyadınız *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Örn: Av. Adayı Ahmet Yılmaz"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-[#B94A26] focus:ring-1 focus:ring-[#B94A26]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#B94A26]" />
                    <span>Telefon Numaranız *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="05XX XXX XX XX"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-[#B94A26] focus:ring-1 focus:ring-[#B94A26]"
                  />
                </div>
              </div>

              {/* Email & Practice Area */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#B94A26]" />
                    <span>E-Posta Adresiniz</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="ahmet@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-[#B94A26] focus:ring-1 focus:ring-[#B94A26]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-[#B94A26]" />
                    <span>İlgili Hukuk Alanı</span>
                  </label>
                  <select
                    value={practiceArea}
                    onChange={e => setPracticeArea(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-[#B94A26] focus:ring-1 focus:ring-[#B94A26] cursor-pointer"
                  >
                    <option value="">-- Alan Seçiniz (Opsiyonel) --</option>
                    {practiceAreas.filter(p => p.isActive).map(area => (
                      <option key={area.id} value={area.title}>
                        {area.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Meeting Type Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">
                  Tercih Ettiğiniz Görüşme Biçimi
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setMeetingType('in_person')}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      meetingType === 'in_person'
                        ? 'bg-[#B94A26] text-white border-[#B94A26] font-semibold shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span className="text-[11px]">Ofiste Yüz Yüze</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMeetingType('online')}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      meetingType === 'online'
                        ? 'bg-[#B94A26] text-white border-[#B94A26] font-semibold shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span className="text-[11px]">Online Görüntülü</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMeetingType('phone')}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      meetingType === 'phone'
                        ? 'bg-[#B94A26] text-white border-[#B94A26] font-semibold shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span className="text-[11px]">Telefonla Ön Görüşme</span>
                  </button>
                </div>
              </div>

              {/* Date & Time Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#B94A26]" />
                    <span>Tercih Edilen Tarih</span>
                  </label>
                  <input
                    type="date"
                    value={appointmentDate}
                    onChange={e => setAppointmentDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-[#B94A26] focus:ring-1 focus:ring-[#B94A26]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#B94A26]" />
                    <span>Tercih Edilen Saat Aralığı</span>
                  </label>
                  <select
                    value={appointmentTime}
                    onChange={e => setAppointmentTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-[#B94A26] focus:ring-1 focus:ring-[#B94A26] cursor-pointer"
                  >
                    <option value="10:00 - 12:00">Sabah: 10:00 - 12:00</option>
                    <option value="13:00 - 15:00">Öğleden Sonra: 13:00 - 15:00</option>
                    <option value="15:00 - 17:00">İkindi: 15:00 - 17:00</option>
                    <option value="17:00 - 19:00">Akşam: 17:00 - 19:00</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Uyuşmazlık Konusu / Kısa Açıklamanız
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Dava veya danışmak istediğiniz hukuki sürecin özeti..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-[#B94A26] focus:ring-1 focus:ring-[#B94A26] resize-none"
                />
              </div>

              {/* KVKK Checkbox */}
              <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer select-none pt-1">
                <input
                  type="checkbox"
                  checked={kvkkConsent}
                  onChange={e => setKvkkConsent(e.target.checked)}
                  className="rounded border-slate-300 text-[#B94A26] focus:ring-[#B94A26] mt-0.5"
                />
                <span className="leading-snug text-[11px]">
                  KVKK Aydınlatma Metni uyarınca kişisel verilerimin randevu sürecinin yürütülmesi amacıyla işlenmesini onaylıyorum.
                </span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:scale-[1.005] transition-all disabled:opacity-60 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>
                  {isSubmitting ? 'Kaydediliyor...' : 'Randevu Talebini Gönder'}
                </span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
