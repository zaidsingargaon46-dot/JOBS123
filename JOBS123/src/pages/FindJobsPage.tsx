import React, { useMemo, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AVAILABLE_SKILLS } from '../services/dataRepository';
import { calculateDistanceKm, PRESET_LOCATIONS } from '../services/locationService';
import { computeJobMatch } from '../services/matchingService';
import { VoiceSearchInput } from '../components/VoiceSearchInput';
import { JobCard } from '../components/JobCard';
import { LocationPicker } from '../components/LocationPicker';

export const FindJobsPage: React.FC = () => {
  const {
    t,
    tSkill,
    jobs,
    currentUser,
    applications,
    applyToJob,
    userLocation,
    setUserLocation,
  } = useApp();

  const [query, setQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('all');
  const [areaFilter, setAreaFilter] = useState('all');
  const [availFilter, setAvailFilter] = useState('all');
  const [minWage, setMinWage] = useState<number>(0);
  const [maxDistanceKm, setMaxDistanceKm] = useState<number | null>(null);
  const [showLocationBar, setShowLocationBar] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const workerUser = currentUser?.role === 'worker' ? currentUser : null;

  const filteredJobs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs
      .filter((job) => job.status === 'open')
      .map((job) => {
        const distanceKm = calculateDistanceKm(
          userLocation.lat,
          userLocation.lng,
          job.location.lat,
          job.location.lng
        );
        const match = workerUser ? computeJobMatch(workerUser, job) : undefined;
        return { job, distanceKm, match };
      })
      .filter(({ job, distanceKm }) => {
        if (q) {
          const hay = `${job.title} ${job.description} ${job.location.area} ${job.employerBusinessName} ${job.requiredSkills.join(' ')}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        if (skillFilter !== 'all' && !job.requiredSkills.includes(skillFilter)) {
          return false;
        }
        if (areaFilter !== 'all' && job.location.area !== areaFilter) {
          return false;
        }
        if (availFilter !== 'all' && job.availabilityType !== availFilter) {
          return false;
        }
        if (minWage > 0 && job.dailyWage < minWage) {
          return false;
        }
        if (maxDistanceKm !== null && distanceKm > maxDistanceKm) {
          return false;
        }
        return true;
      });
  }, [jobs, query, skillFilter, areaFilter, availFilter, minWage, maxDistanceKm, userLocation, workerUser]);

  const handleApply = (jobId: string) => {
    const res = applyToJob(jobId);
    if (res.ok) {
      setFeedback(t('applySuccess'));
    } else if (res.errorKey) {
      setFeedback(t(res.errorKey));
    }
  };

  const resetFilters = () => {
    setQuery('');
    setSkillFilter('all');
    setAreaFilter('all');
    setAvailFilter('all');
    setMinWage(0);
    setMaxDistanceKm(null);
  };

  return (
    <div className="max-w-[1320px] mx-auto px-4 sm:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#123B65]">{t('findJobsTitle')}</h1>
          <p className="text-sm sm:text-base text-[#546E7A] mt-1">{t('findJobsSubtitle')}</p>
        </div>

        <button
          type="button"
          onClick={() => setShowLocationBar(!showLocationBar)}
          className="min-h-[42px] px-4 py-2 rounded-lg bg-white border border-[#C8D6CE] text-sm font-semibold text-[#123B65] inline-flex items-center gap-2 hover:bg-[#E8F0EB] self-start sm:self-auto"
        >
          <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
          <span>{t('yourLocation')}: {userLocation.area}</span>
        </button>
      </div>

      {showLocationBar && (
        <div className="bg-white border border-[#D4E2D9] rounded-xl p-5">
          <LocationPicker value={userLocation} onChange={setUserLocation} label={t('yourLocation')} />
        </div>
      )}

      {/* Search & Filters Panel */}
      <div className="bg-white border border-[#D4E2D9] rounded-xl p-5 space-y-4">
        <VoiceSearchInput value={query} onChange={setQuery} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#546E7A] mb-1">{t('filterSkill')}</label>
            <select
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="w-full min-h-[42px] px-3 py-2 bg-[#F7F9F7] border border-[#C8D6CE] rounded-lg text-sm"
            >
              <option value="all">{t('filterAllSkills')}</option>
              {AVAILABLE_SKILLS.map((s) => (
                <option key={s} value={s}>{tSkill(s)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#546E7A] mb-1">{t('filterLocation')}</label>
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="w-full min-h-[42px] px-3 py-2 bg-[#F7F9F7] border border-[#C8D6CE] rounded-lg text-sm"
            >
              <option value="all">{t('filterAllLocations')}</option>
              {PRESET_LOCATIONS.map((loc) => (
                <option key={loc.area} value={loc.area}>{loc.area}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#546E7A] mb-1">{t('filterMinWage')}</label>
            <select
              value={minWage}
              onChange={(e) => setMinWage(Number(e.target.value))}
              className="w-full min-h-[42px] px-3 py-2 bg-[#F7F9F7] border border-[#C8D6CE] rounded-lg text-sm tabular-nums"
            >
              <option value={0}>Any Wage</option>
              <option value={600}>₹600+</option>
              <option value={800}>₹800+</option>
              <option value={950}>₹950+</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#546E7A] mb-1">{t('filterAvailability')}</label>
            <select
              value={availFilter}
              onChange={(e) => setAvailFilter(e.target.value)}
              className="w-full min-h-[42px] px-3 py-2 bg-[#F7F9F7] border border-[#C8D6CE] rounded-lg text-sm"
            >
              <option value="all">{t('filterAllAvailability')}</option>
              <option value="immediate">{t('avail_immediate')}</option>
              <option value="full_day">{t('avail_full_day')}</option>
              <option value="part_time">{t('avail_part_time')}</option>
              <option value="weekends">{t('avail_weekends')}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#546E7A] mb-1">{t('filterRadius')}</label>
            <select
              value={maxDistanceKm === null ? 'all' : String(maxDistanceKm)}
              onChange={(e) => setMaxDistanceKm(e.target.value === 'all' ? null : Number(e.target.value))}
              className="w-full min-h-[42px] px-3 py-2 bg-[#F7F9F7] border border-[#C8D6CE] rounded-lg text-sm tabular-nums"
            >
              <option value="all">{t('filterAllDistances')}</option>
              <option value="5">5 km</option>
              <option value="10">10 km</option>
              <option value="20">20 km</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#E8F0EB] text-sm">
          <span className="text-[#546E7A] tabular-nums font-medium">
            {filteredJobs.length} {t('jobsWithinRadius')}
          </span>
          <button
            type="button"
            onClick={resetFilters}
            className="text-[#123B65] font-semibold hover:underline"
          >
            {t('btnResetFilters')}
          </button>
        </div>
      </div>

      {feedback && (
        <div role="status" className="p-3.5 rounded-lg bg-[#E8F0EB] border border-[#BBF7D0] text-sm font-medium text-[#14532D]">
          {feedback}
        </div>
      )}

      {filteredJobs.length === 0 ? (
        <div className="bg-white border border-[#D4E2D9] rounded-xl p-10 text-center space-y-4">
          <p className="text-[#546E7A]">{t('noJobsFound')}</p>
          <button
            type="button"
            onClick={resetFilters}
            className="min-h-[42px] px-5 py-2 rounded-lg bg-[#123B65] text-white text-sm font-semibold"
          >
            {t('btnResetFilters')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredJobs.map(({ job, distanceKm, match }) => {
            const isApplied = workerUser
              ? applications.some((a) => a.jobId === job.id && a.workerId === workerUser.id)
              : false;
            return (
              <JobCard
                key={job.id}
                job={job}
                distanceKm={distanceKm}
                match={match}
                applied={isApplied}
                onApply={workerUser ? handleApply : undefined}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
