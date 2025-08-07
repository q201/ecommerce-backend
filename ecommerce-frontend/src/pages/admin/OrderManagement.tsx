import React, { useState, useEffect } from 'react';
import { 
  EyeIcon,
  TruckIcon,
  CheckCircleIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { Order, OrderStatus } from '../../types';
import apiService from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const OrderManagement: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await apiService.getAllOrders();
      setOrders(ordersData);
    } catch (err: any) {
      setError('Failed to load orders');
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await apiService.updateOrderStatus(orderId, status);
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));
    } catch (err: any) {
      setError('Failed to update order status');
    }
  };

  const viewOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case OrderStatus.PAID:
        return 'bg-blue-100 text-blue-800';
      case OrderStatus.SHIPPED:
        return 'bg-purple-100 text-purple-800';
      case OrderStatus.DELIVERED:
        return 'bg-green-100 text-green-800';
      case OrderStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return <CalendarIcon className="h-4 w-4" />;
      case OrderStatus.PAID:
        return <CheckCircleIcon className="h-4 w-4" />;
      case OrderStatus.SHIPPED:
        return <TruckIcon className="h-4 w-4" />;
      case OrderStatus.DELIVERED:
        return <CheckCircleIcon className="h-4 w-4" />;
      case OrderStatus.CANCELLED:
        return <XMarkIcon className="h-4 w-4" />;
      default:
        return <CalendarIcon className="h-4 w-4" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !selectedStatus || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading && orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center py-12">
          <div className="loading-spinner"></div>
          <span className="ml-2 text-gray-600">Loading orders...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
        <p className="text-gray-600 mt-2">Process and manage customer orders</p>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="card mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by order ID or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-10"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="input-field"
              >
                <option value="">All Statuses</option>
                <option value={OrderStatus.PENDING}>Pending</option>
                <option value={OrderStatus.PAID}>Paid</option>
                <option value={OrderStatus.SHIPPED}>Shipped</option>
                <option value={OrderStatus.DELIVERED}>Delivered</option>
                <option value={OrderStatus.CANCELLED}>Cancelled</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedStatus('');
                }}
                className="btn-secondary w-full"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.user?.firstName} {order.user?.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{order.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${order.total?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{order.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => viewOrderDetail(order)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className="text-xs border border-gray-300 rounded px-2 py-1"
                      >
                        <option value={OrderStatus.PENDING}>Pending</option>
                        <option value={OrderStatus.PAID}>Paid</option>
                        <option value={OrderStatus.SHIPPED}>Shipped</option>
                        <option value={OrderStatus.DELIVERED}>Delivered</option>
                        <option value={OrderStatus.CANCELLED}>Cancelled</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {showOrderDetail && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Order #{selectedOrder.id}
              </h3>
              <button
                onClick={() => setShowOrderDetail(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Order Information */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Order Information</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Date:</span>
                    <span className="text-gray-900">
                      {new Date(selectedOrder.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusIcon(selectedOrder.status)}
                      <span className="ml-1">{selectedOrder.status}</span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Status:</span>
                    <span className={`font-medium ${
                      selectedOrder.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {selectedOrder.payment_status || 'Pending'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-medium text-gray-900">
                      ${selectedOrder.total?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Customer Information</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <div className="text-gray-900">
                      {selectedOrder.user?.firstName} {selectedOrder.user?.lastName}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <div className="text-gray-900">{selectedOrder.email}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-4">Order Items</h4>
              <div className="space-y-3">
                {selectedOrder.items?.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
                    <img
                      src={item.product.images[0]?.url || 'https://via.placeholder.com/60x60?text=No+Image'}
                      alt={item.product.name}
                      className="w-15 h-15 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{item.product.name}</h5>
                      <p className="text-sm text-gray-600">SKU: {item.product.sku}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600">
                        ${item.price.toFixed(2)} each
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Addresses */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {selectedOrder.shipping_address && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Shipping Address</h4>
                  <div className="text-sm text-gray-600">
                    <p>{selectedOrder.shipping_address.firstName} {selectedOrder.shipping_address.lastName}</p>
                    <p>{selectedOrder.shipping_address.address1}</p>
                    {selectedOrder.shipping_address.address2 && <p>{selectedOrder.shipping_address.address2}</p>}
                    <p>{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.postalCode}</p>
                    {selectedOrder.shipping_address.phone && <p>{selectedOrder.shipping_address.phone}</p>}
                  </div>
                </div>
              )}

              {selectedOrder.billing_address && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Billing Address</h4>
                  <div className="text-sm text-gray-600">
                    <p>{selectedOrder.billing_address.firstName} {selectedOrder.billing_address.lastName}</p>
                    <p>{selectedOrder.billing_address.address1}</p>
                    {selectedOrder.billing_address.address2 && <p>{selectedOrder.billing_address.address2}</p>}
                    <p>{selectedOrder.billing_address.city}, {selectedOrder.billing_address.state} {selectedOrder.billing_address.postalCode}</p>
                    {selectedOrder.billing_address.phone && <p>{selectedOrder.billing_address.phone}</p>}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => setShowOrderDetail(false)}
                className="btn-secondary"
              >
                Close
              </button>
              <button
                onClick={() => {
                  // Print or export order
                  window.print();
                }}
                className="btn-outline"
              >
                Print Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;