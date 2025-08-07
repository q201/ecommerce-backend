import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  StarIcon, 
  HeartIcon, 
  ShoppingCartIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { Product, Review } from '../types';
import { useCart } from '../context/CartContext';
import apiService from '../services/api';

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'specifications'>('description');

  const { addToCart } = useCart();

  useEffect(() => {
    if (slug) {
      loadProduct();
    }
  }, [slug]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      // For now, using mock data. Replace with actual API call
      const mockProduct: Product = {
        id: '1',
        name: 'Wireless Bluetooth Headphones',
        slug: 'wireless-bluetooth-headphones',
        description: 'Experience crystal-clear sound with these premium wireless Bluetooth headphones. Featuring active noise cancellation, long battery life, and comfortable over-ear design. Perfect for music lovers, gamers, and professionals who demand the best audio experience.',
        price: 99.99,
        discountPrice: 79.99,
        currency: 'USD',
        sku: 'WH-001',
        stock: 50,
        isActive: true,
        brand: 'AudioTech',
        category: { id: '1', name: 'Electronics', slug: 'electronics' },
        images: [
          { id: '1', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop', alt: 'Headphones Front View', isPrimary: true },
          { id: '2', url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop', alt: 'Headphones Side View', isPrimary: false },
          { id: '3', url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&h=600&fit=crop', alt: 'Headphones Detail', isPrimary: false },
        ],
        reviews: [
          {
            id: '1',
            rating: 5,
            comment: 'Excellent sound quality and very comfortable for long listening sessions.',
            user: { id: '1', email: 'user1@example.com', role: 'customer' as any, isVerified: true, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            product: {} as Product,
            createdAt: new Date(),
          },
          {
            id: '2',
            rating: 4,
            comment: 'Great headphones, battery life is impressive. Only minor issue is the size.',
            user: { id: '2', email: 'user2@example.com', role: 'customer' as any, isVerified: true, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            product: {} as Product,
            createdAt: new Date(),
          },
        ],
        variants: [
          { id: '1', name: 'Color', value: 'Black', price: 79.99, stock: 25 },
          { id: '2', name: 'Color', value: 'White', price: 79.99, stock: 15 },
          { id: '3', name: 'Color', value: 'Blue', price: 84.99, stock: 10 },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setProduct(mockProduct);
    } catch (err: any) {
      setError('Failed to load product');
      console.error('Error loading product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      setIsAddingToCart(true);
      await addToCart(product, quantity, selectedVariant);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const nextImage = () => {
    if (product && product.images.length > 1) {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product && product.images.length > 1) {
      setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  const averageRating = product?.reviews.length 
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length 
    : 0;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`h-5 w-5 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : i < rating 
            ? 'text-yellow-400 fill-current opacity-50' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center py-12">
          <div className="loading-spinner"></div>
          <span className="ml-2 text-gray-600">Loading product...</span>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-red-600">{error || 'Product not found'}</p>
          <Link to="/products" className="btn-primary mt-4">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
          </li>
          <li>
            <span className="text-gray-400 mx-2">/</span>
          </li>
          <li>
            <Link to="/products" className="text-gray-500 hover:text-gray-700">Products</Link>
          </li>
          <li>
            <span className="text-gray-400 mx-2">/</span>
          </li>
          <li>
            <Link to={`/categories/${product.category.slug}`} className="text-gray-500 hover:text-gray-700">
              {product.category.name}
            </Link>
          </li>
          <li>
            <span className="text-gray-400 mx-2">/</span>
          </li>
          <li className="text-gray-900 font-medium">{product.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={product.images[selectedImage]?.url || 'https://via.placeholder.com/600x600?text=No+Image'}
              alt={product.images[selectedImage]?.alt || product.name}
              className="w-full h-full object-cover"
            />
            
            {/* Navigation arrows */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail images */}
          {product.images.length > 1 && (
            <div className="flex space-x-2">
              {product.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary-500' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                {renderStars(averageRating)}
                <span className="ml-2 text-sm text-gray-600">
                  {averageRating.toFixed(1)} ({product.reviews.length} reviews)
                </span>
              </div>
              <span className="text-sm text-gray-500">SKU: {product.sku}</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-4">
            {product.discountPrice ? (
              <>
                <span className="text-4xl font-bold text-gray-900">${product.discountPrice}</span>
                <span className="text-2xl text-gray-500 line-through">${product.price}</span>
                <span className="badge badge-error text-lg">
                  {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                </span>
              </>
            ) : (
              <span className="text-4xl font-bold text-gray-900">${product.price}</span>
            )}
          </div>

          {/* Variants */}
          {product.variants.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Select Options</h3>
              <div className="grid grid-cols-3 gap-3">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant.id)}
                    className={`p-3 border rounded-lg text-center ${
                      selectedVariant === variant.id
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-medium">{variant.value}</div>
                    <div className="text-sm text-gray-600">${variant.price}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="text-lg font-medium text-gray-900">Quantity:</label>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-50"
                >
                  -
                </button>
                <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-2 hover:bg-gray-50"
                >
                  +
                </button>
              </div>
              <span className="text-sm text-gray-600">
                {product.stock} available
              </span>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAddingToCart}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingToCart ? (
                  <div className="flex items-center justify-center">
                    <div className="loading-spinner mr-2"></div>
                    Adding to Cart...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <ShoppingCartIcon className="h-5 w-5 mr-2" />
                    Add to Cart
                  </div>
                )}
              </button>
              <button
                onClick={handleWishlist}
                className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {isWishlisted ? (
                  <HeartSolidIcon className="h-6 w-6 text-red-500" />
                ) : (
                  <HeartIcon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-t border-gray-200">
            <div className="flex items-center">
              <TruckIcon className="h-6 w-6 text-primary-600 mr-2" />
              <span className="text-sm text-gray-600">Free Shipping</span>
            </div>
            <div className="flex items-center">
              <ShieldCheckIcon className="h-6 w-6 text-primary-600 mr-2" />
              <span className="text-sm text-gray-600">1 Year Warranty</span>
            </div>
            <div className="flex items-center">
              <ArrowPathIcon className="h-6 w-6 text-primary-600 mr-2" />
              <span className="text-sm text-gray-600">30 Day Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'description', label: 'Description' },
              { id: 'reviews', label: `Reviews (${product.reviews.length})` },
              { id: 'specifications', label: 'Specifications' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="py-8">
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {product.reviews.length === 0 ? (
                <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
              ) : (
                product.reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        {renderStars(review.rating)}
                        <span className="ml-2 text-sm text-gray-600">
                          by {review.user.email}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Product Details</h4>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Brand</dt>
                    <dd className="text-gray-900">{product.brand}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Category</dt>
                    <dd className="text-gray-900">{product.category.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">SKU</dt>
                    <dd className="text-gray-900">{product.sku}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Stock</dt>
                    <dd className="text-gray-900">{product.stock} units</dd>
                  </div>
                </dl>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;