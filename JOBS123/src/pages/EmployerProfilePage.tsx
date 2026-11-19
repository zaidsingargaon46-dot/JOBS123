import React, { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LocationPicker } from '../components/LocationPicker';
import { GeoLocation } from '../types';

export const EmployerProfilePage: React.FC = () => {
  const { t, currentUser, updateEmployerProfile, loginDemo } = useApp();
  const employer = currentUser?.role === 'employer' ? currentUser : null;

  const [name, setName] = useState(employer?.name || '');
  const [businessName, setBusinessName] = useState(employer?.businessName || '');
  const [businessType, setBusinessType] = useState(employer?.businessType || '');
  const [mobile, setMobile] = useState(employer?.mobile || '');
  const [location, setLocation] = useState<GeoLocation>(
    employer?.location || { name: 'Koramangala, Bengaluru', area: 'Koramangala', city: 'Bengaluru', lat: 12.9352, lng: 77.6245 }
  );
  const [description, setDescription] = useState(employer?.description || '');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (employer) {
      setName(employer.name);
      setBusinessName(employer.businessName);
      setBusinessType(employer.businessType);
      setMobile(employer.mobile);
      setLocation(employer.location);
      setDescription(employer.description || '');
    }
  }, [employer?.id]);

  if (!employer) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-4">
        <h1 className="text-2xl font-bold text-[#123B65]">{t('navProfile')}</h1>
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateEmployerProfile({ name, businessName, businessType, mobile, location, description });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#123B65]">{t('navProfile')}</h1>
        <span className={`inline-flex items-center gap-1.5 text-sm font-semibold ${employer.verified ? 'text-[#16A36A]' : 'text-[#B45309]'}`}>
          <ShieldCheck className="w-4 h-4" aria-hidden="true" />
          {employer.verified ? t('verifiedEmployer') : t('unverifiedEmployer')}
        </span>
      </div>

      {saved && (
        <div role="status" className="p-3.5 rounded-lg bg-[#E8F0EB] border border-[#BBF7D0] text-sm font-medium text-[#14532D]">
          {t('profileUpdated')}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white border border-[#D4E2D9] rounded-xl p-6 space-y-5">
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
            <label className="block text-sm font-semibold text-[#263238] mb-1.5">{t('lblBusinessName')}</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
              className="w-full min-h-[44px] px-3.5 py-2 border border-[#C8D6CE] rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#263238] mb-1.5">{t('lblBusinessType')}</label>
            <input
              type="text"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
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

        <LocationPicker value={location} onChange={setLocation} label={t('lblLocation')} />

        <div>
          <label className="block text-sm font-semibold text-[#263238] mb-1.5">{t('lblDescription')}</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-[#C8D6CE] rounded-lg text-sm"
          />
        </div>

        <button
          type="submit"
          className="min-h-[46px] px-6 py-2.5 rounded-lg bg-[#123B65] hover:bg-[#0E2E4F] text-white font-semibold text-sm transition-colors"
        >
          {t('btnSaveChanges')}
        </button>
      </form>
    </div>
  );
};
