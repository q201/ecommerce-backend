import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review, ReviewStatus } from './entities/review.entity';
import { Rating, RatingType } from './entities/rating.entity';
import { CreateReviewDto } from './dtos/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,
  ) {}

  async createReview(userId: string, createReviewDto: CreateReviewDto): Promise<Review> {
    // Check if user has already reviewed this product
    const existingReview = await this.reviewRepository.findOne({
      where: { userId, productId: createReviewDto.productId },
    });

    if (existingReview) {
      throw new BadRequestException('You have already reviewed this product');
    }

    const review = this.reviewRepository.create({
      ...createReviewDto,
      userId,
      isVerifiedPurchase: true, // Assuming order verification is done elsewhere
    });

    return await this.reviewRepository.save(review);
  }

  async findAllReviews(
    productId?: string,
    status?: ReviewStatus,
    rating?: number,
    limit?: number,
    offset?: number
  ): Promise<{ reviews: Review[]; total: number }> {
    const query = this.reviewRepository.createQueryBuilder('review');

    if (productId) {
      query.andWhere('review.productId = :productId', { productId });
    }

    if (status) {
      query.andWhere('review.status = :status', { status });
    } else {
      query.andWhere('review.status = :status', { status: ReviewStatus.APPROVED });
    }

    if (rating) {
      query.andWhere('review.rating = :rating', { rating });
    }

    const total = await query.getCount();

    if (limit) {
      query.limit(limit);
    }

    if (offset) {
      query.offset(offset);
    }

    query.orderBy('review.createdAt', 'DESC');

    const reviews = await query.getMany();

    return { reviews, total };
  }

  async findOneReview(id: string): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    return review;
  }

  async updateReview(id: string, updateData: Partial<Review>): Promise<Review> {
    const review = await this.findOneReview(id);
    Object.assign(review, updateData);
    return await this.reviewRepository.save(review);
  }

  async deleteReview(id: string): Promise<void> {
    const review = await this.findOneReview(id);
    await this.reviewRepository.remove(review);
  }

  async approveReview(id: string, adminId: string): Promise<Review> {
    const review = await this.findOneReview(id);
    review.status = ReviewStatus.APPROVED;
    review.adminResponseBy = adminId;
    review.adminResponseAt = new Date();
    return await this.reviewRepository.save(review);
  }

  async rejectReview(id: string, adminId: string, reason: string): Promise<Review> {
    const review = await this.findOneReview(id);
    review.status = ReviewStatus.REJECTED;
    review.rejectionReason = reason;
    review.adminResponseBy = adminId;
    review.adminResponseAt = new Date();
    return await this.reviewRepository.save(review);
  }

  async markAsHelpful(id: string): Promise<Review> {
    const review = await this.findOneReview(id);
    review.helpfulCount += 1;
    return await this.reviewRepository.save(review);
  }

  async markAsUnhelpful(id: string): Promise<Review> {
    const review = await this.findOneReview(id);
    review.unhelpfulCount += 1;
    return await this.reviewRepository.save(review);
  }

  async addAdminResponse(id: string, adminId: string, response: string): Promise<Review> {
    const review = await this.findOneReview(id);
    review.adminResponse = response;
    review.adminResponseBy = adminId;
    review.adminResponseAt = new Date();
    return await this.reviewRepository.save(review);
  }

  // Rating methods
  async createRating(
    userId: string,
    productId: string,
    rating: number,
    type: RatingType = RatingType.OVERALL,
    comment?: string
  ): Promise<Rating> {
    const existingRating = await this.ratingRepository.findOne({
      where: { userId, productId, type },
    });

    if (existingRating) {
      throw new BadRequestException('You have already rated this product');
    }

    const newRating = this.ratingRepository.create({
      userId,
      productId,
      rating,
      type,
      comment,
    });

    return await this.ratingRepository.save(newRating);
  }

  async getProductRatings(productId: string): Promise<Rating[]> {
    return await this.ratingRepository.find({
      where: { productId },
      order: { createdAt: 'DESC' },
    });
  }

  async getAverageRating(productId: string, type?: RatingType): Promise<number> {
    const query = this.ratingRepository
      .createQueryBuilder('rating')
      .select('AVG(rating.rating)', 'average')
      .where('rating.productId = :productId', { productId });

    if (type) {
      query.andWhere('rating.type = :type', { type });
    }

    const result = await query.getRawOne();
    return parseFloat(result.average) || 0;
  }

  async getRatingDistribution(productId: string): Promise<any> {
    const distribution = await this.ratingRepository
      .createQueryBuilder('rating')
      .select('rating.rating', 'rating')
      .addSelect('COUNT(*)', 'count')
      .where('rating.productId = :productId', { productId })
      .groupBy('rating.rating')
      .orderBy('rating.rating', 'DESC')
      .getRawMany();

    return distribution.reduce((acc, item) => {
      acc[item.rating] = parseInt(item.count);
      return acc;
    }, {});
  }

  // Analytics methods
  async getReviewStats(productId?: string): Promise<any> {
    const query = this.reviewRepository.createQueryBuilder('review');

    if (productId) {
      query.where('review.productId = :productId', { productId });
    }

    const stats = await query
      .select('review.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .addSelect('AVG(review.rating)', 'averageRating')
      .groupBy('review.status')
      .getRawMany();

    return stats.reduce((acc, stat) => {
      acc[stat.status] = {
        count: parseInt(stat.count),
        averageRating: parseFloat(stat.averageRating) || 0,
      };
      return acc;
    }, {});
  }

  async getTopReviewedProducts(limit: number = 10): Promise<any[]> {
    return await this.reviewRepository
      .createQueryBuilder('review')
      .select('review.productId', 'productId')
      .addSelect('COUNT(*)', 'reviewCount')
      .addSelect('AVG(review.rating)', 'averageRating')
      .where('review.status = :status', { status: ReviewStatus.APPROVED })
      .groupBy('review.productId')
      .orderBy('reviewCount', 'DESC')
      .limit(limit)
      .getRawMany();
  }

  async getRecentReviews(limit: number = 10): Promise<Review[]> {
    return await this.reviewRepository.find({
      where: { status: ReviewStatus.APPROVED },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getPendingReviews(): Promise<Review[]> {
    return await this.reviewRepository.find({
      where: { status: ReviewStatus.PENDING },
      order: { createdAt: 'ASC' },
    });
  }
} 