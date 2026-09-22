import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { Mail, MailOpen, Trash2, Phone, MessageSquare, Search, RefreshCw, Database, Smartphone, Globe } from 'lucide-react';
import { ContactMessage } from '../../types';

export const MessagesTab: React.FC = () => {
  const { contactMessages, markMessageRead, deleteMessage, refreshFirebaseMessages, isFirebaseConnected } = useCms();

  const [activeMessage, setActiveMessage] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [search, setSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshStatus, setRefreshStatus] = useState<string | null>(null);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    setRefreshStatus('Firebase kontrol ediliyor...');
    try {
      await refreshFirebaseMessages();
      setRefreshStatus('Firebase verileri güncellendi!');
      setTimeout(() => setRefreshStatus(null), 3000);
    } catch {
      setRefreshStatus('Bağlantı hatası.');
      setTimeout(() => setRefreshStatus(null), 3000);
    } finally {
      setIsRefreshing(false);
    }
  };

  const filtered = contactMessages.filter(m => {
    const matchFilter =
      filter === 'all' ? true : filter === 'unread' ? !m.isRead : m.isRead;
    const matchSearch =
      m.name.toLocaleLowerCase('tr-TR').includes(search.toLocaleLowerCase('tr-TR')) ||
      m.email.toLocaleLowerCase('tr-TR').includes(search.toLocaleLowerCase('tr-TR')) ||
      m.subject.toLocaleLowerCase('tr-TR').includes(search.toLocaleLowerCase('tr-TR')) ||
      m.message.toLocaleLowerCase('tr-TR').includes(search.toLocaleLowerCase('tr-TR'));
    return matchFilter && matchSearch;
  });

  const handleSelectMessage = (msg: ContactMessage) => {
    setActiveMessage(msg);
    if (!msg.isRead) {
      markMessageRead(msg.id);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold font-serif-heading text-white">
              Gelen Danışma Mesajları ({contactMessages.length})
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <Database className="w-3 h-3" />
              <span>Firebase: kir-hukuk</span>
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Mobil cihazlar ve masaüstü web sitesi üzerinden iletilen tüm mesajlar doğrudan Firebase Firestore veritabanı ile eşzamanlıdır.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {refreshStatus && (
            <span className="text-xs text-emerald-400 font-medium animate-in fade-in duration-150">
              {refreshStatus}
            </span>
          )}
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="px-3.5 py-2 rounded-xl bg-[#1C2E4A] hover:bg-[#253d61] text-xs font-semibold text-[#C5A880] border border-[#C5A880]/30 flex items-center gap-2 transition-all shadow-sm active:scale-95 disabled:opacity-50"
            title="Firebase Firestore ile anında eşitle"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Eşitleniyor...' : "Firebase'den Yenile"}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Mesajlarda, isimde veya telefonda ara..."
            className="w-full pl-9 pr-3 py-2 bg-[#1C2E4A] border border-white/10 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#C5A880]"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === 'all'
                ? 'bg-[#C5A880] text-[#0B132B] font-bold'
                : 'bg-[#1C2E4A] text-slate-300 hover:text-white border border-white/10'
            }`}
          >
            Tümü ({contactMessages.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === 'unread'
                ? 'bg-rose-500 text-white font-bold'
                : 'bg-[#1C2E4A] text-slate-300 hover:text-white border border-white/10'
            }`}
          >
            Okunmamış ({contactMessages.filter(m => !m.isRead).length})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === 'read'
                ? 'bg-[#C5A880] text-[#0B132B] font-bold'
                : 'bg-[#1C2E4A] text-slate-300 hover:text-white border border-white/10'
            }`}
          >
            Okunmuş ({contactMessages.filter(m => m.isRead).length})
          </button>
        </div>
      </div>

      {/* Grid: Message List + Message Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Messages List Column */}
        <div className="lg:col-span-5 bg-[#1C2E4A] border border-white/10 rounded-2xl overflow-hidden shadow-xl max-h-[700px] flex flex-col">
          <div className="p-3 bg-[#0B132B]/80 border-b border-white/5 flex items-center justify-between text-xs font-bold text-white uppercase tracking-wider">
            <span>Gelen Kutusu ({filtered.length})</span>
            <span className="text-[10px] text-slate-400 lowercase font-normal">canlı veritabanı</span>
          </div>

          <div className="divide-y divide-white/5 overflow-y-auto custom-scrollbar flex-1">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                <Database className="w-6 h-6 mx-auto opacity-30" />
                <p>Henüz mesaj bulunamadı veya arama kriterine uygun kayıt yok.</p>
              </div>
            ) : (
              filtered.map(msg => (
                <div
                  key={msg.id}
                  onClick={() => handleSelectMessage(msg)}
                  className={`p-4 cursor-pointer transition-colors ${
                    activeMessage?.id === msg.id
                      ? 'bg-[#0B132B] border-l-4 border-[#C5A880]'
                      : 'hover:bg-white/5'
                  } ${!msg.isRead ? 'font-semibold text-white' : 'text-slate-300'}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {!msg.isRead && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                      )}
                      <span className="text-xs text-white font-medium">{msg.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {msg.source?.includes('Mobil') ? (
                        <span className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300 font-normal">
                          <Smartphone className="w-2.5 h-2.5" /> Mobil
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded bg-slate-500/10 text-slate-400 font-normal">
                          <Globe className="w-2.5 h-2.5" /> Web
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 font-mono">
                        {(msg.createdAt || msg.date || '').replace('T', ' ').slice(0, 10) || 'Bugün'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#C5A880] mt-1 truncate">{msg.subject || 'Genel Başvuru'}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{msg.message || ''}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Selected Message Reader Column */}
        <div className="lg:col-span-7 bg-[#1C2E4A] border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          {activeMessage ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#C5A880]/20 text-[#C5A880] text-xs font-semibold">
                      {activeMessage.practiceArea || 'Genel Hukuki Danışma'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {(activeMessage.createdAt || activeMessage.date || '').replace('T', ' ').slice(0, 16) || 'Bugün'}
                    </span>
                    {activeMessage.firestoreId && (
                      <span className="text-[10px] text-emerald-400/90 font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                        Firebase ID: {activeMessage.firestoreId.slice(0, 12)}...
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white font-serif-heading">
                    {activeMessage.subject}
                  </h3>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => markMessageRead(activeMessage.id)}
                    className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
                    title={activeMessage.isRead ? 'Okunmadı Yap' : 'Okundu Yap'}
                  >
                    {activeMessage.isRead ? (
                      <Mail className="w-4 h-4" />
                    ) : (
                      <MailOpen className="w-4 h-4 text-emerald-400" />
                    )}
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('Bu mesajı silmek istediğinize emin misiniz? Hem sistemden hem Firebase veritabanından silinecektir.')) {
                        deleteMessage(activeMessage.id);
                        setActiveMessage(null);
                      }
                    }}
                    className="p-2 rounded-lg text-rose-400 hover:text-rose-200 hover:bg-rose-500/10"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Sender Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-[#0B132B]/60 border border-white/5 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">MÜVEKKİL ADI</span>
                  <span className="font-semibold text-white">{activeMessage.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">TELEFON NUMARASI</span>
                  <a href={`tel:${activeMessage.phone}`} className="font-semibold text-[#C5A880] hover:underline">
                    {activeMessage.phone || 'Belirtilmedi'}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">E-POSTA ADRESİ</span>
                  <a href={`mailto:${activeMessage.email}`} className="font-semibold text-white hover:underline">
                    {activeMessage.email || 'Belirtilmedi'}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">GÖNDERİLDİĞİ ORTAM</span>
                  <span className="font-semibold text-white flex items-center gap-1">
                    {activeMessage.source?.includes('Mobil') ? (
                      <>
                        <Smartphone className="w-3.5 h-3.5 text-blue-400" /> Mobil Cihaz
                      </>
                    ) : (
                      <>
                        <Globe className="w-3.5 h-3.5 text-emerald-400" /> Web Sitesi Formu
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Message Body */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Mesaj İçeriği:
                </span>
                <div className="p-4 rounded-xl bg-[#0B132B] border border-white/5 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {activeMessage.message || 'Detaylı açıklama belirtilmemiş.'}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-3">
                {activeMessage.phone && (
                  <a
                    href={`tel:${activeMessage.phone}`}
                    className="px-4 py-2 rounded-xl gold-btn text-xs font-semibold flex items-center gap-2 shadow"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Telefonla Ara</span>
                  </a>
                )}

                {activeMessage.phone && (
                  <a
                    href={`https://wa.me/${activeMessage.phone.replace(/[^0-9]/g, '')}?text=Merhaba%20${encodeURIComponent(activeMessage.name)},%20KIR%20HUKUK%20Bürosu'na%20iletmiş%20olduğunuz%20danışma%20talebiniz%20hakkında%20ulaşıyoruz.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 shadow"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp'tan Yaz</span>
                  </a>
                )}

                {activeMessage.email && (
                  <a
                    href={`mailto:${activeMessage.email}?subject=KIR%20HUKUK%20-%20Hukuki%20Danışma%20Yanıtı`}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium flex items-center gap-2 border border-white/10"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>E-Posta Gönder</span>
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 space-y-2">
              <Mail className="w-8 h-8 opacity-30" />
              <p className="text-xs">Detaylarını görüntülemek için soldan bir mesaj seçin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
