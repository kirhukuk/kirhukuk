import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { ChevronDown, HelpCircle, Search, ShieldAlert, ArrowRight } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const { faqItems, navigate } = useCms();
  const [openId, setOpenId] = useState<string | null>(faqItems[0]?.id || null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const activeFaqs = faqItems.filter(f => f.isActive);
  const categories = ['all', ...Array.from(new Set(activeFaqs.map(f => f.category)))];

  const filteredFaqs = activeFaqs.filter(item => {
    const matchesCat = filterCategory === 'all' || item.category === filterCategory;
    const matchesSearch =
      searchQuery === '' ||
      item.question.toLocaleLowerCase('tr-TR').includes(searchQuery.toLocaleLowerCase('tr-TR')) ||
      item.answer.toLocaleLowerCase('tr-TR').includes(searchQuery.toLocaleLowerCase('tr-TR'));
    return matchesCat && matchesSearch;
  });

  return (
    <section id="faq-section" className="py-10 sm:py-14 px-4 sm:px-6 bg-[#080E1F] relative">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1C2E4A] border border-[#C5A880]/30 text-xs text-[#C5A880] font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Merak Edilenler</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif-heading text-white tracking-normal leading-[1.25]">
            Sık Sorulan Sorular
          </h2>
          <p className="text-slate-300 text-sm max-w-2xl mx-auto leading-relaxed">
            Müvekkillerimizin avukatlık ve hukuki süreçlerle ilgili en çok sorduğu soruların yanıtları.
          </p>
        </div>

        {/* Search & Categories Bar */}
        <div className="space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="w-4 h-4 text-[#C5A880] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Sorularda arayın (Örn: ücret, boşanma, vekaletname)..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#1C2E4A] border border-white/10 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#C5A880]"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filterCategory === cat
                    ? 'bg-[#C5A880] text-[#0B132B] font-semibold shadow-md'
                    : 'bg-[#1C2E4A] text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                {cat === 'all' ? 'Tüm Sorular' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="p-8 text-center text-slate-400 bg-[#1C2E4A] rounded-xl border border-white/5">
              Aradığınız kriterlere uygun soru bulunamadı.
            </div>
          ) : (
            filteredFaqs.map(item => {
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  id={`faq-item-${item.id}`}
                  className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'bg-[#1C2E4A] border-[#C5A880]/50 shadow-md'
                      : 'bg-[#1C2E4A]/60 border-white/5 hover:border-white/15'
                  }`}
                >
                  <button
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-white/5 text-[#C5A880] text-xs font-semibold flex items-center justify-center shrink-0 border border-white/10">
                        ?
                      </span>
                      <span className="text-base font-semibold text-white group-hover:text-[#C5A880] transition-colors">
                        {item.question}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#C5A880]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 border-t border-white/5 text-sm text-slate-300 leading-relaxed animate-in fade-in duration-150">
                      <p>{item.answer}</p>
                      <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                        <span>Kategori: {item.category}</span>
                        <button
                          onClick={() => navigate('contact')}
                          className="text-[#C5A880] hover:underline"
                        >
                          Özel durumunuzu danışın →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Legal Disclaimer Box */}
        <div className="p-4 rounded-xl bg-[#0B132B] border border-amber-500/20 text-xs text-slate-300 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong>Önemli Yasal Hatırlatma:</strong> Bu sayfada yer alan sorular ve yanıtlar yalnızca genel bilgilendirme amacıyla hazırlanmıştır. Somut olayın kendine has özellikleri, delil durumu ve zamanaşımı süreleri sebebiyle hukuki durumunuz hakkında mutlaka bir avukata danışmanız tavsiye edilir.
          </p>
        </div>
      </div>
    </section>
  );
};
