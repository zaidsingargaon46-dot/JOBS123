import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Clock, MapPin, Sparkles, XCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { computeJobMatch } from '../services/matchingService';
import { JobCard } from '../components/JobCard';

export const WorkerDashboardPage: React.FC = () => {
  const { t, currentUser, jobs, applications, applyToJob, loginDemo } = useApp();
  const worker = currentUser?.role === 'worker' ? currentUser : null;

  const myApplications = useMemo(() => {
    if (!worker) return [];
    return applications.filter((a) => a.workerId === worker.id);
  }, [applications, worker]);

  const topMatches = useMemo(() => {
    if (!worker) return [];
    return jobs
      .filter((j) => j.status === 'open')
      .map((job) => ({ job, match: computeJobMatch(worker, job) }))
      .sort((a, b) => b.match.totalScore - a.match.totalScore)
      .slice(0, 4);
  }, [worker, jobs]);

  if (!worker) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-4">
        <h1 className="text-2xl font-bold text-[#123B65]">{t('workerDashTitle')}</h1>
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

  const acceptedCount = myApplications.filter((a) => a.status === 'accepted').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#123B65]">
            {t('workerDashWelcome')}, {worker.name}
          </h1>
          <p className="text-sm text-[#546E7A] mt-1">
            {worker.location.name} · ₹{worker.expectedDailyWage} {t('lblPerDay')}
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            to="/jobs"
            className="min-h-[42px] px-4 py-2 rounded-lg bg-[#16A36A] text-white text-sm font-semibold inline-flex items-center gap-1.5"
          >
            <span>{t('navFindJobs')}</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
          <Link
            to="/map"
            className="min-h-[42px] px-4 py-2 rounded-lg bg-white border border-[#C8D6CE] text-[#123B65] text-sm font-semibold inline-flex items-center gap-1.5"
          >
            <MapPin className="w-4 h-4 text-[#16A36A]" aria-hidden="true" />
            <span>{t('navNearbyMap')}</span>
          </Link>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#D4E2D9] rounded-xl p-5">
          <div className="text-xs font-semibold text-[#546E7A]">{t('statMatchedJobs')}</div>
          <div className="text-2xl font-bold text-[#123B65] font-mono tabular-nums mt-1">
            {topMatches.filter((m) => m.match.totalScore >= 60).length}
          </div>
        </div>
        <div className="bg-white border border-[#D4E2D9] rounded-xl p-5">
          <div className="text-xs font-semibold text-[#546E7A]">{t('statApplicationsSent')}</div>
          <div className="text-2xl font-bold text-[#123B65] font-mono tabular-nums mt-1">
            {myApplications.length}
          </div>
        </div>
        <div className="bg-white border border-[#D4E2D9] rounded-xl p-5">
          <div className="text-xs font-semibold text-[#546E7A]">{t('statAcceptedJobs')}</div>
          <div className="text-2xl font-bold text-[#16A36A] font-mono tabular-nums mt-1">
            {acceptedCount}
          </div>
        </div>
        <div className="bg-white border border-[#D4E2D9] rounded-xl p-5">
          <div className="text-xs font-semibold text-[#546E7A]">{t('statExpectedWage')}</div>
          <div className="text-2xl font-bold text-[#123B65] font-mono tabular-nums mt-1">
            ₹{worker.expectedDailyWage}
          </div>
        </div>
      </div>

      {/* Top AI Recommendations */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#123B65] inline-flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#16A36A]" aria-hidden="true" />
            <span>{t('aiRecTitle')}</span>
          </h2>
          <Link to="/worker/recommendations" className="text-sm font-semibold text-[#123B65] hover:underline">
            {t('btnViewDetails')}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {topMatches.map(({ job, match }) => (
            <JobCard
              key={job.id}
              job={job}
              distanceKm={match.distanceKm}
              match={match}
              applied={myApplications.some((a) => a.jobId === job.id)}
              onApply={(jobId) => applyToJob(jobId)}
            />
          ))}
        </div>
      </section>

      {/* Recent Applications */}
      <section className="bg-white border border-[#D4E2D9] rounded-xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#123B65]">{t('myAppsTitle')}</h2>
          <Link to="/worker/applications" className="text-sm font-semibold text-[#123B65] hover:underline">
            {t('btnViewDetails')}
          </Link>
        </div>

        {myApplications.length === 0 ? (
          <p className="text-sm text-[#546E7A]">{t('noAppsYet')}</p>
        ) : (
          <div className="divide-y divide-[#E8F0EB]">
            {myApplications.slice(0, 5).map((app) => {
              const job = jobs.find((j) => j.id === app.jobId);
              if (!job) return null;
              return (
                <div key={app.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <Link to={`/jobs/${job.id}`} className="font-semibold text-sm text-[#123B65] hover:underline block truncate">
                      {job.title}
                    </Link>
                    <div className="text-xs text-[#546E7A]">
                      {job.employerBusinessName} · ₹{job.dailyWage} {t('lblPerDay')}
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold shrink-0 ${
                      app.status === 'accepted'
                        ? 'text-[#16A36A]'
                        : app.status === 'rejected'
                        ? 'text-[#B91C1C]'
                        : 'text-[#B45309]'
                    }`}
                  >
                    {app.status === 'accepted' && <CheckCircle2 className="w-4 h-4" aria-hidden="true" />}
                    {app.status === 'rejected' && <XCircle className="w-4 h-4" aria-hidden="true" />}
                    {app.status === 'pending' && <Clock className="w-4 h-4" aria-hidden="true" />}
                    <span>
                      {app.status === 'accepted'
                        ? t('statusAccepted')
                        : app.status === 'rejected'
                        ? t('statusRejected')
                        : t('statusPending')}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
