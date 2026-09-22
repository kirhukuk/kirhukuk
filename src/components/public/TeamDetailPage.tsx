import React from 'react';
import { useCms } from '../../context/CmsContext';
import {
  Mail,
  Phone,
  ArrowRight,
  GraduationCap,
  Globe,
  Award,
  Scale,
  Linkedin,
  Twitter,
  Calendar
} from 'lucide-react';

interface TeamDetailPageProps {
  id: string;
}

export const TeamDetailPage: React.FC<TeamDetailPageProps> = ({ id }) => {
  const { teamMembers, navigate } = useCms();

  const member = teamMembers.find(m => m.id === id) || teamMembers[0];
  const otherMembers = teamMembers.filter(m => m.id !== member.id && m.isActive);

  return (
    <div id="team-detail-page" className="pt-28 pb-24 px-4 sm:px-6 bg-[#F8FAFC] min-h-screen text-slate-800">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button onClick={() => navigate('home')} className="hover:text-[#9A7B4F] transition-colors">
            Ana Sayfa
          </button>
          <span>/</span>
          <button onClick={() => navigate('team')} className="hover:text-[#9A7B4F] transition-colors">
            Ekibimiz
          </button>
          <span>/</span>
          <span className="text-[#9A7B4F] font-semibold">{member.name}</span>
        </div>

        {/* Profile Card Header */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 sm:p-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left Photo */}
            <div className="md:col-span-4 flex justify-center">
              <div className="relative w-56 h-72 sm:w-64 sm:h-80 rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Right Info */}
            <div className="md:col-span-8 space-y-5">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-[#C5A880]/40 text-xs text-[#9A7B4F] font-semibold tracking-wider">
                  <Scale className="w-3.5 h-3.5 text-[#9A7B4F]" />
                  <span>{member.barInfo}</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold font-serif-heading text-slate-900 tracking-normal leading-[1.25] pt-2">
                  {member.name}
                </h1>
                <p className="text-base text-[#9A7B4F] font-semibold font-serif-heading">
                  {member.title}
                </p>
              </div>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {member.fullBio || member.bio || member.shortBio}
              </p>

              {/* Badges / Quick stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-xs text-slate-500 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-[#9A7B4F]" />
                    Eğitim
                  </span>
                  <p className="text-xs font-semibold text-slate-900">
                    {Array.isArray(member.education) ? member.education[0] : member.education}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#9A7B4F]" />
                    Yabancı Dil
                  </span>
                  <p className="text-xs font-semibold text-slate-900">
                    {member.languages?.join(', ') || 'Türkçe, İngilizce'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#9A7B4F]" />
                    Kurum / Baro
                  </span>
                  <p className="text-xs font-semibold text-slate-900">
                    {member.barInfo ? (member.barInfo.includes('—') ? member.barInfo.split('—')[0]?.trim() : member.barInfo) : 'KIR HUKUK'}
                  </p>
                </div>
              </div>

              {/* Contact & Social Buttons */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-3">
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="px-4 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700 flex items-center gap-2 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#9A7B4F]" />
                    <span>{member.email}</span>
                  </a>
                )}

                {member.social?.linkedin && (
                  <a
                    href={member.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors"
                    title="LinkedIn Profili"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}

                {member.social?.twitter && (
                  <a
                    href={member.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors"
                    title="X / Twitter"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                )}

                <button
                  onClick={() => navigate('contact')}
                  className="ml-auto px-5 py-2.5 rounded-lg gold-btn text-xs font-semibold flex items-center gap-1.5 shadow"
                >
                  <span>Randevu Talebi</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Specializations & Areas */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 sm:p-8 space-y-4">
          <h3 className="text-xl font-bold font-serif-heading text-slate-900">
            Uzmanlık Alanları & Dava Pratiği
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {member.name}, KIR HUKUK bünyesinde ağırlıklı olarak aşağıdaki alanlardaki uyuşmazlıklarda vekillik ve danışmanlık hizmeti sunmaktadır:
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {member.specializations.map((spec, idx) => (
              <span
                key={idx}
                className="px-3.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

        {/* Other Team Members */}
        {otherMembers.length > 0 && (
          <div className="space-y-6 pt-4">
            <h3 className="text-2xl font-bold font-serif-heading text-slate-900">
              Diğer Ekip Üyelerimiz
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {otherMembers.slice(0, 3).map(other => (
                <div
                  key={other.id}
                  onClick={() => navigate('team-detail', other.id)}
                  className="bg-white border border-slate-200 hover:border-[#C5A880] shadow-sm rounded-xl p-4 flex items-center gap-4 cursor-pointer group transition-all"
                >
                  <img
                    src={other.photo}
                    alt={other.name}
                    className="w-14 h-14 rounded-full object-cover border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#9A7B4F] transition-colors">
                      {other.name}
                    </h4>
                    <p className="text-xs text-[#9A7B4F]">{other.title}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {other.specializations.slice(0, 2).join(', ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
