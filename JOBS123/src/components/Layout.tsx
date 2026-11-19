import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  Briefcase,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Map as MapIcon,
  Menu,
  PlusCircle,
  Search,
  Settings,
  Shield,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LanguageSelector } from './LanguageSelector';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentUser, logout, t, unreadCount } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isPortalRoute =
    location.pathname.startsWith('/worker') ||
    location.pathname.startsWith('/employer') ||
    location.pathname.startsWith('/admin') ||
    location.pathname === '/notifications' ||
    location.pathname === '/settings';

  const getDashboardPath = () => {
    if (!currentUser) return '/login';
    if (currentUser.role === 'worker') return '/worker/dashboard';
    if (currentUser.role === 'employer') return '/employer/dashboard';
    return '/admin/dashboard';
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const sidebarItems = React.useMemo(() => {
    if (!currentUser) {
      return [
        { to: '/jobs', label: t('navFindJobs'), icon: Search },
        { to: '/map', label: t('navNearbyMap'), icon: MapIcon },
        { to: '/settings', label: t('navSettings'), icon: Settings },
      ];
    }
    if (currentUser.role === 'worker') {
      return [
        { to: '/worker/dashboard', label: t('navDashboard'), icon: LayoutDashboard },
        { to: '/jobs', label: t('navFindJobs'), icon: Search },
        { to: '/worker/recommendations', label: t('navRecommendations'), icon: Sparkles },
        { to: '/map', label: t('navNearbyMap'), icon: MapIcon },
        { to: '/worker/applications', label: t('navApplications'), icon: ClipboardList },
        { to: '/worker/profile', label: t('navProfile'), icon: User },
        { to: '/notifications', label: t('navNotifications'), icon: Bell, badge: unreadCount },
        { to: '/settings', label: t('navSettings'), icon: Settings },
      ];
    }
    if (currentUser.role === 'employer') {
      return [
        { to: '/employer/dashboard', label: t('navDashboard'), icon: LayoutDashboard },
        { to: '/employer/post-job', label: t('navPostJob'), icon: PlusCircle },
        { to: '/jobs', label: t('navFindJobs'), icon: Search },
        { to: '/map', label: t('navNearbyMap'), icon: MapIcon },
        { to: '/employer/profile', label: t('navProfile'), icon: Briefcase },
        { to: '/notifications', label: t('navNotifications'), icon: Bell, badge: unreadCount },
        { to: '/settings', label: t('navSettings'), icon: Settings },
      ];
    }
    return [
      { to: '/admin/dashboard', label: t('navAdmin'), icon: Shield },
      { to: '/jobs', label: t('navFindJobs'), icon: Search },
      { to: '/map', label: t('navNearbyMap'), icon: MapIcon },
      { to: '/notifications', label: t('navNotifications'), icon: Bell, badge: unreadCount },
      { to: '/settings', label: t('navSettings'), icon: Settings },
    ];
  }, [currentUser, t, unreadCount]);

  if (isPortalRoute && currentUser) {
    return (
      <div className="min-h-screen bg-[#F7F9F7] flex flex-col lg:flex-row">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:w-[260px] lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-[#D4E2D9] z-30">
          <div className="px-6 py-5 border-b border-[#E8F0EB] flex items-center justify-between">
            <Link to="/" className="text-xl font-bold tracking-tight text-[#123B65] font-display whitespace-nowrap">
              {t('brandName')}
            </Link>
          </div>

          <div className="px-4 py-4 border-b border-[#E8F0EB]">
            <div className="text-sm font-bold text-[#263238] truncate">{currentUser.name}</div>
            <div className="text-xs text-[#546E7A] capitalize">
              {currentUser.role === 'worker'
                ? t('navWorkerPortal')
                : currentUser.role === 'employer'
                ? t('navEmployerPortal')
                : t('navAdmin')}
            </div>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`min-h-[42px] px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-[#123B65] text-white'
                      : 'text-[#263238] hover:bg-[#E8F0EB]'
                  }`}
                >
                  <span className="flex items-center gap-3 truncate">
                    <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span className="truncate">{item.label}</span>
                  </span>
                  {typeof item.badge === 'number' && item.badge > 0 && (
                    <span
                      className={`text-xs font-mono tabular-nums px-1.5 py-0.5 rounded ${
                        active ? 'bg-white text-[#123B65]' : 'bg-[#16A36A] text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-[#E8F0EB]">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full min-h-[40px] px-3 py-2 rounded-lg text-sm font-semibold text-[#B91C1C] hover:bg-[#FEF2F2] flex items-center gap-2.5 transition-colors"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              <span>{t('navLogout')}</span>
            </button>
          </div>
        </aside>

        {/* Main Workspace Area */}
        <div className="flex-1 lg:pl-[260px] flex flex-col min-w-0">
          <header className="sticky top-0 z-20 bg-white border-b border-[#D4E2D9] px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open navigation menu"
                className="lg:hidden p-2 rounded-lg text-[#123B65] hover:bg-[#E8F0EB]"
              >
                <Menu className="w-5 h-5" />
              </button>
              <Link to="/" className="lg:hidden text-lg font-bold text-[#123B65] font-display whitespace-nowrap">
                {t('brandName')}
              </Link>
              <span className="hidden lg:inline text-sm text-[#546E7A] whitespace-nowrap">
                {t('brandTagline')}
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <LanguageSelector compact />
              <Link
                to="/notifications"
                aria-label={t('navNotifications')}
                className="relative p-2 rounded-lg bg-[#F7F9F7] border border-[#D4E2D9] text-[#123B65] hover:bg-[#E8F0EB]"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="sr-only">{unreadCount} unread</span>
                )}
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#16A36A] text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                    {unreadCount}
                  </span>
                )}
              </Link>
            </div>
          </header>

          {/* Mobile Sidebar Drawer */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 lg:hidden flex">
              <div
                className="fixed inset-0 bg-[#123B65]/40"
                onClick={() => setMobileMenuOpen(false)}
              />
              <div className="relative w-72 max-w-[85vw] bg-white h-full flex flex-col border-r border-[#D4E2D9] z-10">
                <div className="px-5 py-4 border-b border-[#E8F0EB] flex items-center justify-between">
                  <span className="text-lg font-bold text-[#123B65] font-display">{t('brandName')}</span>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label={t('btnClose')}
                    className="p-1.5 rounded-lg text-[#546E7A]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                  {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    const active = location.pathname === item.to;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`min-h-[44px] px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between ${
                          active ? 'bg-[#123B65] text-white' : 'text-[#263238] hover:bg-[#E8F0EB]'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </span>
                        {typeof item.badge === 'number' && item.badge > 0 && (
                          <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-[#16A36A] text-white">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>
                <div className="p-4 border-t border-[#E8F0EB]">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full min-h-[44px] px-3 py-2 rounded-lg text-sm font-semibold text-[#B91C1C] hover:bg-[#FEF2F2] flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t('navLogout')}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          <main className="flex-1 px-4 sm:px-8 py-6 max-w-[1280px] w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    );
  }

  // Public Top Bar Layout (Clean 3-Zone Top Bar Contract)
  return (
    <div className="min-h-screen bg-[#F7F9F7] flex flex-col">
      <header className="sticky top-0 z-30 bg-white border-b border-[#D4E2D9]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-6">
          {/* Zone 1: Brand Wordmark */}
          <Link
            to="/"
            className="text-xl font-bold tracking-tight text-[#123B65] font-display whitespace-nowrap shrink-0"
          >
            {t('brandName')}
          </Link>

          {/* Zone 2: Concise Single-Line Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#263238]">
            <Link
              to="/jobs"
              className="hover:text-[#123B65] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {t('navFindJobs')}
            </Link>
            <Link
              to="/map"
              className="hover:text-[#123B65] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {t('navNearbyMap')}
            </Link>
            <Link
              to={currentUser?.role === 'worker' ? '/worker/dashboard' : '/register/worker'}
              className="hover:text-[#123B65] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {t('navWorkerPortal')}
            </Link>
            <Link
              to={currentUser?.role === 'employer' ? '/employer/dashboard' : '/register/employer'}
              className="hover:text-[#123B65] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {t('navEmployerPortal')}
            </Link>
            <Link
              to="/settings"
              className="hover:text-[#123B65] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {t('navSettings')}
            </Link>
          </nav>

          {/* Zone 3: Language Selector + Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <LanguageSelector compact />

            {currentUser ? (
              <Link
                to={getDashboardPath()}
                className="hidden sm:inline-flex min-h-[40px] px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#123B65] hover:bg-[#0E2E4F] transition-colors items-center whitespace-nowrap shrink-0"
              >
                {t('navDashboard')}
              </Link>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex min-h-[40px] px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#123B65] hover:bg-[#0E2E4F] transition-colors items-center whitespace-nowrap shrink-0"
              >
                {t('navLogin')}
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              className="md:hidden p-2 rounded-lg text-[#123B65] hover:bg-[#E8F0EB]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Public Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E8F0EB] bg-white px-4 py-4 space-y-2">
            <Link
              to="/jobs"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 rounded-lg text-sm font-medium text-[#263238] hover:bg-[#E8F0EB]"
            >
              {t('navFindJobs')}
            </Link>
            <Link
              to="/map"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 rounded-lg text-sm font-medium text-[#263238] hover:bg-[#E8F0EB]"
            >
              {t('navNearbyMap')}
            </Link>
            <Link
              to="/register/worker"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 rounded-lg text-sm font-medium text-[#263238] hover:bg-[#E8F0EB]"
            >
              {t('navRegisterWorker')}
            </Link>
            <Link
              to="/register/employer"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 rounded-lg text-sm font-medium text-[#263238] hover:bg-[#E8F0EB]"
            >
              {t('navRegisterEmployer')}
            </Link>
            <Link
              to="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 rounded-lg text-sm font-medium text-[#263238] hover:bg-[#E8F0EB]"
            >
              {t('navSettings')}
            </Link>
            {currentUser ? (
              <Link
                to={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-[#123B65]"
              >
                {t('navDashboard')}
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-[#123B65]"
              >
                {t('navLogin')}
              </Link>
            )}
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-white border-t border-[#D4E2D9] mt-12">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-[#546E7A]">
          <div>
            <span className="font-bold text-[#123B65] font-display">{t('brandName')}</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>{t('brandTagline')}</span>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <Link to="/jobs" className="hover:text-[#123B65]">{t('navFindJobs')}</Link>
            <Link to="/map" className="hover:text-[#123B65]">{t('navNearbyMap')}</Link>
            <Link to="/login" className="hover:text-[#123B65]">{t('navLogin')}</Link>
            <Link to="/settings" className="hover:text-[#123B65]">{t('navSettings')}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
