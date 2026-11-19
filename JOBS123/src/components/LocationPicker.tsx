import React, { useState } from 'react';
import { LocateFixed, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  PRESET_LOCATIONS,
  requestBrowserGps,
  resolveLocationFromText,
} from '../services/locationService';
import { GeoLocation } from '../types';

interface LocationPickerProps {
  value: GeoLocation;
  onChange: (loc: GeoLocation) => void;
  label?: string;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({ value, onChange, label }) => {
  const { t } = useApp();
  const [manualText, setManualText] = useState(value.name);
  const [gpsStatus, setGpsStatus] = useState<{ type: 'info' | 'error'; text: string } | null>(null);
  const [detecting, setDetecting] = useState(false);

  const handlePresetSelect = (name: string) => {
    setGpsStatus(null);
    const found = PRESET_LOCATIONS.find((l) => l.name === name);
    if (found) {
      setManualText(found.name);
      onChange(found);
    }
  };

  const handleManualInput = (text: string) => {
    setManualText(text);
    onChange(resolveLocationFromText(text));
  };

  const handleGpsClick = async () => {
    setDetecting(true);
    setGpsStatus(null);
    const result = await requestBrowserGps();
    setDetecting(false);

    if (result.success && result.location) {
      setManualText(result.location.name);
      onChange(result.location);
      setGpsStatus({ type: 'info', text: t('gpsSuccess') });
    } else if (result.errorType === 'denied') {
      setGpsStatus({ type: 'error', text: t('gpsPermissionDenied') });
    } else {
      setGpsStatus({ type: 'error', text: t('gpsUnavailable') });
    }
  };

  return (
    <div className="space-y-2.5">
      {label && (
        <label className="block text-sm font-semibold text-[#263238]">{label}</label>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div className="relative">
          <MapPin
            className="w-4 h-4 text-[#546E7A] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            value={manualText}
            onChange={(e) => handleManualInput(e.target.value)}
            placeholder="e.g. Koramangala, Bengaluru"
            aria-label={label || t('lblLocation')}
            className="w-full min-h-[44px] pl-9 pr-3 py-2 bg-white border border-[#C8D6CE] rounded-lg text-sm text-[#263238] focus:outline-none focus:ring-2 focus:ring-[#123B65]"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={PRESET_LOCATIONS.some((l) => l.name === value.name) ? value.name : ''}
            onChange={(e) => handlePresetSelect(e.target.value)}
            aria-label={t('filterLocation')}
            className="flex-1 min-h-[44px] px-3 py-2 bg-white border border-[#C8D6CE] rounded-lg text-sm text-[#263238] focus:outline-none focus:ring-2 focus:ring-[#123B65]"
          >
            <option value="">{t('filterLocation')}...</option>
            {PRESET_LOCATIONS.map((loc) => (
              <option key={loc.name} value={loc.name}>
                {loc.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleGpsClick}
            disabled={detecting}
            className="min-h-[44px] px-3.5 py-2 bg-[#E8F0EB] hover:bg-[#DCE8E0] text-[#123B65] border border-[#C8D6CE] rounded-lg text-sm font-semibold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors"
          >
            <LocateFixed className="w-4 h-4" />
            <span>{detecting ? t('btnDetectingGps') : t('btnUseGps')}</span>
          </button>
        </div>
      </div>

      {gpsStatus && (
        <p
          role="status"
          className={`text-xs px-3 py-2 rounded-md border ${
            gpsStatus.type === 'error'
              ? 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]'
              : 'bg-[#E8F0EB] text-[#14532D] border-[#BBF7D0]'
          }`}
        >
          {gpsStatus.text}
        </p>
      )}
    </div>
  );
};
