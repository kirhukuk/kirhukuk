import React, { useState } from 'react';
import { X, Calculator, Scale, Percent, FileText, Check, ArrowRight } from 'lucide-react';

interface LegalToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LegalToolsModal: React.FC<LegalToolsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'kidem' | 'faiz' | 'harc'>('kidem');

  // Kıdem Tazminatı State
  const [startDate, setStartDate] = useState('2021-01-15');
  const [endDate, setEndDate] = useState('2026-06-30');
  const [grossSalary, setGrossSalary] = useState(35000);
  const [sideBenefits, setSideBenefits] = useState(3000); // Yemek, yol, prim
  const [kidemResult, setKidemResult] = useState<{
    totalGross: number;
    damgaVergisi: number;
    netKidem: number;
    totalYears: number;
  } | null>(null);

  // Faiz Hesaplama State
  const [principal, setPrincipal] = useState(100000);
  const [interestDays, setInterestDays] = useState(180);
  const [interestType, setInterestType] = useState<'yasal' | 'ticari'>('yasal'); // Yasal %24, Ticari %48
  const [faizResult, setFaizResult] = useState<{
    interestAmount: number;
    totalAmount: number;
    annualRate: number;
  } | null>(null);

  // Harç & Masraf State
  const [davaDegeri, setDavaDegeri] = useState(250000);
  const [harcResult, setHarcResult] = useState<{
    pesinHarc: number;
    basvuruHarci: number;
    giderAvansi: number;
    vekaletHarc: number;
    toplamMasraf: number;
  } | null>(null);

  if (!isOpen) return null;

  const calculateKidem = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.max(0, end.getTime() - start.getTime());
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const totalYears = totalDays / 365.25;

    if (totalYears < 1) {
      alert('1 yıldan az kıdem süresi için kıdem tazminatı doğmaz.');
      return;
    }

    const tavan2026 = 53919.88; // 2026 Kıdem Tavanı
    const giydirilmisBrut = Math.min(grossSalary + sideBenefits, tavan2026);
    const totalGross = giydirilmisBrut * totalYears;
    const damgaVergisi = totalGross * 0.00759; // Binde 7.59
    const netKidem = totalGross - damgaVergisi;

    setKidemResult({
      totalGross,
      damgaVergisi,
      netKidem,
      totalYears: Number(totalYears.toFixed(2))
    });
  };

  const calculateFaiz = () => {
    const rate = interestType === 'yasal' ? 24 : 48; // %24 yasal faiz, %48 ticari avans faizi
    const interestAmount = (principal * rate * (interestDays / 365)) / 100;
    const totalAmount = principal + interestAmount;

    setFaizResult({
      interestAmount,
      totalAmount,
      annualRate: rate
    });
  };

  const calculateHarc = () => {
    const nisbiOran = 0.06831; // Binde 68.31
    const pesinHarc = (davaDegeri * nisbiOran) / 4; // 1/4'ü peşin alınır
    const basvuruHarci = 650;
    const vekaletHarc = 120;
    const giderAvansi = 2500;
    const toplamMasraf = pesinHarc + basvuruHarci + vekaletHarc + giderAvansi;

    setHarcResult({
      pesinHarc,
      basvuruHarci,
      giderAvansi,
      vekaletHarc,
      toplamMasraf
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white text-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4.5 bg-[#0B132B] text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#B94A26] flex items-center justify-center text-white">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-serif-heading text-white leading-tight">
                Hukuki Hesaplama Araçları
              </h3>
              <p className="text-[11px] text-[#C5A880]">
                KIR HUKUK Pratik Hesaplama & Bilgilendirme Modülü
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

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('kidem')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'kidem'
                ? 'bg-white text-[#B94A26] border-[#B94A26] shadow-xs'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Kıdem Tazminatı</span>
          </button>

          <button
            onClick={() => setActiveTab('faiz')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'faiz'
                ? 'bg-white text-[#B94A26] border-[#B94A26] shadow-xs'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <Percent className="w-4 h-4" />
            <span>Yasal & Ticari Faiz</span>
          </button>

          <button
            onClick={() => setActiveTab('harc')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'harc'
                ? 'bg-white text-[#B94A26] border-[#B94A26] shadow-xs'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Dava Harç & Masraf</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-sm">
          {/* 1. Kıdem Tazminatı Tab */}
          {activeTab === 'kidem' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">İşe Giriş Tarihi</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#B94A26]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">İşten Çıkış Tarihi</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#B94A26]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Son Brüt Ücret (Aylık TL)</label>
                  <input
                    type="number"
                    value={grossSalary}
                    onChange={e => setGrossSalary(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#B94A26]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Düzenli Yan Haklar (Yol/Yemek/Prim TL)</label>
                  <input
                    type="number"
                    value={sideBenefits}
                    onChange={e => setSideBenefits(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#B94A26]"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={calculateKidem}
                className="w-full py-2.5 rounded-lg bg-[#B94A26] hover:bg-[#A33D1C] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Tazminatı Hesapla</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {kidemResult && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">Toplam Hizmet Süresi:</span>
                    <span className="font-bold text-slate-900">{kidemResult.totalYears} Yıl</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">Toplam Brüt Kıdem Tazminatı:</span>
                    <span className="font-bold text-slate-900">{kidemResult.totalGross.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} TL</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">Kesilecek Damga Vergisi (%0.759):</span>
                    <span className="font-bold text-rose-600">-{kidemResult.damgaVergisi.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} TL</span>
                  </div>
                  <div className="flex justify-between py-2 pt-2 text-sm text-[#B94A26] font-bold">
                    <span>Ödenecek Net Kıdem Tazminatı:</span>
                    <span>{kidemResult.netKidem.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} TL</span>
                  </div>
                  <p className="text-[10px] text-slate-500 italic mt-1">
                    * Hesaplama bilgilendirme amaçlıdır. Kıdem tavanı ve ek giydirilmiş menfaatler somut olaya göre avukat kontrolünde netleştirilmelidir.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 2. Faiz Hesaplama Tab */}
          {activeTab === 'faiz' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ana Para Tutarı (TL)</label>
                  <input
                    type="number"
                    value={principal}
                    onChange={e => setPrincipal(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#B94A26]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Geçen Gün Sayısı</label>
                  <input
                    type="number"
                    value={interestDays}
                    onChange={e => setInterestDays(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#B94A26]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Faiz Türü</label>
                  <select
                    value={interestType}
                    onChange={e => setInterestType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#B94A26]"
                  >
                    <option value="yasal">Yasal Faiz (%24 Yıllık)</option>
                    <option value="ticari">Ticari Avans Faizi (%48 Yıllık)</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={calculateFaiz}
                className="w-full py-2.5 rounded-lg bg-[#B94A26] hover:bg-[#A33D1C] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Faizi Hesapla</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {faizResult && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">Uygulanan Yıllık Faiz Oranı:</span>
                    <span className="font-bold text-slate-900">%{faizResult.annualRate}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">Hesaplanan Faiz Tutarı:</span>
                    <span className="font-bold text-slate-900">{faizResult.interestAmount.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} TL</span>
                  </div>
                  <div className="flex justify-between py-2 pt-2 text-sm text-[#B94A26] font-bold">
                    <span>Toplam Alacak (Ana Para + Faiz):</span>
                    <span>{faizResult.totalAmount.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} TL</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. Dava Harç & Masraf Tab */}
          {activeTab === 'harc' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Dava / Uyuşmazlık Değeri (TL)</label>
                <input
                  type="number"
                  value={davaDegeri}
                  onChange={e => setDavaDegeri(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#B94A26]"
                />
              </div>

              <button
                type="button"
                onClick={calculateHarc}
                className="w-full py-2.5 rounded-lg bg-[#B94A26] hover:bg-[#A33D1C] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Masrafları Hesapla</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {harcResult && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">Dava Açılış Başvuru Harcı:</span>
                    <span className="font-bold text-slate-900">{harcResult.basvuruHarci} TL</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">Peşin Nisbi Karar ve İlam Harcı (1/4):</span>
                    <span className="font-bold text-slate-900">{harcResult.pesinHarc.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} TL</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">Vekalet & Suret Harcı:</span>
                    <span className="font-bold text-slate-900">{harcResult.vekaletHarc} TL</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">Tahmini Mahkeme Gider Avansı:</span>
                    <span className="font-bold text-slate-900">{harcResult.giderAvansi} TL</span>
                  </div>
                  <div className="flex justify-between py-2 pt-2 text-sm text-[#B94A26] font-bold">
                    <span>Toplam Başlangıç Masrafı:</span>
                    <span>{harcResult.toplamMasraf.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} TL</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span>Detaylı hukuki mütalaa ve dava takibi için büromuzla iletişime geçebilirsiniz.</span>
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
