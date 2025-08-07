import React, { useState, useEffect } from 'react';
import { 
  BellIcon,
  CheckIcon,
  XMarkIcon,
  TrashIcon,
  EnvelopeIcon,
  ShoppingBagIcon,
  TruckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

interface Notification {
  id: string;
  type: 'order' | 'promotion' | 'system' | 'security';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
  actionText?: string;
}

const NotificationCenter: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      // This would be a notifications endpoint
      // const notificationsData = await apiService.getNotifications();
      // setNotifications(notificationsData);
      
      // Mock data for now
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'order',
          title: 'Order Shipped',
          message: 'Your order #12345 has been shipped and is on its way to you.',
          isRead: false,
          createdAt: new Date('2024-01-15T10:30:00'),
          actionUrl: '/order/12345',
          actionText: 'Track Order',
        },
        {
          id: '2',
          type: 'promotion',
          title: 'Special Offer',
          message: 'Get 20% off on all electronics this weekend! Use code WEEKEND20.',
          isRead: false,
          createdAt: new Date('2024-01-14T15:45:00'),
          actionUrl: '/products?category=electronics',
          actionText: 'Shop Now',
        },
        {
          id: '3',
          type: 'system',
          title: 'Account Updated',
          message: 'Your account information has been successfully updated.',
          isRead: true,
          createdAt: new Date('2024-01-13T09:15:00'),
        },
        {
          id: '4',
          type: 'security',
          title: 'Login Alert',
          message: 'New login detected from a new device. If this wasn\'t you, please review your account security.',
          isRead: false,
          createdAt: new Date('2024-01-12T14:20:00'),
          actionUrl: '/profile',
          actionText: 'Review Security',
        },
        {
          id: '5',
          type: 'order',
          title: 'Order Delivered',
          message: 'Your order #12340 has been delivered successfully. Enjoy your purchase!',
          isRead: true,
          createdAt: new Date('2024-01-11T16:30:00'),
          actionUrl: '/order/12340',
          actionText: 'View Order',
        },
      ];
      setNotifications(mockNotifications);
    } catch (err: any) {
      setError('Failed to load notifications');
      console.error('Error loading notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      // This would be a mark as read endpoint
      // await apiService.markNotificationAsRead(notificationId);
      setNotifications(prev => prev.map(notification => 
        notification.id === notificationId ? { ...notification, isRead: true } : notification
      ));
    } catch (err: any) {
      setError('Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      // This would be a mark all as read endpoint
      // await apiService.markAllNotificationsAsRead();
      setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })));
    } catch (err: any) {
      setError('Failed to mark all notifications as read');
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      // This would be a delete notification endpoint
      // await apiService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
    } catch (err: any) {
      setError('Failed to delete notification');
    }
  };

  const clearAllNotifications = async () => {
    if (!window.confirm('Are you sure you want to clear all notifications?')) return;

    try {
      // This would be a clear all notifications endpoint
      // await apiService.clearAllNotifications();
      setNotifications([]);
    } catch (err: any) {
      setError('Failed to clear notifications');
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order':
        return <ShoppingBagIcon className="h-6 w-6 text-blue-600" />;
      case 'promotion':
        return <TruckIcon className="h-6 w-6 text-green-600" />;
      case 'system':
        return <InformationCircleIcon className="h-6 w-6 text-gray-600" />;
      case 'security':
        return <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />;
      default:
        return <BellIcon className="h-6 w-6 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'order':
        return 'border-l-blue-500 bg-blue-50';
      case 'promotion':
        return 'border-l-green-500 bg-green-50';
      case 'system':
        return 'border-l-gray-500 bg-gray-50';
      case 'security':
        return 'border-l-red-500 bg-red-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'read') return notification.isRead;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center py-12">
          <div className="loading-spinner"></div>
          <span className="ml-2 text-gray-600">Loading notifications...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BellIcon className="h-8 w-8 text-primary-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600 mt-1">
                {unreadCount} {unreadCount === 1 ? 'unread' : 'unread'} notification{unreadCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="btn-secondary"
              >
                Mark All as Read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="btn-outline"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'all' 
                ? 'bg-primary-100 text-primary-700' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'unread' 
                ? 'bg-primary-100 text-primary-700' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'read' 
                ? 'bg-primary-100 text-primary-700' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Read ({notifications.length - unreadCount})
          </button>
        </div>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="text-center py-12">
          <BellIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {filter === 'all' ? 'No notifications yet' : `No ${filter} notifications`}
          </h2>
          <p className="text-gray-600">
            {filter === 'all' 
              ? 'You\'ll see notifications about your orders, promotions, and account updates here.'
              : `You have no ${filter} notifications at the moment.`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`card border-l-4 ${getNotificationColor(notification.type)} ${
                !notification.isRead ? 'ring-2 ring-primary-200' : ''
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className={`text-lg font-medium ${
                          notification.isRead ? 'text-gray-900' : 'text-gray-900'
                        }`}>
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mt-1">{notification.message}</p>
                      <div className="flex items-center space-x-4 mt-3">
                        <span className="text-sm text-gray-500">
                          {new Date(notification.createdAt).toLocaleDateString()} at{' '}
                          {new Date(notification.createdAt).toLocaleTimeString()}
                        </span>
                        {notification.actionUrl && notification.actionText && (
                          <a
                            href={notification.actionUrl}
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                          >
                            {notification.actionText}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-1 text-gray-400 hover:text-green-600"
                        title="Mark as read"
                      >
                        <CheckIcon className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                      title="Delete notification"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {filteredNotifications.length > 10 && (
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50">
              Previous
            </button>
            <button className="px-3 py-2 text-sm bg-primary-600 text-white rounded-lg">1</button>
            <button className="px-3 py-2 text-sm text-gray-700 hover:text-gray-900">2</button>
            <button className="px-3 py-2 text-sm text-gray-700 hover:text-gray-900">3</button>
            <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;