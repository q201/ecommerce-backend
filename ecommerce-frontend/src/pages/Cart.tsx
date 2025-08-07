import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrashIcon, 
  ArrowLeftIcon,
  ShoppingBagIcon,
  TruckIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart: React.FC = () => {
  const { cart, updateCartItem, removeFromCart, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setUpdatingItems(prev => new Set(prev).add(itemId));
    try {
      await updateCartItem(itemId, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeFromCart(itemId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center py-12">
          <div className="loading-spinner"></div>
          <span className="ml-2 text-gray-600">Loading cart...</span>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <ShoppingBagIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Your cart is empty</h2>
          <p className="mt-2 text-gray-600">Looks like you haven't added any items to your cart yet.</p>
          <div className="mt-6">
            <Link to="/products" className="btn-primary">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = cart.items.reduce((sum, item) => {
    const price = item.product.discountPrice || item.product.price;
    return sum + (price * item.quantity);
  }, 0);

  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link to="/products" className="flex items-center text-gray-600 hover:text-gray-900 mr-4">
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            Continue Shopping
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <p className="text-gray-600 mt-2">
          {cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Cart Items</h2>
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.product.images[0]?.url || 'https://via.placeholder.com/100x100?text=No+Image'}
                        alt={item.product.images[0]?.alt || item.product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <Link 
                        to={`/product/${item.product.slug}`}
                        className="text-lg font-medium text-gray-900 hover:text-primary-600"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.product.category.name}
                      </p>
                      {item.variant && (
                        <p className="text-sm text-gray-500 mt-1">
                          Variant: {item.variant.value}
                        </p>
                      )}
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={updatingItems.has(item.id)}
                        className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                      >
                        -
                      </button>
                      <span className="w-12 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        disabled={updatingItems.has(item.id)}
                        className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">
                        ${((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)}
                      </div>
                      {item.product.discountPrice && (
                        <div className="text-sm text-gray-500 line-through">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </div>
                      )}
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-8">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              {/* Summary Details */}
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

              {/* Shipping Info */}
              {shipping === 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
                  <div className="flex items-center">
                    <TruckIcon className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-sm text-green-800">Free shipping on orders over $100</span>
                  </div>
                </div>
              )}

              {/* Checkout Button */}
              <div className="space-y-3">
                {isAuthenticated ? (
                  <Link to="/checkout" className="w-full btn-primary flex items-center justify-center">
                    <CreditCardIcon className="h-5 w-5 mr-2" />
                    Proceed to Checkout
                  </Link>
                ) : (
                  <div className="space-y-3">
                    <Link to="/login" className="w-full btn-primary">
                      Sign in to Checkout
                    </Link>
                    <Link to="/register" className="w-full btn-outline">
                      Create Account
                    </Link>
                  </div>
                )}
              </div>

              {/* Additional Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
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
    </div>
  );
};

export default Cart;