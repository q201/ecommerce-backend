import React, { useState, useEffect } from 'react';
import { 
  HeartIcon,
  TrashIcon,
  ShoppingCartIcon,
  EyeIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import { Product } from '../types';
import apiService from '../services/api';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';

const Wishlist: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { addToCart } = useCart();

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      // This would be a wishlist endpoint
      // const wishlistData = await apiService.getWishlist();
      // setWishlistItems(wishlistData);
      
      // Mock data for now
      const mockWishlist: Product[] = [
        {
          id: '1',
          name: 'Wireless Bluetooth Headphones',
          slug: 'wireless-bluetooth-headphones',
          description: 'High-quality wireless headphones with noise cancellation',
          price: 99.99,
          discountPrice: 79.99,
          currency: 'USD',
          sku: 'WH-001',
          stock: 50,
          isActive: true,
          brand: 'AudioTech',
          category: { id: '1', name: 'Electronics', slug: 'electronics' },
          images: [{ id: '1', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', alt: 'Headphones', isPrimary: true }],
          reviews: [],
          variants: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'Smart Fitness Watch',
          slug: 'smart-fitness-watch',
          description: 'Track your fitness goals with this advanced smartwatch',
          price: 199.99,
          currency: 'USD',
          sku: 'SW-001',
          stock: 25,
          isActive: true,
          brand: 'FitTech',
          category: { id: '1', name: 'Electronics', slug: 'electronics' },
          images: [{ id: '2', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', alt: 'Smart Watch', isPrimary: true }],
          reviews: [],
          variants: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '3',
          name: 'Premium Cotton T-Shirt',
          slug: 'premium-cotton-tshirt',
          description: 'Comfortable and stylish cotton t-shirt',
          price: 29.99,
          discountPrice: 24.99,
          currency: 'USD',
          sku: 'TS-001',
          stock: 100,
          isActive: true,
          brand: 'FashionCo',
          category: { id: '2', name: 'Fashion', slug: 'fashion' },
          images: [{ id: '3', url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop', alt: 'T-Shirt', isPrimary: true }],
          reviews: [],
          variants: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      setWishlistItems(mockWishlist);
    } catch (err: any) {
      setError('Failed to load wishlist');
      console.error('Error loading wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      // This would be a remove from wishlist endpoint
      // await apiService.removeFromWishlist(productId);
      setWishlistItems(prev => prev.filter(item => item.id !== productId));
    } catch (err: any) {
      setError('Failed to remove item from wishlist');
      console.error('Error removing from wishlist:', err);
    }
  };

  const moveToCart = async (product: Product) => {
    try {
      await addToCart(product, 1);
      // Optionally remove from wishlist after adding to cart
      // removeFromWishlist(product.id);
    } catch (err: any) {
      setError('Failed to add item to cart');
      console.error('Error adding to cart:', err);
    }
  };

  const shareWishlist = () => {
    // This would implement sharing functionality
    if (navigator.share) {
      navigator.share({
        title: 'My Wishlist',
        text: 'Check out my wishlist!',
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Wishlist link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center py-12">
          <div className="loading-spinner"></div>
          <span className="ml-2 text-gray-600">Loading wishlist...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <HeartIcon className="h-8 w-8 text-red-500 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
        </div>
        <p className="text-gray-600">
          {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} in your wishlist
        </p>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {wishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <HeartIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-6">
            Start adding products you love to your wishlist
          </p>
          <a href="/products" className="btn-primary">
            Browse Products
          </a>
        </div>
      ) : (
        <>
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <button
                onClick={shareWishlist}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <ShareIcon className="h-5 w-5 mr-2" />
                Share Wishlist
              </button>
            </div>

            <div className="flex items-center space-x-4">
              {/* View Mode */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Wishlist Items */}
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
          }>
            {wishlistItems.map((product) => (
              <div key={product.id} className="relative">
                <ProductCard product={product} viewMode={viewMode} />
                
                {/* Wishlist Actions Overlay */}
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => moveToCart(product)}
                    className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                    title="Add to Cart"
                  >
                    <ShoppingCartIcon className="h-4 w-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
                    title="Remove from Wishlist"
                  >
                    <TrashIcon className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bulk Actions */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => {
                    // Add all items to cart
                    wishlistItems.forEach(product => moveToCart(product));
                  }}
                  className="btn-primary"
                >
                  <ShoppingCartIcon className="h-5 w-5 mr-2" />
                  Add All to Cart
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear your wishlist?')) {
                      setWishlistItems([]);
                    }
                  }}
                  className="btn-secondary"
                >
                  <TrashIcon className="h-5 w-5 mr-2" />
                  Clear Wishlist
                </button>
              </div>
              
              <div className="text-sm text-gray-600">
                Total Value: ${wishlistItems.reduce((sum, item) => sum + (item.discountPrice || item.price), 0).toFixed(2)}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Wishlist;