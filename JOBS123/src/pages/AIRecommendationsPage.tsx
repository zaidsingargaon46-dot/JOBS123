import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, MapPin, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { computeJobMatch } from '../services/matchingService';

export const AIRecommendationsPage: React.FC = () => {
  const {
    t,
    tSkill,
    currentUser,
    jobs,
    applications,
    applyToJob,
    loginDemo,
  } = useApp();

  const [appliedToast, setAppliedToast] = useState<string | null>(null);
  const worker = currentUser?.role === 'worker' ? currentUser : null;

  const rankedJobs = useMemo(() => {
    if (!worker) return [];
    return jobs
      .filter((j) => j.status === 'open')
      .map((job) => ({
        job,
        match: computeJobMatch(worker, job),
      }))
      .sort((a, b) => b.match.totalScore - a.match.totalScore);
  }, [worker, jobs]);

  if (!worker) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center space-y-4">
        <h1 className="text-2xl font-bold text-[#123B65]">{t('aiRecTitle')}</h1>
        <p className="text-sm text-[#546E7A]">{t('applyOnlyWorkers')}</p>
        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={() => loginDemo('worker')}
            className="min-h-[44px] px-5 py-2.5 rounded-lg bg-[#16A36A] text-white text-sm font-semibold"
          >
            {t('btnEnterAsWorker')}
          </button>
          <Link
            to="/login"
            className="min-h-[44px] px-5 py-2.5 rounded-lg bg-[#123B65] text-white text-sm font-semibold inline-flex items-center"
          >
            {t('navLogin')}
          </Link>
        </div>
      </div>
    );
  }

  const handleApply = (jobId: string) => {
    const res = applyToJob(jobId);
    if (res.ok) setAppliedToast(t('applySuccess'));
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#16A36A] mb-1">
          <Sparkles className="w-4 h-4" aria-hidden="true" />
          <span>{t('navRecommendations')}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#123B65]">{t('aiRecTitle')}</h1>
        <p className="text-sm sm:text-base text-[#546E7A] mt-1">{t('aiRecSubtitle')}</p>
      </div>

      <div className="bg-[#E8F0EB] border border-[#C8D6CE] rounded-xl px-4 py-3 text-xs sm:text-sm font-medium text-[#123B65]">
        {t('aiRecWeightsBanner')}
      </div>

      {appliedToast && (
        <div role="status" className="p-3.5 rounded-lg bg-[#E8F0EB] border border-[#BBF7D0] text-sm font-medium text-[#14532D]">
          {appliedToast}
        </div>
      )}

      <div className="space-y-5">
        {rankedJobs.map(({ job, match }) => {
          const isApplied = applications.some(
            (a) => a.jobId === job.id && a.workerId === worker.id
          );

          return (
            <article
              key={job.id}
              className="bg-white border border-[#D4E2D9] rounded-xl p-5 sm:p-6 space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs text-[#546E7A] font-medium">
                    {job.employerBusinessName} · {job.location.area} ({match.distanceKm} {t('lblKmAway')})
                  </div>
                  <Link
                    to={`/jobs/${job.id}`}
                    className="text-xl font-bold text-[#123B65] hover:underline block"
                  >
                    {job.title}
                  </Link>
                  <div className="text-sm text-[#455A64]">
                    {t('lblRequiredSkills')}: {job.requiredSkills.map((s) => tSkill(s)).join(' · ')}
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                  <div className="text-right">
                    <div className="text-xs text-[#546E7A]">{t('aiRecTotalScore')}</div>
                    <div className="text-2xl font-bold text-[#16A36A] font-mono tabular-nums">
                      {match.totalScore}/100
                    </div>
                  </div>
                  <div className="text-base font-bold text-[#123B65] font-mono tabular-nums">
                    ₹{job.dailyWage} {t('lblPerDay')}
                  </div>
                </div>
              </div>

              {/* 5-Factor Transparent Bars */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-[#F7F9F7] border border-[#E8F0EB] rounded-lg p-3.5 text-xs">
                {[
                  { label: t('weightSkills'), val: match.skillsScore, max: 40 },
                  { label: t('weightLocation'), val: match.locationScore, max: 25 },
                  { label: t('weightWage'), val: match.wageScore, max: 15 },
                  { label: t('weightExperience'), val: match.experienceScore, max: 10 },
                  { label: t('weightAvailability'), val: match.availabilityScore, max: 10 },
                ].map((factor) => (
                  <div key={factor.label} className="space-y-1.5">
                    <div className="flex justify-between font-medium text-[#263238]">
                      <span className="truncate">{factor.label}</span>
                      <span className="font-mono tabular-nums">{factor.val}/{factor.max}</span>
                    </div>
                    <div className="h-1.5 bg-[#D4E2D9] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#123B65] rounded-full"
                        style={{ width: `${(factor.val / factor.max) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Explanation List */}
              <div className="space-y-2">
                <h2 className="text-xs font-bold text-[#546E7A]">{t('aiRecWhyTitle')}</h2>
                <ul className="space-y-1 text-sm text-[#263238]">
                  {match.reasons.map((r, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className={r.positive ? 'text-[#16A36A] font-bold' : 'text-[#546E7A]'}>
                        {r.positive ? '✓' : '·'}
                      </span>
                      <span>{t(r.key, r.params)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E8F0EB]">
                <Link
                  to={`/jobs/${job.id}`}
                  className="min-h-[40px] px-4 py-2 rounded-lg bg-[#E8F0EB] text-[#123B65] text-sm font-semibold inline-flex items-center gap-1.5"
                >
                  <MapPin className="w-4 h-4" aria-hidden="true" />
                  <span>{t('btnViewDetails')}</span>
                </Link>

                {isApplied ? (
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#14532D] bg-[#E8F0EB] px-4 py-2 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-[#16A36A]" aria-hidden="true" />
                    {t('btnApplied')}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleApply(job.id)}
                    className="min-h-[40px] px-5 py-2 rounded-lg bg-[#16A36A] hover:bg-[#138A58] text-white text-sm font-semibold transition-colors"
                  >
                    {t('btnApplyNow')}
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
