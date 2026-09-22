import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { Download, Upload, RotateCcw, Database, ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';

export const BackupTab: React.FC = () => {
  const { exportData, importData, resetToDefault } = useCms();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleExport = () => {
    const jsonString = exportData();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kir-hukuk-cms-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setSuccessMsg('Tüm site verileri ve ayarları JSON dosyası olarak bilgisayarınıza indirildi.');
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const content = event.target?.result as string;
        const res = importData(content);
        if (res) {
          setSuccessMsg('Yedek dosyası başarıyla yüklendi! Sayfa yenileniyor...');
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          setErrorMsg('Geçersiz yedek dosyası formatı.');
        }
      } catch (err) {
        setErrorMsg('Dosya okunurken bir hata oluştu.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (
      confirm(
        'DİKKAT: Tüm veriler orijinal "KIR HUKUK" varsayılan ayarlarına sıfırlanacaktır. Devam etmek istiyor musunuz?'
      )
    ) {
      resetToDefault();
      setSuccessMsg('Sistem fabrika ayarlarına sıfırlandı.');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold font-serif-heading text-white">
            Sistem Veritabanı & Yedekleme Yönetimi
          </h2>
          <p className="text-xs text-slate-400">
            Tüm içeriklerinizi, avukat listelerini, makaleleri ve ayarları tek tıkla yedekleyin veya geri yükleyin.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 flex items-center gap-2 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 flex items-center gap-2 text-xs">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Cloud & Local Persistence Status */}
      <div className="bg-[#1C2E4A] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0B132B] border border-[#C5A880]/40 flex items-center justify-center text-[#C5A880]">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-serif-heading">
              Veri Saklama & Yayın Durumu
            </h3>
            <p className="text-xs text-slate-400">
              Gerçek zamanlı yerel kalıcılık aktif. Yapılan tüm değişiklikler anında kaydedilmektedir.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-[#0B132B] border border-white/5 space-y-1">
            <span className="text-[10px] text-[#C5A880] uppercase tracking-wider font-semibold">
              Kalıcı Tarayıcı Depolaması
            </span>
            <p className="text-xs text-slate-300">
              Tüm CMS kayıtları (makaleler, ayarlar, ekip, mesajlar) yerel belleğe şifreli ve senkronize yazılır.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0B132B] border border-white/5 space-y-1">
            <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">
              Firebase & Cloud Ready
            </span>
            <p className="text-xs text-slate-300">
              `src/lib/firebase.ts` ve `firestore.rules` yapılandırması hazırdır; canlı ortama bulut dağıtımına tam uyumludur.
            </p>
          </div>
        </div>
      </div>

      {/* Export & Import Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export */}
        <div className="bg-[#1C2E4A] border border-white/10 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-xl">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#0B132B] border border-white/10 flex items-center justify-center text-[#C5A880]">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-serif-heading">
              Yedek Dosyası İndir (JSON)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Sitedeki tüm avukat profillerini, makaleleri, çalışma alanlarını, iletişim ayarlarını ve mesajları tek bir JSON dosyası olarak indirir.
            </p>
          </div>

          <button
            onClick={handleExport}
            className="w-full py-3 rounded-xl gold-btn text-xs font-bold flex items-center justify-center gap-2 shadow-lg"
          >
            <Download className="w-4 h-4" />
            <span>Yedeği İndir (.json)</span>
          </button>
        </div>

        {/* Import */}
        <div className="bg-[#1C2E4A] border border-white/10 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-xl">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#0B132B] border border-white/10 flex items-center justify-center text-sky-400">
              <Upload className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-serif-heading">
              Yedekten Geri Yükle (JSON)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Daha önce bilgisayarınıza indirdiğiniz `.json` yedek dosyasını yükleyerek tüm site verilerini anında geri yükleyebilirsiniz.
            </p>
          </div>

          <label className="w-full py-3 rounded-xl bg-[#0B132B] hover:bg-white/10 border border-white/15 text-xs font-semibold text-white flex items-center justify-center gap-2 cursor-pointer transition-colors shadow">
            <Upload className="w-4 h-4 text-[#C5A880]" />
            <span>Yedek Dosyası Seç</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Factory Reset Card */}
      <div className="bg-[#1C2E4A] border border-rose-500/30 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-serif-heading">
              Varsayılan Verilere Sıfırla (Fabrika Ayarları)
            </h3>
            <p className="text-xs text-slate-300">
              Yapılan tüm değişiklikleri silip büro bilgilerini, 11 çalışma alanını ve avukat kadrosunu orijinal haline döndürür.
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleReset}
            className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors shadow-lg"
          >
            Varsayılana Sıfırla
          </button>
        </div>
      </div>
    </div>
  );
};
