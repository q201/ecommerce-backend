import React, { useState, useEffect } from 'react';
import { 
  StarIcon,
  PencilIcon,
  TrashIcon,
  ChatBubbleLeftIcon,
  CalendarIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { Review, Product } from '../types';
import apiService from '../services/api';

interface ReviewWithProduct extends Review {
  product: Product;
}

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingReview, setEditingReview] = useState<ReviewWithProduct | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    rating: 5,
    title: '',
    comment: '',
  });

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      // This would be a user reviews endpoint
      // const reviewsData = await apiService.getUserReviews();
      // setReviews(reviewsData);
      
      // Mock data for now
      const mockReviews: ReviewWithProduct[] = [
        {
          id: '1',
          rating: 5,
          title: 'Excellent headphones!',
          comment: 'These headphones are amazing. Great sound quality and comfortable to wear for long periods.',
          product: {
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
          user: null,
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15'),
        },
        {
          id: '2',
          rating: 4,
          title: 'Good fitness watch',
          comment: 'The watch tracks my workouts well and has a long battery life. Would recommend.',
          product: {
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
          user: null,
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-10'),
        },
      ];
      setReviews(mockReviews);
    } catch (err: any) {
      setError('Failed to load reviews');
      console.error('Error loading reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditReview = (review: ReviewWithProduct) => {
    setEditingReview(review);
    setEditForm({
      rating: review.rating,
      title: review.title,
      comment: review.comment,
    });
    setShowEditForm(true);
  };

  const handleUpdateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;

    try {
      // This would be an update review endpoint
      // await apiService.updateReview(editingReview.id, editForm);
      
      setReviews(prev => prev.map(review => 
        review.id === editingReview.id 
          ? { ...review, ...editForm, updatedAt: new Date() }
          : review
      ));
      
      setShowEditForm(false);
      setEditingReview(null);
      setEditForm({ rating: 5, title: '', comment: '' });
    } catch (err: any) {
      setError('Failed to update review');
      console.error('Error updating review:', err);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      // This would be a delete review endpoint
      // await apiService.deleteReview(reviewId);
      setReviews(prev => prev.filter(review => review.id !== reviewId));
    } catch (err: any) {
      setError('Failed to delete review');
      console.error('Error deleting review:', err);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`h-5 w-5 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center py-12">
          <div className="loading-spinner"></div>
          <span className="ml-2 text-gray-600">Loading reviews...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <ChatBubbleLeftIcon className="h-8 w-8 text-primary-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">My Reviews</h1>
        </div>
        <p className="text-gray-600">
          {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'} written
        </p>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <ChatBubbleLeftIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No reviews yet</h2>
          <p className="text-gray-600 mb-6">
            Start reviewing products you've purchased to help other customers
          </p>
          <a href="/orders" className="btn-primary">
            View Orders
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="card">
              <div className="p-6">
                {/* Product Info */}
                <div className="flex items-start space-x-4 mb-4">
                  <img
                    src={review.product.images[0]?.url || 'https://via.placeholder.com/80x80?text=No+Image'}
                    alt={review.product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{review.product.name}</h3>
                    <p className="text-sm text-gray-600">{review.product.brand}</p>
                    <div className="flex items-center mt-1">
                      {renderStars(review.rating)}
                      <span className="ml-2 text-sm text-gray-600">{review.rating}/5</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditReview(review)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="Edit Review"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="p-2 text-gray-400 hover:text-red-600"
                      title="Delete Review"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Review Content */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
                  <p className="text-gray-600">{review.comment}</p>
                </div>

                {/* Review Meta */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                    {review.updatedAt !== review.createdAt && (
                      <span className="text-xs">(Edited)</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Review Modal */}
      {showEditForm && editingReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Edit Review for {editingReview.product.name}
            </h3>
            
            <form onSubmit={handleUpdateReview} className="space-y-4">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setEditForm(prev => ({ ...prev, rating: i + 1 }))}
                      className="focus:outline-none"
                    >
                      <StarIcon
                        className={`h-6 w-6 ${
                          i < editForm.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">{editForm.rating}/5</span>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  className="input-field"
                  required
                />
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Review</label>
                <textarea
                  value={editForm.comment}
                  onChange={(e) => setEditForm(prev => ({ ...prev, comment: e.target.value }))}
                  className="input-field"
                  rows={4}
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  Update Review
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingReview(null);
                    setEditForm({ rating: 5, title: '', comment: '' });
                  }}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;