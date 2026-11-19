import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, ShieldCheck, UserCheck, UserX } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EmployerProfile, WorkerProfile } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const {
    t,
    currentUser,
    users,
    jobs,
    applications,
    reports,
    verifyEmployer,
    toggleUserActive,
    resolveReport,
    loginDemo,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'accounts' | 'verifications' | 'reports'>('accounts');

  const workers = useMemo(
    () => users.filter((u) => u.role === 'worker') as WorkerProfile[],
    [users]
  );
  const employers = useMemo(
    () => users.filter((u) => u.role === 'employer') as EmployerProfile[],
    [users]
  );

  if (currentUser?.role !== 'admin') {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-4">
        <h1 className="text-2xl font-bold text-[#123B65]">{t('adminDashTitle')}</h1>
        <button
          type="button"
          onClick={() => loginDemo('admin')}
          className="min-h-[44px] px-5 py-2.5 rounded-lg bg-[#123B65] text-white text-sm font-semibold"
        >
          {t('btnEnterAsAdmin')}
        </button>
      </div>
    );
  }

  const activeJobsCount = jobs.filter((j) => j.status === 'open').length;
  const pendingReportsCount = reports.filter((r) => r.status === 'pending').length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#123B65]">{t('adminDashTitle')}</h1>
        <p className="text-sm sm:text-base text-[#546E7A] mt-1">{t('adminDashSubtitle')}</p>
      </div>

      {/* Platform KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#D4E2D9] rounded-xl p-5">
          <div className="text-xs font-semibold text-[#546E7A]">{t('statTotalWorkers')}</div>
          <div className="text-2xl font-bold text-[#123B65] font-mono tabular-nums mt-1">{workers.length}</div>
        </div>
        <div className="bg-white border border-[#D4E2D9] rounded-xl p-5">
          <div className="text-xs font-semibold text-[#546E7A]">{t('statTotalEmployers')}</div>
          <div className="text-2xl font-bold text-[#123B65] font-mono tabular-nums mt-1">{employers.length}</div>
        </div>
        <div className="bg-white border border-[#D4E2D9] rounded-xl p-5">
          <div className="text-xs font-semibold text-[#546E7A]">{t('statTotalJobs')}</div>
          <div className="text-2xl font-bold text-[#16A36A] font-mono tabular-nums mt-1">{activeJobsCount}</div>
        </div>
        <div className="bg-white border border-[#D4E2D9] rounded-xl p-5">
          <div className="text-xs font-semibold text-[#546E7A]">{t('statTotalApplications')}</div>
          <div className="text-2xl font-bold text-[#123B65] font-mono tabular-nums mt-1">{applications.length}</div>
        </div>
      </div>

      {/* Platform Breakdown Strip */}
      <div className="bg-white border border-[#D4E2D9] rounded-xl p-5 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        <div className="space-y-1.5">
          <div className="text-xs font-semibold text-[#546E7A]">{t('statVerification')}</div>
          <div className="font-mono tabular-nums text-[#263238]">
            {employers.filter((e) => e.verified).length} {t('verifiedEmployer')} ·{' '}
            {employers.filter((e) => !e.verified).length} {t('unverifiedEmployer')}
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="text-xs font-semibold text-[#546E7A]">{t('statTotalApplications')}</div>
          <div className="font-mono tabular-nums text-[#263238]">
            {applications.filter((a) => a.status === 'accepted').length} {t('statusAccepted')} ·{' '}
            {applications.filter((a) => a.status === 'pending').length} {t('statusPending')}
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="text-xs font-semibold text-[#546E7A]">{t('tabReports')}</div>
          <div className="font-mono tabular-nums text-[#B45309] font-semibold">
            {pendingReportsCount} {t('statusPending')}
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="inline-flex flex-wrap gap-1 p-1 bg-[#E8F0EB] rounded-lg border border-[#D4E2D9]">
        {(
          [
            { id: 'accounts', label: t('tabAccounts') },
            { id: 'verifications', label: t('tabVerifications') },
            { id: 'reports', label: `${t('tabReports')} (${pendingReportsCount})` },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`min-h-[40px] px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
              activeTab === tab.id ? 'bg-[#123B65] text-white' : 'text-[#263238] hover:bg-white/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Accounts Management */}
      {activeTab === 'accounts' && (
        <div className="bg-white border border-[#D4E2D9] rounded-xl p-5 sm:p-6 overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#D4E2D9] text-xs text-[#546E7A]">
                <th className="py-2.5 pr-4 font-semibold">{t('lblFullName')}</th>
                <th className="py-2.5 pr-4 font-semibold">Role</th>
                <th className="py-2.5 pr-4 font-semibold">{t('lblMobile')}</th>
                <th className="py-2.5 pr-4 font-semibold">{t('lblLocation')}</th>
                <th className="py-2.5 pr-4 font-semibold">Status</th>
                <th className="py-2.5 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8F0EB]">
              {[...workers, ...employers].map((account) => (
                <tr key={account.id} className="hover:bg-[#F7F9F7]">
                  <td className="py-3 pr-4 font-semibold text-[#123B65]">
                    {account.name}
                    {account.role === 'employer' && (
                      <div className="text-xs font-normal text-[#546E7A]">{account.businessName}</div>
                    )}
                  </td>
                  <td className="py-3 pr-4 capitalize text-[#455A64]">{account.role}</td>
                  <td className="py-3 pr-4 font-mono tabular-nums text-[#263238]">{account.mobile}</td>
                  <td className="py-3 pr-4 text-[#455A64]">{account.location.area}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold ${
                        account.active ? 'text-[#16A36A]' : 'text-[#991B1B]'
                      }`}
                    >
                      {account.active ? (
                        <UserCheck className="w-3.5 h-3.5" aria-hidden="true" />
                      ) : (
                        <UserX className="w-3.5 h-3.5" aria-hidden="true" />
                      )}
                      {account.active ? t('accountActive') : t('accountSuspended')}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      type="button"
                      onClick={() => toggleUserActive(account.id)}
                      className={`min-h-[34px] px-3 py-1 rounded-md text-xs font-semibold border ${
                        account.active
                          ? 'border-[#FECACA] text-[#991B1B] hover:bg-[#FEF2F2]'
                          : 'border-[#BBF7D0] text-[#14532D] hover:bg-[#E8F0EB]'
                      }`}
                    >
                      {account.active ? t('btnSuspend') : t('btnActivate')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Employer Verification */}
      {activeTab === 'verifications' && (
        <div className="space-y-4">
          {employers.map((emp) => (
            <div
              key={emp.id}
              className="bg-white border border-[#D4E2D9] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-base text-[#123B65]">{emp.businessName}</h2>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold ${
                      emp.verified ? 'text-[#16A36A]' : 'text-[#B45309]'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                    {emp.verified ? t('verifiedEmployer') : t('unverifiedEmployer')}
                  </span>
                </div>
                <div className="text-sm text-[#546E7A]">
                  {emp.name} · <span className="font-mono tabular-nums">{emp.mobile}</span> · {emp.location.area}
                </div>
                {emp.description && (
                  <p className="text-xs text-[#455A64]">{emp.description}</p>
                )}
              </div>

              <button
                type="button"
                onClick={() => verifyEmployer(emp.id, !emp.verified)}
                className={`min-h-[40px] px-4 py-2 rounded-lg text-sm font-semibold shrink-0 transition-colors ${
                  emp.verified
                    ? 'bg-white border border-[#C8D6CE] text-[#263238] hover:bg-[#F7F9F7]'
                    : 'bg-[#16A36A] hover:bg-[#138A58] text-white'
                }`}
              >
                {emp.verified ? t('btnRevokeVerify') : t('btnVerifyEmployer')}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Reported Jobs */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {reports.length === 0 ? (
            <div className="bg-white border border-[#D4E2D9] rounded-xl p-8 text-center text-sm text-[#546E7A]">
              No reported listings.
            </div>
          ) : (
            reports.map((rep) => {
              const job = jobs.find((j) => j.id === rep.jobId);
              return (
                <div
                  key={rep.id}
                  className="bg-white border border-[#D4E2D9] rounded-xl p-5 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#B45309]">
                        <AlertTriangle className="w-4 h-4" aria-hidden="true" />
                        <span>Reported by {rep.reporterName}</span>
                        <span aria-hidden="true">·</span>
                        <span className="uppercase">{rep.status}</span>
                      </div>
                      <Link
                        to={`/jobs/${rep.jobId}`}
                        className="text-lg font-bold text-[#123B65] hover:underline block"
                      >
                        {job?.title || rep.jobId}
                      </Link>
                      {job && (
                        <div className="text-xs text-[#546E7A]">
                          {job.employerBusinessName} · {job.location.area} · ₹{job.dailyWage}
                        </div>
                      )}
                    </div>

                    {rep.status === 'pending' ? (
                      <div className="flex flex-wrap gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => resolveReport(rep.id, 'dismiss')}
                          className="min-h-[38px] px-4 py-1.5 rounded-lg bg-[#E8F0EB] text-[#123B65] text-xs font-semibold"
                        >
                          {t('btnDismissReport')}
                        </button>
                        <button
                          type="button"
                          onClick={() => resolveReport(rep.id, 'remove_job')}
                          className="min-h-[38px] px-4 py-1.5 rounded-lg bg-[#991B1B] text-white text-xs font-semibold"
                        >
                          {t('btnRemoveJob')}
                        </button>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#16A36A]">
                        <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                        {rep.status === 'removed' ? t('statusRemoved') : 'Dismissed'}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-[#263238] bg-[#F7F9F7] border border-[#E8F0EB] rounded-lg p-3">
                    {rep.reason}
                  </p>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
