import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, MapPin, ShieldCheck, Clock, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { JobPosting, MatchBreakdown } from '../types';

interface JobCardProps {
  job: JobPosting;
  distanceKm?: number;
  match?: MatchBreakdown;
  applied?: boolean;
  onApply?: (jobId: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  distanceKm,
  match,
  applied,
  onApply,
}) => {
  const { t, tSkill, currentUser } = useApp();
  const isWorker = currentUser?.role === 'worker';

  return (
    <article className="bg-white border border-[#D4E2D9] rounded-xl p-5 flex flex-col justify-between gap-4 hover:border-[#123B65]/40 transition-colors">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-[#546E7A] mb-1">
              <span className="font-medium text-[#263238] truncate">{job.employerBusinessName}</span>
              {job.employerVerified && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1 text-[#16A36A] font-semibold whitespace-nowrap">
                    <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                    {t('verifiedEmployer')}
                  </span>
                </>
              )}
            </div>
            <Link
              to={`/jobs/${job.id}`}
              className="text-lg font-bold text-[#123B65] hover:underline leading-snug block"
            >
              {job.title}
            </Link>
          </div>

          <div className="text-right shrink-0">
            <div className="text-xl font-bold text-[#16A36A] tabular-nums font-mono">
              ₹{job.dailyWage}
            </div>
            <div className="text-xs text-[#546E7A]">{t('lblPerDay')}</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#455A64]">
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-4 h-4 text-[#123B65]" aria-hidden="true" />
            {job.location.area}
            {typeof distanceKm === 'number' && (
              <span className="tabular-nums text-[#123B65] font-medium ml-1">
                ({distanceKm} {t('lblKmAway')})
              </span>
            )}
          </span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-4 h-4 text-[#546E7A]" aria-hidden="true" />
            {t(`avail_${job.availabilityType}`)}
          </span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1 tabular-nums">
            <Users className="w-4 h-4 text-[#546E7A]" aria-hidden="true" />
            {job.workersNeeded} {t('lblWorkersNeeded')}
          </span>
        </div>

        <p className="text-sm text-[#455A64] line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        <div className="text-xs text-[#546E7A]">
          <span className="font-semibold text-[#263238]">{t('lblRequiredSkills')}: </span>
          {job.requiredSkills.map((s) => tSkill(s)).join(' · ')}
        </div>

        {match && (
          <div className="pt-2 border-t border-[#E8F0EB] flex items-center justify-between gap-4">
            <span className="text-xs font-semibold text-[#123B65]">
              {t('aiRecTotalScore')}:
            </span>
            <div className="flex items-center gap-2.5 flex-1 max-w-[200px]">
              <div className="flex-1 h-2 bg-[#E8F0EB] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#16A36A] rounded-full"
                  style={{ width: `${match.totalScore}%` }}
                />
              </div>
              <span className="text-sm font-bold text-[#123B65] tabular-nums font-mono">
                {match.totalScore}/100
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="pt-2 flex flex-wrap items-center justify-between gap-2.5 border-t border-[#F0F4F1]">
        <Link
          to={`/jobs/${job.id}`}
          className="min-h-[40px] px-4 py-2 rounded-lg text-sm font-semibold text-[#123B65] bg-[#E8F0EB] hover:bg-[#DCE8E0] transition-colors inline-flex items-center justify-center whitespace-nowrap shrink-0"
        >
          {t('btnViewDetails')}
        </Link>

        {isWorker && onApply && (
          applied ? (
            <span className="min-h-[40px] px-4 py-2 rounded-lg text-sm font-semibold text-[#14532D] bg-[#E8F0EB] inline-flex items-center gap-1.5 whitespace-nowrap shrink-0">
              <CheckCircle2 className="w-4 h-4 text-[#16A36A]" aria-hidden="true" />
              {t('btnApplied')}
            </span>
          ) : (
            <button
              type="button"
              onClick={() => onApply(job.id)}
              className="min-h-[40px] px-5 py-2 rounded-lg text-sm font-semibold text-white bg-[#16A36A] hover:bg-[#138A58] transition-colors whitespace-nowrap shrink-0"
            >
              {t('btnApplyNow')}
            </button>
          )
        )}
      </div>
    </article>
  );
};
