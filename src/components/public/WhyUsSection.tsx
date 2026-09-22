import React from 'react';
import { Shield, Target, BookOpen, Clock, FileCheck2, Scale } from 'lucide-react';

export const WhyUsSection: React.FC = () => {
  const reasons = [
    {
      icon: <Shield className="w-6 h-6 text-[#B94A26]" />,
      title: 'Müvekkil Mahremiyeti ve Güven',
      desc: 'Avukatlık mesleğinin temeli olan sır saklama yükümlülüğü çerçevesinde tüm bilgi ve belgeleriniz yüksek güvenlik standartlarıyla korunur.'
    },
    {
      icon: <Target className="w-6 h-6 text-[#B94A26]" />,
      title: 'Stratejik ve Sonuç Odaklı Yaklaşım',
      desc: 'Uyuşmazlıkları yalnızca mevcut davasıyla değil, gelecekteki ticari ve şahsi riskleri öngören bütüncül bir yaklaşımla ele alıyoruz.'
    },
    {
      icon: <BookOpen className="w-6 h-6 text-[#B94A26]" />,
      title: 'Derin Akademik & Pratik Bilgi',
      desc: 'Sürekli güncellenen kanunlar, Yargıtay İçtihatları Birleştirme Kararları ve Anayasa Mahkemesi içtihatları düzenli olarak taranır.'
    },
    {
      icon: <Clock className="w-6 h-6 text-[#B94A26]" />,
      title: 'Hızlı ve Şeffaf Dosya Takibi',
      desc: 'Dava dilekçelerinin tanzimi, duruşma tarihleri ve ara kararlar hakkında müvekkillerimize gecikmeksizin şeffaf bilgi verilir.'
    },
    {
      icon: <FileCheck2 className="w-6 h-6 text-[#B94A26]" />,
      title: 'Önleyici Hukuk Danışmanlığı',
      desc: 'Dava açılmadan önceki müzakere, arabuluculuk ve sulh aşamalarını etkin kullanarak müvekkillerimizin zaman ve maddi kaybını önlüyoruz.'
    },
    {
      icon: <Scale className="w-6 h-6 text-[#B94A26]" />,
      title: 'Etik Değerlere Bağlılık',
      desc: 'Türkiye Barolar Birliği Meslek Kuralları ve Avukatlık Kanunu ilkelerine titizlikle bağlı kalarak dürüst ve tarafsız temsil sağlıyoruz.'
    }
  ];

  return (
    <section id="why-us-section" className="py-8 sm:py-12 px-4 sm:px-6 bg-white border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#B94A26]/10 border border-[#B94A26]/20 text-xs text-[#B94A26] font-semibold tracking-wide">
            <span>Çalışma Yaklaşımımız ve İlkelerimiz</span>
          </div>
          <h2 className="text-[28px] sm:text-[34px] md:text-[40px] font-bold font-serif-heading text-slate-900 tracking-tight leading-[1.25]">
            Hukuki Yaklaşımımız ve Güven İlkelerimiz
          </h2>
          <p className="text-slate-600 text-[15px] sm:text-[16px] leading-[1.7] max-w-2xl mx-auto">
            Hukuki süreçlerin hassasiyetinin bilinciyle, her dosyayı en yüksek mesleki ciddiyet, sır saklama ve kurumsal şeffaflıkla yönetiyoruz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {reasons.map((item, idx) => (
            <div
              key={idx}
              className="p-7 rounded-2xl bg-[#F8FAFC] hover:bg-white border border-slate-200 hover:border-[#B94A26]/40 transition-all duration-300 shadow-xs hover:shadow-md space-y-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-2xs group-hover:border-[#B94A26]/30">
                {item.icon}
              </div>
              <h3 className="text-[19px] sm:text-[20px] font-semibold text-slate-900 font-serif-heading leading-snug group-hover:text-[#B94A26] transition-colors">
                {item.title}
              </h3>
              <p className="text-slate-600 text-[14px] sm:text-[15px] leading-[1.7]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
