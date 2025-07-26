import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dtos/create-review.dto';
import { ReviewStatus } from './entities/review.entity';
import { RatingType } from './entities/rating.entity';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new review' })
  @ApiResponse({ status: 201, description: 'Review created successfully' })
  createReview(
    @Body() createReviewDto: CreateReviewDto,
    @Body('userId') userId: string
  ) {
    return this.reviewsService.createReview(userId, createReviewDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reviews' })
  @ApiResponse({ status: 200, description: 'List of reviews' })
  findAllReviews(
    @Query('productId') productId?: string,
    @Query('status') status?: ReviewStatus,
    @Query('rating') rating?: number,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number
  ) {
    return this.reviewsService.findAllReviews(productId, status, rating, limit, offset);
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Get reviews by product ID' })
  @ApiResponse({ status: 200, description: 'Product reviews' })
  getProductReviews(
    @Param('productId') productId: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number
  ) {
    return this.reviewsService.findAllReviews(productId, undefined, undefined, limit, offset);
  }

  @Get('pending')
  @ApiOperation({ summary: 'Get pending reviews' })
  @ApiResponse({ status: 200, description: 'Pending reviews for moderation' })
  getPendingReviews() {
    return this.reviewsService.getPendingReviews();
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get recent reviews' })
  @ApiResponse({ status: 200, description: 'Recent approved reviews' })
  getRecentReviews(@Query('limit') limit?: number) {
    return this.reviewsService.getRecentReviews(limit);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get review statistics' })
  @ApiResponse({ status: 200, description: 'Review statistics' })
  getReviewStats(@Query('productId') productId?: string) {
    return this.reviewsService.getReviewStats(productId);
  }

  @Get('top-products')
  @ApiOperation({ summary: 'Get top reviewed products' })
  @ApiResponse({ status: 200, description: 'Top reviewed products' })
  getTopReviewedProducts(@Query('limit') limit?: number) {
    return this.reviewsService.getTopReviewedProducts(limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get review by ID' })
  @ApiResponse({ status: 200, description: 'Review found' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  findOneReview(@Param('id') id: string) {
    return this.reviewsService.findOneReview(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update review' })
  @ApiResponse({ status: 200, description: 'Review updated successfully' })
  updateReview(@Param('id') id: string, @Body() updateData: any) {
    return this.reviewsService.updateReview(id, updateData);
  }

  @Put(':id/approve')
  @ApiOperation({ summary: 'Approve review' })
  @ApiResponse({ status: 200, description: 'Review approved successfully' })
  approveReview(
    @Param('id') id: string,
    @Body('adminId') adminId: string
  ) {
    return this.reviewsService.approveReview(id, adminId);
  }

  @Put(':id/reject')
  @ApiOperation({ summary: 'Reject review' })
  @ApiResponse({ status: 200, description: 'Review rejected successfully' })
  rejectReview(
    @Param('id') id: string,
    @Body() body: { adminId: string; reason: string }
  ) {
    return this.reviewsService.rejectReview(id, body.adminId, body.reason);
  }

  @Put(':id/helpful')
  @ApiOperation({ summary: 'Mark review as helpful' })
  @ApiResponse({ status: 200, description: 'Review marked as helpful' })
  markAsHelpful(@Param('id') id: string) {
    return this.reviewsService.markAsHelpful(id);
  }

  @Put(':id/unhelpful')
  @ApiOperation({ summary: 'Mark review as unhelpful' })
  @ApiResponse({ status: 200, description: 'Review marked as unhelpful' })
  markAsUnhelpful(@Param('id') id: string) {
    return this.reviewsService.markAsUnhelpful(id);
  }

  @Put(':id/admin-response')
  @ApiOperation({ summary: 'Add admin response to review' })
  @ApiResponse({ status: 200, description: 'Admin response added successfully' })
  addAdminResponse(
    @Param('id') id: string,
    @Body() body: { adminId: string; response: string }
  ) {
    return this.reviewsService.addAdminResponse(id, body.adminId, body.response);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete review' })
  @ApiResponse({ status: 200, description: 'Review deleted successfully' })
  deleteReview(@Param('id') id: string) {
    return this.reviewsService.deleteReview(id);
  }

  // Rating endpoints
  @Post('ratings')
  @ApiOperation({ summary: 'Create a new rating' })
  @ApiResponse({ status: 201, description: 'Rating created successfully' })
  createRating(
    @Body() body: {
      userId: string;
      productId: string;
      rating: number;
      type?: RatingType;
      comment?: string;
    }
  ) {
    return this.reviewsService.createRating(
      body.userId,
      body.productId,
      body.rating,
      body.type,
      body.comment
    );
  }

  @Get('ratings/product/:productId')
  @ApiOperation({ summary: 'Get product ratings' })
  @ApiResponse({ status: 200, description: 'Product ratings' })
  getProductRatings(@Param('productId') productId: string) {
    return this.reviewsService.getProductRatings(productId);
  }

  @Get('ratings/product/:productId/average')
  @ApiOperation({ summary: 'Get average product rating' })
  @ApiResponse({ status: 200, description: 'Average product rating' })
  getAverageRating(
    @Param('productId') productId: string,
    @Query('type') type?: RatingType
  ) {
    return this.reviewsService.getAverageRating(productId, type);
  }

  @Get('ratings/product/:productId/distribution')
  @ApiOperation({ summary: 'Get rating distribution' })
  @ApiResponse({ status: 200, description: 'Rating distribution' })
  getRatingDistribution(@Param('productId') productId: string) {
    return this.reviewsService.getRatingDistribution(productId);
  }
} 