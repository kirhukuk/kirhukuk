import React from 'react';
import { useCms } from '../../context/CmsContext';
import {
  Scale,
  CheckCircle2,
  Phone,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  FileCheck,
  ChevronRight,
  HelpCircle,
  Edit2
} from 'lucide-react';

interface PracticeDetailPageProps {
  slug: string;
}

export const PracticeDetailPage: React.FC<PracticeDetailPageProps> = ({ slug }) => {
  const { practiceAreas, faqItems, settings, navigate, navigateToAdmin } = useCms();

  const practice = practiceAreas.find(p => p.slug === slug) || practiceAreas[0];
  const otherPractices = practiceAreas.filter(p => p.id !== practice.id && p.isActive);

  // Filter FAQs that might match this category or general
  const relatedFaqs = faqItems.filter(
    f =>
      f.category.toLocaleLowerCase('tr-TR').includes(practice.title.toLocaleLowerCase('tr-TR')) ||
      practice.title.toLocaleLowerCase('tr-TR').includes(f.category.toLocaleLowerCase('tr-TR'))
  );

  const cleanWaNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <div id="practice-detail-page" className="pt-28 pb-24 px-4 sm:px-6 bg-[#F8FAFC] min-h-screen text-slate-800">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Breadcrumbs & Admin Edit Action */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <button onClick={() => navigate('home')} className="hover:text-[#9A7B4F] transition-colors cursor-pointer">
              Ana Sayfa
            </button>
            <span>/</span>
            <button onClick={() => navigate('practices')} className="hover:text-[#9A7B4F] transition-colors cursor-pointer">
              Çalışma Alanlarımız
            </button>
            <span>/</span>
            <span className="text-[#9A7B4F] font-semibold">{practice.title}</span>
          </div>

          <button
            type="button"
            onClick={() => navigateToAdmin('practices', practice.id)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C5A880]/15 hover:bg-[#C5A880]/25 text-[#9A7B4F] hover:text-[#7d623b] border border-[#C5A880]/40 text-xs font-semibold transition-all cursor-pointer shadow-xs"
            title="Bu faaliyet alanının içeriğini kontrol panelinde düzenle"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Kontrol Panelinden İçeriği Düzenle</span>
          </button>
        </div>

        {/* Hero Title Section */}
        <div className="space-y-3.5 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#C5A880]/40 text-xs text-[#9A7B4F] font-semibold uppercase tracking-wider shadow-xs">
            <Scale className="w-3.5 h-3.5 text-[#9A7B4F]" />
            <span>Hukuki Uzmanlık Alanı</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif-heading text-slate-900 tracking-normal leading-[1.25]">
            {practice.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            {practice.shortDesc}
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Visual Banner */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md h-72 sm:h-96 relative bg-slate-100">
              <img
                src={practice.image || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80'}
                alt={practice.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-5 left-6 right-6 text-white">
                <p className="text-xs uppercase tracking-widest font-semibold text-[#C5A880]">KIR HUKUK UZMANLIK</p>
                <h3 className="text-xl sm:text-2xl font-bold font-serif-heading">{practice.title}</h3>
              </div>
            </div>

            {/* Detailed Description */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-10 space-y-6 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-2xl font-bold font-serif-heading text-slate-900">
                  Hukuki Çerçeve ve Yaklaşımımız
                </h2>
                <button
                  type="button"
                  onClick={() => navigateToAdmin('practices', practice.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-[#9A7B4F] hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Faaliyet Alanı İçeriğini Kontrol Panelinden Düzenle"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              <div className="text-slate-700 text-sm sm:text-base leading-relaxed space-y-4">
                <p className="whitespace-pre-line">{practice.longDesc || practice.fullDesc}</p>
                <p>
                  KIR HUKUK olarak {practice.title} alanındaki uyuşmazlıklarda hem mahkeme öncesi arabuluculuk ve sulh görüşmelerini yürütüyor, hem de dava açıldığı andan kararın kesinleşmesine kadar her aşamada müvekkillerimizin yanında yer alıyoruz.
                </p>
              </div>

              {/* Handled Services Checklist */}
              {practice.services && practice.services.length > 0 && (
                <div className="pt-6 border-t border-slate-200 space-y-4">
                  <h3 className="text-lg font-bold font-serif-heading text-[#9A7B4F]">
                    Bu Alanda Sunduğumuz Başlıca Hizmetler
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {practice.services.map((service, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-800"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#9A7B4F] shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm font-medium">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Step-by-Step Legal Process */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-10 space-y-6 shadow-sm">
              <h3 className="text-xl font-bold font-serif-heading text-slate-900">
                Dava ve Danışmanlık Sürecimiz Nasıl İlerler?
              </h3>

              <div className="space-y-4">
                {[
                  {
                    step: '1',
                    title: 'Ön İnceleme ve Belge Analizi',
                    desc: 'Mevcut uyuşmazlığa dair tüm delil, sözleşme, tebligat ve yazışmalar avukatlarımızca titizlikle incelenir.'
                  },
                  {
                    step: '2',
                    title: 'Hukuki Strateji ve Risk Raporlaması',
                    desc: 'Davanın başarı şansı, zaman maliyeti, alternatif çözüm yolları ve masraf kalemleri müvekkile şeffaf şekilde aktarılır.'
                  },
                  {
                    step: '3',
                    title: 'Dava Açılması ve Duruşma Temsili',
                    desc: 'Yetkili ve görevli mahkemelerde titizlikle hazırlanan dava ve cevap dilekçeleriyle süreç başlatılır, duruşmalara bizzat katılınır.'
                  },
                  {
                    step: '4',
                    title: 'İstinaf, Temyiz ve İlam İcrası',
                    desc: 'İlk derece mahkemesi kararlarının Bölge Adliye ve Yargıtay nezdindeki kanun yolu takipleri ile tahsilat icrası eksiksiz yürütülür.'
                  }
                ].map((st, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="w-8 h-8 rounded-full bg-[#1C2E4A] text-[#C5A880] font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                      {st.step}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{st.title}</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{st.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Related FAQ (if any) */}
            {relatedFaqs.length > 0 && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
                <h3 className="text-xl font-bold font-serif-heading text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[#9A7B4F]" />
                  <span>{practice.title} İle İlgili Sık Sorulan Sorular</span>
                </h3>

                <div className="space-y-3 pt-2">
                  {relatedFaqs.map(f => (
                    <div key={f.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                      <p className="text-sm font-bold text-slate-900">{f.question}</p>
                      <p className="text-xs text-slate-600 leading-relaxed">{f.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Contact Card */}
            <div className="bg-gradient-to-b from-[#1C2E4A] to-[#0B132B] text-white border border-[#C5A880]/40 rounded-2xl p-6 sm:p-7 space-y-5 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C5A880]">
                <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
                <span>Hukuki Danışmanlık Alın</span>
              </div>

              <h3 className="text-xl font-bold font-serif-heading text-white">
                Dosyanızı Avukatlarımız İncelesin
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                {practice.title} alanındaki uyuşmazlığınız hakkında bilgi almak veya büromuzda yüz yüze ya da online görüşme randevusu oluşturmak için doğrudan arayabilirsiniz.
              </p>

              <div className="space-y-3 pt-2">
                <a
                  href={`tel:${settings.phoneRaw}`}
                  className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <Phone className="w-4 h-4 text-[#C5A880]" />
                  <span>{settings.phone}</span>
                </a>

                {settings.modules.whatsapp && (
                  <a
                    href={`https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(
                      `${practice.title} hakkında danışmanlık almak istiyorum.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl gold-btn text-xs font-semibold flex items-center justify-center gap-2 shadow-lg"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>WhatsApp Danışma</span>
                  </a>
                )}

                <button
                  onClick={() => navigate('contact')}
                  className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white text-xs font-medium border border-white/10 flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>İletişim Formunu Doldurun</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Other Practice Areas List */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold font-serif-heading text-slate-900">
                Diğer Çalışma Alanlarımız
              </h3>

              <div className="space-y-1">
                {otherPractices.map(other => (
                  <button
                    key={other.id}
                    onClick={() => navigate('practice-detail', other.slug)}
                    className="w-full p-2.5 rounded-lg text-left text-xs font-medium text-slate-700 hover:text-[#9A7B4F] hover:bg-slate-50 flex items-center justify-between transition-colors group"
                  >
                    <span>{other.title}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#9A7B4F] group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
