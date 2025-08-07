import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ChevronDownIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { Product } from '../types';
import apiService from '../services/api';
import ProductCard from '../components/ProductCard';

const SearchResults: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Get search query from URL
  const query = searchParams.get('q') || '';

  // Filter states
  const [filters, setFilters] = useState({
    category: '',
    priceRange: { min: '', max: '' },
    brand: '',
    rating: '',
    availability: '',
  });
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query, filters, sortBy]);

  const performSearch = async () => {
    try {
      setLoading(true);
      const searchResults = await apiService.searchProducts(query);
      setProducts(searchResults);
    } catch (err: any) {
      setError('Failed to perform search');
      console.error('Search error:', err);
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
      category: '',
      priceRange: { min: '', max: '' },
      brand: '',
      rating: '',
      availability: '',
    });
    setSortBy('relevance');
  };

  const mockProducts: Product[] = [
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

  const displayProducts = products.length > 0 ? products : mockProducts;

  const categories = [
    { id: '1', name: 'Electronics' },
    { id: '2', name: 'Fashion' },
    { id: '3', name: 'Home & Garden' },
    { id: '4', name: 'Sports' },
    { id: '5', name: 'Books' },
  ];

  const brands = [
    'AudioTech',
    'FitTech',
    'FashionCo',
    'GardenPro',
    'SportMax',
  ];

  const ratings = [
    { value: '4', label: '4+ Stars' },
    { value: '3', label: '3+ Stars' },
    { value: '2', label: '2+ Stars' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <MagnifyingGlassIcon className="h-6 w-6 text-gray-400 mr-2" />
          <h1 className="text-3xl font-bold text-gray-900">
            Search Results for "{query}"
          </h1>
        </div>
        <p className="text-gray-600">
          {displayProducts.length} products found
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

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Category</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.category === category.id}
                        onChange={(e) => handleFilterChange('category', e.target.checked ? category.id : '')}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{category.name}</span>
                    </label>
                  ))}
                </div>
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
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Brand</h3>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <label key={brand} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.brand === brand}
                        onChange={(e) => handleFilterChange('brand', e.target.checked ? brand : '')}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Rating</h3>
                <div className="space-y-2">
                  {ratings.map((rating) => (
                    <label key={rating.value} className="flex items-center">
                      <input
                        type="radio"
                        name="rating"
                        value={rating.value}
                        checked={filters.rating === rating.value}
                        onChange={(e) => handleFilterChange('rating', e.target.value)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">{rating.label}</span>
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
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="input-field text-sm"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
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
              </div>
            </div>
          )}

          {/* Results */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="loading-spinner"></div>
              <span className="ml-2 text-gray-600">Searching...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          ) : displayProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No products found for "{query}"</p>
              <p className="text-sm text-gray-500 mt-2">Try adjusting your search terms or filters</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
            }>
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} viewMode={viewMode} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {displayProducts.length > 0 && (
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

export default SearchResults;