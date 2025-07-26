import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { SearchQueryDto } from './dtos/search-query.dto';
import { SuggestionType } from './entities/search-suggestion.entity';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post('products')
  @ApiOperation({ summary: 'Search products with filters' })
  @ApiResponse({ status: 200, description: 'Search results' })
  searchProducts(
    @Body() searchQueryDto: SearchQueryDto,
    @Query('userId') userId?: string
  ) {
    return this.searchService.searchProducts(searchQueryDto, userId);
  }

  @Get('suggestions')
  @ApiOperation({ summary: 'Get search suggestions' })
  @ApiResponse({ status: 200, description: 'Search suggestions' })
  getSearchSuggestions(
    @Query('query') query: string,
    @Query('limit') limit?: number
  ) {
    return this.searchService.getSearchSuggestions(query, limit);
  }

  @Get('popular')
  @ApiOperation({ summary: 'Get popular searches' })
  @ApiResponse({ status: 200, description: 'Popular searches' })
  getPopularSearches(@Query('limit') limit?: number) {
    return this.searchService.getPopularSearches(limit);
  }

  @Get('trending')
  @ApiOperation({ summary: 'Get trending searches' })
  @ApiResponse({ status: 200, description: 'Trending searches' })
  getTrendingSearches(@Query('limit') limit?: number) {
    return this.searchService.getTrendingSearches(limit);
  }

  @Post('suggestions')
  @ApiOperation({ summary: 'Add search suggestion' })
  @ApiResponse({ status: 201, description: 'Suggestion added successfully' })
  addSearchSuggestion(@Body() suggestionData: any) {
    return this.searchService.addSearchSuggestion(suggestionData);
  }

  @Post('suggestions/:term/click')
  @ApiOperation({ summary: 'Update suggestion click count' })
  @ApiResponse({ status: 200, description: 'Click count updated' })
  updateSuggestionClick(
    @Param('term') term: string,
    @Query('type') type: SuggestionType
  ) {
    return this.searchService.updateSuggestionClickCount(term, type);
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get search analytics' })
  @ApiResponse({ status: 200, description: 'Search analytics' })
  getSearchAnalytics(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    return this.searchService.getSearchAnalytics(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    );
  }

  @Get('top-searches')
  @ApiOperation({ summary: 'Get top searches' })
  @ApiResponse({ status: 200, description: 'Top searches' })
  getTopSearches(@Query('limit') limit?: number) {
    return this.searchService.getTopSearches(limit);
  }

  @Get('performance')
  @ApiOperation({ summary: 'Get search performance metrics' })
  @ApiResponse({ status: 200, description: 'Search performance' })
  getSearchPerformance() {
    return this.searchService.getSearchPerformance();
  }

  @Get('filters')
  @ApiOperation({ summary: 'Get available search filters' })
  @ApiResponse({ status: 200, description: 'Available filters' })
  getSearchFilters() {
    return this.searchService.getSearchFilters();
  }

  @Get('autocomplete')
  @ApiOperation({ summary: 'Get autocomplete suggestions' })
  @ApiResponse({ status: 200, description: 'Autocomplete suggestions' })
  getAutocompleteSuggestions(
    @Query('query') query: string,
    @Query('limit') limit?: number
  ) {
    return this.searchService.getSearchSuggestions(query, limit);
  }
} 