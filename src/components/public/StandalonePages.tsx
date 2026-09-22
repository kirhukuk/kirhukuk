import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import {
  Scale,
  ArrowRight,
  User,
  Calendar,
  Clock,
  Search,
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  Send,
  HelpCircle,
  Bell,
  CheckCircle2,
  FileText,
  Users,
  Building2,
  Share2,
  Navigation,
  ExternalLink,
  Edit2
} from 'lucide-react';

/* =========================================================================
   1. PRACTICES PAGE (BEYAZ SAYFA)
   ========================================================================= */
export const PracticesPage: React.FC = () => {
  const { practiceAreas, navigate, navigateToAdmin } = useCms();
  const [searchTerm, setSearchTerm] = useState('');

  const activeAreas = practiceAreas.filter(p => p.isActive);
  const filtered = activeAreas.filter(p =>
    p.title.toLocaleLowerCase('tr-TR').includes(searchTerm.toLocaleLowerCase('tr-TR')) ||
    p.shortDesc.toLocaleLowerCase('tr-TR').includes(searchTerm.toLocaleLowerCase('tr-TR'))
  );

  return (
    <div id="practices-page" className="pt-28 pb-24 px-4 sm:px-6 bg-[#F8FAFC] min-h-screen text-slate-800">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button onClick={() => navigate('home')} className="hover:text-[#9A7B4F] transition-colors">
            Ana Sayfa
          </button>
          <span>/</span>
          <span className="text-[#9A7B4F] font-semibold">Çalışma Alanlarımız</span>
        </div>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#C5A880]/40 text-xs text-[#9A7B4F] font-semibold uppercase tracking-wider shadow-xs">
            <Scale className="w-3.5 h-3.5 text-[#9A7B4F]" />
            <span>Faaliyet Alanlarımız</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif-heading text-slate-900 tracking-normal leading-[1.25]">
            Çalışma Alanlarımız
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            KIR HUKUK, gerçek ve tüzel kişilere Türk Hukuku ve Uluslararası Hukuk alanında nitelikli dava takibi ve koruyucu danışmanlık hizmeti sunar.
          </p>

          {/* Search bar */}
          <div className="relative max-w-md mx-auto pt-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Çalışma alanlarında arayın (Örn: Ticaret, Ceza, İş)..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#9A7B4F] shadow-xs"
            />
          </div>
        </div>

        {/* Grid of Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {filtered.map(area => (
            <div
              key={area.id}
              onClick={() => navigate('practice-detail', area.slug)}
              className="group bg-white border border-slate-200 hover:border-[#9A7B4F] rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[#9A7B4F] group-hover:bg-[#9A7B4F] group-hover:text-white transition-colors duration-300 shadow-xs">
                    <Scale className="w-6 h-6" />
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateToAdmin('practices', area.id);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-[#9A7B4F] hover:bg-[#9A7B4F]/10 transition-colors cursor-pointer"
                    title="Faaliyet Alanı İçeriğini Kontrol Panelinden Düzenle"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h3 className="text-xl font-bold font-serif-heading text-slate-900 group-hover:text-[#9A7B4F] transition-colors">
                    {area.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {area.shortDesc}
                  </p>
                </div>

                {area.services && area.services.length > 0 && (
                  <ul className="space-y-1.5 pt-2 border-t border-slate-100">
                    {area.services.slice(0, 3).map((s, idx) => (
                      <li key={idx} className="text-xs text-slate-600 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#9A7B4F] shrink-0" />
                        <span className="line-clamp-1">{s}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#9A7B4F] group-hover:text-slate-900 transition-colors">
                <span>Detaylı Bilgi & Süreç</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   2. TEAM PAGE (BEYAZ SAYFA)
   ========================================================================= */
export const TeamPage: React.FC = () => {
  const { teamMembers, navigate } = useCms();
  const activeMembers = teamMembers.filter(m => m.isActive);

  return (
    <div id="team-page" className="pt-28 pb-24 px-4 sm:px-6 bg-[#F8FAFC] min-h-screen text-slate-800">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button onClick={() => navigate('home')} className="hover:text-[#9A7B4F] transition-colors">
            Ana Sayfa
          </button>
          <span>/</span>
          <span className="text-[#9A7B4F] font-semibold">Ekibimiz</span>
        </div>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#C5A880]/40 text-xs text-[#9A7B4F] font-semibold uppercase tracking-wider shadow-xs">
            <Users className="w-3.5 h-3.5 text-[#9A7B4F]" />
            <span>Hukuk & İdari Kadromuz</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif-heading text-slate-900 tracking-normal leading-[1.25]">
            Avukatlarımız ve Büro Kadromuz
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Alanında yetkin, akademik birikim ve saha deneyimini birleştiren profesyonel avukatlarımız ve büro personelimizle müvekkillerimizin yanındayız.
          </p>
        </div>

        {/* Grid of Team Members */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
          {activeMembers.map(member => (
            <div
              key={member.id}
              onClick={() => navigate('team-detail', member.id)}
              className="group bg-white border border-slate-200 hover:border-[#9A7B4F] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col"
            >
              <div className="relative h-64 sm:h-72 overflow-hidden bg-slate-100">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-xs border border-slate-200 text-[10px] sm:text-[11px] font-semibold text-[#9A7B4F] shadow-xs">
                  {member.barInfo}
                </div>
              </div>

              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-xl font-bold font-serif-heading text-slate-900 group-hover:text-[#9A7B4F] transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#9A7B4F] mt-0.5">
                    {member.title}
                  </p>
                  <p className="text-xs text-slate-600 mt-3 line-clamp-3 leading-relaxed">
                    {member.shortBio || member.bio || member.fullBio}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700 group-hover:text-[#9A7B4F] transition-colors">
                  <span>Özgeçmiş & Uzmanlıklar</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   3. ARTICLES PAGE (BEYAZ SAYFA)
   ========================================================================= */
export const ArticlesPage: React.FC = () => {
  const { articles, navigate } = useCms();
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const activeArticles = articles.filter(a => a.isPublished);
  const categories = ['all', ...Array.from(new Set(activeArticles.map(a => a.category)))];

  const filtered = activeArticles.filter(art => {
    const matchesCat = selectedCat === 'all' || art.category === selectedCat;
    const matchesSearch =
      searchQuery === '' ||
      art.title.toLocaleLowerCase('tr-TR').includes(searchQuery.toLocaleLowerCase('tr-TR')) ||
      art.summary.toLocaleLowerCase('tr-TR').includes(searchQuery.toLocaleLowerCase('tr-TR'));
    return matchesCat && matchesSearch;
  });

  return (
    <div id="articles-page" className="pt-28 pb-24 px-4 sm:px-6 bg-[#F8FAFC] min-h-screen text-slate-800">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button onClick={() => navigate('home')} className="hover:text-[#9A7B4F] transition-colors">
            Ana Sayfa
          </button>
          <span>/</span>
          <span className="text-[#9A7B4F] font-semibold">Hukuki Makaleler & Bilgiler</span>
        </div>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#C5A880]/40 text-xs text-[#9A7B4F] font-semibold uppercase tracking-wider shadow-xs">
            <FileText className="w-3.5 h-3.5 text-[#9A7B4F]" />
            <span>Hukuki Bilgi Bankası</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif-heading text-slate-900 tracking-normal leading-[1.25]">
            Makaleler ve Yargıtay Karar İncelemeleri
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Güncel mevzuat değişiklikleri, emsal yüksek mahkeme kararları ve hukuki rehber yazılarımız.
          </p>

          {/* Search & Categories */}
          <div className="pt-4 space-y-3">
            <div className="relative max-w-md mx-auto">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Makalelerde veya konularda arayın..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#9A7B4F] shadow-xs"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedCat === cat
                      ? 'bg-[#9A7B4F] text-white font-semibold shadow-xs'
                      : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  {cat === 'all' ? 'Tüm Kategoriler' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid of Articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 pt-4">
          {filtered.map(article => (
            <article
              key={article.id}
              onClick={() => navigate('article-detail', article.slug)}
              className="group bg-white border border-slate-200 hover:border-[#9A7B4F] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative h-52 overflow-hidden bg-slate-100">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs border border-slate-200 text-[11px] font-semibold text-[#9A7B4F] shadow-xs">
                    {article.category}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#9A7B4F]" />
                      {article.publishedAt}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#9A7B4F]" />
                      {article.readTime}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-serif-heading text-slate-900 group-hover:text-[#9A7B4F] transition-colors line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#9A7B4F]">
                <span>Makaleyi Oku</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   4. FAQ PAGE (BEYAZ SAYFA)
   ========================================================================= */
export const FaqPage: React.FC = () => {
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
    <div id="faq-page" className="pt-28 pb-24 px-4 sm:px-6 bg-[#F8FAFC] min-h-screen text-slate-800">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button onClick={() => navigate('home')} className="hover:text-[#9A7B4F] transition-colors">
            Ana Sayfa
          </button>
          <span>/</span>
          <span className="text-[#9A7B4F] font-semibold">Sık Sorulan Sorular</span>
        </div>

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#C5A880]/40 text-xs text-[#9A7B4F] font-semibold uppercase tracking-wider shadow-xs">
            <HelpCircle className="w-3.5 h-3.5 text-[#9A7B4F]" />
            <span>Merak Edilenler</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif-heading text-slate-900 tracking-normal leading-[1.25]">
            Sık Sorulan Sorular
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Avukat tutma, vekaletname çıkarma, dava harçları ve hukuki süreçlerle ilgili temel soruların yanıtları.
          </p>

          {/* Search & Categories */}
          <div className="pt-3 space-y-3">
            <div className="relative max-w-md mx-auto">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Sorularda arayın (Örn: vekalet, ücret, boşanma)..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#9A7B4F] shadow-xs"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filterCategory === cat
                      ? 'bg-[#9A7B4F] text-white font-semibold shadow-xs'
                      : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  {cat === 'all' ? 'Tümü' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Accordion list */}
        <div className="space-y-3 pt-2">
          {filteredFaqs.map(faq => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs transition-all"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#9A7B4F] shrink-0" />
                    <span className="text-sm sm:text-base font-bold text-slate-900 font-serif-heading">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-[#9A7B4F] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-2 text-xs sm:text-sm text-slate-600 border-t border-slate-100 leading-relaxed space-y-3">
                    <p>{faq.answer}</p>
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-slate-100 text-[11px] font-medium text-slate-500">
                      Kategori: {faq.category}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   5. CONTACT PAGE (BEYAZ SAYFA)
   ========================================================================= */
export const ContactPage: React.FC = () => {
  const { settings, navigate, addMessage } = useCms();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setErrorMsg('Lütfen adınızı ve telefon numaranızı giriniz.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    try {
      await addMessage({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        subject: subject.trim() || 'Genel Hukuki Danışmanlık ve Randevu Talebi',
        message: message.trim() || (subject.trim() ? `${subject.trim()} danışma talebi iletildi.` : 'Müvekkil iletişim formu üzerinden ulaşıldı.'),
        practiceArea: subject.trim(),
        type: 'contact',
        source: 'İletişim & Randevu Sayfası'
      });

      setIsSent(true);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (err) {
      setErrorMsg('Mesaj iletilirken bir sorun oluştu. Lütfen doğrudan arayınız.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="contact-page" className="pt-28 pb-24 px-4 sm:px-6 bg-[#F8FAFC] min-h-screen text-slate-800">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button onClick={() => navigate('home')} className="hover:text-[#9A7B4F] transition-colors">
            Ana Sayfa
          </button>
          <span>/</span>
          <span className="text-[#9A7B4F] font-semibold">İletişim & Randevu</span>
        </div>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#C5A880]/40 text-xs text-[#9A7B4F] font-semibold uppercase tracking-wider shadow-xs">
            <Mail className="w-3.5 h-3.5 text-[#9A7B4F]" />
            <span>Bize Ulaşın</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif-heading text-slate-900 tracking-normal leading-[1.25]">
            İletişim ve Danışma Randevusu
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Hukuki uyuşmazlığınızın değerlendirilmesi ve randevu planlaması için ofisimizi arayabilir veya mesaj bırakabilirsiniz.
          </p>
        </div>

        {/* 2-Column Info & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
          {/* Left Info */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
            <h3 className="text-xl font-bold font-serif-heading text-slate-900 border-b border-slate-100 pb-3 tracking-normal">
              Ofis Bilgilerimiz
            </h3>

            <div className="space-y-5 text-xs sm:text-sm">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 text-[#9A7B4F] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Adres</h4>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">{settings.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 text-[#9A7B4F] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Telefon</h4>
                  <p className="text-slate-600 mt-0.5">{settings.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 text-[#9A7B4F] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">E-Posta</h4>
                  <p className="text-slate-600 mt-0.5">{settings.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 text-[#9A7B4F] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Çalışma Saatleri</h4>
                  <p className="text-slate-600 mt-0.5">{settings.workingHours || 'Hafta içi 09:00 - 18:30'}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
              <a
                href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Hemen Telefonla Ara</span>
              </a>

              <a
                href={`https://wa.me/${(settings.whatsappNumber || settings.phoneRaw || '').replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <span>WhatsApp Üzerinden Yazın</span>
              </a>
            </div>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
            <h3 className="text-xl font-bold font-serif-heading text-slate-900 border-b border-slate-100 pb-3 tracking-normal">
              Danışma & Mesaj Formu
            </h3>

            {isSent ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-4 text-center shadow-sm animate-in fade-in">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-lg font-bold font-serif-heading text-emerald-900">
                  Mesajınız & Danışma Talebiniz Başarıyla Alındı!
                </h4>
                <div className="text-xs text-emerald-800/90 leading-relaxed max-w-md mx-auto space-y-1">
                  <p className="font-semibold text-emerald-900">
                    Form verileriniz eksiksiz olarak Firestore veritabanına kaydedildi.
                  </p>
                  <p>
                    Hukuk büromuzun nöbetçi avukatları talebinizi inceleyerek en kısa sürede belirttiğiniz telefon numarası veya e-posta üzerinden sizinle irtibata geçecektir.
                  </p>
                </div>
                <button
                  onClick={() => setIsSent(false)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition-colors shadow-sm cursor-pointer"
                >
                  Yeni Danışma Formu Gönder
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                    {errorMsg}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Adınız Soyadınız *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Ad Soyad"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#9A7B4F] bg-slate-50/50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Telefon Numaranız *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="05XX XXX XX XX"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#9A7B4F] bg-slate-50/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">E-Posta Adresiniz</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="ornek@mail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#9A7B4F] bg-slate-50/50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Konu / Alan</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      placeholder="Örn: İş Davası, Gayrimenkul, Ceza"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#9A7B4F] bg-slate-50/50"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Hukuki Konunuz Hakkında Kısa Özet</label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Uyuşmazlığınızın özetini ve sormak istediğiniz hususları yazınız..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#9A7B4F] bg-slate-50/50 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl gold-btn text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Firestore Kaydediliyor...' : 'Danışma & Randevu Talebini Gönder'}</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Google Haritası & Yol Tarifi Alanı */}
        <div id="contact-office-map-container" className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs space-y-0">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-[#9A7B4F]/20 flex items-center justify-center text-[#9A7B4F] shrink-0 shadow-xs">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                  Büro Konumu & Google Haritalar
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">{settings.address}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <a
                id="contact-map-directions-btn"
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(settings.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl gold-btn text-xs font-semibold flex items-center gap-2 shadow-xs transition-transform active:scale-95"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Yol Tarifi Al</span>
              </a>
              <a
                id="contact-map-external-btn"
                href={`https://maps.google.com/?q=${encodeURIComponent(settings.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
                title="Google Haritalar'da Tam Ekran Görüntüle"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Haritada Aç</span>
              </a>
            </div>
          </div>

          <div className="w-full h-[360px] sm:h-[420px] bg-slate-100 relative">
            <iframe
              title="KIR HUKUK Ofis Konumu ve Haritası"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(settings.address)}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Harita Altı Ulaşım Bilgilendirme Notu */}
          <div className="p-4 sm:px-6 bg-slate-50/60 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
              <span><strong>Toplu Taşıma:</strong> Metro, metrobüs ve otobüs duraklarına 2 dakika yürüme mesafesindedir.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#9A7B4F] shrink-0"></span>
              <span><strong>Otopark:</strong> Müvekkillerimiz için plazada kapalı otopark ve vale hizmeti mevcuttur.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   6. ANNOUNCEMENTS PAGE (BEYAZ SAYFA)
   ========================================================================= */
export const AnnouncementsPage: React.FC = () => {
  const { announcements, navigate } = useCms();
  const activeAnnouncements = announcements.filter(a => a.isActive);

  return (
    <div id="announcements-page" className="pt-28 pb-24 px-4 sm:px-6 bg-[#F8FAFC] min-h-screen text-slate-800">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button onClick={() => navigate('home')} className="hover:text-[#9A7B4F] transition-colors">
            Ana Sayfa
          </button>
          <span>/</span>
          <span className="text-[#9A7B4F] font-semibold">Duyurular</span>
        </div>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#C5A880]/40 text-xs text-[#9A7B4F] font-semibold uppercase tracking-wider shadow-xs">
            <Bell className="w-3.5 h-3.5 text-[#9A7B4F]" />
            <span>Büro Bülteni</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif-heading text-slate-900 tracking-normal leading-[1.25]">
            Duyurular ve Hukuki Gelişmeler
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Büromuzdan kurumsal haberler, mevzuat yenilikleri ve önemli hukuki uyarılar.
          </p>
        </div>

        {/* List of Announcements */}
        <div className="space-y-4 pt-2">
          {activeAnnouncements.map(ann => (
            <div
              key={ann.id}
              className="bg-white border border-slate-200 hover:border-[#9A7B4F] rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                <span className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-[#9A7B4F] font-semibold">
                  {'category' in ann ? String((ann as any).category) : 'Duyuru'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#9A7B4F]" />
                  {ann.date}
                </span>
              </div>

              <h3 className="text-xl font-bold font-serif-heading text-slate-900">
                {ann.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {ann.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
