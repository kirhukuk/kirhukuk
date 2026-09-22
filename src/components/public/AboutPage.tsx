import React from 'react';
import { useCms } from '../../context/CmsContext';
import { Shield, Award, Users, Scale, CheckCircle2, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { settings, navigate } = useCms();

  return (
    <div id="about-page" className="pt-28 pb-24 px-4 sm:px-6 bg-[#F8FAFC] min-h-screen text-slate-800">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Breadcrumb & Header */}
        <div className="space-y-3.5">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <button onClick={() => navigate('home')} className="hover:text-[#9A7B4F] transition-colors">
              Ana Sayfa
            </button>
            <span>/</span>
            <span className="text-[#9A7B4F] font-semibold">Hakkımızda</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#C5A880]/40 text-xs text-[#9A7B4F] font-semibold uppercase tracking-wider shadow-xs">
            <Scale className="w-3.5 h-3.5 text-[#9A7B4F]" />
            <span>Kurumsal Profil</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif-heading text-slate-900 tracking-normal leading-[1.25]">
            Hakkımızda
          </h1>
          <p className="text-lg text-[#9A7B4F] font-serif-heading italic">
            «{settings.slogan}»
          </p>
        </div>

        {/* Hero Image */}
        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md h-80 sm:h-96 relative bg-slate-100">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80"
            alt="KIR HUKUK Çalışma Ortamı"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold">KIR HUKUK BÜROSU</span>
            <h3 className="text-2xl font-bold font-serif-heading">İstanbul Levent Merkezli Hukuki Temsil</h3>
          </div>
        </div>

        {/* Corporate Profile Story */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 sm:p-10 space-y-6 text-slate-700 text-base sm:text-lg leading-relaxed">
          <h2 className="text-2xl font-bold font-serif-heading text-slate-900">
            Köklü Deneyim ve Güven Odaklı Hizmet Anlayışı
          </h2>
          <p>
            <strong className="text-slate-900">KIR HUKUK</strong>, bireysel ve kurumsal müvekkillerine yüksek standartlarda hukuki danışmanlık ve dava vekilliği sunmak amacıyla İstanbul Levent'te kurulmuştur. Hukuk büromuz, Türkiye genelinde ve uluslararası arenada faaliyet gösteren şirketlere, kurumlara ve bireylere karmaşık hukuki uyuşmazlıklarda stratejik çözümler üretmektedir.
          </p>
          <p>
            Her biri kendi uzmanlık alanında deneyim sahibi avukat kadromuzla; önleyici hukuk felsefesini benimseyerek, ihtilaflar mahkeme koridorlarına taşınmadan önce etkin risk yönetimi ve sulh mekanizmalarını devreye sokuyoruz. Dava aşamasına intikal eden uyuşmazlıklarda ise titiz delil tespiti, derin mevzuat araştırması ve duruşma stratejisiyle müvekkillerimizin hak ve menfaatlerini en üst derecede savunuyoruz.
          </p>
        </div>

        {/* Mission & Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#1C2E4A] flex items-center justify-center">
              <Scale className="w-6 h-6 text-[#C5A880]" />
            </div>
            <h2 className="text-2xl font-bold font-serif-heading text-slate-900">Misyonumuz</h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Müvekkillerimize evrensel hukuk ilkeleri, Türkiye Barolar Birliği Meslek Kuralları ve çağdaş yargı içtihatları doğrultusunda; dürüst, şeffaf, hızlı ve sonuç odaklı hukuki çözümler sunmak; adaletin tecellisine katkıda bulunmaktır.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#1C2E4A] flex items-center justify-center">
              <Award className="w-6 h-6 text-[#C5A880]" />
            </div>
            <h2 className="text-2xl font-bold font-serif-heading text-slate-900">Vizyonumuz</h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Ulusal ve küresel ölçekte referans gösterilen, uzmanlık alanlarında içtihat yaratan kararlara imza atan, yenilikçi hukuki teknolojileri etik ilkelerle harmanlayan prestijli bir hukuk kurumu olmaktır.
            </p>
          </div>
        </div>

        {/* Ethical Principles */}
        <div className="space-y-6 pt-2">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif-heading text-slate-900">
            Çalışma Prensiplerimiz & Etik Değerlerimiz
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: 'Mutlak Sır Saklama (Mahremiyet)',
                desc: 'Avukatlık Kanunu ve uluslararası teamüller uyarınca tüm müvekkil bilgi ve belgeleri ömür boyu gizlilik altında tutulur.'
              },
              {
                title: 'Çıkar Çatışması Yasağı',
                desc: 'Müvekkillerimizin aleyhine olabilecek hiçbir menfaat ilişkisine girilmez; bağımsız ve tarafsız temsil esastır.'
              },
              {
                title: 'Ayrıntılı ve Düzenli Dosya Raporlaması',
                desc: 'Müvekkillerimiz dosyalarındaki her aşamayı, duruşma tutanaklarını ve tebligatları şeffaf bir şekilde takip edebilir.'
              },
              {
                title: 'Sürekli Hukuki Gelişim ve Akademi',
                desc: 'Ekibimiz Yargıtay, Danıştay ve AYM içtihatlarını günlük olarak inceleyerek güncel savunma tekniklerini uygular.'
              }
            ].map((p, i) => (
              <div key={i} className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#9A7B4F]" />
                  <h3 className="text-base font-bold text-slate-900">{p.title}</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-6">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-[#1C2E4A] to-[#0B132B] text-white border border-[#C5A880]/40 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl font-bold font-serif-heading text-white">
              Hukuki Uyuşmazlığınız İçin Bize Ulaşın
            </h3>
            <p className="text-xs text-slate-300">
              Alanında yetkin avukatlarımızla randevu oluşturmak için iletişime geçebilirsiniz.
            </p>
          </div>
          <button
            onClick={() => navigate('contact')}
            className="px-6 py-3 rounded-xl gold-btn text-xs font-semibold uppercase tracking-wider shrink-0"
          >
            Randevu Talebi Oluştur
          </button>
        </div>
      </div>
    </div>
  );
};
