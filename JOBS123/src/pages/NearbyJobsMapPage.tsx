import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateDistanceKm } from '../services/locationService';
import { LocationPicker } from '../components/LocationPicker';
import { LeafletJobsMap } from '../components/LeafletJobsMap';

export const NearbyJobsMapPage: React.FC = () => {
  const { t, jobs, userLocation, setUserLocation } = useApp();
  const navigate = useNavigate();
  const [radiusKm, setRadiusKm] = useState<number | null>(10);

  const visibleJobs = useMemo(() => {
    return jobs
      .filter((j) => j.status === 'open')
      .map((job) => ({
        job,
        distanceKm: calculateDistanceKm(
          userLocation.lat,
          userLocation.lng,
          job.location.lat,
          job.location.lng
        ),
      }))
      .filter(({ distanceKm }) => (radiusKm === null ? true : distanceKm <= radiusKm))
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [jobs, userLocation, radiusKm]);

  return (
    <div className="max-w-[1320px] mx-auto px-4 sm:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#123B65]">{t('mapTitle')}</h1>
        <p className="text-sm sm:text-base text-[#546E7A] mt-1">{t('mapSubtitle')}</p>
      </div>

      {/* Location & Radius Controls */}
      <div className="bg-white border border-[#D4E2D9] rounded-xl p-5 space-y-4">
        <LocationPicker value={userLocation} onChange={setUserLocation} label={t('yourLocation')} />

        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#E8F0EB]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-[#263238] mr-1">{t('filterRadius')}:</span>
            {[5, 10, 20, null].map((rad) => {
              const active = radiusKm === rad;
              return (
                <button
                  key={String(rad)}
                  type="button"
                  onClick={() => setRadiusKm(rad)}
                  className={`min-h-[36px] px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                    active
                      ? 'bg-[#123B65] text-white'
                      : 'bg-[#E8F0EB] text-[#263238] hover:bg-[#DCE8E0]'
                  }`}
                >
                  {rad === null ? t('filterAllDistances') : `${rad} km`}
                </button>
              );
            })}
          </div>

          <span className="text-sm text-[#546E7A] tabular-nums font-medium">
            {visibleJobs.length} {t('jobsWithinRadius')}
          </span>
        </div>
      </div>

      {/* Map + Nearby List Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8">
          <LeafletJobsMap
            center={userLocation}
            radiusKm={radiusKm}
            jobs={visibleJobs.map((v) => v.job)}
            onSelectJob={(jobId) => navigate(`/jobs/${jobId}`)}
            yourLocationLabel={t('yourLocation')}
            perDayLabel={t('lblPerDay')}
            viewDetailsLabel={t('btnViewDetails')}
            kmAwayLabel={t('lblKmAway')}
          />
        </div>

        <div className="lg:col-span-4 space-y-3 max-h-[520px] overflow-y-auto pr-1">
          {visibleJobs.length === 0 ? (
            <div className="bg-white border border-[#D4E2D9] rounded-xl p-6 text-center text-sm text-[#546E7A]">
              {t('noJobsFound')}
            </div>
          ) : (
            visibleJobs.map(({ job, distanceKm }) => (
              <Link
                key={job.id}
                to={`/jobs/${job.id}`}
                className="block bg-white border border-[#D4E2D9] hover:border-[#123B65] rounded-xl p-4 space-y-1.5 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-bold text-sm text-[#123B65] leading-snug">{job.title}</h2>
                  <span className="font-bold text-sm text-[#16A36A] tabular-nums font-mono shrink-0">
                    ₹{job.dailyWage}
                  </span>
                </div>
                <div className="text-xs text-[#546E7A] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#123B65]" aria-hidden="true" />
                  <span>{job.location.area}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums font-semibold text-[#123B65]">
                    {distanceKm} {t('lblKmAway')}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
