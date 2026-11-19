import { GeoLocation } from '../types';

export const PRESET_LOCATIONS: GeoLocation[] = [
  { name: 'Koramangala, Bengaluru', area: 'Koramangala', city: 'Bengaluru', lat: 12.9352, lng: 77.6245 },
  { name: 'Indiranagar, Bengaluru', area: 'Indiranagar', city: 'Bengaluru', lat: 12.9784, lng: 77.6408 },
  { name: 'Jayanagar, Bengaluru', area: 'Jayanagar', city: 'Bengaluru', lat: 12.9299, lng: 77.5824 },
  { name: 'HSR Layout, Bengaluru', area: 'HSR Layout', city: 'Bengaluru', lat: 12.9116, lng: 77.6389 },
  { name: 'Whitefield, Bengaluru', area: 'Whitefield', city: 'Bengaluru', lat: 12.9698, lng: 77.7500 },
  { name: 'Yeshwanthpur, Bengaluru', area: 'Yeshwanthpur', city: 'Bengaluru', lat: 13.0285, lng: 77.5462 },
  { name: 'Malleswaram, Bengaluru', area: 'Malleswaram', city: 'Bengaluru', lat: 13.0031, lng: 77.5643 },
  { name: 'Electronic City, Bengaluru', area: 'Electronic City', city: 'Bengaluru', lat: 12.8452, lng: 77.6602 },
  { name: 'Yelahanka, Bengaluru', area: 'Yelahanka', city: 'Bengaluru', lat: 13.1007, lng: 77.5963 },
  { name: 'Hebbal, Bengaluru', area: 'Hebbal', city: 'Bengaluru', lat: 13.0358, lng: 77.5970 },
  { name: 'Banashankari, Bengaluru', area: 'Banashankari', city: 'Bengaluru', lat: 12.9255, lng: 77.5468 },
  { name: 'Peenya Industrial Area, Bengaluru', area: 'Peenya', city: 'Bengaluru', lat: 13.0285, lng: 77.5197 },
];

export const DEFAULT_CENTER: GeoLocation = PRESET_LOCATIONS[0];

export function calculateDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function resolveLocationFromText(input: string): GeoLocation {
  const trimmed = input.trim();
  if (!trimmed) return DEFAULT_CENTER;
  const lower = trimmed.toLowerCase();
  const exact = PRESET_LOCATIONS.find(
    (loc) =>
      loc.name.toLowerCase() === lower ||
      loc.area.toLowerCase() === lower ||
      lower.includes(loc.area.toLowerCase())
  );
  if (exact) return exact;

  // Deterministic slight offset around central Bengaluru for custom area strings
  let hash = 0;
  for (let i = 0; i < lower.length; i++) {
    hash = (hash * 31 + lower.charCodeAt(i)) % 1000;
  }
  const latOffset = ((hash % 40) - 20) * 0.0025;
  const lngOffset = (((hash * 7) % 40) - 20) * 0.0025;

  return {
    name: trimmed,
    area: trimmed.split(',')[0].trim(),
    city: trimmed.includes(',') ? trimmed.split(',')[1].trim() : 'Bengaluru',
    lat: Number((12.9716 + latOffset).toFixed(4)),
    lng: Number((77.5946 + lngOffset).toFixed(4)),
  };
}

export interface GpsResult {
  success: boolean;
  location?: GeoLocation;
  errorType?: 'unsupported' | 'denied' | 'unavailable' | 'timeout';
}

export function requestBrowserGps(): Promise<GpsResult> {
  return new Promise((resolve) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      resolve({ success: false, errorType: 'unsupported' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(5));
        const lng = Number(pos.coords.longitude.toFixed(5));
        // Find nearest preset locality label if close, otherwise show GPS coordinates label
        let nearest = PRESET_LOCATIONS[0];
        let minDist = Infinity;
        for (const loc of PRESET_LOCATIONS) {
          const d = calculateDistanceKm(lat, lng, loc.lat, loc.lng);
          if (d < minDist) {
            minDist = d;
            nearest = loc;
          }
        }
        const label =
          minDist <= 8
            ? `Near ${nearest.area} (GPS)`
            : `GPS (${lat.toFixed(3)}, ${lng.toFixed(3)})`;

        resolve({
          success: true,
          location: {
            name: label,
            area: minDist <= 8 ? nearest.area : 'Current GPS',
            city: minDist <= 8 ? nearest.city : 'Local Area',
            lat,
            lng,
          },
        });
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          resolve({ success: false, errorType: 'denied' });
        } else if (err.code === err.TIMEOUT) {
          resolve({ success: false, errorType: 'timeout' });
        } else {
          resolve({ success: false, errorType: 'unavailable' });
        }
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
    );
  });
}
