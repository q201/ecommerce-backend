import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  CreditCardIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { Order, OrderStatus } from '../types';
import apiService from '../services/api';

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadOrder();
    }
  }, [id]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const orderData = await apiService.getOrder(id!);
      setOrder(orderData);
    } catch (err: any) {
      setError('Failed to load order details');
      console.error('Error loading order:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.DELIVERED:
        return <CheckCircleIcon className="h-6 w-6 text-green-600" />;
      case OrderStatus.SHIPPED:
        return <TruckIcon className="h-6 w-6 text-blue-600" />;
      case OrderStatus.PAID:
        return <CheckCircleIcon className="h-6 w-6 text-green-600" />;
      case OrderStatus.CANCELLED:
        return <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />;
      default:
        return <ClockIcon className="h-6 w-6 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.DELIVERED:
        return 'text-green-600 bg-green-100';
      case OrderStatus.SHIPPED:
        return 'text-blue-600 bg-blue-100';
      case OrderStatus.PAID:
        return 'text-green-600 bg-green-100';
      case OrderStatus.CANCELLED:
        return 'text-red-600 bg-red-100';
      default:
        return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getStatusDescription = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'Your order is being processed';
      case OrderStatus.PAID:
        return 'Payment received, preparing for shipment';
      case OrderStatus.SHIPPED:
        return 'Your order is on its way';
      case OrderStatus.DELIVERED:
        return 'Order delivered successfully';
      case OrderStatus.CANCELLED:
        return 'Order has been cancelled';
      default:
        return 'Processing your order';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center py-12">
          <div className="loading-spinner"></div>
          <span className="ml-2 text-gray-600">Loading order details...</span>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-red-600">{error || 'Order not found'}</p>
          <Link to="/profile" className="btn-primary mt-4">
            Back to Profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link to="/profile" className="flex items-center text-gray-600 hover:text-gray-900 mr-4">
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            Back to Profile
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Order #{order.id}</h1>
        <p className="text-gray-600 mt-2">
          Placed on {new Date(order.created_at).toLocaleDateString()}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <div className="card">
            <div className="p-6">
              <div className="flex items-center mb-4">
                {getStatusIcon(order.status)}
                <div className="ml-3">
                  <h2 className="text-lg font-semibold text-gray-900">Order Status</h2>
                  <p className="text-sm text-gray-600">{getStatusDescription(order.status)}</p>
                </div>
              </div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="card">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <img
                      src={item.product.images[0]?.url || 'https://via.placeholder.com/80x80?text=No+Image'}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.product.name}</h3>
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
          </div>

          {/* Shipping Information */}
          {order.shipping_address && (
            <div className="card">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h2>
                <div className="flex items-start space-x-3">
                  <MapPinIcon className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {order.shipping_address.firstName} {order.shipping_address.lastName}
                    </p>
                    <p className="text-gray-600">{order.shipping_address.address1}</p>
                    {order.shipping_address.address2 && (
                      <p className="text-gray-600">{order.shipping_address.address2}</p>
                    )}
                    <p className="text-gray-600">
                      {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postalCode}
                    </p>
                    {order.shipping_address.phone && (
                      <p className="text-gray-600">{order.shipping_address.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Billing Information */}
          {order.billing_address && (
            <div className="card">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Billing Information</h2>
                <div className="flex items-start space-x-3">
                  <CreditCardIcon className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {order.billing_address.firstName} {order.billing_address.lastName}
                    </p>
                    <p className="text-gray-600">{order.billing_address.address1}</p>
                    {order.billing_address.address2 && (
                      <p className="text-gray-600">{order.billing_address.address2}</p>
                    )}
                    <p className="text-gray-600">
                      {order.billing_address.city}, {order.billing_address.state} {order.billing_address.postalCode}
                    </p>
                    {order.billing_address.phone && (
                      <p className="text-gray-600">{order.billing_address.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card sticky top-8">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">
                    ${((order.total || 0) - (order.shipping_total || 0) - (order.tax_total || 0)).toFixed(2)}
                  </span>
                </div>
                {order.shipping_total && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900">${order.shipping_total.toFixed(2)}</span>
                  </div>
                )}
                {order.tax_total && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-900">${order.tax_total.toFixed(2)}</span>
                  </div>
                )}
                {order.discount_total && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-600">-${order.discount_total.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">${order.total?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID</span>
                  <span className="text-gray-900">#{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date</span>
                  <span className="text-gray-900">
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status</span>
                  <span className={`font-medium ${
                    order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {order.payment_status?.charAt(0).toUpperCase() + order.payment_status?.slice(1) || 'Pending'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fulfillment Status</span>
                  <span className={`font-medium ${
                    order.fulfillment_status === 'fulfilled' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {order.fulfillment_status?.charAt(0).toUpperCase() + order.fulfillment_status?.slice(1) || 'Pending'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 space-y-3">
                <button className="w-full btn-outline">
                  Download Invoice
                </button>
                <button className="w-full btn-secondary">
                  Contact Support
                </button>
                {order.status === OrderStatus.DELIVERED && (
                  <button className="w-full btn-primary">
                    Write Review
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;