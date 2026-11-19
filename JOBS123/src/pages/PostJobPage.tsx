import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AVAILABLE_SKILLS } from '../services/dataRepository';
import { DEFAULT_CENTER } from '../services/locationService';
import { LocationPicker } from '../components/LocationPicker';
import { AvailabilityType, GeoLocation } from '../types';

export const PostJobPage: React.FC = () => {
  const { t, tSkill, currentUser, postJob, loginDemo } = useApp();
  const navigate = useNavigate();
  const employer = currentUser?.role === 'employer' ? currentUser : null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requiredSkills, setRequiredSkills] = useState<string[]>(['Mason']);
  const [location, setLocation] = useState<GeoLocation>(employer?.location || DEFAULT_CENTER);
  const [dailyWage, setDailyWage] = useState(900);
  const [workersNeeded, setWorkersNeeded] = useState(2);
  const [experienceRequired, setExperienceRequired] = useState(1);
  const [workingHours, setWorkingHours] = useState('9:00 AM – 6:00 PM');
  const [joiningDate, setJoiningDate] = useState('2026-11-22');
  const [availabilityType, setAvailabilityType] = useState<AvailabilityType>('immediate');
  const [error, setError] = useState<string | null>(null);

  if (!employer) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-4">
        <h1 className="text-2xl font-bold text-[#123B65]">{t('postJobTitle')}</h1>
        <button
          type="button"
          onClick={() => loginDemo('employer')}
          className="min-h-[44px] px-5 py-2.5 rounded-lg bg-[#123B65] text-white text-sm font-semibold"
        >
          {t('btnEnterAsEmployer')}
        </button>
      </div>
    );
  }

  const toggleSkill = (skill: string) => {
    setRequiredSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title.trim() || !description.trim() || requiredSkills.length === 0) {
      setError(t('requiredFieldError'));
      return;
    }

    const created = postJob({
      title,
      description,
      requiredSkills,
      location,
      dailyWage,
      workersNeeded,
      experienceRequired,
      workingHours,
      joiningDate,
      availabilityType,
    });

    if (created) {
      navigate('/employer/dashboard');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#123B65]">{t('postJobTitle')}</h1>
        <p className="text-sm sm:text-base text-[#546E7A] mt-1">{t('postJobSubtitle')}</p>
      </div>

      {error && (
        <div role="alert" className="p-3.5 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-sm text-[#991B1B]">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-8 bg-white border border-[#D4E2D9] rounded-xl p-6 space-y-5"
        >
          <div>
            <label className="block text-sm font-semibold text-[#263238] mb-1.5">{t('lblJobTitle')} *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Skilled Mason for Boundary Wall Plastering"
              required
              className="w-full min-h-[44px] px-3.5 py-2 border border-[#C8D6CE] rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#263238] mb-1.5">{t('lblDescription')} *</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mention site landmarks, tools provided, and daily payment schedule..."
              required
              className="w-full p-3 border border-[#C8D6CE] rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#263238] mb-2">{t('lblRequiredSkills')} *</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AVAILABLE_SKILLS.map((skill) => {
                const selected = requiredSkills.includes(skill);
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#263238] mb-1.5">{t('lblDailyWage')} (₹) *</label>
              <input
                type="number"
                min={300}
                max={5000}
                value={dailyWage}
                onChange={(e) => setDailyWage(Number(e.target.value))}
                className="w-full min-h-[44px] px-3.5 py-2 border border-[#C8D6CE] rounded-lg tabular-nums"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#263238] mb-1.5">{t('lblWorkersNeeded')}</label>
              <input
                type="number"
                min={1}
                max={100}
                value={workersNeeded}
                onChange={(e) => setWorkersNeeded(Number(e.target.value))}
                className="w-full min-h-[44px] px-3.5 py-2 border border-[#C8D6CE] rounded-lg tabular-nums"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#263238] mb-1.5">{t('lblExperience')} ({t('lblYears')})</label>
              <input
                type="number"
                min={0}
                max={30}
                value={experienceRequired}
                onChange={(e) => setExperienceRequired(Number(e.target.value))}
                className="w-full min-h-[44px] px-3.5 py-2 border border-[#C8D6CE] rounded-lg tabular-nums"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#263238] mb-1.5">{t('lblWorkingHours')}</label>
              <input
                type="text"
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2 border border-[#C8D6CE] rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#263238] mb-1.5">{t('lblJoiningDate')}</label>
              <input
                type="date"
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2 border border-[#C8D6CE] rounded-lg tabular-nums"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#263238] mb-1.5">{t('lblAvailability')}</label>
              <select
                value={availabilityType}
                onChange={(e) => setAvailabilityType(e.target.value as AvailabilityType)}
                className="w-full min-h-[44px] px-3.5 py-2 border border-[#C8D6CE] rounded-lg bg-white"
              >
                <option value="immediate">{t('avail_immediate')}</option>
                <option value="full_day">{t('avail_full_day')}</option>
                <option value="part_time">{t('avail_part_time')}</option>
                <option value="weekends">{t('avail_weekends')}</option>
              </select>
            </div>
          </div>

          <LocationPicker value={location} onChange={setLocation} label={t('lblLocation')} />

          <button
            type="submit"
            className="w-full sm:w-auto min-h-[48px] px-7 py-3 rounded-lg bg-[#16A36A] hover:bg-[#138A58] text-white font-semibold text-base transition-colors"
          >
            {t('navPostJob')}
          </button>
        </form>

        <aside className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-[#D4E2D9] rounded-xl overflow-hidden">
            <img
              src="/src/assets/images/employer_site_preview_1795089790365.jpg"
              alt="Construction and solar project site"
              referrerPolicy="no-referrer"
              className="w-full aspect-[4/3] object-cover"
            />
            <div className="p-5 space-y-2">
              <h2 className="font-bold text-[#123B65]">{employer.businessName}</h2>
              <p className="text-xs text-[#546E7A] leading-relaxed">
                {t('postJobSubtitle')}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
