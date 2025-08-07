import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { Product, Category } from '../types';
import apiService from '../services/api';
import ProductCard from '../components/ProductCard';

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    priceRange: { min: '', max: '' },
    brand: '',
    rating: '',
    availability: '',
  });
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    if (slug) {
      loadCategoryData();
    }
  }, [slug]);

  const loadCategoryData = async () => {
    try {
      setLoading(true);
      // Load category and products
      const [categoryData, productsData] = await Promise.all([
        apiService.getCategoryBySlug(slug!),
        apiService.getProducts({ category: slug, limit: 100 }),
      ]);
      setCategory(categoryData);
      setProducts(productsData.data || []);
    } catch (err: any) {
      setError('Failed to load category data');
      console.error('Error loading category:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handlePriceRangeChange = (type: 'min' | 'max', value: string) => {
    setFilters(prev => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [type]: value
      }
    }));
  };

  const clearFilters = () => {
    setFilters({
      priceRange: { min: '', max: '' },
      brand: '',
      rating: '',
      availability: '',
    });
    setSortBy('relevance');
  };

  const filteredProducts = products.filter(product => {
    const matchesPrice = (!filters.priceRange.min || product.price >= parseFloat(filters.priceRange.min)) &&
                        (!filters.priceRange.max || product.price <= parseFloat(filters.priceRange.max));
    const matchesBrand = !filters.brand || product.brand === filters.brand;
    const matchesRating = !filters.rating || (product.reviews.length > 0 && 
      product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length >= parseFloat(filters.rating));
    const matchesAvailability = !filters.availability || 
      (filters.availability === 'in-stock' && product.stock > 0) ||
      (filters.availability === 'on-sale' && product.discountPrice);
    
    return matchesPrice && matchesBrand && matchesRating && matchesAvailability;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'rating':
        const aRating = a.reviews.length > 0 ? a.reviews.reduce((sum, review) => sum + review.rating, 0) / a.reviews.length : 0;
        const bRating = b.reviews.length > 0 ? b.reviews.reduce((sum, review) => sum + review.rating, 0) / b.reviews.length : 0;
        return bRating - aRating;
      default:
        return 0;
    }
  });

  const brands = Array.from(new Set(products.map(p => p.brand))).filter(Boolean);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center py-12">
          <div className="loading-spinner"></div>
          <span className="ml-2 text-gray-600">Loading category...</span>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-red-600">{error || 'Category not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
        <p className="text-gray-600 mt-2">
          {products.length} {products.length === 1 ? 'product' : 'products'} in this category
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Clear All
                </button>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceRange.min}
                    onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                    className="input-field text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceRange.max}
                    onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                    className="input-field text-sm"
                  />
                </div>
              </div>

              {/* Brand Filter */}
              {brands.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Brand</h3>
                  <div className="space-y-2">
                    {brands.map((brand) => (
                      <label key={brand} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.brand === brand}
                          onChange={(e) => handleFilterChange('brand', e.target.checked ? brand || '' : '')}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Rating Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Rating</h3>
                <div className="space-y-2">
                  {[4, 3, 2].map((rating) => (
                    <label key={rating} className="flex items-center">
                      <input
                        type="radio"
                        name="rating"
                        value={rating.toString()}
                        checked={filters.rating === rating.toString()}
                        onChange={(e) => handleFilterChange('rating', e.target.value)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">{rating}+ Stars</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Availability</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.availability === 'in-stock'}
                      onChange={(e) => handleFilterChange('availability', e.target.checked ? 'in-stock' : '')}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">In Stock</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.availability === 'on-sale'}
                      onChange={(e) => handleFilterChange('availability', e.target.checked ? 'on-sale' : '')}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">On Sale</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <FunnelIcon className="h-5 w-5 mr-2" />
                Filters
              </button>
            </div>

            <div className="flex items-center space-x-4">
              {/* Sort */}
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-700">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-field text-sm"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              {/* View Mode */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Squares2X2Icon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <ListBulletIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3">Quick Filters</h3>
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={filters.brand}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                  className="input-field text-sm"
                >
                  <option value="">All Brands</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
                <select
                  value={filters.availability}
                  onChange={(e) => handleFilterChange('availability', e.target.value)}
                  className="input-field text-sm"
                >
                  <option value="">All Items</option>
                  <option value="in-stock">In Stock</option>
                  <option value="on-sale">On Sale</option>
                </select>
              </div>
            </div>
          )}

          {/* Results */}
          {sortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No products found in this category</p>
              <p className="text-sm text-gray-500 mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
            }>
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} viewMode={viewMode} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {sortedProducts.length > 0 && (
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
      </div>
    </div>
  );
};

export default CategoryPage;