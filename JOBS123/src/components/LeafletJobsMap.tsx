import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { GeoLocation, JobPosting } from '../types';
import { calculateDistanceKm } from '../services/locationService';

interface LeafletJobsMapProps {
  center: GeoLocation;
  radiusKm: number | null;
  jobs: JobPosting[];
  onSelectJob: (jobId: string) => void;
  yourLocationLabel: string;
  perDayLabel: string;
  viewDetailsLabel: string;
  kmAwayLabel: string;
}

export const LeafletJobsMap: React.FC<LeafletJobsMapProps> = ({
  center,
  radiusKm,
  jobs,
  onSelectJob,
  yourLocationLabel,
  perDayLabel,
  viewDetailsLabel,
  kmAwayLabel,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [center.lat, center.lng],
      zoom: 12,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    const group = L.layerGroup().addTo(map);
    mapRef.current = map;
    layerGroupRef.current = group;

    return () => {
      map.remove();
      mapRef.current = null;
      layerGroupRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const group = layerGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();
    map.setView([center.lat, center.lng], radiusKm && radiusKm <= 5 ? 13 : radiusKm && radiusKm <= 10 ? 12 : 11);

    // Radius circle
    if (radiusKm) {
      L.circle([center.lat, center.lng], {
        radius: radiusKm * 1000,
        color: '#123B65',
        weight: 1.5,
        fillColor: '#16A36A',
        fillOpacity: 0.08,
      }).addTo(group);
    }

    // User location pin
    const userIcon = L.divIcon({
      className: '',
      html: `<div class="kc-map-pin" style="width:20px;height:20px;background:#123B65;"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    L.marker([center.lat, center.lng], { icon: userIcon })
      .bindPopup(
        `<div style="font-size:13px;line-height:1.4"><strong>${yourLocationLabel}</strong><br/>${center.name}</div>`
      )
      .addTo(group);

    // Job pins
    for (const job of jobs) {
      const dist = calculateDistanceKm(center.lat, center.lng, job.location.lat, job.location.lng);
      const jobIcon = L.divIcon({
        className: '',
        html: `<div class="kc-map-pin" style="width:26px;height:26px;background:#16A36A;color:#fff;font-size:11px;font-weight:700;">₹</div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });

      const popupEl = document.createElement('div');
      popupEl.style.minWidth = '190px';
      popupEl.innerHTML = `
        <div style="font-weight:700;color:#123B65;font-size:14px;margin-bottom:4px;">${job.title}</div>
        <div style="font-size:12px;color:#455A64;margin-bottom:4px;">${job.employerBusinessName} · ${job.location.area}</div>
        <div style="font-size:13px;font-weight:700;color:#16A36A;margin-bottom:8px;">₹${job.dailyWage} ${perDayLabel} · ${dist} ${kmAwayLabel}</div>
      `;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = viewDetailsLabel;
      btn.style.cssText =
        'background:#123B65;color:#fff;border:none;border-radius:6px;padding:6px 12px;font-size:12px;font-weight:600;cursor:pointer;width:100%;';
      btn.onclick = () => onSelectJob(job.id);
      popupEl.appendChild(btn);

      L.marker([job.location.lat, job.location.lng], { icon: jobIcon })
        .bindPopup(popupEl)
        .addTo(group);
    }
  }, [center, radiusKm, jobs, onSelectJob, yourLocationLabel, perDayLabel, viewDetailsLabel, kmAwayLabel]);

  return (
    <div
      ref={containerRef}
      aria-label="OpenStreetMap nearby jobs map"
      className="w-full h-[420px] lg:h-[520px] rounded-xl border border-[#C8D6CE] overflow-hidden bg-[#E8F0EB]"
    />
  );
};
