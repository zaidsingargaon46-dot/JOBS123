import {
  AdminProfile,
  Application,
  AppNotification,
  EmployerProfile,
  JobPosting,
  ReportedJob,
  UserAccount,
  WorkerProfile,
} from '../types';
import { PRESET_LOCATIONS } from './locationService';
import { hashPassword } from './security';

const STORAGE_KEYS = {
  USERS: 'kaamconnect_p1_users',
  JOBS: 'kaamconnect_p1_jobs',
  APPLICATIONS: 'kaamconnect_p1_applications',
  REPORTS: 'kaamconnect_p1_reports',
  NOTIFICATIONS: 'kaamconnect_p1_notifications',
  SESSION_USER_ID: 'kaamconnect_p1_session_uid',
};

export const AVAILABLE_SKILLS = [
  'Mason',
  'Electrician',
  'Plumber',
  'Carpenter',
  'Painter',
  'Welder',
  'Helper',
  'Solar Technician',
  'AC Technician',
  'Tile Setter',
  'Gardener',
  'Loader',
];

export const DEMO_CREDENTIALS = {
  worker: { mobile: '9845011223', label: 'Ramesh Gowda (Worker)' },
  employer: { mobile: '9880022334', label: 'Suresh Shetty (Employer)' },
  admin: { mobile: '9900099000', label: 'Priya Nair (Admin)' },
};

async function createInitialSeedData() {
  const workerHash = await hashPassword('worker123');
  const employerHash = await hashPassword('employer123');
  const adminHash = await hashPassword('admin123');

  const users: UserAccount[] = [
    {
      id: 'w-1',
      role: 'worker',
      name: 'Ramesh Gowda',
      mobile: '9845011223',
      passwordHash: workerHash,
      skills: ['Carpenter', 'Mason', 'Tile Setter'],
      experienceYears: 6,
      location: PRESET_LOCATIONS[0], // Koramangala
      expectedDailyWage: 850,
      availability: 'immediate',
      photoUrl: '/src/assets/images/worker_portrait_ramesh_1795089790589.jpg',
      bio: 'Experienced formwork carpenter and masonry specialist across South Bengaluru residential sites.',
      active: true,
      createdAt: '2026-10-02T09:00:00.000Z',
    } as WorkerProfile,
    {
      id: 'w-2',
      role: 'worker',
      name: 'Lakshmi Devi',
      mobile: '9845033445',
      passwordHash: workerHash,
      skills: ['Electrician', 'Solar Technician', 'Painter'],
      experienceYears: 4,
      location: PRESET_LOCATIONS[1], // Indiranagar
      expectedDailyWage: 900,
      availability: 'full_day',
      photoUrl: '/src/assets/images/worker_portrait_lakshmi_1795089790706.jpg',
      bio: 'Certified house wiring electrician and rooftop solar mounting technician.',
      active: true,
      createdAt: '2026-10-08T10:30:00.000Z',
    } as WorkerProfile,
    {
      id: 'w-3',
      role: 'worker',
      name: 'Mahesh Kumar',
      mobile: '9741055667',
      passwordHash: workerHash,
      skills: ['Plumber', 'Helper', 'Tile Setter'],
      experienceYears: 3,
      location: PRESET_LOCATIONS[2], // Jayanagar
      expectedDailyWage: 750,
      availability: 'immediate',
      bio: 'Sanitary pipeline fitting, bathroom waterproofing, and tile grouting worker.',
      active: true,
      createdAt: '2026-10-14T11:15:00.000Z',
    } as WorkerProfile,
    {
      id: 'w-4',
      role: 'worker',
      name: 'Arjun Yadav',
      mobile: '9611077889',
      passwordHash: workerHash,
      skills: ['Welder', 'Helper', 'Loader'],
      experienceYears: 5,
      location: PRESET_LOCATIONS[5], // Yeshwanthpur
      expectedDailyWage: 800,
      availability: 'weekends',
      bio: 'Arc welding, gate fabrication, and warehouse material shifting.',
      active: true,
      createdAt: '2026-10-20T08:45:00.000Z',
    } as WorkerProfile,
    {
      id: 'e-1',
      role: 'employer',
      name: 'Suresh Shetty',
      businessName: 'Shetty BuildTech Contractors',
      businessType: 'Residential & Commercial Construction',
      mobile: '9880022334',
      passwordHash: employerHash,
      location: PRESET_LOCATIONS[0], // Koramangala
      verified: true,
      active: true,
      description: 'Direct daily-wage hiring for apartment finishing, electrical, and renovation projects across South Bengaluru.',
      createdAt: '2026-09-15T09:00:00.000Z',
    } as EmployerProfile,
    {
      id: 'e-2',
      role: 'employer',
      name: 'Anitha Rao',
      businessName: 'GreenWatt Solar & Interiors',
      businessType: 'Solar & Home Maintenance',
      mobile: '9880044556',
      passwordHash: employerHash,
      location: PRESET_LOCATIONS[1], // Indiranagar
      verified: true,
      active: true,
      description: 'Rooftop solar installations, home electrical upgrades, and interior painting projects.',
      createdAt: '2026-09-22T14:20:00.000Z',
    } as EmployerProfile,
    {
      id: 'e-3',
      role: 'employer',
      name: 'Vikram Logistics Hub',
      businessName: 'Vikram Warehousing Services',
      businessType: 'Warehousing & Fabrication',
      mobile: '9880066778',
      passwordHash: employerHash,
      location: PRESET_LOCATIONS[4], // Whitefield
      verified: false,
      active: true,
      description: 'Industrial shelving assembly, welding repair, and morning loading shifts.',
      createdAt: '2026-11-01T11:00:00.000Z',
    } as EmployerProfile,
    {
      id: 'a-1',
      role: 'admin',
      name: 'Priya Nair',
      mobile: '9900099000',
      passwordHash: adminHash,
      active: true,
      createdAt: '2026-09-01T08:00:00.000Z',
    } as AdminProfile,
  ];

  const jobs: JobPosting[] = [
    {
      id: 'j-101',
      employerId: 'e-1',
      employerName: 'Suresh Shetty',
      employerBusinessName: 'Shetty BuildTech Contractors',
      employerVerified: true,
      title: 'Senior Shuttering Carpenter & Helper',
      description: 'Need experienced shuttering carpenter for 3-floor residential slab formwork near Koramangala 4th Block. Tools and safety helmets provided at site. Daily wage settled every evening via UPI or cash.',
      requiredSkills: ['Carpenter', 'Mason'],
      location: PRESET_LOCATIONS[0], // Koramangala
      dailyWage: 950,
      workersNeeded: 4,
      experienceRequired: 3,
      workingHours: '8:30 AM – 5:30 PM',
      joiningDate: '2026-11-21',
      availabilityType: 'immediate',
      status: 'open',
      createdAt: '2026-11-16T08:00:00.000Z',
    },
    {
      id: 'j-102',
      employerId: 'e-1',
      employerName: 'Suresh Shetty',
      employerBusinessName: 'Shetty BuildTech Contractors',
      employerVerified: true,
      title: 'Bathroom Tile Setter & Plumber',
      description: 'Renovation work for 6 apartment bathrooms in HSR Layout Sector 2. Looking for skilled tile cutter/setter and CPVC pipeline plumber. Tea and afternoon break included.',
      requiredSkills: ['Tile Setter', 'Plumber'],
      location: PRESET_LOCATIONS[3], // HSR Layout
      dailyWage: 900,
      workersNeeded: 2,
      experienceRequired: 2,
      workingHours: '9:00 AM – 6:00 PM',
      joiningDate: '2026-11-22',
      availabilityType: 'full_day',
      status: 'open',
      createdAt: '2026-11-17T09:30:00.000Z',
    },
    {
      id: 'j-103',
      employerId: 'e-2',
      employerName: 'Anitha Rao',
      employerBusinessName: 'GreenWatt Solar & Interiors',
      employerVerified: true,
      title: 'Rooftop Solar Panel Wiring Electrician',
      description: 'Install DC conduit wiring, inverter connection, and earthing for a 10 kW commercial rooftop solar unit in Indiranagar 100ft Road.',
      requiredSkills: ['Electrician', 'Solar Technician'],
      location: PRESET_LOCATIONS[1], // Indiranagar
      dailyWage: 1050,
      workersNeeded: 3,
      experienceRequired: 2,
      workingHours: '9:00 AM – 5:30 PM',
      joiningDate: '2026-11-20',
      availabilityType: 'immediate',
      status: 'open',
      createdAt: '2026-11-17T13:15:00.000Z',
    },
    {
      id: 'j-104',
      employerId: 'e-2',
      employerName: 'Anitha Rao',
      employerBusinessName: 'GreenWatt Solar & Interiors',
      employerVerified: true,
      title: 'Interior Wall Putty & Emulsion Painter',
      description: 'Clean interior repainting of a 3BHK house in Jayanagar 4th Block. Brushes, rollers, and paint supplied. Neat finishing required.',
      requiredSkills: ['Painter'],
      location: PRESET_LOCATIONS[2], // Jayanagar
      dailyWage: 800,
      workersNeeded: 3,
      experienceRequired: 1,
      workingHours: '9:00 AM – 5:00 PM',
      joiningDate: '2026-11-24',
      availabilityType: 'full_day',
      status: 'open',
      createdAt: '2026-11-18T07:45:00.000Z',
    },
    {
      id: 'j-105',
      employerId: 'e-3',
      employerName: 'Vikram Logistics Hub',
      employerBusinessName: 'Vikram Warehousing Services',
      employerVerified: false,
      title: 'Steel Rack Welder & Warehouse Loader',
      description: 'Repair heavy steel storage racks and assist with pallet unloading in Whitefield ITPL Main Road warehouse.',
      requiredSkills: ['Welder', 'Loader'],
      location: PRESET_LOCATIONS[4], // Whitefield
      dailyWage: 850,
      workersNeeded: 5,
      experienceRequired: 2,
      workingHours: '8:00 AM – 4:30 PM',
      joiningDate: '2026-11-23',
      availabilityType: 'weekends',
      status: 'open',
      createdAt: '2026-11-18T11:20:00.000Z',
    },
    {
      id: 'j-106',
      employerId: 'e-1',
      employerName: 'Suresh Shetty',
      employerBusinessName: 'Shetty BuildTech Contractors',
      employerVerified: true,
      title: 'Plastering Mason & Site Helper',
      description: 'Exterior boundary wall plastering and curing support in Malleswaram 8th Cross. Weekly bonus for consistent attendance.',
      requiredSkills: ['Mason', 'Helper'],
      location: PRESET_LOCATIONS[6], // Malleswaram
      dailyWage: 820,
      workersNeeded: 4,
      experienceRequired: 2,
      workingHours: '8:30 AM – 5:30 PM',
      joiningDate: '2026-11-21',
      availabilityType: 'immediate',
      status: 'open',
      createdAt: '2026-11-18T15:00:00.000Z',
    },
    {
      id: 'j-107',
      employerId: 'e-2',
      employerName: 'Anitha Rao',
      employerBusinessName: 'GreenWatt Solar & Interiors',
      employerVerified: true,
      title: 'Split AC Servicing & Copper Pipe Technician',
      description: 'Service 8 office split AC units and replace insulation sleeves in Electronic City Phase 1.',
      requiredSkills: ['AC Technician', 'Electrician'],
      location: PRESET_LOCATIONS[7], // Electronic City
      dailyWage: 1100,
      workersNeeded: 2,
      experienceRequired: 3,
      workingHours: '9:30 AM – 6:00 PM',
      joiningDate: '2026-11-25',
      availabilityType: 'part_time',
      status: 'open',
      createdAt: '2026-11-19T06:00:00.000Z',
    },
  ];

  const applications: Application[] = [
    {
      id: 'app-1',
      jobId: 'j-101',
      workerId: 'w-1',
      workerName: 'Ramesh Gowda',
      workerMobile: '9845011223',
      employerId: 'e-1',
      status: 'accepted',
      note: 'I have 6 years of slab shuttering experience and own hand tools.',
      appliedAt: '2026-11-17T10:15:00.000Z',
      updatedAt: '2026-11-18T09:00:00.000Z',
    },
    {
      id: 'app-2',
      jobId: 'j-102',
      workerId: 'w-1',
      workerName: 'Ramesh Gowda',
      workerMobile: '9845011223',
      employerId: 'e-1',
      status: 'pending',
      note: 'Available to start immediately for tile setting work.',
      appliedAt: '2026-11-18T14:20:00.000Z',
      updatedAt: '2026-11-18T14:20:00.000Z',
    },
    {
      id: 'app-3',
      jobId: 'j-103',
      workerId: 'w-2',
      workerName: 'Lakshmi Devi',
      workerMobile: '9845033445',
      employerId: 'e-2',
      status: 'pending',
      note: 'Experienced in rooftop DC wiring and inverter setup.',
      appliedAt: '2026-11-18T16:40:00.000Z',
      updatedAt: '2026-11-18T16:40:00.000Z',
    },
    {
      id: 'app-4',
      jobId: 'j-102',
      workerId: 'w-3',
      workerName: 'Mahesh Kumar',
      workerMobile: '9741055667',
      employerId: 'e-1',
      status: 'rejected',
      note: 'Can handle CPVC bathroom plumbing.',
      appliedAt: '2026-11-17T11:00:00.000Z',
      updatedAt: '2026-11-18T10:30:00.000Z',
    },
  ];

  const reports: ReportedJob[] = [
    {
      id: 'rep-1',
      jobId: 'j-105',
      reporterId: 'w-4',
      reporterName: 'Arjun Yadav',
      reason: 'Employer requested a refundable helmet deposit before site entry. Please verify safety policy.',
      status: 'pending',
      createdAt: '2026-11-18T17:10:00.000Z',
    },
  ];

  const notifications: AppNotification[] = [
    {
      id: 'n-1',
      userId: 'w-1',
      titleKey: 'notifAcceptedTitle',
      messageKey: 'notifAcceptedMsg',
      params: { job: 'Senior Shuttering Carpenter & Helper', employer: 'Shetty BuildTech Contractors' },
      type: 'success',
      read: false,
      link: '/worker/applications',
      createdAt: '2026-11-18T09:00:00.000Z',
    },
    {
      id: 'n-2',
      userId: 'w-1',
      titleKey: 'notifNewMatchTitle',
      messageKey: 'notifNewMatchMsg',
      params: { job: 'Bathroom Tile Setter & Plumber', score: 88 },
      type: 'info',
      read: false,
      link: '/worker/recommendations',
      createdAt: '2026-11-18T12:00:00.000Z',
    },
    {
      id: 'n-3',
      userId: 'e-1',
      titleKey: 'notifNewApplicantTitle',
      messageKey: 'notifNewApplicantMsg',
      params: { worker: 'Ramesh Gowda', job: 'Bathroom Tile Setter & Plumber' },
      type: 'info',
      read: false,
      link: '/employer/dashboard',
      createdAt: '2026-11-18T14:20:00.000Z',
    },
    {
      id: 'n-4',
      userId: 'a-1',
      titleKey: 'notifReportTitle',
      messageKey: 'notifReportMsg',
      params: { job: 'Steel Rack Welder & Warehouse Loader' },
      type: 'warning',
      read: false,
      link: '/admin/dashboard',
      createdAt: '2026-11-18T17:10:00.000Z',
    },
  ];

  return { users, jobs, applications, reports, notifications };
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export const dataRepository = {
  async initialize(): Promise<{
    users: UserAccount[];
    jobs: JobPosting[];
    applications: Application[];
    reports: ReportedJob[];
    notifications: AppNotification[];
    sessionUserId: string | null;
  }> {
    const existingUsers = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!existingUsers) {
      const seed = await createInitialSeedData();
      writeJson(STORAGE_KEYS.USERS, seed.users);
      writeJson(STORAGE_KEYS.JOBS, seed.jobs);
      writeJson(STORAGE_KEYS.APPLICATIONS, seed.applications);
      writeJson(STORAGE_KEYS.REPORTS, seed.reports);
      writeJson(STORAGE_KEYS.NOTIFICATIONS, seed.notifications);
    }

    return {
      users: readJson<UserAccount[]>(STORAGE_KEYS.USERS, []),
      jobs: readJson<JobPosting[]>(STORAGE_KEYS.JOBS, []),
      applications: readJson<Application[]>(STORAGE_KEYS.APPLICATIONS, []),
      reports: readJson<ReportedJob[]>(STORAGE_KEYS.REPORTS, []),
      notifications: readJson<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, []),
      sessionUserId: localStorage.getItem(STORAGE_KEYS.SESSION_USER_ID),
    };
  },

  async resetDemoData() {
    const seed = await createInitialSeedData();
    writeJson(STORAGE_KEYS.USERS, seed.users);
    writeJson(STORAGE_KEYS.JOBS, seed.jobs);
    writeJson(STORAGE_KEYS.APPLICATIONS, seed.applications);
    writeJson(STORAGE_KEYS.REPORTS, seed.reports);
    writeJson(STORAGE_KEYS.NOTIFICATIONS, seed.notifications);
    localStorage.removeItem(STORAGE_KEYS.SESSION_USER_ID);
    return seed;
  },

  saveUsers(users: UserAccount[]) {
    writeJson(STORAGE_KEYS.USERS, users);
  },

  saveJobs(jobs: JobPosting[]) {
    writeJson(STORAGE_KEYS.JOBS, jobs);
  },

  saveApplications(applications: Application[]) {
    writeJson(STORAGE_KEYS.APPLICATIONS, applications);
  },

  saveReports(reports: ReportedJob[]) {
    writeJson(STORAGE_KEYS.REPORTS, reports);
  },

  saveNotifications(notifications: AppNotification[]) {
    writeJson(STORAGE_KEYS.NOTIFICATIONS, notifications);
  },

  saveSessionUserId(userId: string | null) {
    if (userId) {
      localStorage.setItem(STORAGE_KEYS.SESSION_USER_ID, userId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.SESSION_USER_ID);
    }
  },
};
