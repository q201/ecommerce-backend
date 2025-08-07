import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon,
  ShoppingBagIcon,
  UsersIcon,
  CurrencyDollarIcon,
  TruckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });

  useEffect(() => {
    // Mock data for now
    setStats({
      totalOrders: 1250,
      totalRevenue: 45678.90,
      totalUsers: 3420,
      totalProducts: 156,
      pendingOrders: 23,
      completedOrders: 1227,
    });
  }, []);

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      name: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingBagIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: CurrencyDollarIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: UsersIcon,
      color: 'bg-purple-500',
    },
    {
      name: 'Total Products',
      value: stats.totalProducts.toLocaleString(),
      icon: ChartBarIcon,
      color: 'bg-yellow-500',
    },
  ];

  const recentOrders = [
    { id: '1', customer: 'John Doe', amount: 299.99, status: 'pending', date: '2024-01-15' },
    { id: '2', customer: 'Jane Smith', amount: 149.99, status: 'completed', date: '2024-01-14' },
    { id: '3', customer: 'Bob Johnson', amount: 89.99, status: 'shipped', date: '2024-01-13' },
    { id: '4', customer: 'Alice Brown', amount: 199.99, status: 'pending', date: '2024-01-12' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'shipped':
        return 'text-blue-600 bg-blue-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user.firstName}!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="card">
              <div className="p-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="card">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <a href="/admin/orders" className="text-sm text-primary-600 hover:text-primary-700">
                View all
              </a>
            </div>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{order.customer}</p>
                    <p className="text-sm text-gray-600">Order #{order.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${order.amount}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="space-y-4">
              <a
                href="/admin/products"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ShoppingBagIcon className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Manage Products</p>
                  <p className="text-sm text-gray-600">Add, edit, or remove products</p>
                </div>
              </a>
              
              <a
                href="/admin/orders"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <TruckIcon className="h-6 w-6 text-green-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Manage Orders</p>
                  <p className="text-sm text-gray-600">Process and track orders</p>
                </div>
              </a>
              
              <a
                href="/admin/users"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <UsersIcon className="h-6 w-6 text-purple-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Manage Users</p>
                  <p className="text-sm text-gray-600">View and manage user accounts</p>
                </div>
              </a>
              
              <a
                href="/admin/analytics"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ChartBarIcon className="h-6 w-6 text-yellow-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Analytics</p>
                  <p className="text-sm text-gray-600">View sales and performance data</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Order Status Summary */}
      <div className="card mt-8">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Status Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <ClockIcon className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
              <p className="text-sm text-gray-600">Pending Orders</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <TruckIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">45</p>
              <p className="text-sm text-gray-600">Shipped Orders</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircleIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{stats.completedOrders}</p>
              <p className="text-sm text-gray-600">Completed Orders</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;