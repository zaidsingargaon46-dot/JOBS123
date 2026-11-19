import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Phone, UserCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const { t, login, loginDemo } = useApp();
  const navigate = useNavigate();

  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const redirectByRole = (role: UserRole) => {
    if (role === 'worker') navigate('/worker/dashboard');
    else if (role === 'employer') navigate('/employer/dashboard');
    else navigate('/admin/dashboard');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!mobile.trim() || !password) {
      setError(t('requiredFieldError'));
      return;
    }
    setSubmitting(true);
    const result = await login(mobile, password);
    setSubmitting(false);

    if (!result.ok || !result.role) {
      setError(t(result.errorKey || 'loginInvalidError'));
      return;
    }

    redirectByRole(result.role);
  };

  const handleDemo = (role: UserRole) => {
    const user = loginDemo(role);
    if (user) redirectByRole(user.role);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-7 bg-white border border-[#D4E2D9] rounded-xl p-6 sm:p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-[#123B65]">{t('loginTitle')}</h1>
            <p className="text-sm text-[#546E7A] mt-1.5">{t('loginSubtitle')}</p>
          </div>

          {error && (
            <div role="alert" className="p-3.5 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-sm text-[#991B1B]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-mobile" className="block text-sm font-semibold text-[#263238] mb-1.5">
                {t('lblMobile')}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#546E7A] absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
                <input
                  id="login-mobile"
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="9845011223"
                  className="w-full min-h-[44px] pl-10 pr-3 py-2 bg-white border border-[#C8D6CE] rounded-lg text-base text-[#263238] focus:outline-none focus:ring-2 focus:ring-[#123B65]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-semibold text-[#263238] mb-1.5">
                {t('lblPassword')}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#546E7A] absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full min-h-[44px] pl-10 pr-3 py-2 bg-white border border-[#C8D6CE] rounded-lg text-base text-[#263238] focus:outline-none focus:ring-2 focus:ring-[#123B65]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full min-h-[48px] px-5 py-2.5 rounded-lg bg-[#123B65] hover:bg-[#0E2E4F] text-white font-semibold text-base transition-colors"
            >
              {t('loginBtn')}
            </button>
          </form>

          <div className="pt-4 border-t border-[#E8F0EB] flex flex-wrap gap-4 text-sm">
            <Link to="/register/worker" className="font-semibold text-[#16A36A] hover:underline">
              {t('navRegisterWorker')}
            </Link>
            <span className="text-[#90A4AE]" aria-hidden="true">·</span>
            <Link to="/register/employer" className="font-semibold text-[#123B65] hover:underline">
              {t('navRegisterEmployer')}
            </Link>
          </div>
        </div>

        <div className="md:col-span-5 bg-[#E8F0EB]/60 border border-[#D4E2D9] rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-[#123B65] font-bold">
            <UserCheck className="w-5 h-5 text-[#16A36A]" aria-hidden="true" />
            <h2>{t('sectionRolesTitle')}</h2>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handleDemo('worker')}
              className="w-full text-left p-3.5 rounded-lg bg-white border border-[#C8D6CE] hover:border-[#16A36A] transition-colors"
            >
              <div className="font-bold text-sm text-[#123B65]">{t('btnEnterAsWorker')}</div>
              <div className="text-xs text-[#546E7A] mt-0.5 font-mono tabular-nums">
                Ramesh Gowda · 9845011223 / worker123
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDemo('employer')}
              className="w-full text-left p-3.5 rounded-lg bg-white border border-[#C8D6CE] hover:border-[#123B65] transition-colors"
            >
              <div className="font-bold text-sm text-[#123B65]">{t('btnEnterAsEmployer')}</div>
              <div className="text-xs text-[#546E7A] mt-0.5 font-mono tabular-nums">
                Suresh Shetty · 9880022334 / employer123
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDemo('admin')}
              className="w-full text-left p-3.5 rounded-lg bg-white border border-[#C8D6CE] hover:border-[#123B65] transition-colors"
            >
              <div className="font-bold text-sm text-[#123B65]">{t('btnEnterAsAdmin')}</div>
              <div className="text-xs text-[#546E7A] mt-0.5 font-mono tabular-nums">
                Priya Nair · 9900099000 / admin123
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
