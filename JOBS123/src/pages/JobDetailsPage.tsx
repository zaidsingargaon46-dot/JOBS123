import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Flag,
  MapPin,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateDistanceKm } from '../services/locationService';
import { computeJobMatch } from '../services/matchingService';

export const JobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    t,
    tSkill,
    jobs,
    currentUser,
    applications,
    applyToJob,
    reportJob,
    userLocation,
  } = useApp();

  const [applyNote, setApplyNote] = useState('');
  const [applyMsg, setApplyMsg] = useState<string | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSent, setReportSent] = useState(false);

  const job = useMemo(() => jobs.find((j) => j.id === id), [jobs, id]);

  const workerUser = currentUser?.role === 'worker' ? currentUser : null;
  const alreadyApplied = workerUser && job
    ? applications.some((a) => a.jobId === job.id && a.workerId === workerUser.id)
    : false;

  const match = useMemo(() => {
    if (!workerUser || !job) return null;
    return computeJobMatch(workerUser, job);
  }, [workerUser, job]);

  if (!job) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-12 text-center space-y-4">
        <p className="text-[#546E7A]">{t('noJobsFound')}</p>
        <Link to="/jobs" className="inline-flex px-5 py-2.5 rounded-lg bg-[#123B65] text-white text-sm font-semibold">
          {t('btnBack')}
        </Link>
      </div>
    );
  }

  const distanceKm = calculateDistanceKm(
    userLocation.lat,
    userLocation.lng,
    job.location.lat,
    job.location.lng
  );

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const res = applyToJob(job.id, applyNote);
    if (res.ok) {
      setApplyMsg(t('applySuccess'));
    } else if (res.errorKey) {
      setApplyMsg(t(res.errorKey));
    }
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason.trim()) return;
    reportJob(job.id, reportReason);
    setReportSent(true);
    setShowReport(false);
    setReportReason('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#123B65] hover:underline"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        <span>{t('btnBack')}</span>
      </button>

      <div className="bg-white border border-[#D4E2D9] rounded-xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#E8F0EB] pb-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-sm text-[#546E7A]">
              <span className="font-semibold text-[#263238]">{job.employerBusinessName}</span>
              {job.employerVerified && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1 text-[#16A36A] font-semibold">
                    <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                    {t('verifiedEmployer')}
                  </span>
                </>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#123B65]">{job.title}</h1>
          </div>

          <div className="sm:text-right shrink-0">
            <div className="text-3xl font-bold text-[#16A36A] tabular-nums font-mono">
              ₹{job.dailyWage}
            </div>
            <div className="text-sm text-[#546E7A]">{t('lblDailyWage')} {t('lblPerDay')}</div>
          </div>
        </div>

        {/* Structured Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#F7F9F7] border border-[#E8F0EB] rounded-lg p-4 text-sm">
          <div>
            <div className="text-xs text-[#546E7A]">{t('lblLocation')}</div>
            <div className="font-semibold text-[#263238] mt-0.5 inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#123B65]" aria-hidden="true" />
              <span>{job.location.area} ({distanceKm} km)</span>
            </div>
          </div>
          <div>
            <div className="text-xs text-[#546E7A]">{t('lblWorkingHours')}</div>
            <div className="font-semibold text-[#263238] mt-0.5 inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#123B65]" aria-hidden="true" />
              <span>{job.workingHours}</span>
            </div>
          </div>
          <div>
            <div className="text-xs text-[#546E7A]">{t('lblJoiningDate')}</div>
            <div className="font-semibold text-[#263238] mt-0.5 tabular-nums inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#123B65]" aria-hidden="true" />
              <span>{job.joiningDate}</span>
            </div>
          </div>
          <div>
            <div className="text-xs text-[#546E7A]">{t('lblWorkersNeeded')}</div>
            <div className="font-semibold text-[#263238] mt-0.5 tabular-nums inline-flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#123B65]" aria-hidden="true" />
              <span>{job.workersNeeded} · {job.experienceRequired}+ {t('lblYears')}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-base font-bold text-[#123B65]">{t('lblDescription')}</h2>
          <p className="text-base text-[#263238] leading-relaxed">{job.description}</p>
        </div>

        <div className="space-y-1.5">
          <h2 className="text-base font-bold text-[#123B65]">{t('lblRequiredSkills')}</h2>
          <p className="text-sm font-medium text-[#263238]">
            {job.requiredSkills.map((s) => tSkill(s)).join(' · ')}
          </p>
        </div>

        {/* AI Match Breakdown (for signed-in Worker) */}
        {match && (
          <div className="bg-[#E8F0EB]/60 border border-[#C8D6CE] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#123B65]">{t('aiRecWhyTitle')}</h2>
              <span className="text-xl font-bold text-[#16A36A] font-mono tabular-nums">
                {match.totalScore}/100
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-[#D4E2D9]">
                <div className="text-[#546E7A]">{t('weightSkills')}</div>
                <div className="font-bold text-[#123B65] tabular-nums font-mono text-sm mt-0.5">
                  {match.skillsScore}/40
                </div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-[#D4E2D9]">
                <div className="text-[#546E7A]">{t('weightLocation')}</div>
                <div className="font-bold text-[#123B65] tabular-nums font-mono text-sm mt-0.5">
                  {match.locationScore}/25
                </div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-[#D4E2D9]">
                <div className="text-[#546E7A]">{t('weightWage')}</div>
                <div className="font-bold text-[#123B65] tabular-nums font-mono text-sm mt-0.5">
                  {match.wageScore}/15
                </div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-[#D4E2D9]">
                <div className="text-[#546E7A]">{t('weightExperience')}</div>
                <div className="font-bold text-[#123B65] tabular-nums font-mono text-sm mt-0.5">
                  {match.experienceScore}/10
                </div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-[#D4E2D9]">
                <div className="text-[#546E7A]">{t('weightAvailability')}</div>
                <div className="font-bold text-[#123B65] tabular-nums font-mono text-sm mt-0.5">
                  {match.availabilityScore}/10
                </div>
              </div>
            </div>

            <ul className="space-y-1.5 text-sm text-[#263238]">
              {match.reasons.map((r, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className={`font-bold ${r.positive ? 'text-[#16A36A]' : 'text-[#546E7A]'}`}>
                    {r.positive ? '✓' : '·'}
                  </span>
                  <span>{t(r.key, r.params)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Apply Form */}
        {applyMsg && (
          <div role="status" className="p-3.5 rounded-lg bg-[#E8F0EB] border border-[#BBF7D0] text-sm font-medium text-[#14532D]">
            {applyMsg}
          </div>
        )}

        {workerUser ? (
          alreadyApplied ? (
            <div className="p-4 rounded-lg bg-[#E8F0EB] border border-[#BBF7D0] flex items-center justify-between flex-wrap gap-3">
              <span className="font-semibold text-[#14532D] inline-flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#16A36A]" aria-hidden="true" />
                {t('btnApplied')}
              </span>
              <Link to="/worker/applications" className="text-sm font-semibold text-[#123B65] hover:underline">
                {t('navApplications')}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleApply} className="space-y-3 pt-2 border-t border-[#E8F0EB]">
              <label htmlFor="apply-note" className="block text-sm font-semibold text-[#263238]">
                {t('applyNoteLabel')}
              </label>
              <textarea
                id="apply-note"
                rows={2}
                value={applyNote}
                onChange={(e) => setApplyNote(e.target.value)}
                placeholder={t('applyNotePlaceholder')}
                className="w-full p-3 border border-[#C8D6CE] rounded-lg text-sm"
              />
              <button
                type="submit"
                className="min-h-[48px] px-6 py-3 rounded-lg bg-[#16A36A] hover:bg-[#138A58] text-white font-semibold text-base transition-colors"
              >
                {t('btnApplyNow')}
              </button>
            </form>
          )
        ) : (
          !currentUser && (
            <div className="p-4 rounded-lg bg-[#F7F9F7] border border-[#D4E2D9] flex items-center justify-between flex-wrap gap-3">
              <span className="text-sm text-[#455A64]">{t('applyOnlyWorkers')}</span>
              <Link
                to="/login"
                className="min-h-[40px] px-4 py-2 rounded-lg bg-[#123B65] text-white text-sm font-semibold inline-flex items-center"
              >
                {t('navLogin')}
              </Link>
            </div>
          )
        )}

        {/* Report Suspicious Job */}
        {currentUser && (
          <div className="pt-4 border-t border-[#E8F0EB]">
            {reportSent ? (
              <p className="text-sm text-[#14532D] font-medium">{t('reportSubmitted')}</p>
            ) : !showReport ? (
              <button
                type="button"
                onClick={() => setShowReport(true)}
                className="text-xs font-semibold text-[#991B1B] hover:underline inline-flex items-center gap-1.5"
              >
                <Flag className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{t('reportJobBtn')}</span>
              </button>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-3 bg-[#FEF2F2] border border-[#FECACA] rounded-lg p-4">
                <label className="block text-sm font-semibold text-[#991B1B]">{t('reportReasonLabel')}</label>
                <textarea
                  rows={2}
                  required
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder={t('reportReasonPlaceholder')}
                  className="w-full p-2.5 bg-white border border-[#FECACA] rounded-lg text-sm"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#991B1B] text-white text-xs font-semibold"
                  >
                    {t('btnSubmit')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReport(false)}
                    className="px-4 py-2 rounded-lg bg-white border border-[#C8D6CE] text-xs font-semibold text-[#263238]"
                  >
                    {t('btnCancel')}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
