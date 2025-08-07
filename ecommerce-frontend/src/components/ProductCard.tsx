import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      setIsAddingToCart(true);
      await addToCart(product, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const averageRating = product.reviews.length > 0 
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length 
    : 0;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : i < rating 
            ? 'text-yellow-400 fill-current opacity-50' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (viewMode === 'list') {
    return (
      <Link to={`/product/${product.slug}`} className="block">
        <div className="card hover:shadow-lg transition-shadow duration-200">
          <div className="flex">
            {/* Product Image */}
            <div className="w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0">
              <img
                src={product.images[0]?.url || 'https://via.placeholder.com/400x400?text=No+Image'}
                alt={product.images[0]?.alt || product.name}
                className="w-full h-full object-cover rounded-l-lg"
              />
            </div>

            {/* Product Info */}
            <div className="flex-1 p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {product.description}
                  </p>
                  
                  {/* Rating */}
                  <div className="flex items-center mb-2">
                    <div className="flex items-center mr-2">
                      {renderStars(averageRating)}
                    </div>
                    <span className="text-sm text-gray-600">
                      ({product.reviews.length} reviews)
                    </span>
                  </div>

                  {/* Category and Brand */}
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <span>{product.category.name}</span>
                    {product.brand && <span>• {product.brand}</span>}
                    <span>• SKU: {product.sku}</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center space-x-2 mb-3">
                    {product.discountPrice ? (
                      <>
                        <span className="text-2xl font-bold text-gray-900">
                          ${product.discountPrice}
                        </span>
                        <span className="text-lg text-gray-500 line-through">
                          ${product.price}
                        </span>
                        <span className="badge badge-error">
                          {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                        </span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold text-gray-900">
                        ${product.price}
                      </span>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col space-y-2 ml-4">
                  <button
                    onClick={handleWishlist}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    {isWishlisted ? (
                      <HeartSolidIcon className="h-5 w-5 text-red-500" />
                    ) : (
                      <HeartIcon className="h-5 w-5" />
                    )}
                  </button>
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0 || isAddingToCart}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAddingToCart ? (
                      <div className="loading-spinner h-4 w-4"></div>
                    ) : (
                      <ShoppingCartIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid view
  return (
    <Link to={`/product/${product.slug}`} className="group">
      <div className="card card-hover overflow-hidden">
        {/* Product Image */}
        <div className="relative aspect-square bg-gray-200">
          <img
            src={product.images[0]?.url || 'https://via.placeholder.com/400x400?text=No+Image'}
            alt={product.images[0]?.alt || product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          
          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md text-gray-400 hover:text-red-500 transition-colors"
          >
            {isWishlisted ? (
              <HeartSolidIcon className="h-4 w-4 text-red-500" />
            ) : (
              <HeartIcon className="h-4 w-4" />
            )}
          </button>

          {/* Discount Badge */}
          {product.discountPrice && (
            <div className="absolute top-2 left-2">
              <span className="badge badge-error">
                {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
              </span>
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isAddingToCart}
            className="absolute bottom-2 left-2 right-2 btn-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200 disabled:opacity-50"
          >
            {isAddingToCart ? (
              <div className="flex items-center justify-center">
                <div className="loading-spinner h-4 w-4 mr-2"></div>
                Adding...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <ShoppingCartIcon className="h-4 w-4 mr-2" />
                Add to Cart
              </div>
            )}
          </button>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center mb-2">
            <div className="flex items-center mr-2">
              {renderStars(averageRating)}
            </div>
            <span className="text-sm text-gray-600">
              ({product.reviews.length})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-2 mb-2">
            {product.discountPrice ? (
              <>
                <span className="text-xl font-bold text-gray-900">
                  ${product.discountPrice}
                </span>
                <span className="text-lg text-gray-500 line-through">
                  ${product.price}
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-gray-900">
                ${product.price}
              </span>
            )}
          </div>

          {/* Category and Stock */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{product.category.name}</span>
            <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;