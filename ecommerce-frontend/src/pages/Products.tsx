import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get('minPrice') || '',
    max: searchParams.get('maxPrice') || '',
  });
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [searchQuery, selectedCategory, priceRange, sortBy]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: 1,
        limit: 20,
      };

      if (searchQuery) params.search = searchQuery;
      if (selectedCategory) params.category = selectedCategory;
      if (priceRange.min) params.minPrice = priceRange.min;
      if (priceRange.max) params.maxPrice = priceRange.max;
      if (sortBy) params.sort = sortBy;

      const response = await apiService.getProducts(params);
      setProducts(response.data);
    } catch (err: any) {
      setError('Failed to load products');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      // This would be replaced with actual API call
      const mockCategories: Category[] = [
        { id: '1', name: 'Electronics', slug: 'electronics', description: 'Electronic devices and gadgets' },
        { id: '2', name: 'Fashion', slug: 'fashion', description: 'Clothing and accessories' },
        { id: '3', name: 'Home & Garden', slug: 'home-garden', description: 'Home improvement and garden supplies' },
        { id: '4', name: 'Sports', slug: 'sports', description: 'Sports equipment and outdoor gear' },
        { id: '5', name: 'Books', slug: 'books', description: 'Books and educational materials' },
      ];
      setCategories(mockCategories);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    if (priceRange.min) params.set('minPrice', priceRange.min);
    if (priceRange.max) params.set('maxPrice', priceRange.max);
    if (sortBy) params.set('sort', sortBy);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setPriceRange({ min: '', max: '' });
    setSortBy('newest');
    setSearchParams({});
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
    {
      id: '4',
      name: 'Garden Tool Set',
      slug: 'garden-tool-set',
      description: 'Complete set of essential garden tools',
      price: 89.99,
      currency: 'USD',
      sku: 'GT-001',
      stock: 30,
      isActive: true,
      brand: 'GardenPro',
      category: { id: '3', name: 'Home & Garden', slug: 'home-garden' },
      images: [{ id: '4', url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop', alt: 'Garden Tools', isPrimary: true }],
      reviews: [],
      variants: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const displayProducts = products.length > 0 ? products : mockProducts;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
        <p className="text-gray-600">Discover amazing products at great prices</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FunnelIcon className="h-5 w-5 mr-2" />
            Filters
            <ChevronDownIcon className="h-4 w-4 ml-2" />
          </button>
          <button type="submit" className="btn-primary">
            Search
          </button>
        </form>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full input-field"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
              <input
                type="number"
                placeholder="0"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
              <input
                type="number"
                placeholder="1000"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full input-field"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Clear all filters
            </button>
            <span className="text-sm text-gray-600">
              {displayProducts.length} products found
            </span>
          </div>
        </div>
      )}

      {/* View Mode Toggle */}
      <div className="flex justify-between items-center mb-6">
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

      {/* Products Grid/List */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="loading-spinner"></div>
          <span className="ml-2 text-gray-600">Loading products...</span>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          : 'space-y-4'
        }>
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} viewMode={viewMode} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && displayProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No products found. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
};

export default Products;