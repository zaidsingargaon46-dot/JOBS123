import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, Trash2, XCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ApplicationStatus } from '../types';

export const MyApplicationsPage: React.FC = () => {
  const { t, currentUser, applications, jobs, withdrawApplication, loginDemo } = useApp();
  const [filter, setFilter] = useState<'all' | ApplicationStatus>('all');
  const [message, setMessage] = useState<string | null>(null);

  const worker = currentUser?.role === 'worker' ? currentUser : null;

  const myApps = useMemo(() => {
    if (!worker) return [];
    return applications
      .filter((a) => a.workerId === worker.id)
      .filter((a) => (filter === 'all' ? true : a.status === filter));
  }, [applications, worker, filter]);

  if (!worker) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-4">
        <h1 className="text-2xl font-bold text-[#123B65]">{t('myAppsTitle')}</h1>
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

  const handleWithdraw = (appId: string) => {
    withdrawApplication(appId);
    setMessage(t('appWithdrawn'));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#123B65]">{t('myAppsTitle')}</h1>
        <p className="text-sm sm:text-base text-[#546E7A] mt-1">{t('myAppsSubtitle')}</p>
      </div>

      {/* Status Filter Tabs */}
      <div className="inline-flex flex-wrap gap-1 p-1 bg-[#E8F0EB] rounded-lg border border-[#D4E2D9]">
        {(
          [
            { id: 'all', label: 'All' },
            { id: 'pending', label: t('statusPending') },
            { id: 'accepted', label: t('statusAccepted') },
            { id: 'rejected', label: t('statusRejected') },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={`min-h-[38px] px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${
              filter === tab.id ? 'bg-[#123B65] text-white' : 'text-[#263238] hover:bg-white/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {message && (
        <div role="status" className="p-3.5 rounded-lg bg-[#E8F0EB] border border-[#BBF7D0] text-sm text-[#14532D]">
          {message}
        </div>
      )}

      {myApps.length === 0 ? (
        <div className="bg-white border border-[#D4E2D9] rounded-xl p-10 text-center space-y-4">
          <p className="text-[#546E7A]">{t('noAppsYet')}</p>
          <Link
            to="/jobs"
            className="inline-flex min-h-[42px] px-5 py-2 rounded-lg bg-[#16A36A] text-white text-sm font-semibold items-center"
          >
            {t('ctaFindJob')}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {myApps.map((app) => {
            const job = jobs.find((j) => j.id === app.jobId);
            if (!job) return null;

            return (
              <div
                key={app.id}
                className="bg-white border border-[#D4E2D9] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <Link
                    to={`/jobs/${job.id}`}
                    className="text-lg font-bold text-[#123B65] hover:underline"
                  >
                    {job.title}
                  </Link>
                  <div className="text-sm text-[#546E7A]">
                    {job.employerBusinessName} · {job.location.area} ·{' '}
                    <span className="font-mono tabular-nums text-[#16A36A] font-semibold">
                      ₹{job.dailyWage} {t('lblPerDay')}
                    </span>
                  </div>
                  <div className="text-xs text-[#607D8B] tabular-nums">
                    {t('lblJoiningDate')}: {job.joiningDate} · {job.workingHours}
                  </div>
                  {app.note && (
                    <p className="text-xs text-[#455A64] pt-1 italic">"{app.note}"</p>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold border ${
                      app.status === 'accepted'
                        ? 'bg-[#E8F0EB] text-[#14532D] border-[#BBF7D0]'
                        : app.status === 'rejected'
                        ? 'bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]'
                        : 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]'
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

                  {app.status === 'pending' && (
                    <button
                      type="button"
                      onClick={() => handleWithdraw(app.id)}
                      className="min-h-[38px] px-3 py-1.5 rounded-lg border border-[#FECACA] text-xs font-semibold text-[#991B1B] hover:bg-[#FEF2F2] inline-flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{t('withdrawApp')}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
