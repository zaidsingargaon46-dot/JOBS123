import React from 'react';
import { MapPin, Phone, User, X, Briefcase, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WorkerProfile } from '../types';

interface WorkerProfileModalProps {
  worker: WorkerProfile | null;
  onClose: () => void;
}

export const WorkerProfileModal: React.FC<WorkerProfileModalProps> = ({ worker, onClose }) => {
  const { t, tSkill } = useApp();
  if (!worker) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={worker.name}
      className="fixed inset-0 z-50 bg-[#123B65]/40 backdrop-blur-[2px] flex items-center justify-center p-4"
    >
      <div className="bg-white border border-[#C8D6CE] rounded-xl max-w-lg w-full p-6 space-y-5 shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {worker.photoUrl ? (
              <img
                src={worker.photoUrl}
                alt={worker.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-full object-cover border border-[#C8D6CE]"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#E8F0EB] flex items-center justify-center text-[#123B65]">
                <User className="w-7 h-7" />
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold text-[#123B65]">{worker.name}</h3>
              <p className="text-sm text-[#546E7A] inline-flex items-center gap-1.5 mt-0.5 tabular-nums">
                <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                {worker.mobile}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t('btnClose')}
            className="p-2 rounded-lg text-[#546E7A] hover:bg-[#F7F9F7] hover:text-[#263238]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm bg-[#F7F9F7] p-4 rounded-lg border border-[#E8F0EB]">
          <div>
            <div className="text-xs text-[#546E7A]">{t('lblExpectedWage')}</div>
            <div className="font-bold text-[#16A36A] tabular-nums font-mono text-base">
              ₹{worker.expectedDailyWage} {t('lblPerDay')}
            </div>
          </div>
          <div>
            <div className="text-xs text-[#546E7A]">{t('lblExperience')}</div>
            <div className="font-semibold text-[#263238] tabular-nums inline-flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-[#123B65]" aria-hidden="true" />
              {worker.experienceYears} {t('lblYears')}
            </div>
          </div>
          <div>
            <div className="text-xs text-[#546E7A]">{t('lblLocation')}</div>
            <div className="font-medium text-[#263238] inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#123B65]" aria-hidden="true" />
              {worker.location.area}
            </div>
          </div>
          <div>
            <div className="text-xs text-[#546E7A]">{t('lblAvailability')}</div>
            <div className="font-medium text-[#263238] inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#123B65]" aria-hidden="true" />
              {t(`avail_${worker.availability}`)}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-semibold text-[#546E7A]">{t('lblSkills')}</div>
          <div className="text-sm font-medium text-[#123B65]">
            {worker.skills.map((s) => tSkill(s)).join(' · ')}
          </div>
        </div>

        {worker.bio && (
          <div className="space-y-1">
            <div className="text-xs font-semibold text-[#546E7A]">{t('lblBio')}</div>
            <p className="text-sm text-[#263238] leading-relaxed">{worker.bio}</p>
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-[#E8F0EB]">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[40px] px-5 py-2 rounded-lg bg-[#123B65] text-white text-sm font-semibold hover:bg-[#0E2E4F] transition-colors"
          >
            {t('btnClose')}
          </button>
        </div>
      </div>
    </div>
  );
};
