import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { Plus, Trash2, Edit2, Users, Check, X, Mail, Phone } from 'lucide-react';
import { TeamMember } from '../../types';
import { ImageInputWithPicker } from './ImageInputWithPicker';

export const TeamManagerTab: React.FC = () => {
  const { teamMembers, addTeamMember, updateTeamMember, deleteTeamMember } = useCms();

  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const initialForm: Partial<TeamMember> = {
    name: '',
    title: 'Avukat',
    barInfo: 'İstanbul Barosu — Sicil No: ',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
    shortBio: '',
    bio: '',
    education: '',
    languages: ['Türkçe', 'İngilizce'],
    specializations: [],
    email: '',
    phone: '',
    social: { linkedin: '', twitter: '' },
    order: teamMembers.length + 1,
    isActive: true
  };

  const [form, setForm] = useState<Partial<TeamMember>>(initialForm);
  const [specsInput, setSpecsInput] = useState('');
  const [languagesInput, setLanguagesInput] = useState('');

  const handleStartAdd = () => {
    setForm({ ...initialForm, order: teamMembers.length + 1 });
    setSpecsInput('');
    setLanguagesInput('Türkçe, İngilizce');
    setIsAdding(true);
    setIsEditing(null);
  };

  const handleStartEdit = (member: TeamMember) => {
    setIsEditing(member.id);
    setForm({ ...member });
    setSpecsInput(member.specializations ? member.specializations.join(', ') : '');
    setLanguagesInput(member.languages ? member.languages.join(', ') : '');
    setIsAdding(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.name.trim()) {
      alert('Lütfen Ad Soyad alanını doldurunuz.');
      return;
    }
    if (!form.title || !form.title.trim()) {
      alert('Lütfen Ünvan / Pozisyon alanını doldurunuz.');
      return;
    }

    const specsList = specsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const langList = languagesInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (isEditing) {
      updateTeamMember(isEditing, {
        ...form,
        specializations: specsList,
        languages: langList
      });
      setIsEditing(null);
    } else {
      addTeamMember({
        name: form.name.trim(),
        title: form.title.trim(),
        barInfo: form.barInfo || 'İstanbul Barosu',
        photo: form.photo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
        shortBio: form.shortBio || '',
        bio: form.bio || '',
        education: form.education || 'Hukuk Fakültesi',
        languages: langList,
        specializations: specsList,
        email: form.email || '',
        phone: form.phone || '',
        social: form.social || {},
        order: Number(form.order) || teamMembers.length + 1,
        isActive: form.isActive !== undefined ? form.isActive : true
      });
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold font-serif-heading text-white">
            Ekip & Kadro Yönetimi ({teamMembers.length})
          </h2>
          <p className="text-xs text-slate-400">
            Hukuk bürosu avukatları, büro personeli ve danışmanların profillerini yönetin.
          </p>
        </div>

        <button
          onClick={handleStartAdd}
          className="px-4 py-2.5 rounded-xl gold-btn text-xs font-bold flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Üye Ekle</span>
        </button>
      </div>

      {/* Add / Edit Form Modal */}
      {(isAdding || isEditing) && (
        <form noValidate onSubmit={handleSubmit} className="p-6 rounded-2xl bg-[#1C2E4A] border border-[#C5A880]/50 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-serif-heading">
              {isEditing ? `Üyeyi Düzenle: ${form.name}` : 'Yeni Üye Ekle'}
            </h3>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setIsEditing(null);
              }}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Ad Soyad *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Örn: Abidin KIR / Fatma Büşra KIR"
                className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Ünvan / Pozisyon *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="Örn: Kurucu Avukat / Büro Personeli"
                className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Baro / Kurum Bilgisi</label>
              <input
                type="text"
                value={form.barInfo}
                onChange={e => setForm({ ...form, barInfo: e.target.value })}
                placeholder="Örn: İstanbul Barosu — Sicil: ... / KIR HUKUK — İdari Personel"
                className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-3">
              <ImageInputWithPicker
                label="Fotoğraf URL (Profil Resmi)"
                value={form.photo || ''}
                onChange={val => setForm({ ...form, photo: val })}
                placeholder="https://... veya galeriden seçin"
                category="Ekip"
                helperText="Avukat veya personel kartlarında gösterilecek portre fotoğrafı."
              />
            </div>

            <div className="sm:col-span-1">
              <label className="block text-xs font-medium text-slate-300 mb-1">E-Posta Adresi</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="selim@kirhukuk.com"
                className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">Eğitim Geçmişi</label>
              <input
                type="text"
                value={form.education}
                onChange={e => setForm({ ...form, education: e.target.value })}
                placeholder="Örn: İstanbul Üniversitesi Hukuk Fakültesi"
                className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Kısa Biyografi (Kartlarda görünür)</label>
            <textarea
              rows={2}
              value={form.shortBio}
              onChange={e => setForm({ ...form, shortBio: e.target.value })}
              placeholder="Örn: Şirketler hukuku ve birleşme devralma alanında 12 yıllık dava tecrübesi..."
              className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Detaylı Özgeçmiş</label>
            <textarea
              rows={4}
              value={form.bio}
              onChange={e => setForm({ ...form, bio: e.target.value })}
              placeholder="Avukatın akademik çalışmaları, baktığı dava türleri ve profesyonel geçmişi..."
              className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Uzmanlık Alanları (Virgülle ayırın)
              </label>
              <input
                type="text"
                value={specsInput}
                onChange={e => setSpecsInput(e.target.value)}
                placeholder="Örn: Ticaret Hukuku, Tahkim, Şirketler Hukuku"
                className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Yabancı Diller (Virgülle ayırın)
              </label>
              <input
                type="text"
                value={languagesInput}
                onChange={e => setLanguagesInput(e.target.value)}
                placeholder="Örn: Türkçe, İngilizce, Almanca"
                className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">LinkedIn Profili (Opsiyonel)</label>
              <input
                type="text"
                value={form.social?.linkedin || ''}
                onChange={e =>
                  setForm({
                    ...form,
                    social: { ...form.social, linkedin: e.target.value }
                  })
                }
                placeholder="https://linkedin.com/in/..."
                className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Sıralama</label>
              <input
                type="number"
                value={form.order}
                onChange={e => setForm({ ...form, order: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-lg bg-[#0B132B] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div className="flex items-center gap-2 pt-5">
              <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={e => setForm({ ...form, isActive: e.target.checked })}
                  className="rounded bg-[#0B132B] border-white/20 text-[#C5A880]"
                />
                <span>Sitede Aktif Göster</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setIsEditing(null);
              }}
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg gold-btn text-xs font-bold"
            >
              {isEditing ? 'Değişiklikleri Kaydet' : 'Üyeyi Ekle'}
            </button>
          </div>
        </form>
      )}

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {teamMembers.map(member => (
          <div
            key={member.id}
            className="p-4 rounded-xl bg-[#1C2E4A] border border-white/10 flex flex-col justify-between space-y-3 shadow-lg hover:border-white/20 transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-12 h-12 rounded-full object-cover border border-[#C5A880]/40"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-sm font-bold text-white font-serif-heading">
                    {member.name}
                  </h4>
                  <p className="text-xs text-[#C5A880]">{member.title}</p>
                </div>
              </div>

              <div className="text-[11px] text-slate-300">
                <p className="line-clamp-2 text-slate-400">{member.shortBio}</p>
                <p className="text-[#C5A880] font-mono mt-1">{member.barInfo}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  member.isActive
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-slate-700/40 text-slate-400'
                }`}
              >
                {member.isActive ? 'Aktif' : 'Pasif'}
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleStartEdit(member)}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
                  title="Düzenle"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    if (confirm(`"${member.name}" profilini silmek istediğinize emin misiniz?`)) {
                      deleteTeamMember(member.id);
                    }
                  }}
                  className="p-1.5 rounded-lg text-rose-400 hover:text-rose-200 hover:bg-rose-500/10"
                  title="Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
