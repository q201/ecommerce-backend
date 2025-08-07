import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCardIcon, 
  LockClosedIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Address } from '../types';

const Checkout: React.FC = () => {
  const { cart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedBillingAddress, setSelectedBillingAddress] = useState<string>('');
  const [selectedShippingAddress, setSelectedShippingAddress] = useState<string>('');
  const [useSameAddress, setUseSameAddress] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [orderNotes, setOrderNotes] = useState('');

  // Form states
  const [billingForm, setBillingForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
    phone: '',
  });

  const [shippingForm, setShippingForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
    phone: '',
  });

  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });

  useEffect(() => {
    if (!cart || cart.items.length === 0) {
      navigate('/cart');
      return;
    }
    loadAddresses();
  }, [cart, navigate]);

  const loadAddresses = async () => {
    try {
      // Mock addresses - replace with API call
      const mockAddresses: Address[] = [
        {
          id: '1',
          firstName: user?.firstName || '',
          lastName: user?.lastName || '',
          address1: '123 Main St',
          address2: 'Apt 4B',
          city: 'New York',
          state: 'NY',
          postalCode: '10001',
          country: 'US',
          phone: '+1-555-123-4567',
          isDefault: true,
          type: 'billing',
        },
      ];
      setAddresses(mockAddresses);
      if (mockAddresses.length > 0) {
        setSelectedBillingAddress(mockAddresses[0].id);
        setSelectedShippingAddress(mockAddresses[0].id);
      }
    } catch (error) {
      console.error('Failed to load addresses:', error);
    }
  };

  const handleBillingFormChange = (field: string, value: string) => {
    setBillingForm(prev => ({ ...prev, [field]: value }));
    if (useSameAddress) {
      setShippingForm(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleShippingFormChange = (field: string, value: string) => {
    setShippingForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentFormChange = (field: string, value: string) => {
    setPaymentForm(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      // Mock order placement - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      navigate('/order-confirmation/12345');
    } catch (error) {
      console.error('Failed to place order:', error);
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cart?.items.reduce((sum, item) => {
    const price = item.product.discountPrice || item.product.price;
    return sum + (price * item.quantity);
  }, 0) || 0;

  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const steps = [
    { id: 1, name: 'Shipping Address', status: currentStep >= 1 ? 'current' : 'upcoming' },
    { id: 2, name: 'Payment Method', status: currentStep >= 2 ? 'current' : 'upcoming' },
    { id: 3, name: 'Review & Place Order', status: currentStep >= 3 ? 'current' : 'upcoming' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        <p className="text-gray-600 mt-2">Complete your purchase</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <nav aria-label="Progress">
          <ol className="flex items-center">
            {steps.map((step, stepIdx) => (
              <li key={step.name} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''} ${stepIdx !== 0 ? 'pl-8 sm:pl-20' : ''}`}>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <div className={`relative flex h-8 w-8 items-center justify-center rounded-full ${
                  step.status === 'current' ? 'bg-primary-600' : 'bg-gray-200'
                }`}>
                  {step.status === 'current' ? (
                    <CheckIcon className="h-5 w-5 text-white" />
                  ) : (
                    <span className="text-sm font-medium text-gray-500">{step.id}</span>
                  )}
                </div>
                <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-sm font-medium text-gray-900">
                  {step.name}
                </span>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="p-6">
              {/* Step 1: Shipping Address */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Address</h2>
                  
                  {/* Saved Addresses */}
                  {addresses.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Saved Addresses</h3>
                      <div className="space-y-3">
                        {addresses.map((address) => (
                          <label key={address.id} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                              type="radio"
                              name="shippingAddress"
                              value={address.id}
                              checked={selectedShippingAddress === address.id}
                              onChange={(e) => setSelectedShippingAddress(e.target.value)}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                            />
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {address.firstName} {address.lastName}
                              </div>
                              <div className="text-sm text-gray-600">
                                {address.address1}, {address.city}, {address.state} {address.postalCode}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New Address Form */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <input
                          type="text"
                          value={shippingForm.firstName}
                          onChange={(e) => handleShippingFormChange('firstName', e.target.value)}
                          className="input-field"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <input
                          type="text"
                          value={shippingForm.lastName}
                          onChange={(e) => handleShippingFormChange('lastName', e.target.value)}
                          className="input-field"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                      <input
                        type="text"
                        value={shippingForm.address1}
                        onChange={(e) => handleShippingFormChange('address1', e.target.value)}
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (Optional)</label>
                      <input
                        type="text"
                        value={shippingForm.address2}
                        onChange={(e) => handleShippingFormChange('address2', e.target.value)}
                        className="input-field"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input
                          type="text"
                          value={shippingForm.city}
                          onChange={(e) => handleShippingFormChange('city', e.target.value)}
                          className="input-field"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                        <input
                          type="text"
                          value={shippingForm.state}
                          onChange={(e) => handleShippingFormChange('state', e.target.value)}
                          className="input-field"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                        <input
                          type="text"
                          value={shippingForm.postalCode}
                          onChange={(e) => handleShippingFormChange('postalCode', e.target.value)}
                          className="input-field"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={shippingForm.phone}
                        onChange={(e) => handleShippingFormChange('phone', e.target.value)}
                        className="input-field"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Payment Method */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Method</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                      <input
                        type="text"
                        value={paymentForm.cardNumber}
                        onChange={(e) => handlePaymentFormChange('cardNumber', e.target.value)}
                        className="input-field"
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                        <input
                          type="text"
                          value={paymentForm.expiryDate}
                          onChange={(e) => handlePaymentFormChange('expiryDate', e.target.value)}
                          className="input-field"
                          placeholder="MM/YY"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                        <input
                          type="text"
                          value={paymentForm.cvv}
                          onChange={(e) => handlePaymentFormChange('cvv', e.target.value)}
                          className="input-field"
                          placeholder="123"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                        <input
                          type="text"
                          value={paymentForm.cardholderName}
                          onChange={(e) => handlePaymentFormChange('cardholderName', e.target.value)}
                          className="input-field"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <LockClosedIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">
                        Your payment information is secure and encrypted
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Review Your Order</h2>
                  
                  <div className="space-y-6">
                    {/* Order Items */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Order Items</h3>
                      <div className="space-y-3">
                        {cart?.items.map((item) => (
                          <div key={item.id} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
                            <img
                              src={item.product.images[0]?.url || 'https://via.placeholder.com/60x60?text=No+Image'}
                              alt={item.product.name}
                              className="w-15 h-15 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-gray-900">
                                ${((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Shipping Address</h3>
                      <div className="p-3 border border-gray-200 rounded-lg">
                        <p className="text-gray-900">
                          {shippingForm.firstName} {shippingForm.lastName}
                        </p>
                        <p className="text-gray-600">{shippingForm.address1}</p>
                        {shippingForm.address2 && <p className="text-gray-600">{shippingForm.address2}</p>}
                        <p className="text-gray-600">
                          {shippingForm.city}, {shippingForm.state} {shippingForm.postalCode}
                        </p>
                        <p className="text-gray-600">{shippingForm.phone}</p>
                      </div>
                    </div>

                    {/* Order Notes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Order Notes (Optional)</label>
                      <textarea
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        rows={3}
                        className="input-field"
                        placeholder="Any special instructions for your order..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                {currentStep > 1 && (
                  <button
                    onClick={prevStep}
                    className="btn-secondary"
                  >
                    Previous
                  </button>
                )}
                <div className="ml-auto">
                  {currentStep < 3 ? (
                    <button
                      onClick={nextStep}
                      className="btn-primary"
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className="btn-primary disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="loading-spinner mr-2"></div>
                          Processing...
                        </div>
                      ) : (
                        'Place Order'
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-8">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {shipping === 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
                  <div className="flex items-center">
                    <CheckIcon className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-sm text-green-800">Free shipping on orders over $100</span>
                  </div>
                </div>
              )}

              <div className="text-sm text-gray-600 space-y-2">
                <p>• Secure checkout with SSL encryption</p>
                <p>• 30-day return policy</p>
                <p>• Free shipping on orders over $100</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;