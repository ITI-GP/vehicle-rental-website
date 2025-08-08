import { useTranslation } from "react-i18next";
import { useEffect, useState, useCallback } from "react";
import {
  fetchNotifications,
  deleteNotification,
  markAsRead,
  markAllAsRead,
  subscribeToNotifications,
} from "../../../data/notifications";
import { format } from "date-fns";
import { CheckIcon, XMarkIcon, BellIcon, ClockIcon } from "@heroicons/react/24/outline";

export default function NotificationsTab({ user }) {
  const { t, i18n } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = user?.id;
  const unreadCount = notifications.filter(n => !n.is_read).length;

  // Format date based on current locale
  const formatDate = useCallback((dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return format(date, 'PPpp', { locale: i18n.language });
  }, [i18n.language]);

  // Fetch notifications
  const loadNotifications = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const data = await fetchNotifications(userId);
      setNotifications(data);
      setError(null);
    } catch (e) {
      console.error('Error loading notifications:', e);
      setError(e.message || t('profile.notifications.fetchError', 'Failed to load notifications'));
    } finally {
      setLoading(false);
    }
  }, [userId, t]);

  // Initial load
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!userId) return;
    
    const channel = subscribeToNotifications(userId, (payload) => {
      console.log('Notification change:', payload);
      loadNotifications();
    });
    
    return () => {
      if (channel) channel.unsubscribe();
    };
  }, [userId, loadNotifications]);

  // Handle delete notification
  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm(t('profile.notifications.confirmDelete', 'Are you sure you want to delete this notification?'))) {
      return;
    }
    
    try {
      await deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (e) {
      console.error('Error deleting notification:', e);
      setError(e.message || t('profile.notifications.deleteError', 'Failed to delete notification'));
    }
  };

  // Handle mark as read
  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      const updatedNotification = await markAsRead(id);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true, read_at: updatedNotification.read_at } : n)
      );
    } catch (e) {
      console.error('Error marking notification as read:', e);
      setError(e.message || t('profile.notifications.markReadError', 'Failed to mark as read'));
    }
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;
    
    try {
      const updatedNotifications = await markAllAsRead(userId);
      if (updatedNotifications && updatedNotifications.length > 0) {
        setNotifications(prev => 
          prev.map(n => ({
            ...n,
            is_read: true,
            read_at: updatedNotifications.find(un => un.id === n.id)?.read_at || n.read_at
          }))
        );
      }
    } catch (e) {
      console.error('Error marking all as read:', e);
      setError(e.message || t('profile.notifications.markAllReadError', 'Failed to mark all as read'));
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    const iconClass = "h-5 w-5";
    
    switch(type) {
      case 'reminder':
        return <ClockIcon className={`${iconClass} text-yellow-500`} />;
      case 'alert':
        return <BellIcon className={`${iconClass} text-red-500`} />;
      case 'confirmation':
        return <CheckIcon className={`${iconClass} text-green-500`} />;
      default:
        return <BellIcon className={`${iconClass} text-blue-500`} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {t("profile.notifications.title", "Notifications")}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {t("profile.notifications.unreadCount", {
              count: unreadCount,
              defaultValue: "{{count}} unread",
              defaultValue_plural: "{{count}} unread"
            })}
          </p>
        </div>
        
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {t("profile.notifications.markAllRead", "Mark all as read")}
          </button>
        )}
      </div>
      
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-500">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
            <p className="mt-2">{t("common.loading", "Loading...")}</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <div className="text-red-500">
              <XMarkIcon className="mx-auto h-12 w-12" />
              <p className="mt-2">{error}</p>
              <button
                onClick={loadNotifications}
                className="mt-4 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {t("common.retry", "Retry")}
              </button>
            </div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {t("profile.notifications.none.title", "No notifications")}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {t("profile.notifications.none.description", "When you get notifications, they'll appear here.")}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <li 
                key={notification.id} 
                className={`px-4 py-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                  !notification.is_read ? 'bg-blue-50' : ''
                }`}
                onClick={(e) => !notification.is_read && handleMarkAsRead(notification.id, e)}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>
                  
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex justify-between">
                      <p className={`text-sm font-medium ${
                        !notification.is_read ? 'text-gray-900' : 'text-gray-600'
                      }`}>
                        {notification.message}
                      </p>
                      
                      <div className="flex space-x-2">
                        {!notification.is_read && (
                          <button
                            onClick={(e) => handleMarkAsRead(notification.id, e)}
                            className="text-gray-400 hover:text-gray-500"
                            title={t("profile.notifications.markAsRead", "Mark as read")}
                          >
                            <CheckIcon className="h-4 w-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={(e) => handleDelete(notification.id, e)}
                          className="text-gray-400 hover:text-red-500"
                          title={t("profile.notifications.delete", "Delete")}
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(notification.created_at)}
                    </p>
                    
                    {notification.rental_id && (
                      <div className="mt-2 text-xs text-blue-600">
                        {t("profile.notifications.relatedToRental", "Related to rental")}: {notification.rental_id.substring(0, 8)}...
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
