import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AVAILABLE_SKILLS } from '../services/dataRepository';
import { DEFAULT_CENTER } from '../services/locationService';
import { LocationPicker } from '../components/LocationPicker';
import { AvailabilityType, GeoLocation } from '../types';

export const RegisterWorkerPage: React.FC = () => {
  const { t, tSkill, registerWorker } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [skills, setSkills] = useState<string[]>(['Carpenter']);
  const [experienceYears, setExperienceYears] = useState(2);
  const [location, setLocation] = useState<GeoLocation>(DEFAULT_CENTER);
  const [expectedDailyWage, setExpectedDailyWage] = useState(800);
  const [availability, setAvailability] = useState<AvailabilityType>('immediate');
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  const [bio, setBio] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const toggleSkill = (skill: string) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhotoUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !mobile.trim() || !password || skills.length === 0) {
      setError(t('requiredFieldError'));
      return;
    }
    if (!/^\d{10}$/.test(mobile.trim())) {
      setError(t('mobileInvalidError'));
      return;
    }
    if (password.length < 6) {
      setError(t('passwordMinError'));
      return;
    }

    setSubmitting(true);
    const result = await registerWorker({
      name,
      mobile,
      password,
      skills,
      experienceYears,
      location,
      expectedDailyWage,
      availability,
      photoUrl,
      bio,
    });
    setSubmitting(false);

    if (!result.ok) {
      setError(t(result.errorKey || 'registerDuplicateMobile'));
      return;
    }
    navigate('/worker/dashboard');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-10">
      <div className="bg-white border border-[#D4E2D9] rounded-xl p-6 sm:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#123B65]">{t('registerWorkerTitle')}</h1>
          <p className="text-sm text-[#546E7A] mt-1">{t('registerWorkerSubtitle')}</p>
        </div>

        {error && (
          <div role="alert" className="p-3.5 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-sm text-[#991B1B]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Photo Upload Preview */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#E8F0EB] border border-[#C8D6CE] overflow-hidden flex items-center justify-center shrink-0">
              {photoUrl ? (
                <img src={photoUrl} alt="Profile preview" className="w-full h-full object-cover" />
              ) : (
                <Camera className="w-6 h-6 text-[#123B65]" aria-hidden="true" />
              )}
            </div>
            <div>
              <label className="inline-flex items-center gap-2 min-h-[40px] px-4 py-2 rounded-lg bg-[#E8F0EB] hover:bg-[#DCE8E0] text-[#123B65] text-sm font-semibold cursor-pointer">
                <span>{t('lblUploadPhoto')}</span>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="sr-only" />
              </label>
              <p className="text-xs text-[#546E7A] mt-1">{t('lblProfilePhoto')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#263238] mb-1.5">{t('lblFullName')} *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full min-h-[44px] px-3.5 py-2 border border-[#C8D6CE] rounded-lg text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#263238] mb-1.5">{t('lblMobile')} *</label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="9845012345"
                required
                className="w-full min-h-[44px] px-3.5 py-2 border border-[#C8D6CE] rounded-lg text-base tabular-nums"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#263238] mb-1.5">{t('lblPassword')} *</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full min-h-[44px] px-3.5 py-2 border border-[#C8D6CE] rounded-lg text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#263238] mb-1.5">{t('lblExpectedWage')} *</label>
              <input
                type="number"
                min={200}
                max={5000}
                value={expectedDailyWage}
                onChange={(e) => setExpectedDailyWage(Number(e.target.value))}
                className="w-full min-h-[44px] px-3.5 py-2 border border-[#C8D6CE] rounded-lg text-base tabular-nums"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#263238] mb-1.5">{t('lblExperience')} ({t('lblYears')})</label>
              <input
                type="number"
                min={0}
                max={45}
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full min-h-[44px] px-3.5 py-2 border border-[#C8D6CE] rounded-lg text-base tabular-nums"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#263238] mb-2">{t('lblSkills')} *</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AVAILABLE_SKILLS.map((skill) => {
                const selected = skills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    aria-pressed={selected}
                    className={`min-h-[42px] px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between border transition-colors ${
                      selected
                        ? 'bg-[#123B65] text-white border-[#123B65]'
                        : 'bg-[#F7F9F7] text-[#263238] border-[#C8D6CE] hover:bg-[#E8F0EB]'
                    }`}
                  >
                    <span className="truncate">{tSkill(skill)}</span>
                    {selected && <Check className="w-4 h-4 shrink-0" aria-hidden="true" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#263238] mb-1.5">{t('lblAvailability')}</label>
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value as AvailabilityType)}
              className="w-full min-h-[44px] px-3.5 py-2 border border-[#C8D6CE] rounded-lg text-base bg-white"
            >
              <option value="immediate">{t('avail_immediate')}</option>
              <option value="full_day">{t('avail_full_day')}</option>
              <option value="part_time">{t('avail_part_time')}</option>
              <option value="weekends">{t('avail_weekends')}</option>
            </select>
          </div>

          <LocationPicker value={location} onChange={setLocation} label={t('lblLocation')} />

          <div>
            <label className="block text-sm font-semibold text-[#263238] mb-1.5">{t('lblBio')}</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 border border-[#C8D6CE] rounded-lg text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full min-h-[48px] px-6 py-3 rounded-lg bg-[#16A36A] hover:bg-[#138A58] text-white font-semibold text-base transition-colors"
          >
            {t('navRegisterWorker')}
          </button>
        </form>

        <p className="text-sm text-[#546E7A] text-center">
          <Link to="/login" className="text-[#123B65] font-semibold hover:underline">
            {t('navLogin')}
          </Link>
        </p>
      </div>
    </div>
  );
};
