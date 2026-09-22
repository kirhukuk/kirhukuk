import React from 'react';
import { useCms } from '../../context/CmsContext';
import { ShieldCheck, Compass, Users, CheckCircle2, ArrowRight } from 'lucide-react';

export const AboutPreview: React.FC = () => {
  const { navigate } = useCms();

  return (
    <section id="about-preview-section" className="py-8 sm:py-12 px-4 sm:px-6 bg-white border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Centered Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#B94A26]/10 border border-[#B94A26]/20 text-xs text-[#B94A26] font-semibold tracking-wide">
            <span>Kurumsal Mirasımız</span>
          </div>
          <h2 className="text-[28px] sm:text-[34px] md:text-[40px] font-bold font-serif-heading text-slate-900 tracking-tight leading-[1.28]">
            Hukuki Uyuşmazlıklarda <span className="text-[#B94A26]">Güçlü Temsil</span>, Çözüm Odaklı Strateji
          </h2>
          <p className="text-slate-600 text-[15px] sm:text-[16px] leading-[1.7]">
            Hukukun üstünlüğü, mesleki bağımsızlık ve sır saklama ilkeleri ışığında müvekkillerimizin yanındayız.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Story & Principles */}
          <div className="lg:col-span-7 space-y-6">
            <p className="text-slate-700 text-[15px] sm:text-[16px] leading-[1.75]">
              KIR HUKUK, kuruluşundan bu yana müvekkillerinin yasal hak ve menfaatlerini en üst seviyede koruma misyonuyla faaliyet göstermektedir. Hukukun üstünlüğü, mesleki bağımsızlık ve sır saklama ilkelerini temel ilke edinen büromuz; karmaşık dava ve ticari uyuşmazlıklarda dinamik bir ekiple titiz bir takip yürütür.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-200 hover:border-[#B94A26]/40 transition-colors shadow-2xs">
                <ShieldCheck className="w-5 h-5 text-[#B94A26] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[16px] font-semibold text-slate-900 font-serif-heading">Sır Saklama & Gizlilik</h4>
                  <p className="text-sm text-slate-600 mt-1 leading-[1.6]">Müvekkil mahremiyeti avukatlık etiğimizin en temel kuralıdır.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-200 hover:border-[#B94A26]/40 transition-colors shadow-2xs">
                <Compass className="w-5 h-5 text-[#B94A26] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[16px] font-semibold text-slate-900 font-serif-heading">Proaktif Çözümler</h4>
                  <p className="text-sm text-slate-600 mt-1 leading-[1.6]">Uyuşmazlıklar dava aşamasına gelmeden önleyici hukuk tedbirleri.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-200 hover:border-[#B94A26]/40 transition-colors shadow-2xs">
                <Users className="w-5 h-5 text-[#B94A26] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[16px] font-semibold text-slate-900 font-serif-heading">Departmansal Uzmanlık</h4>
                  <p className="text-sm text-slate-600 mt-1 leading-[1.6]">Her dava konusu kendi alanında uzman avukatlarca yönetilir.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-200 hover:border-[#B94A26]/40 transition-colors shadow-2xs">
                <CheckCircle2 className="w-5 h-5 text-[#B94A26] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[16px] font-semibold text-slate-900 font-serif-heading">Şeffaf Bilgilendirme</h4>
                  <p className="text-sm text-slate-600 mt-1 leading-[1.6]">Her duruşma ve tebligat sonrası anlık dosya raporlaması.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                id="about-learn-more-btn"
                onClick={() => navigate('about')}
                className="inline-flex items-center gap-2 text-[15px] font-bold text-[#B94A26] hover:text-[#933718] transition-colors group cursor-pointer"
              >
                <span>Hakkımızda Detaylı Bilgi ve Kurumsal Vizyonumuz</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Column: Visual Frame */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-lg relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
                  alt="KIR HUKUK Danışmanlık Ofisi"
                  className="w-full h-[420px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent"></div>
              </div>

              {/* Decorative accent card */}
              <div className="absolute -bottom-5 -left-5 z-20 bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xl max-w-[260px] hidden sm:block">
                <p className="text-xs text-[#B94A26] font-bold tracking-wide uppercase">Türkiye Barolar Birliği</p>
                <p className="text-sm font-semibold text-slate-900 mt-1 leading-[1.5]">
                  Bursa ve İstanbul Barosu bünyesinde kayıtlı profesyonel avukatlık.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
