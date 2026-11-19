import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const NotificationsPage: React.FC = () => {
  const { t, currentUser, notifications, markNotificationRead, markAllNotificationsRead } = useApp();

  const myNotifications = useMemo(() => {
    if (!currentUser) return [];
    return notifications.filter((n) => n.userId === currentUser.id);
  }, [notifications, currentUser]);

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center space-y-4">
        <h1 className="text-2xl font-bold text-[#123B65]">{t('notificationsTitle')}</h1>
        <Link to="/login" className="inline-flex px-5 py-2.5 rounded-lg bg-[#123B65] text-white text-sm font-semibold">
          {t('navLogin')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#123B65]">{t('notificationsTitle')}</h1>
          <p className="text-sm text-[#546E7A] mt-1">{t('notificationsSubtitle')}</p>
        </div>

        {myNotifications.some((n) => !n.read) && (
          <button
            type="button"
            onClick={markAllNotificationsRead}
            className="min-h-[40px] px-4 py-2 rounded-lg bg-[#E8F0EB] hover:bg-[#DCE8E0] text-[#123B65] text-sm font-semibold inline-flex items-center gap-2 self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4" aria-hidden="true" />
            <span>{t('btnMarkAllRead')}</span>
          </button>
        )}
      </div>

      {myNotifications.length === 0 ? (
        <div className="bg-white border border-[#D4E2D9] rounded-xl p-10 text-center space-y-2">
          <Bell className="w-8 h-8 text-[#90A4AE] mx-auto" aria-hidden="true" />
          <p className="text-sm text-[#546E7A]">{t('noNotifications')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {myNotifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`border rounded-xl p-4 sm:p-5 transition-colors cursor-pointer ${
                n.read
                  ? 'bg-white border-[#D4E2D9]'
                  : 'bg-[#E8F0EB]/55 border-[#16A36A]'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-bold text-sm text-[#123B65]">{t(n.titleKey)}</div>
                  <p className="text-sm text-[#263238]">{t(n.messageKey, n.params)}</p>
                </div>
                <span className="text-xs text-[#607D8B] tabular-nums shrink-0">
                  {new Date(n.createdAt).toLocaleDateString()}
                </span>
              </div>

              {n.link && (
                <div className="mt-2.5">
                  <Link
                    to={n.link}
                    className="text-xs font-semibold text-[#123B65] hover:underline"
                  >
                    {t('btnViewDetails')}
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
