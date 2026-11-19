import React, { useEffect, useState } from 'react';
import { Camera, Check, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AVAILABLE_SKILLS } from '../services/dataRepository';
import { LocationPicker } from '../components/LocationPicker';
import { AvailabilityType, GeoLocation } from '../types';

export const WorkerProfilePage: React.FC = () => {
  const { t, tSkill, currentUser, updateWorkerProfile, loginDemo } = useApp();
  const worker = currentUser?.role === 'worker' ? currentUser : null;

  const [name, setName] = useState(worker?.name || '');
  const [mobile, setMobile] = useState(worker?.mobile || '');
  const [skills, setSkills] = useState<string[]>(worker?.skills || []);
  const [experienceYears, setExperienceYears] = useState(worker?.experienceYears || 0);
  const [location, setLocation] = useState<GeoLocation>(
    worker?.location || { name: 'Koramangala, Bengaluru', area: 'Koramangala', city: 'Bengaluru', lat: 12.9352, lng: 77.6245 }
  );
  const [expectedDailyWage, setExpectedDailyWage] = useState(worker?.expectedDailyWage || 800);
  const [availability, setAvailability] = useState<AvailabilityType>(worker?.availability || 'immediate');
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(worker?.photoUrl);
  const [bio, setBio] = useState(worker?.bio || '');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (worker) {
      setName(worker.name);
      setMobile(worker.mobile);
      setSkills(worker.skills);
      setExperienceYears(worker.experienceYears);
      setLocation(worker.location);
      setExpectedDailyWage(worker.expectedDailyWage);
      setAvailability(worker.availability);
      setPhotoUrl(worker.photoUrl);
      setBio(worker.bio || '');
    }
  }, [worker?.id]);

  if (!worker) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-4">
        <h1 className="text-2xl font-bold text-[#123B65]">{t('navProfile')}</h1>
        <button
          type="button"
          onClick={() => loginDemo('worker')}
          className="min-h-[44px] px-5 py-2.5 rounded-lg bg-[#16A36A] text-white text-sm font-semibold"
        >
          {t('btnEnterAsWorker')}
        </button>
      </div>
    );
  }

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
      if (typeof reader.result === 'string') setPhotoUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateWorkerProfile({
      name,
      mobile,
      skills,
      experienceYears,
      location,
      expectedDailyWage,
      availability,
      photoUrl,
      bio,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#123B65]">{t('navProfile')}</h1>
      </div>

      {saved && (
        <div role="status" className="p-3.5 rounded-lg bg-[#E8F0EB] border border-[#BBF7D0] text-sm font-medium text-[#14532D]">
          {t('profileUpdated')}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white border border-[#D4E2D9] rounded-xl p-6 space-y-5">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-[#E8F0EB] border border-[#C8D6CE] overflow-hidden flex items-center justify-center shrink-0">
            {photoUrl ? (
              <img src={photoUrl} alt={name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-[#123B65]" />
            )}
          </div>
          <div>
            <label className="inline-flex items-center gap-2 min-h-[40px] px-4 py-2 rounded-lg bg-[#E8F0EB] hover:bg-[#DCE8E0] text-[#123B65] text-sm font-semibold cursor-pointer">
              <Camera className="w-4 h-4" aria-hidden="true" />
              <span>{t('lblUploadPhoto')}</span>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="sr-only" />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#263238] mb-1.5">{t('lblFullName')}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full min-h-[44px] px-3.5 py-2 border border-[#C8D6CE] rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#263238] mb-1.5">{t('lblMobile')}</label>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
              className="w-full min-h-[44px] px-3.5 py-2 border border-[#C8D6CE] rounded-lg tabular-nums"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#263238] mb-1.5">{t('lblExpectedWage')}</label>
            <input
              type="number"
              min={200}
              max={5000}
              value={expectedDailyWage}
              onChange={(e) => setExpectedDailyWage(Number(e.target.value))}
              className="w-full min-h-[44px] px-3.5 py-2 border border-[#C8D6CE] rounded-lg tabular-nums"
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
              className="w-full min-h-[44px] px-3.5 py-2 border border-[#C8D6CE] rounded-lg tabular-nums"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#263238] mb-1.5">{t('lblAvailability')}</label>
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value as AvailabilityType)}
              className="w-full min-h-[44px] px-3.5 py-2 border border-[#C8D6CE] rounded-lg bg-white"
            >
              <option value="immediate">{t('avail_immediate')}</option>
              <option value="full_day">{t('avail_full_day')}</option>
              <option value="part_time">{t('avail_part_time')}</option>
              <option value="weekends">{t('avail_weekends')}</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#263238] mb-2">{t('lblSkills')}</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {AVAILABLE_SKILLS.map((skill) => {
              const selected = skills.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`min-h-[40px] px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between border transition-colors ${
                    selected
                      ? 'bg-[#123B65] text-white border-[#123B65]'
                      : 'bg-[#F7F9F7] text-[#263238] border-[#C8D6CE]'
                  }`}
                >
                  <span className="truncate">{tSkill(skill)}</span>
                  {selected && <Check className="w-4 h-4 shrink-0" />}
                </button>
              );
            })}
          </div>
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
          className="min-h-[46px] px-6 py-2.5 rounded-lg bg-[#16A36A] hover:bg-[#138A58] text-white font-semibold text-sm transition-colors"
        >
          {t('btnSaveChanges')}
        </button>
      </form>
    </div>
  );
};
