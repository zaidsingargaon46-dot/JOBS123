import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterWorkerPage } from './pages/RegisterWorkerPage';
import { RegisterEmployerPage } from './pages/RegisterEmployerPage';
import { WorkerDashboardPage } from './pages/WorkerDashboardPage';
import { WorkerProfilePage } from './pages/WorkerProfilePage';
import { MyApplicationsPage } from './pages/MyApplicationsPage';
import { AIRecommendationsPage } from './pages/AIRecommendationsPage';
import { EmployerDashboardPage } from './pages/EmployerDashboardPage';
import { EmployerProfilePage } from './pages/EmployerProfilePage';
import { PostJobPage } from './pages/PostJobPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { FindJobsPage } from './pages/FindJobsPage';
import { JobDetailsPage } from './pages/JobDetailsPage';
import { NearbyJobsMapPage } from './pages/NearbyJobsMapPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Layout>
          <Routes>
            {/* 1. Landing page */}
            <Route path="/" element={<LandingPage />} />
            {/* 2. Worker registration */}
            <Route path="/register/worker" element={<RegisterWorkerPage />} />
            {/* 3. Employer registration */}
            <Route path="/register/employer" element={<RegisterEmployerPage />} />
            {/* 4. Login */}
            <Route path="/login" element={<LoginPage />} />
            {/* 5. Worker dashboard */}
            <Route path="/worker/dashboard" element={<WorkerDashboardPage />} />
            {/* 6. Employer dashboard */}
            <Route path="/employer/dashboard" element={<EmployerDashboardPage />} />
            {/* 7. Admin dashboard */}
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            {/* 8. Worker profile */}
            <Route path="/worker/profile" element={<WorkerProfilePage />} />
            {/* 9. Employer profile */}
            <Route path="/employer/profile" element={<EmployerProfilePage />} />
            {/* 10. Find jobs */}
            <Route path="/jobs" element={<FindJobsPage />} />
            {/* 11. Job details */}
            <Route path="/jobs/:id" element={<JobDetailsPage />} />
            {/* 12. Post a job */}
            <Route path="/employer/post-job" element={<PostJobPage />} />
            {/* 13. AI job recommendations */}
            <Route path="/worker/recommendations" element={<AIRecommendationsPage />} />
            {/* 14. Nearby jobs map */}
            <Route path="/map" element={<NearbyJobsMapPage />} />
            {/* 15. My applications */}
            <Route path="/worker/applications" element={<MyApplicationsPage />} />
            {/* 16. Notifications */}
            <Route path="/notifications" element={<NotificationsPage />} />
            {/* 17. Settings */}
            <Route path="/settings" element={<SettingsPage />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </AppProvider>
    </BrowserRouter>
  );
}
