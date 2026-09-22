import React, { useState, useEffect, useRef } from 'react';
import { useCms } from '../../context/CmsContext';
import { Search, X, Scale, FileText, HelpCircle, Bell, ArrowRight, UserCheck } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    practiceAreas,
    articles,
    faqItems,
    announcements,
    teamMembers,
    customPages,
    navigate
  } = useCms();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  // Turkish character insensitive comparison
  const normalizeTr = (text: string) => {
    return text
      .toLocaleLowerCase('tr-TR')
      .replace(/ı/g, 'i')
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c');
  };

  const cleanQ = normalizeTr(query.trim());

  const matchedPractices = cleanQ
    ? practiceAreas.filter(p => normalizeTr(p.title + ' ' + p.shortDesc).includes(cleanQ))
    : [];

  const matchedArticles = cleanQ
    ? articles.filter(a => normalizeTr(a.title + ' ' + a.summary + ' ' + a.category).includes(cleanQ))
    : [];

  const matchedFaq = cleanQ
    ? faqItems.filter(f => normalizeTr(f.question + ' ' + f.answer).includes(cleanQ))
    : [];

  const matchedAnnouncements = cleanQ
    ? announcements.filter(an => normalizeTr(an.title + ' ' + an.content).includes(cleanQ))
    : [];

  const matchedTeam = cleanQ
    ? teamMembers.filter(t => normalizeTr(t.name + ' ' + t.title + ' ' + t.specializations.join(' ')).includes(cleanQ))
    : [];

  const matchedPages = cleanQ
    ? customPages.filter(p => normalizeTr(p.title + ' ' + p.content).includes(cleanQ))
    : [];

  const totalMatches =
    matchedPractices.length +
    matchedArticles.length +
    matchedFaq.length +
    matchedAnnouncements.length +
    matchedTeam.length +
    matchedPages.length;

  const handleSelect = (action: () => void) => {
    setIsSearchOpen(false);
    action();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 p-4 animate-in fade-in duration-150">
      <div className="bg-[#1C2E4A] border border-[#C5A880]/40 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden text-slate-100 animate-in slide-in-from-top-4 duration-200">
        {/* Search Input Box */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3 relative">
          <Search className="w-5 h-5 text-[#C5A880] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Hukuk alanı, makale, avukat veya soru arayın... (Örn: Boşanma, Kıdem, İcra)"
            className="w-full bg-transparent border-none text-white placeholder-slate-400 focus:outline-none text-base"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-white text-xs px-2 py-1 bg-white/5 rounded"
            >
              Temizle
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results / Suggestions */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-5">
          {!cleanQ && (
            <div className="py-6 text-center text-slate-400 space-y-3">
              <p className="text-xs uppercase tracking-wider text-[#C5A880]">Popüler Arama Konuları</p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {['Ceza Hukuku', 'Kıdem Tazminatı', 'Boşanma Protokolü', 'Tahliye Davası', 'Tenkis', 'Av. Abidin KIR'].map(
                  (tag, i) => (
                    <button
                      key={i}
                      onClick={() => setQuery(tag)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#C5A880]/20 hover:text-[#C5A880] border border-white/5 text-xs text-slate-300 transition-colors"
                    >
                      {tag}
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {cleanQ && totalMatches === 0 && (
            <div className="py-12 text-center text-slate-400">
              <HelpCircle className="w-10 h-10 text-slate-500 mx-auto mb-3" />
              <p className="text-base text-slate-200">"{query}" ile ilgili eşleşen sonuç bulunamadı.</p>
              <p className="text-xs text-slate-400 mt-1">Lütfen farklı anahtar kelimelerle tekrar deneyiniz veya doğrudan bizimle iletişime geçiniz.</p>
            </div>
          )}

          {/* Practice Areas */}
          {matchedPractices.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-[#C5A880] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5" />
                Çalışma Alanları ({matchedPractices.length})
              </h4>
              <div className="space-y-1.5">
                {matchedPractices.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(() => navigate('practice-detail', item.slug))}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <p className="text-sm font-semibold text-white group-hover:text-[#C5A880]">{item.title}</p>
                      <p className="text-xs text-slate-300 line-clamp-1">{item.shortDesc}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#C5A880] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Articles */}
          {matchedArticles.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-[#C5A880] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Makaleler ({matchedArticles.length})
              </h4>
              <div className="space-y-1.5">
                {matchedArticles.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(() => navigate('article-detail', item.slug))}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <p className="text-sm font-semibold text-white group-hover:text-[#C5A880]">{item.title}</p>
                      <p className="text-xs text-slate-300 line-clamp-1">{item.summary}</p>
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0 px-2 py-0.5 bg-white/5 rounded">
                      {item.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Team Members */}
          {matchedTeam.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-[#C5A880] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5" />
                Avukatlarımız ({matchedTeam.length})
              </h4>
              <div className="space-y-1.5">
                {matchedTeam.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(() => navigate('team-detail', item.id))}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-3 group"
                  >
                    <img
                      src={item.photo}
                      alt={item.name}
                      className="w-9 h-9 rounded-full object-cover border border-[#C5A880]/30"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <p className="text-sm font-semibold text-white group-hover:text-[#C5A880]">{item.name}</p>
                      <p className="text-xs text-slate-300">{item.title} — {item.specializations.slice(0, 2).join(', ')}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* FAQs */}
          {matchedFaq.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-[#C5A880] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                Sık Sorulan Sorular ({matchedFaq.length})
              </h4>
              <div className="space-y-1.5">
                {matchedFaq.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(() => navigate('faq'))}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-white/10 transition-colors block"
                  >
                    <p className="text-sm font-medium text-white">{item.question}</p>
                    <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">{item.answer}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Announcements */}
          {matchedAnnouncements.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-[#C5A880] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5" />
                Duyurular ({matchedAnnouncements.length})
              </h4>
              <div className="space-y-1.5">
                {matchedAnnouncements.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(() => navigate('announcements'))}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-white/10 transition-colors block"
                  >
                    <p className="text-sm font-medium text-white">{item.title}</p>
                    <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">{item.content}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#0B132B]/80 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
          <span>Toplam {totalMatches} sonuç</span>
          <span>Çıkış için <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px]">ESC</kbd> tuşuna basın</span>
        </div>
      </div>
    </div>
  );
};
