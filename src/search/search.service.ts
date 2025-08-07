import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, In } from 'typeorm';
import { SearchLog, SearchType } from './entities/search-log.entity';
import { SearchSuggestion, SuggestionType } from './entities/search-suggestion.entity';
import { SearchQueryDto } from './dtos/search-query.dto';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(SearchLog)
    private searchLogRepository: Repository<SearchLog>,
    @InjectRepository(SearchSuggestion)
    private searchSuggestionRepository: Repository<SearchSuggestion>,
  ) {}

  async searchProducts(searchQueryDto: SearchQueryDto, userId?: string): Promise<any> {
    const startTime = Date.now();
    
    try {
      // This would typically integrate with a search engine like Elasticsearch
      // For now, we'll simulate a search with basic filtering
      const results = await this.simulateProductSearch(searchQueryDto);
      
      // Log the search
      await this.logSearch({
        userId,
        query: searchQueryDto.query,
        type: searchQueryDto.type || SearchType.PRODUCT,
        resultCount: results.total,
        hasResults: results.total > 0,
        filters: searchQueryDto.filters,
        sortBy: { field: searchQueryDto.sortBy, order: searchQueryDto.sortOrder },
        page: searchQueryDto.page || 1,
        limit: searchQueryDto.limit || 20,
        responseTime: Date.now() - startTime,
        isSuccessful: true,
      });

      return results;
    } catch (error) {
      // Log failed search
      await this.logSearch({
        userId,
        query: searchQueryDto.query,
        type: searchQueryDto.type || SearchType.PRODUCT,
        resultCount: 0,
        hasResults: false,
        responseTime: Date.now() - startTime,
        isSuccessful: false,
        errorMessage: error.message,
      });

      throw error;
    }
  }

  async getSearchSuggestions(query: string, limit: number = 10): Promise<SearchSuggestion[]> {
    const suggestions = await this.searchSuggestionRepository.find({
      where: [
        { term: Like(`%${query}%`), isActive: true },
        { synonyms: Like(`%${query}%`), isActive: true },
      ],
      order: { relevanceScore: 'DESC', frequency: 'DESC' },
      take: limit,
    });

    // Update last used timestamp
    if (suggestions.length > 0) {
      await this.searchSuggestionRepository.update(
        { id: In(suggestions.map(s => s.id)) },
        { lastUsed: new Date() }
      );
    }

    return suggestions;
  }

  async getPopularSearches(limit: number = 10): Promise<SearchSuggestion[]> {
    return await this.searchSuggestionRepository.find({
      where: { isActive: true },
      order: { frequency: 'DESC', clickCount: 'DESC' },
      take: limit,
    });
  }

  async getTrendingSearches(limit: number = 10): Promise<SearchSuggestion[]> {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    return await this.searchSuggestionRepository.find({
      where: { isActive: true, lastUsed: Between(lastWeek, new Date()) },
      order: { clickCount: 'DESC', lastUsed: 'DESC' },
      take: limit,
    });
  }

  async addSearchSuggestion(suggestionData: Partial<SearchSuggestion>): Promise<SearchSuggestion> {
    const existingSuggestion = await this.searchSuggestionRepository.findOne({
      where: { term: suggestionData.term, type: suggestionData.type },
    });

    if (existingSuggestion) {
      existingSuggestion.frequency += 1;
      existingSuggestion.lastUsed = new Date();
      return await this.searchSuggestionRepository.save(existingSuggestion);
    }

    const suggestion = this.searchSuggestionRepository.create(suggestionData);
    return await this.searchSuggestionRepository.save(suggestion);
  }

  async updateSuggestionClickCount(term: string, type: SuggestionType): Promise<void> {
    await this.searchSuggestionRepository.update(
      { term, type },
      { 
        clickCount: () => 'clickCount + 1',
        lastUsed: new Date()
      }
    );
  }

  async getSearchAnalytics(startDate?: Date, endDate?: Date): Promise<any> {
    const query = this.searchLogRepository.createQueryBuilder('search');

    if (startDate && endDate) {
      query.where('search.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate });
    }

    const analytics = await query
      .select('search.type', 'type')
      .addSelect('COUNT(*)', 'totalSearches')
      .addSelect('AVG(search.resultCount)', 'avgResults')
      .addSelect('AVG(search.responseTime)', 'avgResponseTime')
      .addSelect('SUM(CASE WHEN search.hasResults = true THEN 1 ELSE 0 END)', 'successfulSearches')
      .groupBy('search.type')
      .getRawMany();

    return analytics;
  }

  async getTopSearches(limit: number = 10): Promise<any[]> {
    return await this.searchLogRepository
      .createQueryBuilder('search')
      .select('search.query', 'query')
      .addSelect('COUNT(*)', 'searchCount')
      .addSelect('AVG(search.resultCount)', 'avgResults')
      .addSelect('SUM(search.clickCount)', 'totalClicks')
      .groupBy('search.query')
      .orderBy('searchCount', 'DESC')
      .limit(limit)
      .getRawMany();
  }

  async getSearchPerformance(): Promise<any> {
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [todayStats, lastWeekStats] = await Promise.all([
      this.searchLogRepository.count({ where: { createdAt: Between(today, new Date()) } }),
      this.searchLogRepository.count({ where: { createdAt: Between(lastWeek, today) } }),
    ]);

    const avgResponseTime = await this.searchLogRepository
      .createQueryBuilder('search')
      .select('AVG(search.responseTime)', 'avgTime')
      .where('search.createdAt >= :date', { date: lastWeek })
      .getRawOne();

    return {
      todaySearches: todayStats,
      lastWeekSearches: lastWeekStats,
      averageResponseTime: parseFloat(avgResponseTime.avgTime) || 0,
    };
  }

  async logSearch(logData: Partial<SearchLog>): Promise<SearchLog> {
    const log = this.searchLogRepository.create(logData);
    return await this.searchLogRepository.save(log);
  }

  async getSearchFilters(): Promise<any> {
    // This would return available filters for the search interface
    return {
      categories: ['Electronics', 'Clothing', 'Books', 'Home & Garden'],
      brands: ['Apple', 'Samsung', 'Nike', 'Adidas'],
      priceRanges: [
        { label: 'Under $10', min: 0, max: 10 },
        { label: '$10 - $50', min: 10, max: 50 },
        { label: '$50 - $100', min: 50, max: 100 },
        { label: '$100 - $500', min: 100, max: 500 },
        { label: 'Over $500', min: 500, max: null },
      ],
      ratings: [1, 2, 3, 4, 5],
      availability: ['in_stock', 'out_of_stock', 'pre_order'],
    };
  }

  private async simulateProductSearch(searchQueryDto: SearchQueryDto): Promise<any> {
    // This is a mock implementation
    // In a real application, this would query a search engine or database
    const mockProducts = [
      {
        id: '1',
        name: 'Sample Product 1',
        price: 99.99,
        category: 'Electronics',
        brand: 'Sample Brand',
        rating: 4.5,
        inStock: true,
      },
      {
        id: '2',
        name: 'Sample Product 2',
        price: 149.99,
        category: 'Electronics',
        brand: 'Sample Brand',
        rating: 4.2,
        inStock: true,
      },
    ];

    // Apply filters
    let filteredProducts = mockProducts;

    if (searchQueryDto.priceRange !== undefined && searchQueryDto.priceRange !== null) {
      filteredProducts = filteredProducts.filter(product => {
        if (searchQueryDto.priceRange?.min !== undefined && searchQueryDto.priceRange.min !== null && product.price < searchQueryDto.priceRange.min) return false;
        if (searchQueryDto.priceRange?.max !== undefined && searchQueryDto.priceRange.max !== null && product.price > searchQueryDto.priceRange.max) return false;
        return true;
      });
    }

    if (searchQueryDto?.category) {
      const categoryLower = searchQueryDto.category.toLowerCase();
      filteredProducts = filteredProducts.filter(product => 
        product.category.toLowerCase().includes(categoryLower)
      );
    }

    if (searchQueryDto?.brand) {
      const brandLower = searchQueryDto.brand.toLowerCase();
      filteredProducts = filteredProducts.filter(product => 
        product.brand.toLowerCase().includes(brandLower)
      );
    }

    if (searchQueryDto?.minRating !== undefined && searchQueryDto?.minRating !== null) {
      const minRating = searchQueryDto.minRating;
      filteredProducts = filteredProducts.filter(product => product.rating >= minRating);
    }

    if (searchQueryDto.availability !== undefined && searchQueryDto.availability !== null) {
      filteredProducts = filteredProducts.filter(product => {
        switch (searchQueryDto.availability) {
          case 'in_stock': return product.inStock;
          case 'out_of_stock': return !product.inStock;
          default: return true;
        }
      });
    }

    // Apply sorting
    if (searchQueryDto.sortBy !== undefined && searchQueryDto.sortBy !== null) {
      const sortBy = searchQueryDto.sortBy;
      filteredProducts.sort((a, b) => {
        const aValue = a[sortBy] ?? 0;
        const bValue = b[sortBy] ?? 0;
        
        if (searchQueryDto.sortOrder === 'desc') {
          return bValue > aValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    // Apply pagination
    const page = searchQueryDto.page || 1;
    const limit = searchQueryDto.limit || 20;
    const offset = (page - 1) * limit;

    const paginatedProducts = filteredProducts.slice(offset, offset + limit);

    return {
      products: paginatedProducts,
      total: filteredProducts.length,
      page,
      limit,
      totalPages: Math.ceil(filteredProducts.length / limit),
      hasNext: page * limit < filteredProducts.length,
      hasPrev: page > 1,
    };
  }
} 