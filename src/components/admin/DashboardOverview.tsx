import React from 'react';
import { useCms } from '../../context/CmsContext';
import {
  Scale,
  Users,
  FileText,
  Mail,
  PlusCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const {
    settings,
    practiceAreas,
    teamMembers,
    articles,
    contactMessages,
    setAdminTab,
    navigate
  } = useCms();

  const unreadMessages = contactMessages.filter(m => !m.isRead);

  const stats = [
    {
      title: 'Faaliyet Alanları',
      count: practiceAreas.length,
      active: practiceAreas.filter(p => p.isActive).length,
      icon: Scale,
      color: 'text-amber-400',
      tab: 'practices' as const
    },
    {
      title: 'Avukat & Ekip',
      count: teamMembers.length,
      active: teamMembers.filter(t => t.isActive).length,
      icon: Users,
      color: 'text-sky-400',
      tab: 'team' as const
    },
    {
      title: 'Makaleler',
      count: articles.length,
      active: articles.filter(a => a.isPublished).length,
      icon: FileText,
      color: 'text-emerald-400',
      tab: 'articles' as const
    },
    {
      title: 'Gelen Mesajlar',
      count: contactMessages.length,
      active: unreadMessages.length,
      activeLabel: 'Okunmamış',
      icon: Mail,
      color: 'text-rose-400',
      tab: 'messages' as const
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#1C2E4A] via-[#24375A] to-[#1C2E4A] border border-[#C5A880]/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C5A880]">
            <ShieldCheck className="w-4 h-4" />
            <span>KIR HUKUK Yönetim Portalı</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-heading text-white">
            Hoş Geldiniz, Yönetici
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Web sitenizin tüm içeriklerini, çalışma alanlarını, avukat kadrosunu, makaleleri ve gelen danışmanlık taleplerini buradan yönetebilirsiniz.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setAdminTab('articles')}
            className="px-4 py-2.5 rounded-xl gold-btn text-xs font-semibold flex items-center gap-2 shadow-lg"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Yeni Makale Ekle</span>
          </button>
          <button
            onClick={() => navigate('home')}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs font-medium"
          >
            Siteyi Canlıda Gör
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              onClick={() => setAdminTab(s.tab)}
              className="p-5 rounded-xl bg-[#1C2E4A] border border-white/10 hover:border-[#C5A880]/50 transition-all cursor-pointer group shadow-lg flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">{s.title}</span>
                <div className="w-8 h-8 rounded-lg bg-[#0B132B] flex items-center justify-center">
                  <Icon className={`w-4 h-4 ${s.color}`} />
                </div>
              </div>

              <div className="pt-4 pb-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold font-serif-heading text-white">
                  {s.count}
                </span>
                <span className="text-xs text-slate-400">
                  ({s.active} {s.activeLabel || 'Aktif'})
                </span>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-[#C5A880] group-hover:underline">
                <span>Modülü Yönet</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid: Recent Messages + Quick System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Messages */}
        <div className="lg:col-span-8 bg-[#1C2E4A] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold font-serif-heading text-white">
                Son Gelen Hukuki Danışma Formları
              </h3>
              <p className="text-xs text-slate-400">
                Müvekkiller tarafından web sitesi üzerinden iletilen mesajlar.
              </p>
            </div>
            <button
              onClick={() => setAdminTab('messages')}
              className="text-xs text-[#C5A880] hover:underline font-medium"
            >
              Tümünü Gör ({contactMessages.length})
            </button>
          </div>

          <div className="space-y-3">
            {contactMessages.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 bg-[#0B132B]/50 rounded-xl border border-white/5">
                Henüz gelen danışma formu bulunmuyor.
              </div>
            ) : (
              contactMessages.slice(0, 4).map(msg => {
                const dateStr = (msg.createdAt || msg.date || '').replace('T', ' ').slice(0, 16) || 'Bugün';
                return (
                  <div
                    key={msg.id}
                    onClick={() => setAdminTab('messages')}
                    className={`p-4 rounded-xl border transition-colors cursor-pointer flex items-start justify-between gap-4 ${
                      !msg.isRead
                        ? 'bg-[#0B132B] border-[#C5A880]/50'
                        : 'bg-[#0B132B]/50 border-white/5 hover:border-white/15'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">{msg.name || 'Ziyaretçi'}</span>
                        <span className="text-xs text-slate-400">• {msg.phone || 'Telefon Belirtilmedi'}</span>
                        {!msg.isRead && (
                          <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold">
                            YENİ
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#C5A880] font-medium">
                        {msg.subject || 'Genel Hukuki Danışma'} {msg.practiceArea ? `— (${msg.practiceArea})` : ''}
                      </p>
                      <p className="text-xs text-slate-300 line-clamp-1">{msg.message || ''}</p>
                    </div>

                    <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                      {dateStr}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Office Settings Quick Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#1C2E4A] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold font-serif-heading text-white">
              Büro İletişim Bilgileri
            </h3>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="p-2.5 rounded-lg bg-[#0B132B]/60 border border-white/5">
                <span className="text-slate-400 block text-[10px]">TELEFON</span>
                <span className="font-semibold text-white">{settings.phone}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0B132B]/60 border border-white/5">
                <span className="text-slate-400 block text-[10px]">WHATSAPP HATTI</span>
                <span className="font-semibold text-emerald-400">{settings.whatsappNumber}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0B132B]/60 border border-white/5">
                <span className="text-slate-400 block text-[10px]">E-POSTA</span>
                <span className="font-semibold text-white">{settings.email}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0B132B]/60 border border-white/5">
                <span className="text-slate-400 block text-[10px]">MESAİ SAATLERİ</span>
                <span className="font-semibold text-white">{settings.workingHours}</span>
              </div>
            </div>

            <button
              onClick={() => setAdminTab('settings')}
              className="w-full py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-colors"
            >
              Bilgileri Düzenle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
