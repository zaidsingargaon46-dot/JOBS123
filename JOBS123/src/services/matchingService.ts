import { JobPosting, MatchBreakdown, MatchReason, WorkerProfile } from '../types';
import { calculateDistanceKm } from './locationService';

// Transparent rule-based weighted matching algorithm for Phase 1:
// - Skills match: 40%
// - Location proximity: 25%
// - Wage compatibility: 15%
// - Experience: 10%
// - Availability: 10%

export function computeJobMatch(worker: WorkerProfile, job: JobPosting): MatchBreakdown {
  const reasons: MatchReason[] = [];

  // 1. Skills Match (40 points)
  const workerSkillsLower = worker.skills.map((s) => s.toLowerCase());
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  for (const reqSkill of job.requiredSkills) {
    const reqLower = reqSkill.toLowerCase();
    const isMatched = workerSkillsLower.some(
      (ws) => ws === reqLower || ws.includes(reqLower) || reqLower.includes(ws)
    );
    if (isMatched) {
      matchedSkills.push(reqSkill);
    } else {
      missingSkills.push(reqSkill);
    }
  }

  const skillsRatio =
    job.requiredSkills.length > 0 ? matchedSkills.length / job.requiredSkills.length : 1;
  const skillsScore = Math.round(skillsRatio * 40);

  if (matchedSkills.length > 0) {
    reasons.push({
      factor: 'skills',
      key: 'matchReasonSkillsFull',
      params: { matched: matchedSkills.length, total: job.requiredSkills.length, skills: matchedSkills.join(', ') },
      positive: true,
    });
  } else {
    reasons.push({
      factor: 'skills',
      key: 'matchReasonSkillsNone',
      params: { required: job.requiredSkills.join(', ') },
      positive: false,
    });
  }

  // 2. Location Proximity (25 points)
  const distanceKm = calculateDistanceKm(
    worker.location.lat,
    worker.location.lng,
    job.location.lat,
    job.location.lng
  );

  let locationScore = 0;
  if (distanceKm <= 3) locationScore = 25;
  else if (distanceKm <= 5) locationScore = 22;
  else if (distanceKm <= 10) locationScore = 18;
  else if (distanceKm <= 15) locationScore = 13;
  else if (distanceKm <= 20) locationScore = 9;
  else if (distanceKm <= 35) locationScore = 4;
  else locationScore = 0;

  reasons.push({
    factor: 'location',
    key: distanceKm <= 10 ? 'matchReasonLocationClose' : 'matchReasonLocationFar',
    params: { distance: distanceKm, area: job.location.area },
    positive: distanceKm <= 10,
  });

  // 3. Wage Compatibility (15 points)
  let wageScore = 0;
  if (job.dailyWage >= worker.expectedDailyWage) {
    wageScore = 15;
    reasons.push({
      factor: 'wage',
      key: 'matchReasonWageGood',
      params: { jobWage: job.dailyWage, expectedWage: worker.expectedDailyWage },
      positive: true,
    });
  } else {
    const ratio = job.dailyWage / Math.max(1, worker.expectedDailyWage);
    if (ratio >= 0.85) {
      wageScore = 10;
    } else if (ratio >= 0.7) {
      wageScore = 5;
    } else {
      wageScore = 0;
    }
    reasons.push({
      factor: 'wage',
      key: 'matchReasonWageLower',
      params: { jobWage: job.dailyWage, expectedWage: worker.expectedDailyWage },
      positive: ratio >= 0.85,
    });
  }

  // 4. Experience (10 points)
  let experienceScore = 0;
  if (worker.experienceYears >= job.experienceRequired) {
    experienceScore = 10;
    reasons.push({
      factor: 'experience',
      key: 'matchReasonExpMet',
      params: { years: worker.experienceYears, required: job.experienceRequired },
      positive: true,
    });
  } else {
    experienceScore = Math.max(
      2,
      Math.round((worker.experienceYears / Math.max(1, job.experienceRequired)) * 10)
    );
    reasons.push({
      factor: 'experience',
      key: 'matchReasonExpPartial',
      params: { years: worker.experienceYears, required: job.experienceRequired },
      positive: false,
    });
  }

  // 5. Availability (10 points)
  let availabilityScore = 0;
  if (
    worker.availability === job.availabilityType ||
    worker.availability === 'immediate' ||
    (worker.availability === 'full_day' && job.availabilityType === 'immediate')
  ) {
    availabilityScore = 10;
    reasons.push({
      factor: 'availability',
      key: 'matchReasonAvailMatch',
      positive: true,
    });
  } else {
    availabilityScore = 5;
    reasons.push({
      factor: 'availability',
      key: 'matchReasonAvailPartial',
      positive: false,
    });
  }

  const totalScore = Math.min(
    100,
    skillsScore + locationScore + wageScore + experienceScore + availabilityScore
  );

  return {
    totalScore,
    skillsScore,
    locationScore,
    wageScore,
    experienceScore,
    availabilityScore,
    distanceKm,
    matchedSkills,
    missingSkills,
    reasons,
  };
}
