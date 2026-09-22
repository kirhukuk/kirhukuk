import React, { useState } from 'react';
import { X, FileText, Copy, Check, ArrowRight } from 'lucide-react';

interface PetitionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PetitionItem {
  id: string;
  title: string;
  category: string;
  desc: string;
  template: string;
}

const petitionTemplates: PetitionItem[] = [
  {
    id: 'pet-1',
    title: 'İşçi Kıdem & İhbar Tazminatı Talep İhtarnamesi',
    category: 'İş Hukuku',
    desc: 'İş akdi haksız veya haklı nedenle feshedilen işçinin noter kanalıyla kıdem, ihbar ve fazla mesai alacaklarını talep etmesi için örnek ihtarname metni.',
    template: `İHTARNAME

İHTAR EDEN: [Adınız Soyadınız] (TC: [TC Numaranız])
ADRES: [Adresiniz]
VEKİLİ: Av. [Avukat Adı] - KIR Hukuk & Danışmanlık Bürosu

MUHATAP: [İşveren Şirket Unvanı]
ADRES: [Şirket Adresi]

KONU: Kıdem ve ihbar tazminatı ile ödenmeyen işçilik alacaklarının (fazla mesai, yıllık izin, AGİ, UBGT) ödenmesi talebidir.

AÇIKLAMALAR:
1. Müvekkil, [İşe Başlama Tarihi] - [İşten Ayrılma Tarihi] tarihleri arasında nezdinizde [Görev Unvanı] unvanıyla çalışmıştır.
2. Müvekkilin iş akdi, 4857 sayılı İş Kanunu hükümlerine aykırı olarak haksız şekilde feshedilmiş olup, kanundan doğan yasal tazminatları tarafına ödenmemiştir.
3. Fazla mesai ücretleri ile hak edilen yıllık ücretli izin alacakları bordrolara yansıtılmamış ve banka hesabına yatırılmamıştır.

SONUÇ VE İSTEM: Fazlaya ilişkin haklarımız saklı kalmak kaydıyla, hak edilen kıdem tazminatı, ihbar tazminatı ve diğer işçilik alacaklarının işbu ihtarnamenin tebliğinden itibaren 3 (üç) gün içinde aşağıda belirtilen IBAN hesabına ödenmesini; aksi takdirde arabuluculuk yoluna ve akabinde İş Mahkemesi nezdinde dava açılacağını, yargılama giderleri ve vekalet ücretinin tarafınıza yükleneceğini ihtaren bildiririz.

HESAP BİLGİLERİ: [Banka Adı - IBAN]
İhtar Eden / Vekili`
  },
  {
    id: 'pet-2',
    title: 'Anlaşmalı Boşanma Protokolü Örneği',
    category: 'Aile Hukuku',
    desc: 'Türk Medeni Kanunu 166/3 uyarınca eşlerin velayet, nafaka, maddi-manevi tazminat ve mal paylaşımında uzlaştığı resmi protokol örneği.',
    template: `ANLAŞMALI BOŞANMA PROTOKOLÜ

TARAFLAR:
1. [Eş 1 Adı Soyadı] (TC: [TC No])
2. [Eş 2 Adı Soyadı] (TC: [TC No])

Taraflar, evlilik birliğinin temelinden sarsılması nedeniyle Türk Medeni Kanunu'nun 166/3. maddesi gereğince serbest iradeleriyle boşanmaya karar vermiş olup aşağıdaki şartlarda tam bir mutabakata varmışlardır:

MADDE 1 - BOŞANMA HUSUSU:
Taraflar müşterek evlilik birliğinin sona erdirilmesi hususunda karşılıklı olarak anlaşmışlardır.

MADDE 2 - VELAYET VE KİŞİSEL İLİŞKİ:
Müşterek çocuk/çocuklar [Çocuğun Adı] velayeti [Anneye/Babaya] bırakılacaktır. Diğer taraf ile çocuk arasında [Görüşme günleri/saatleri] kişisel ilişki kurulacaktır.

MADDE 3 - İŞTİRAK VE YOKSULLUK NAFAKASI:
Çocuk için aylık [Tutar] TL iştirak nafakası ödenecektir. Tarafların birbirlerinden yoksulluk nafakası talebi bulunmamaktadır.

MADDE 4 - MADDİ VE MANEVİ TAZMİNAT:
Tarafların birbirinden geçmişe veya geleceğe dönük maddi ya da manevi tazminat talebi yoktur.

MADDE 5 - EV EŞYALARI VE MAL PAYLAŞIMI:
Kişisel ve müşterek eşyalar taraflarca rızaen paylaşılmış olup hiçbir hak ve alacak kalmamıştır.

İşbu protokol 5 maddeden ibaret olup mahkemeye sunulmak üzere imza altına alınmıştır.
[Tarih]
Eş 1 İmza                  Eş 2 İmza`
  },
  {
    id: 'pet-3',
    title: 'İcra Takibine ve Borca İtiraz Dilekçesi',
    category: 'İcra & İflas Hukuku',
    desc: 'İlamsız icra takiplerinde (Örnek No: 7) 7 günlük yasal süre içerisinde icra dairesine sunulan yetki ve borca itiraz dilekçesi.',
    template: `İSTANBUL [X]. İCRA MÜDÜRLÜĞÜ'NE

DOSYA NO: [2026/.... Esas]

BORCA İTİRAZ EDEN: [Adınız Soyadınız] (TC: [TC Numaranız])
ADRES: [Adresiniz]
VEKİLİ: Av. [Avukat Adı] - KIR Hukuk Bürosu

ALACAKLI: [Alacaklı Kişi veya Şirket Adı]
VEKİLİ: [Alacaklı Vekili]

KONU: Ödeme emrine, borca, faize ve tüm ferilerine yasal süresi içinde itirazımızdır.

AÇIKLAMALAR:
1. Müdürlüğünüzün yukarıda esas numarası yazılı dosyasından tarafıma gönderilen [Örnek No: 7] İlamsız Takiplerde Ödeme Emri [Tebliğ Tarihi] tarihinde tebliğ edilmiştir. Yasal 7 günlük süre içerisinde itirazlarımızı sunuyoruz.
2. Alacaklı tarafa herhangi bir borcum bulunmamaktadır. Bu nedenle takibe konu asıl alacağa, faiz oranına, işletilen işlemiş faize ve takibin tüm ferilerine açıkça itiraz ediyorum.
3. Takip yetkisiz icra dairesinde açılmış olup, İcra İflas Kanunu uyarınca yerleşim yeri icra daireleri yetkili olduğundan ayrıca YETKİ İTİRAZINDA da bulunuyoruz.

SONUÇ VE İSTEM: Yukarıda arz edilen nedenlerle, takibe, borca, faize ve yetkiye itirazımın kabulü ile hakkımda başlatılan icra takibinin İİK m. 62 gereğince DURDURULMASINA karar verilmesini saygılarımla arz ve talep ederim. [Tarih]

İtiraz Eden Borçlu / Vekili`
  }
];

export const PetitionsModal: React.FC<PetitionsModalProps> = ({ isOpen, onClose }) => {
  const [selectedPet, setSelectedPet] = useState<PetitionItem>(petitionTemplates[0]);
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedPet.template);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white text-slate-800 w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4.5 bg-[#0B132B] text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#B94A26] flex items-center justify-center text-white">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-serif-heading text-white leading-tight">
                Hukuki Dilekçe & İhtarname Örnekleri
              </h3>
              <p className="text-[11px] text-[#C5A880]">
                KIR HUKUK Pratik Taslak & Form Kütüphanesi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
          {/* Sidebar: List of Petitions */}
          <div className="md:col-span-4 border-r border-slate-200 bg-slate-50 p-4 space-y-2 overflow-y-auto max-h-[250px] md:max-h-full">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2 mb-2">
              Kategoriler & Taslaklar
            </p>
            {petitionTemplates.map(pet => (
              <button
                key={pet.id}
                onClick={() => setSelectedPet(pet)}
                className={`w-full text-left p-3 rounded-xl text-xs transition-all flex flex-col gap-1 border ${
                  selectedPet.id === pet.id
                    ? 'bg-white border-[#B94A26] text-[#B94A26] font-semibold shadow-xs'
                    : 'bg-white/70 border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <span className="text-[10px] text-slate-500 uppercase">{pet.category}</span>
                <span className="line-clamp-2 leading-tight">{pet.title}</span>
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="md:col-span-8 p-6 overflow-y-auto flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-200">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#B94A26]/10 text-[#B94A26] text-[10px] font-semibold">
                    {selectedPet.category}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-1">
                    {selectedPet.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {selectedPet.desc}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCopy}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                    isCopied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#B94A26] hover:bg-[#A33D1C] text-white shadow-xs'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Kopyalandı</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Metni Kopyala</span>
                    </>
                  )}
                </button>
              </div>

              {/* Text Area / Preview */}
              <div className="mt-4 p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed overflow-x-auto max-h-[340px] whitespace-pre-wrap select-all">
                {selectedPet.template}
              </div>
            </div>

            <p className="text-[11px] text-slate-500 italic border-t border-slate-200 pt-3">
              * Dilekçe ve ihtarnameler somut uyuşmazlığın şartlarına göre farklılık gösterebilir. Hukuki hak kaybına uğramamak adına avukat incelemesi tavsiye edilir.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span>KIR Hukuk Bürosu Resmi Dokümantasyon Taslakları</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
