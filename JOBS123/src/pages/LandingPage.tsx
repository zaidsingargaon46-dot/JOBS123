import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, ShieldCheck, Sparkles, UserCheck, Briefcase, Wrench } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

export const LandingPage: React.FC = () => {
  const { t, loginDemo, jobs } = useApp();
  const navigate = useNavigate();

  const openJobsCount = jobs.filter((j) => j.status === 'open').length;

  const handleDemoEnter = (role: UserRole) => {
    const user = loginDemo(role);
    if (!user) return;
    if (role === 'worker') navigate('/worker/dashboard');
    else if (role === 'employer') navigate('/employer/dashboard');
    else navigate('/admin/dashboard');
  };

  return (
    <div className="bg-[#F7F9F7]">
      {/* Hero Section */}
      <section className="max-w-[1320px] mx-auto px-4 sm:px-8 pt-8 pb-12 lg:pt-12 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            <div className="text-sm font-semibold text-[#16A36A] tracking-wide">
              {t('heroKicker')}
            </div>

            <h1 className="text-[clamp(2.15rem,4vw,3.5rem)] font-bold text-[#123B65] leading-[1.12] tracking-tight text-balance">
              {t('heroHeadline')}
            </h1>

            <p className="text-base sm:text-lg text-[#455A64] leading-relaxed max-w-xl">
              {t('heroSubheading')}
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                to="/jobs"
                className="min-h-[48px] px-6 py-3 rounded-lg bg-[#16A36A] hover:bg-[#138A58] text-white font-semibold text-base inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
              >
                <span>{t('ctaFindJob')}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>

              <Link
                to="/register/employer"
                className="min-h-[48px] px-6 py-3 rounded-lg bg-[#123B65] hover:bg-[#0E2E4F] text-white font-semibold text-base inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
              >
                <span>{t('ctaHireWorkers')}</span>
              </Link>

              <Link
                to="/map"
                className="min-h-[48px] px-5 py-3 rounded-lg bg-white hover:bg-[#E8F0EB] text-[#123B65] border border-[#C8D6CE] font-semibold text-base inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
              >
                <MapPin className="w-4 h-4 text-[#16A36A]" aria-hidden="true" />
                <span>{t('ctaExploreMap')}</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="h-full min-h-[280px] lg:min-h-[400px] rounded-xl overflow-hidden border border-[#D4E2D9] bg-[#E8F0EB] relative">
              <img
                src="/src/assets/images/hero_skilled_workers_1795089790810.jpg"
                alt="Skilled tradespeople collaborating on site"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* 4-column Key Metrics Strip below Hero */}
        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4 bg-white border border-[#D4E2D9] rounded-xl p-5 sm:p-6">
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-[#123B65] tabular-nums font-mono">
              12+
            </div>
            <div className="text-sm text-[#546E7A] mt-1">{t('heroStatWorkers')}</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-[#16A36A] tabular-nums font-mono">
              {openJobsCount} Open
            </div>
            <div className="text-sm text-[#546E7A] mt-1">{t('heroStatWages')}</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-[#123B65] tabular-nums font-mono">
              EN · ಕ · हि
            </div>
            <div className="text-sm text-[#546E7A] mt-1">{t('heroStatLanguages')}</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-[#123B65] tabular-nums font-mono">
              0–100
            </div>
            <div className="text-sm text-[#546E7A] mt-1">{t('heroStatMatching')}</div>
          </div>
        </div>
      </section>

      {/* How KaamConnect Works */}
      <section className="bg-white border-y border-[#D4E2D9] py-14">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8">
          <div className="max-w-2xl mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#123B65] tracking-tight text-balance">
              {t('sectionHowTitle')}
            </h2>
            <p className="text-base text-[#546E7A] mt-2 leading-relaxed">
              {t('sectionHowSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-[#F7F9F7] border border-[#D4E2D9] space-y-3">
              <h3 className="text-lg font-bold text-[#123B65]">{t('step1Title')}</h3>
              <p className="text-sm text-[#455A64] leading-relaxed">{t('step1Desc')}</p>
            </div>
            <div className="p-6 rounded-xl bg-[#F7F9F7] border border-[#D4E2D9] space-y-3">
              <h3 className="text-lg font-bold text-[#123B65]">{t('step2Title')}</h3>
              <p className="text-sm text-[#455A64] leading-relaxed">{t('step2Desc')}</p>
            </div>
            <div className="p-6 rounded-xl bg-[#F7F9F7] border border-[#D4E2D9] space-y-3">
              <h3 className="text-lg font-bold text-[#123B65]">{t('step3Title')}</h3>
              <p className="text-sm text-[#455A64] leading-relaxed">{t('step3Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Transparent 100-Point AI Matching Breakdown */}
      <section className="max-w-[1320px] mx-auto px-4 sm:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#16A36A]">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              <span>{t('navRecommendations')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#123B65] tracking-tight text-balance">
              {t('sectionMatchPreviewTitle')}
            </h2>
            <p className="text-base text-[#455A64] leading-relaxed">
              {t('sectionMatchPreviewSubtitle')}
            </p>
            <div className="pt-2">
              <Link
                to="/login"
                className="min-h-[44px] px-5 py-2.5 rounded-lg bg-[#123B65] text-white text-sm font-semibold inline-flex items-center gap-2 hover:bg-[#0E2E4F] transition-colors"
              >
                <span>{t('btnEnterAsWorker')}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white border border-[#D4E2D9] rounded-xl p-6 space-y-4">
            {[
              { label: t('weightSkills'), pct: 40, color: '#123B65' },
              { label: t('weightLocation'), pct: 25, color: '#16A36A' },
              { label: t('weightWage'), pct: 15, color: '#123B65' },
              { label: t('weightExperience'), pct: 10, color: '#16A36A' },
              { label: t('weightAvailability'), pct: 10, color: '#123B65' },
            ].map((item) => (
              <div key={item.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm font-semibold text-[#263238]">
                  <span>{item.label}</span>
                  <span className="font-mono tabular-nums text-[#123B65]">{item.pct}%</span>
                </div>
                <div className="h-2.5 bg-[#E8F0EB] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${item.pct * 2}%`, maxWidth: '100%', backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Try Any Role Immediately (Phase 1 Interactive Demos) */}
      <section className="bg-[#E8F0EB]/60 border-t border-[#D4E2D9] py-14">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8">
          <div className="max-w-2xl mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#123B65] tracking-tight">
              {t('sectionRolesTitle')}
            </h2>
            <p className="text-base text-[#455A64] mt-2 leading-relaxed">
              {t('sectionRolesSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-[#D4E2D9] rounded-xl p-6 flex flex-col justify-between gap-5">
              <div className="space-y-2.5">
                <Wrench className="w-6 h-6 text-[#16A36A]" aria-hidden="true" />
                <h3 className="text-lg font-bold text-[#123B65]">{t('demoWorkerTitle')}</h3>
                <p className="text-sm text-[#455A64] leading-relaxed">{t('demoWorkerDesc')}</p>
              </div>
              <button
                type="button"
                onClick={() => handleDemoEnter('worker')}
                className="w-full min-h-[44px] px-4 py-2.5 rounded-lg bg-[#16A36A] hover:bg-[#138A58] text-white font-semibold text-sm transition-colors"
              >
                {t('btnEnterAsWorker')}
              </button>
            </div>

            <div className="bg-white border border-[#D4E2D9] rounded-xl p-6 flex flex-col justify-between gap-5">
              <div className="space-y-2.5">
                <Briefcase className="w-6 h-6 text-[#123B65]" aria-hidden="true" />
                <h3 className="text-lg font-bold text-[#123B65]">{t('demoEmployerTitle')}</h3>
                <p className="text-sm text-[#455A64] leading-relaxed">{t('demoEmployerDesc')}</p>
              </div>
              <button
                type="button"
                onClick={() => handleDemoEnter('employer')}
                className="w-full min-h-[44px] px-4 py-2.5 rounded-lg bg-[#123B65] hover:bg-[#0E2E4F] text-white font-semibold text-sm transition-colors"
              >
                {t('btnEnterAsEmployer')}
              </button>
            </div>

            <div className="bg-white border border-[#D4E2D9] rounded-xl p-6 flex flex-col justify-between gap-5">
              <div className="space-y-2.5">
                <ShieldCheck className="w-6 h-6 text-[#123B65]" aria-hidden="true" />
                <h3 className="text-lg font-bold text-[#123B65]">{t('demoAdminTitle')}</h3>
                <p className="text-sm text-[#455A64] leading-relaxed">{t('demoAdminDesc')}</p>
              </div>
              <button
                type="button"
                onClick={() => handleDemoEnter('admin')}
                className="w-full min-h-[44px] px-4 py-2.5 rounded-lg bg-white hover:bg-[#E8F0EB] text-[#123B65] border border-[#123B65] font-semibold text-sm transition-colors inline-flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4" aria-hidden="true" />
                <span>{t('btnEnterAsAdmin')}</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
