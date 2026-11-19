import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { translate, translateSkill, TranslationKeys } from '../i18n';
import { dataRepository, DEMO_CREDENTIALS } from '../services/dataRepository';
import { DEFAULT_CENTER } from '../services/locationService';
import { hashPassword, verifyPassword } from '../services/security';
import {
  AccessibilitySettings,
  Application,
  ApplicationStatus,
  AppNotification,
  AvailabilityType,
  EmployerProfile,
  GeoLocation,
  JobPosting,
  Language,
  ReportedJob,
  UserAccount,
  UserRole,
  WorkerProfile,
} from '../types';

const LANG_STORAGE_KEY = 'kaamconnect_lang';
const ACCESSIBILITY_STORAGE_KEY = 'kaamconnect_accessibility';

interface RegisterWorkerInput {
  name: string;
  mobile: string;
  password: string;
  skills: string[];
  experienceYears: number;
  location: GeoLocation;
  expectedDailyWage: number;
  availability: AvailabilityType;
  photoUrl?: string;
  bio?: string;
}

interface RegisterEmployerInput {
  name: string;
  businessName: string;
  businessType: string;
  mobile: string;
  password: string;
  location: GeoLocation;
  description?: string;
}

interface PostJobInput {
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
}

interface AppContextValue {
  ready: boolean;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKeys | string, params?: Record<string, string | number>) => string;
  tSkill: (skill: string) => string;
  accessibility: AccessibilitySettings;
  setAccessibility: (settings: AccessibilitySettings) => void;
  currentUser: UserAccount | null;
  users: UserAccount[];
  jobs: JobPosting[];
  applications: Application[];
  reports: ReportedJob[];
  notifications: AppNotification[];
  unreadCount: number;
  userLocation: GeoLocation;
  setUserLocation: (loc: GeoLocation) => void;
  login: (mobile: string, password: string) => Promise<{ ok: boolean; role?: UserRole; errorKey?: TranslationKeys }>;
  loginDemo: (role: UserRole) => UserAccount | null;
  registerWorker: (data: RegisterWorkerInput) => Promise<{ ok: boolean; errorKey?: TranslationKeys }>;
  registerEmployer: (data: RegisterEmployerInput) => Promise<{ ok: boolean; errorKey?: TranslationKeys }>;
  logout: () => void;
  updateWorkerProfile: (updates: Partial<WorkerProfile>) => void;
  updateEmployerProfile: (updates: Partial<EmployerProfile>) => void;
  postJob: (data: PostJobInput) => JobPosting | null;
  toggleJobStatus: (jobId: string) => void;
  applyToJob: (jobId: string, note?: string) => { ok: boolean; errorKey?: TranslationKeys };
  withdrawApplication: (applicationId: string) => void;
  respondToApplication: (applicationId: string, status: Exclude<ApplicationStatus, 'pending'>) => void;
  reportJob: (jobId: string, reason: string) => void;
  verifyEmployer: (employerId: string, verified: boolean) => void;
  toggleUserActive: (userId: string) => void;
  resolveReport: (reportId: string, action: 'dismiss' | 'remove_job') => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetDemoData: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ready, setReady] = useState(false);
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    return saved === 'kn' || saved === 'hi' || saved === 'en' ? saved : 'en';
  });
  const [accessibility, setAccessibilityState] = useState<AccessibilitySettings>(() => {
    try {
      const raw = localStorage.getItem(ACCESSIBILITY_STORAGE_KEY);
      if (raw) return JSON.parse(raw) as AccessibilitySettings;
    } catch {
      // ignore
    }
    return { largeText: false, highContrast: false };
  });

  const [users, setUsers] = useState<UserAccount[]>([]);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [reports, setReports] = useState<ReportedJob[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<GeoLocation>(DEFAULT_CENTER);

  useEffect(() => {
    let active = true;
    dataRepository.initialize().then((state) => {
      if (!active) return;
      setUsers(state.users);
      setJobs(state.jobs);
      setApplications(state.applications);
      setReports(state.reports);
      setNotifications(state.notifications);
      setSessionUserId(state.sessionUserId);
      const found = state.users.find((u) => u.id === state.sessionUserId);
      if (found && 'location' in found) {
        setUserLocation(found.location);
      }
      setReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('large-text', accessibility.largeText);
    root.classList.toggle('high-contrast', accessibility.highContrast);
    localStorage.setItem(ACCESSIBILITY_STORAGE_KEY, JSON.stringify(accessibility));
  }, [accessibility]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  };

  const setAccessibility = (settings: AccessibilitySettings) => {
    setAccessibilityState(settings);
  };

  const currentUser = useMemo(() => {
    if (!sessionUserId) return null;
    return users.find((u) => u.id === sessionUserId) || null;
  }, [users, sessionUserId]);

  const unreadCount = useMemo(() => {
    if (!currentUser) return 0;
    return notifications.filter((n) => n.userId === currentUser.id && !n.read).length;
  }, [notifications, currentUser]);

  const pushNotification = (notif: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => {
    const entry: AppNotification = {
      ...notif,
      id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => {
      const next = [entry, ...prev];
      dataRepository.saveNotifications(next);
      return next;
    });
  };

  const login = async (mobile: string, password: string) => {
    const cleanMobile = mobile.trim();
    const user = users.find((u) => u.mobile === cleanMobile);
    if (!user || !user.active) {
      return { ok: false, errorKey: 'loginInvalidError' as TranslationKeys };
    }
    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return { ok: false, errorKey: 'loginInvalidError' as TranslationKeys };
    }
    setSessionUserId(user.id);
    dataRepository.saveSessionUserId(user.id);
    if ('location' in user) {
      setUserLocation(user.location);
    }
    return { ok: true, role: user.role };
  };

  const loginDemo = (role: UserRole) => {
    const targetMobile = DEMO_CREDENTIALS[role].mobile;
    const found = users.find((u) => u.mobile === targetMobile) || users.find((u) => u.role === role);
    if (!found) return null;
    if (!found.active) {
      const activated = users.map((u) => (u.id === found.id ? { ...u, active: true } : u));
      setUsers(activated);
      dataRepository.saveUsers(activated);
    }
    setSessionUserId(found.id);
    dataRepository.saveSessionUserId(found.id);
    if ('location' in found) {
      setUserLocation(found.location);
    }
    return found;
  };

  const registerWorker = async (data: RegisterWorkerInput) => {
    const cleanMobile = data.mobile.trim();
    if (users.some((u) => u.mobile === cleanMobile)) {
      return { ok: false, errorKey: 'registerDuplicateMobile' as TranslationKeys };
    }
    const passwordHash = await hashPassword(data.password);
    const newWorker: WorkerProfile = {
      id: `w-${Date.now()}`,
      role: 'worker',
      name: data.name.trim(),
      mobile: cleanMobile,
      passwordHash,
      skills: data.skills,
      experienceYears: data.experienceYears,
      location: data.location,
      expectedDailyWage: data.expectedDailyWage,
      availability: data.availability,
      photoUrl: data.photoUrl,
      bio: data.bio?.trim(),
      active: true,
      createdAt: new Date().toISOString(),
    };
    const nextUsers = [...users, newWorker];
    setUsers(nextUsers);
    dataRepository.saveUsers(nextUsers);
    setSessionUserId(newWorker.id);
    dataRepository.saveSessionUserId(newWorker.id);
    setUserLocation(newWorker.location);
    return { ok: true };
  };

  const registerEmployer = async (data: RegisterEmployerInput) => {
    const cleanMobile = data.mobile.trim();
    if (users.some((u) => u.mobile === cleanMobile)) {
      return { ok: false, errorKey: 'registerDuplicateMobile' as TranslationKeys };
    }
    const passwordHash = await hashPassword(data.password);
    const newEmployer: EmployerProfile = {
      id: `e-${Date.now()}`,
      role: 'employer',
      name: data.name.trim(),
      businessName: data.businessName.trim(),
      businessType: data.businessType.trim(),
      mobile: cleanMobile,
      passwordHash,
      location: data.location,
      verified: false,
      active: true,
      description: data.description?.trim(),
      createdAt: new Date().toISOString(),
    };
    const nextUsers = [...users, newEmployer];
    setUsers(nextUsers);
    dataRepository.saveUsers(nextUsers);
    setSessionUserId(newEmployer.id);
    dataRepository.saveSessionUserId(newEmployer.id);
    setUserLocation(newEmployer.location);
    return { ok: true };
  };

  const logout = () => {
    setSessionUserId(null);
    dataRepository.saveSessionUserId(null);
  };

  const updateWorkerProfile = (updates: Partial<WorkerProfile>) => {
    if (!currentUser || currentUser.role !== 'worker') return;
    const nextUsers = users.map((u) =>
      u.id === currentUser.id ? ({ ...u, ...updates } as WorkerProfile) : u
    );
    setUsers(nextUsers);
    dataRepository.saveUsers(nextUsers);
    if (updates.location) {
      setUserLocation(updates.location);
    }
  };

  const updateEmployerProfile = (updates: Partial<EmployerProfile>) => {
    if (!currentUser || currentUser.role !== 'employer') return;
    const nextUsers = users.map((u) =>
      u.id === currentUser.id ? ({ ...u, ...updates } as EmployerProfile) : u
    );
    setUsers(nextUsers);
    dataRepository.saveUsers(nextUsers);
    if (updates.location) {
      setUserLocation(updates.location);
    }
  };

  const postJob = (data: PostJobInput) => {
    if (!currentUser || currentUser.role !== 'employer') return null;
    const newJob: JobPosting = {
      id: `j-${Date.now()}`,
      employerId: currentUser.id,
      employerName: currentUser.name,
      employerBusinessName: currentUser.businessName,
      employerVerified: currentUser.verified,
      title: data.title.trim(),
      description: data.description.trim(),
      requiredSkills: data.requiredSkills,
      location: data.location,
      dailyWage: data.dailyWage,
      workersNeeded: data.workersNeeded,
      experienceRequired: data.experienceRequired,
      workingHours: data.workingHours,
      joiningDate: data.joiningDate,
      availabilityType: data.availabilityType,
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    const nextJobs = [newJob, ...jobs];
    setJobs(nextJobs);
    dataRepository.saveJobs(nextJobs);
    return newJob;
  };

  const toggleJobStatus = (jobId: string) => {
    const nextJobs = jobs.map((j) =>
      j.id === jobId ? { ...j, status: j.status === 'open' ? 'closed' : 'open' } : j
    ) as JobPosting[];
    setJobs(nextJobs);
    dataRepository.saveJobs(nextJobs);
  };

  const applyToJob = (jobId: string, note?: string) => {
    if (!currentUser || currentUser.role !== 'worker') {
      return { ok: false, errorKey: 'applyOnlyWorkers' as TranslationKeys };
    }
    if (applications.some((a) => a.jobId === jobId && a.workerId === currentUser.id)) {
      return { ok: true };
    }
    const targetJob = jobs.find((j) => j.id === jobId);
    if (!targetJob) return { ok: false };

    const newApp: Application = {
      id: `app-${Date.now()}`,
      jobId,
      workerId: currentUser.id,
      workerName: currentUser.name,
      workerMobile: currentUser.mobile,
      employerId: targetJob.employerId,
      status: 'pending',
      note: note?.trim(),
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const nextApps = [newApp, ...applications];
    setApplications(nextApps);
    dataRepository.saveApplications(nextApps);

    pushNotification({
      userId: targetJob.employerId,
      titleKey: 'notifNewApplicantTitle',
      messageKey: 'notifNewApplicantMsg',
      params: { worker: currentUser.name, job: targetJob.title },
      type: 'info',
      link: '/employer/dashboard',
    });

    return { ok: true };
  };

  const withdrawApplication = (applicationId: string) => {
    const nextApps = applications.filter((a) => a.id !== applicationId);
    setApplications(nextApps);
    dataRepository.saveApplications(nextApps);
  };

  const respondToApplication = (
    applicationId: string,
    status: Exclude<ApplicationStatus, 'pending'>
  ) => {
    const targetApp = applications.find((a) => a.id === applicationId);
    if (!targetApp) return;
    const job = jobs.find((j) => j.id === targetApp.jobId);

    const nextApps = applications.map((a) =>
      a.id === applicationId ? { ...a, status, updatedAt: new Date().toISOString() } : a
    );
    setApplications(nextApps);
    dataRepository.saveApplications(nextApps);

    if (job) {
      pushNotification({
        userId: targetApp.workerId,
        titleKey: status === 'accepted' ? 'notifAcceptedTitle' : 'notifRejectedTitle',
        messageKey: status === 'accepted' ? 'notifAcceptedMsg' : 'notifRejectedMsg',
        params: { employer: job.employerBusinessName, job: job.title },
        type: status === 'accepted' ? 'success' : 'warning',
        link: '/worker/applications',
      });
    }
  };

  const reportJob = (jobId: string, reason: string) => {
    if (!currentUser) return;
    const job = jobs.find((j) => j.id === jobId);
    const newReport: ReportedJob = {
      id: `rep-${Date.now()}`,
      jobId,
      reporterId: currentUser.id,
      reporterName: currentUser.name,
      reason: reason.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    const nextReports = [newReport, ...reports];
    setReports(nextReports);
    dataRepository.saveReports(nextReports);

    const admins = users.filter((u) => u.role === 'admin');
    for (const admin of admins) {
      pushNotification({
        userId: admin.id,
        titleKey: 'notifReportTitle',
        messageKey: 'notifReportMsg',
        params: { job: job?.title || jobId },
        type: 'warning',
        link: '/admin/dashboard',
      });
    }
  };

  const verifyEmployer = (employerId: string, verified: boolean) => {
    const nextUsers = users.map((u) =>
      u.id === employerId && u.role === 'employer' ? { ...u, verified } : u
    );
    setUsers(nextUsers);
    dataRepository.saveUsers(nextUsers);

    const nextJobs = jobs.map((j) =>
      j.employerId === employerId ? { ...j, employerVerified: verified } : j
    );
    setJobs(nextJobs);
    dataRepository.saveJobs(nextJobs);

    if (verified) {
      pushNotification({
        userId: employerId,
        titleKey: 'notifVerifiedTitle',
        messageKey: 'notifVerifiedMsg',
        type: 'success',
        link: '/employer/dashboard',
      });
    }
  };

  const toggleUserActive = (userId: string) => {
    const nextUsers = users.map((u) =>
      u.id === userId ? { ...u, active: !u.active } : u
    );
    setUsers(nextUsers);
    dataRepository.saveUsers(nextUsers);
  };

  const resolveReport = (reportId: string, action: 'dismiss' | 'remove_job') => {
    const rep = reports.find((r) => r.id === reportId);
    if (!rep) return;

    const nextReports = reports.map((r) =>
      r.id === reportId ? { ...r, status: action === 'dismiss' ? 'dismissed' : 'removed' } : r
    ) as ReportedJob[];
    setReports(nextReports);
    dataRepository.saveReports(nextReports);

    if (action === 'remove_job') {
      const nextJobs = jobs.map((j) =>
        j.id === rep.jobId ? { ...j, status: 'removed' } : j
      ) as JobPosting[];
      setJobs(nextJobs);
      dataRepository.saveJobs(nextJobs);
    }
  };

  const markNotificationRead = (id: string) => {
    const next = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    setNotifications(next);
    dataRepository.saveNotifications(next);
  };

  const markAllNotificationsRead = () => {
    if (!currentUser) return;
    const next = notifications.map((n) =>
      n.userId === currentUser.id ? { ...n, read: true } : n
    );
    setNotifications(next);
    dataRepository.saveNotifications(next);
  };

  const resetDemoData = async () => {
    const seed = await dataRepository.resetDemoData();
    setUsers(seed.users);
    setJobs(seed.jobs);
    setApplications(seed.applications);
    setReports(seed.reports);
    setNotifications(seed.notifications);
    setSessionUserId(null);
    setUserLocation(DEFAULT_CENTER);
  };

  const t = (key: TranslationKeys | string, params?: Record<string, string | number>) =>
    translate(language, key, params);

  const tSkill = (skill: string) => translateSkill(language, skill);

  return (
    <AppContext.Provider
      value={{
        ready,
        language,
        setLanguage,
        t,
        tSkill,
        accessibility,
        setAccessibility,
        currentUser,
        users,
        jobs,
        applications,
        reports,
        notifications,
        unreadCount,
        userLocation,
        setUserLocation,
        login,
        loginDemo,
        registerWorker,
        registerEmployer,
        logout,
        updateWorkerProfile,
        updateEmployerProfile,
        postJob,
        toggleJobStatus,
        applyToJob,
        withdrawApplication,
        respondToApplication,
        reportJob,
        verifyEmployer,
        toggleUserActive,
        resolveReport,
        markNotificationRead,
        markAllNotificationsRead,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
