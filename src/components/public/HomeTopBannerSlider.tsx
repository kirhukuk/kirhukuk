import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useCms } from '../../context/CmsContext';
import { ChevronLeft, ChevronRight, ArrowRight, ShieldCheck } from 'lucide-react';

export interface BannerSlide {
  id: string;
  order: number;
  imageUrl: string;
  altText: string;
  badge?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  linkUrl?: string;
}

// KIR HUKUK kurumsal kimliğine tam uyumlu 10 adet yüksek çözünürlüklü hukuk ve prestij görseli
const defaultBannerSlides: BannerSlide[] = [
  {
    id: 'banner-slide-1',
    order: 1,
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=2000&q=85',
    altText: 'KIR HUKUK - Adalet Heykeli ve Hukuki Güvence',
    badge: 'KIR HUKUK & DANIŞMANLIK',
    title: 'Hukukun Üstünlüğü ve Haklarınızın Güvencesi',
    description: 'Bireysel ve kurumsal müvekkillerimize 20 yılı aşkın tecrübeyle güvenilir, çözüm odaklı ve ilkeli hukuki temsil hizmeti sunuyoruz.',
    buttonText: 'Hukuki Danışmanlık Alın',
    buttonLink: 'contact'
  },
  {
    id: 'banner-slide-2',
    order: 2,
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=85',
    altText: 'KIR HUKUK Levent Merkez Ofisi Toplantı ve Kabul Salonu',
    badge: 'PRESTİJLİ VE MODERN OFİS',
    title: 'Modern Altyapı ve Gizlilik Odaklı Hizmet',
    description: 'Levent merkez ofisimizde müvekkil mahremiyetini ve şeffaflığı esas alan çağdaş çalışma ortamı.',
    buttonText: 'Ofisimizi İnceleyin',
    buttonLink: 'about'
  },
  {
    id: 'banner-slide-3',
    order: 3,
    imageUrl: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=2000&q=85',
    altText: 'Hukuk Kütüphanesi ve Akademik Araştırma',
    badge: 'AKADEMİK VE DERİNLEMESİNE BİLGİ',
    title: 'Güncel İçtihatlar ve Kapsamlı Doktrin Analizi',
    description: 'Her somut dava dosyasını Yargıtay ve Danıştay kararları ışığında titizlikle analiz ediyoruz.',
    buttonText: 'Hukuki Makaleler',
    buttonLink: 'articles'
  },
  {
    id: 'banner-slide-4',
    order: 4,
    imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=2000&q=85',
    altText: 'Sözleşmeler ve Ticari Müzakere Masası',
    badge: 'TİCARET & ŞİRKETLER HUKUKU',
    title: 'Önleyici Hukuk ve Güvenli Sözleşme Yönetimi',
    description: 'Uyuşmazlıklar ortaya çıkmadan önce şirketinizin hukuki altyapısını koruma altına alıyoruz.',
    buttonText: 'Uzmanlık Alanlarımız',
    buttonLink: 'practices'
  },
  {
    id: 'banner-slide-5',
    order: 5,
    imageUrl: 'https://images.unsplash.com/photo-1589578527966-fdac0f44566c?auto=format&fit=crop&w=2000&q=85',
    altText: 'Adliye ve Dava Vekilliği Temsili',
    badge: 'DAVA VE YARGI SÜREÇLERİ',
    title: 'Mahkemelerde Güçlü ve Kararlı Temsil',
    description: 'Ceza, hukuk ve idari yargı alanlarında tüm duruşma ve kanun yolu süreçlerini adım adım takip ediyoruz.',
    buttonText: 'Hemen İletişime Geçin',
    buttonLink: 'contact'
  },
  {
    id: 'banner-slide-6',
    order: 6,
    imageUrl: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=2000&q=85',
    altText: 'İstanbul Finans ve İş Dünyası Silüeti',
    badge: 'KURUMSAL DANIŞMANLIK',
    title: 'İş Dünyasına Stratejik Hukuki Çözümler',
    description: 'Uluslararası standartlarda kurumsal şirket danışmanlığı, birleşme ve devralma süreçleri.',
    buttonText: 'Detaylı Bilgi',
    buttonLink: 'practices'
  },
  {
    id: 'banner-slide-7',
    order: 7,
    imageUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=2000&q=85',
    altText: 'Büyük Konferans ve Arabuluculuk Müzakere Odası',
    badge: 'ALTERNATİF UYUŞMAZLIK ÇÖZÜMLERİ',
    title: 'Uzlaşma, Arabuluculuk ve Tahkim',
    description: 'Uzun süren dava süreçleri yerine hızlı, ekonomik ve barışçıl müzakere yolları ile hak teslimi.',
    buttonText: 'Randevu Alın',
    buttonLink: 'contact'
  },
  {
    id: 'banner-slide-8',
    order: 8,
    imageUrl: 'https://images.unsplash.com/photo-1479142506502-19b3a3b7ff33?auto=format&fit=crop&w=2000&q=85',
    altText: 'İcra ve Alacak Takibi Hukuk Masası',
    badge: 'İCRA & İFLAS HUKUKU',
    title: 'Hızlı ve Etkin Alacak Tahsili',
    description: 'Bireysel ve kurumsal alacaklarınızın tahsili için profesyonel icra takibi ve ihtiyati haciz yönetimi.',
    buttonText: 'Uzmanlıklarımız',
    buttonLink: 'practices'
  },
  {
    id: 'banner-slide-9',
    order: 9,
    imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=2000&q=85',
    altText: 'Müvekkil İle Hukuki Değerlendirme Toplantısı',
    badge: 'MÜVEKKİL ODAKLI YAKLAŞIM',
    title: 'Her Müvekkilimize Özel Stratejik Yol Haritası',
    description: 'Dava ve danışmanlık dosyalarınızda düzenli raporlama ve kesintisiz iletişim güvencesi.',
    buttonText: 'Ekibimizi Tanıyın',
    buttonLink: 'team'
  },
  {
    id: 'banner-slide-10',
    order: 10,
    imageUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=2000&q=85',
    altText: 'Özel Hukuki Görüşme ve Temsil Salonu',
    badge: 'GÜVEN & ŞEFFAFLIK',
    title: 'Haklarınızı Güvenle Savunuyoruz',
    description: 'KIR HUKUK olarak hak ve adaletin tesisi için tüm yasal süreçlerde yanınızdayız.',
    buttonText: 'İletişim & Randevu',
    buttonLink: 'contact'
  }
];

export const HomeTopBannerSlider: React.FC = () => {
  const { navigate } = useCms();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Dokunmatik kaydırma (touch swipe) referansları
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);
  const totalSlides = defaultBannerSlides.length; // 10 adet görsel

  // Sonraki görsele geç (Sonsuz döngü)
  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % totalSlides);
  }, [totalSlides]);

  // Önceki görsele geç (Sonsuz döngü)
  const prevSlide = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Doğrudan belirli bir slayta git
  const goToSlide = (index: number) => {
    setCurrentIndex((index + totalSlides) % totalSlides);
  };

  // 4.5 saniyede bir otomatik geçiş (Kullanıcı etkileşimi yokken)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 4500);

    return () => clearInterval(timer);
  }, [nextSlide, isPaused]);

  // Dokunmatik olay işleyicileri (Mobil swipe desteği)
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsPaused(true);
    touchStartXRef.current = e.touches[0].clientX;
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current !== null && touchEndXRef.current !== null) {
      const distance = touchStartXRef.current - touchEndXRef.current;
      const minSwipeDistance = 45; // Kaydırma hassasiyeti (px)

      if (distance > minSwipeDistance) {
        // Sola kaydırma -> Sonraki görsel
        nextSlide();
      } else if (distance < -minSwipeDistance) {
        // Sağa kaydırma -> Önceki görsel
        prevSlide();
      }
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
    setIsPaused(false);
  };

  // Slayta tıklandığında yönlendirme
  const handleSlideClick = (slide: BannerSlide) => {
    if (slide.buttonLink) {
      navigate(slide.buttonLink);
    } else if (slide.linkUrl) {
      window.location.href = slide.linkUrl;
    }
  };

  // 10 görsel için kullanıcı isteği: "Alt kısımda 5 adet küçük pagination noktası bulunsun"
  // 10 görsel 5 pagination noktasına eşlenir: 0-1 -> dot 0, 2-3 -> dot 1, 4-5 -> dot 2, 6-7 -> dot 3, 8-9 -> dot 4
  const totalDots = 5;
  const activeDotIndex = Math.floor(currentIndex / 2);

  return (
    <section
      id="home-top-banner-slider"
      className="relative w-full px-4 sm:px-6 pt-20 sm:pt-24 md:pt-28 pb-2 sm:pb-3 bg-white"
      aria-label="Öne Çıkan Hukuki Görsel Carousel"
    >
      <div className="max-w-7xl mx-auto">
        {/* Kompakt, modern, köşeleri yuvarlatılmış banner çerçevesi */}
      <div
        className="group relative w-full h-[260px] sm:h-[300px] md:h-[350px] lg:h-[380px] rounded-2xl overflow-hidden bg-[#0B132B] border border-white/10 shadow-2xl select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 10 Adet Görsel Slaytı (Sıfır layout shift için mutlak konumlandırılmış) */}
        {defaultBannerSlides.map((slide, idx) => {
          const isActive = idx === currentIndex;

          return (
            <div
              key={slide.id}
              onClick={() => handleSlideClick(slide)}
              className={`absolute inset-0 w-full h-full transition-all duration-700 ease-out cursor-pointer ${
                isActive
                  ? 'opacity-100 scale-100 z-10 pointer-events-auto'
                  : 'opacity-0 scale-105 z-0 pointer-events-none'
              }`}
            >
              {/* Görsel: object-fit: cover mantığıyla container'a tam oturur */}
              <img
                src={slide.imageUrl}
                alt={slide.altText}
                className="w-full h-full object-cover object-center filter brightness-[0.82] contrast-[1.04]"
                loading={idx === 0 ? 'eager' : 'lazy'}
                referrerPolicy="no-referrer"
              />

              {/* Kurumsal koyu degrade katmanları: Yazıların netliği ve elit görünüm */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#080E1F]/95 via-[#0B132B]/45 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#080E1F]/85 via-transparent to-[#080E1F]/40 pointer-events-none" />

              {/* İleride başlık, açıklama ve buton ekleyebileceğiniz dinamik içerik katmanı */}
              <div className="absolute inset-0 p-4 sm:p-7 md:p-9 pb-12 sm:pb-14 md:pb-14 flex flex-col justify-end text-left z-20 pointer-events-none">
                <div className="max-w-2xl space-y-1.5 sm:space-y-2 pointer-events-auto">
                  {/* Badge */}
                  {slide.badge && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#0B132B]/85 backdrop-blur-md border border-[#C5A880]/40 text-[10px] sm:text-xs font-semibold text-[#C5A880] tracking-wider uppercase">
                      <ShieldCheck className="w-3 h-3 text-[#C5A880]" />
                      <span>{slide.badge}</span>
                    </div>
                  )}

                  {/* Başlık */}
                  {slide.title && (
                    <h2 className="text-base sm:text-2xl md:text-3xl font-bold font-serif-heading text-white tracking-normal leading-snug drop-shadow-md line-clamp-2">
                      {slide.title}
                    </h2>
                  )}

                  {/* Açıklama (Mobilde yer tasarrufu için 1 satır, geniş ekranlarda 2 satır) */}
                  {slide.description && (
                    <p className="text-[11px] sm:text-sm md:text-base text-slate-200 line-clamp-1 sm:line-clamp-2 max-w-xl font-normal drop-shadow-sm">
                      {slide.description}
                    </p>
                  )}

                  {/* Eylem Butonu */}
                  {slide.buttonText && (
                    <div className="pt-0.5 sm:pt-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSlideClick(slide);
                        }}
                        className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-xl gold-btn text-xs sm:text-sm font-semibold shadow-lg hover:scale-105 transition-transform cursor-pointer"
                      >
                        <span>{slide.buttonText}</span>
                        <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Masaüstü ve Geniş Ekranlar İçin Sol / Sağ Hızlı Geçiş Butonları */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          aria-label="Önceki Görsel"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-[#C5A880] text-white hover:text-[#0B132B] border border-white/20 backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 active:scale-90 shadow-xl cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          aria-label="Sonraki Görsel"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-[#C5A880] text-white hover:text-[#0B132B] border border-white/20 backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 active:scale-90 shadow-xl cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Sağ Üst Görsel Sayacı (1/10 formatında kompakt gösterge) */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-[11px] font-mono font-medium text-slate-200">
          <span className="text-[#C5A880] font-bold">{currentIndex + 1}</span> / {totalSlides}
        </div>

        {/* Alt Kısım: Kullanıcının İstediği 5 Adet Küçük Pagination Noktası (Yatay Ortalanmış) */}
        <div
          className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 p-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/15 shadow-lg"
          role="tablist"
          aria-label="Görsel Geçiş Noktaları"
        >
          {Array.from({ length: totalDots }).map((_, dotIdx) => {
            const isDotActive = dotIdx === activeDotIndex;

            return (
              <button
                key={`banner-dot-${dotIdx}`}
                type="button"
                role="tab"
                aria-selected={isDotActive}
                aria-label={`Görsel Grubu ${dotIdx + 1}`}
                onClick={(e) => {
                  e.stopPropagation();
                  // 5 nokta 10 görsele dağıtıldığı için ilgili görsel çiftinin ilkine gider
                  goToSlide(dotIdx * 2);
                }}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  isDotActive
                    ? 'w-6 sm:w-7 h-2 bg-gradient-to-r from-[#C5A880] via-[#e2cfb7] to-[#C5A880] shadow-[0_0_8px_rgba(197,168,128,0.7)]'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  </section>
  );
};
