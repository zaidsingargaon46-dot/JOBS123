import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, PlusCircle, ShieldCheck, User, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WorkerProfile } from '../types';
import { WorkerProfileModal } from '../components/WorkerProfileModal';

export const EmployerDashboardPage: React.FC = () => {
  const {
    t,
    currentUser,
    jobs,
    applications,
    users,
    toggleJobStatus,
    respondToApplication,
    loginDemo,
  } = useApp();

  const [selectedWorker, setSelectedWorker] = useState<WorkerProfile | null>(null);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  const employer = currentUser?.role === 'employer' ? currentUser : null;

  const myJobs = useMemo(() => {
    if (!employer) return [];
    return jobs.filter((j) => j.employerId === employer.id);
  }, [jobs, employer]);

  const myApplicants = useMemo(() => {
    if (!employer) return [];
    return applications.filter((a) => a.employerId === employer.id);
  }, [applications, employer]);

  if (!employer) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-4">
        <h1 className="text-2xl font-bold text-[#123B65]">{t('employerDashTitle')}</h1>
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

  const openCount = myJobs.filter((j) => j.status === 'open').length;
  const acceptedCount = myApplicants.filter((a) => a.status === 'accepted').length;

  const handleDecision = (appId: string, decision: 'accepted' | 'rejected') => {
    respondToApplication(appId, decision);
    setStatusFeedback(
      decision === 'accepted' ? t('applicantAcceptedMsg') : t('applicantRejectedMsg')
    );
    setTimeout(() => setStatusFeedback(null), 3500);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#123B65]">{t('employerDashTitle')}</h1>
          <div className="text-sm text-[#546E7A] mt-1 flex items-center gap-2">
            <span>{employer.businessName}</span>
            <span aria-hidden="true">·</span>
            <span className={`inline-flex items-center gap-1 font-semibold ${employer.verified ? 'text-[#16A36A]' : 'text-[#B45309]'}`}>
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              {employer.verified ? t('verifiedEmployer') : t('unverifiedEmployer')}
            </span>
          </div>
        </div>

        <Link
          to="/employer/post-job"
          className="min-h-[44px] px-5 py-2.5 rounded-lg bg-[#16A36A] hover:bg-[#138A58] text-white text-sm font-semibold inline-flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" aria-hidden="true" />
          <span>{t('navPostJob')}</span>
        </Link>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#D4E2D9] rounded-xl p-5">
          <div className="text-xs font-semibold text-[#546E7A]">{t('statOpenJobs')}</div>
          <div className="text-2xl font-bold text-[#123B65] font-mono tabular-nums mt-1">{openCount}</div>
        </div>
        <div className="bg-white border border-[#D4E2D9] rounded-xl p-5">
          <div className="text-xs font-semibold text-[#546E7A]">{t('statTotalApplicants')}</div>
          <div className="text-2xl font-bold text-[#123B65] font-mono tabular-nums mt-1">{myApplicants.length}</div>
        </div>
        <div className="bg-white border border-[#D4E2D9] rounded-xl p-5">
          <div className="text-xs font-semibold text-[#546E7A]">{t('statHiredWorkers')}</div>
          <div className="text-2xl font-bold text-[#16A36A] font-mono tabular-nums mt-1">{acceptedCount}</div>
        </div>
        <div className="bg-white border border-[#D4E2D9] rounded-xl p-5">
          <div className="text-xs font-semibold text-[#546E7A]">{t('statVerification')}</div>
          <div className={`text-sm font-bold mt-2 ${employer.verified ? 'text-[#16A36A]' : 'text-[#B45309]'}`}>
            {employer.verified ? t('verifiedEmployer') : t('unverifiedEmployer')}
          </div>
        </div>
      </div>

      {statusFeedback && (
        <div role="status" className="p-3.5 rounded-lg bg-[#E8F0EB] border border-[#BBF7D0] text-sm font-medium text-[#14532D]">
          {statusFeedback}
        </div>
      )}

      {/* Applicants Management */}
      <section className="bg-white border border-[#D4E2D9] rounded-xl p-5 sm:p-6 space-y-4">
        <h2 className="text-xl font-bold text-[#123B65]">{t('applicantsSection')}</h2>

        {myApplicants.length === 0 ? (
          <p className="text-sm text-[#546E7A]">No applicants yet.</p>
        ) : (
          <div className="divide-y divide-[#E8F0EB]">
            {myApplicants.map((app) => {
              const job = myJobs.find((j) => j.id === app.jobId);
              const workerProfile = users.find(
                (u) => u.id === app.workerId && u.role === 'worker'
              ) as WorkerProfile | undefined;

              return (
                <div
                  key={app.id}
                  className="py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-base text-[#123B65]">{app.workerName}</span>
                      <span className="text-xs text-[#546E7A] font-mono tabular-nums">
                        {app.workerMobile}
                      </span>
                      {workerProfile && (
                        <span className="text-xs text-[#455A64]">
                          · {workerProfile.experienceYears} {t('lblYears')} · {workerProfile.location.area}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-[#455A64]">
                      {job?.title || app.jobId}
                    </div>
                    {app.note && (
                      <p className="text-xs text-[#546E7A] italic">"{app.note}"</p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    {workerProfile && (
                      <button
                        type="button"
                        onClick={() => setSelectedWorker(workerProfile)}
                        className="min-h-[38px] px-3.5 py-1.5 rounded-lg bg-[#E8F0EB] hover:bg-[#DCE8E0] text-[#123B65] text-xs font-semibold inline-flex items-center gap-1.5"
                      >
                        <User className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{t('btnViewWorkerProfile')}</span>
                      </button>
                    )}

                    {app.status === 'pending' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleDecision(app.id, 'accepted')}
                          className="min-h-[38px] px-4 py-1.5 rounded-lg bg-[#16A36A] hover:bg-[#138A58] text-white text-xs font-semibold inline-flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>{t('btnAccept')}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDecision(app.id, 'rejected')}
                          className="min-h-[38px] px-4 py-1.5 rounded-lg bg-white border border-[#FECACA] hover:bg-[#FEF2F2] text-[#991B1B] text-xs font-semibold inline-flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>{t('btnReject')}</span>
                        </button>
                      </>
                    ) : (
                      <span
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                          app.status === 'accepted'
                            ? 'bg-[#E8F0EB] text-[#14532D]'
                            : 'bg-[#FEF2F2] text-[#991B1B]'
                        }`}
                      >
                        {app.status === 'accepted' ? t('statusAccepted') : t('statusRejected')}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Posted Jobs Table */}
      <section className="bg-white border border-[#D4E2D9] rounded-xl p-5 sm:p-6 space-y-4">
        <h2 className="text-xl font-bold text-[#123B65]">{t('postedJobsSection')}</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#D4E2D9] text-xs text-[#546E7A]">
                <th className="py-2.5 pr-4 font-semibold">{t('lblJobTitle')}</th>
                <th className="py-2.5 pr-4 font-semibold">{t('lblLocation')}</th>
                <th className="py-2.5 pr-4 font-semibold text-right">{t('lblDailyWage')}</th>
                <th className="py-2.5 pr-4 font-semibold text-right">{t('statTotalApplicants')}</th>
                <th className="py-2.5 pr-4 font-semibold">Status</th>
                <th className="py-2.5 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8F0EB]">
              {myJobs.map((job) => {
                const count = myApplicants.filter((a) => a.jobId === job.id).length;
                return (
                  <tr key={job.id} className="hover:bg-[#F7F9F7]">
                    <td className="py-3 pr-4 font-semibold text-[#123B65]">
                      <Link to={`/jobs/${job.id}`} className="hover:underline">
                        {job.title}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 text-[#455A64]">{job.location.area}</td>
                    <td className="py-3 pr-4 text-right font-mono tabular-nums text-[#16A36A] font-semibold">
                      ₹{job.dailyWage}
                    </td>
                    <td className="py-3 pr-4 text-right font-mono tabular-nums">{count}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`font-semibold text-xs ${
                          job.status === 'open'
                            ? 'text-[#16A36A]'
                            : job.status === 'removed'
                            ? 'text-[#991B1B]'
                            : 'text-[#546E7A]'
                        }`}
                      >
                        {job.status === 'open'
                          ? t('statusOpen')
                          : job.status === 'removed'
                          ? t('statusRemoved')
                          : t('statusClosed')}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      {job.status !== 'removed' && (
                        <button
                          type="button"
                          onClick={() => toggleJobStatus(job.id)}
                          className="text-xs font-semibold text-[#123B65] hover:underline"
                        >
                          {job.status === 'open' ? t('btnCloseJob') : t('btnReopenJob')}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <WorkerProfileModal worker={selectedWorker} onClose={() => setSelectedWorker(null)} />
    </div>
  );
};
