export type Language = 'en' | 'kn' | 'hi';

export type UserRole = 'worker' | 'employer' | 'admin';

export type AvailabilityType = 'immediate' | 'full_day' | 'part_time' | 'weekends';

export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';

export type JobStatus = 'open' | 'closed' | 'removed';

export interface GeoLocation {
  name: string;
  area: string;
  city: string;
  lat: number;
  lng: number;
}

export interface WorkerProfile {
  id: string;
  role: 'worker';
  name: string;
  mobile: string;
  passwordHash: string;
  skills: string[];
  experienceYears: number;
  location: GeoLocation;
  expectedDailyWage: number;
  availability: AvailabilityType;
  photoUrl?: string;
  bio?: string;
  active: boolean;
  createdAt: string;
}

export interface EmployerProfile {
  id: string;
  role: 'employer';
  name: string;
  businessName: string;
  businessType: string;
  mobile: string;
  passwordHash: string;
  location: GeoLocation;
  verified: boolean;
  active: boolean;
  description?: string;
  createdAt: string;
}

export interface AdminProfile {
  id: string;
  role: 'admin';
  name: string;
  mobile: string;
  passwordHash: string;
  active: boolean;
  createdAt: string;
}

export type UserAccount = WorkerProfile | EmployerProfile | AdminProfile;

export interface JobPosting {
  id: string;
  employerId: string;
  employerName: string;
  employerBusinessName: string;
  employerVerified: boolean;
  title: string;
  description: string;
  requiredSkills: string[];
  location: GeoLocation;
  dailyWage: number;
  workersNeeded: number;
  experienceRequired: number;
  workingHours: string;
  joiningDate: string;
  availabilityType: AvailabilityType;
  status: JobStatus;
  createdAt: string;
}

export interface Application {
  id: string;
  jobId: string;
  workerId: string;
  workerName: string;
  workerMobile: string;
  employerId: string;
  status: ApplicationStatus;
  note?: string;
  appliedAt: string;
  updatedAt: string;
}

export interface ReportedJob {
  id: string;
  jobId: string;
  reporterId: string;
  reporterName: string;
  reason: string;
  status: 'pending' | 'dismissed' | 'removed';
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  titleKey: string;
  messageKey: string;
  params?: Record<string, string | number>;
  type: 'info' | 'success' | 'warning';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface MatchReason {
  factor: 'skills' | 'location' | 'wage' | 'experience' | 'availability';
  key: string;
  params?: Record<string, string | number>;
  positive: boolean;
}

export interface MatchBreakdown {
  totalScore: number;
  skillsScore: number;
  locationScore: number;
  wageScore: number;
  experienceScore: number;
  availabilityScore: number;
  distanceKm: number;
  matchedSkills: string[];
  missingSkills: string[];
  reasons: MatchReason[];
}

export interface AccessibilitySettings {
  largeText: boolean;
  highContrast: boolean;
}
