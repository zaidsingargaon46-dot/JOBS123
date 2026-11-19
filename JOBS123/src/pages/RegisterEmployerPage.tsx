import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { DEFAULT_CENTER } from '../services/locationService';
import { LocationPicker } from '../components/LocationPicker';
import { GeoLocation } from '../types';

export const RegisterEmployerPage: React.FC = () => {
  const { t, registerEmployer } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('Residential Construction');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState<GeoLocation>(DEFAULT_CENTER);
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !businessName.trim() || !mobile.trim() || !password) {
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
    const result = await registerEmployer({
      name,
      businessName,
      businessType,
      mobile,
      password,
      location,
      description,
    });
    setSubmitting(false);

    if (!result.ok) {
      setError(t(result.errorKey || 'registerDuplicateMobile'));
      return;
    }
    navigate('/employer/dashboard');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-10">
      <div className="bg-white border border-[#D4E2D9] rounded-xl p-6 sm:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#123B65]">{t('registerEmployerTitle')}</h1>
          <p className="text-sm text-[#546E7A] mt-1">{t('registerEmployerSubtitle')}</p>
        </div>

        {error && (
          <div role="alert" className="p-3.5 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-sm text-[#991B1B]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
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
              <label className="block text-sm font-semibold text-[#263238] mb-1.5">{t('lblBusinessName')} *</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
                className="w-full min-h-[44px] px-3.5 py-2 border border-[#C8D6CE] rounded-lg text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#263238] mb-1.5">{t('lblBusinessType')}</label>
              <input
                type="text"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2 border border-[#C8D6CE] rounded-lg text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#263238] mb-1.5">{t('lblMobile')} *</label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="9880012345"
                required
                className="w-full min-h-[44px] px-3.5 py-2 border border-[#C8D6CE] rounded-lg text-base tabular-nums"
              />
            </div>
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
            disabled={submitting}
            className="w-full min-h-[48px] px-6 py-3 rounded-lg bg-[#123B65] hover:bg-[#0E2E4F] text-white font-semibold text-base transition-colors"
          >
            {t('navRegisterEmployer')}
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
