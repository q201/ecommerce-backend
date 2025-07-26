import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { SalesReport, ReportPeriod } from './entities/sales-report.entity';
import { UserAnalytics } from './entities/user-analytics.entity';
import { ProductAnalytics } from './entities/product-analytics.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(SalesReport)
    private salesReportRepository: Repository<SalesReport>,
    @InjectRepository(UserAnalytics)
    private userAnalyticsRepository: Repository<UserAnalytics>,
    @InjectRepository(ProductAnalytics)
    private productAnalyticsRepository: Repository<ProductAnalytics>,
  ) {}

  // Sales Analytics
  async generateSalesReport(
    startDate: Date,
    endDate: Date,
    period: ReportPeriod = ReportPeriod.DAILY
  ): Promise<SalesReport> {
    // This would typically aggregate data from orders table
    // For now, creating a mock report
    const report = this.salesReportRepository.create({
      period,
      startDate,
      endDate,
      totalOrders: 0,
      totalRevenue: 0,
      totalCost: 0,
      grossProfit: 0,
      profitMargin: 0,
      totalItemsSold: 0,
      averageOrderValue: 0,
      newCustomers: 0,
      returningCustomers: 0,
      conversionRate: 0,
      topProducts: [],
      topCategories: [],
      salesByRegion: [],
      salesByPaymentMethod: [],
      salesByHour: [],
      salesByDay: [],
    });

    return await this.salesReportRepository.save(report);
  }

  async getSalesReports(
    startDate?: Date,
    endDate?: Date,
    period?: ReportPeriod
  ): Promise<SalesReport[]> {
    const query = this.salesReportRepository.createQueryBuilder('report');

    if (startDate && endDate) {
      query.where('report.startDate >= :startDate AND report.endDate <= :endDate', {
        startDate,
        endDate,
      });
    }

    if (period) {
      query.andWhere('report.period = :period', { period });
    }

    return await query.orderBy('report.startDate', 'DESC').getMany();
  }

  async getSalesSummary(startDate: Date, endDate: Date): Promise<any> {
    const reports = await this.salesReportRepository.find({
      where: {
        startDate: Between(startDate, endDate),
      },
    });

    const summary = {
      totalRevenue: 0,
      totalOrders: 0,
      totalItemsSold: 0,
      averageOrderValue: 0,
      newCustomers: 0,
      returningCustomers: 0,
      topProducts: [],
      topCategories: [],
    };

    reports.forEach(report => {
      summary.totalRevenue += parseFloat(report.totalRevenue.toString());
      summary.totalOrders += report.totalOrders;
      summary.totalItemsSold += report.totalItemsSold;
      summary.newCustomers += report.newCustomers;
      summary.returningCustomers += report.returningCustomers;
    });

    summary.averageOrderValue = summary.totalOrders > 0 
      ? summary.totalRevenue / summary.totalOrders 
      : 0;

    return summary;
  }

  // User Analytics
  async trackUserActivity(userId: string, activityData: any): Promise<UserAnalytics> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let analytics = await this.userAnalyticsRepository.findOne({
      where: { userId, date: today },
    });

    if (!analytics) {
      analytics = this.userAnalyticsRepository.create({
        userId,
        date: today,
        isNewUser: true,
      });
    }

    // Update analytics based on activity data
    if (activityData.pageView) analytics.pageViews += 1;
    if (activityData.session) analytics.sessions += 1;
    if (activityData.productViewed) analytics.productsViewed += 1;
    if (activityData.addToCart) analytics.productsAddedToCart += 1;
    if (activityData.orderPlaced) analytics.ordersPlaced += 1;
    if (activityData.timeOnSite) analytics.timeOnSite += activityData.timeOnSite;

    return await this.userAnalyticsRepository.save(analytics);
  }

  async getUserAnalytics(userId: string, startDate?: Date, endDate?: Date): Promise<UserAnalytics[]> {
    const query = this.userAnalyticsRepository.createQueryBuilder('analytics')
      .where('analytics.userId = :userId', { userId });

    if (startDate && endDate) {
      query.andWhere('analytics.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    return await query.orderBy('analytics.date', 'DESC').getMany();
  }

  async getTopUsers(limit: number = 10): Promise<any[]> {
    return await this.userAnalyticsRepository
      .createQueryBuilder('analytics')
      .select('analytics.userId', 'userId')
      .addSelect('SUM(analytics.totalSpent)', 'totalSpent')
      .addSelect('SUM(analytics.ordersPlaced)', 'totalOrders')
      .addSelect('AVG(analytics.timeOnSite)', 'avgTimeOnSite')
      .groupBy('analytics.userId')
      .orderBy('totalSpent', 'DESC')
      .limit(limit)
      .getRawMany();
  }

  // Product Analytics
  async trackProductActivity(productId: string, activityData: any): Promise<ProductAnalytics> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let analytics = await this.productAnalyticsRepository.findOne({
      where: { productId, date: today },
    });

    if (!analytics) {
      analytics = this.productAnalyticsRepository.create({
        productId,
        date: today,
      });
    }

    // Update analytics based on activity data
    if (activityData.view) analytics.views += 1;
    if (activityData.uniqueView) analytics.uniqueViews += 1;
    if (activityData.addToCart) analytics.addToCartCount += 1;
    if (activityData.purchase) analytics.purchases += 1;
    if (activityData.quantitySold) analytics.quantitySold += activityData.quantitySold;
    if (activityData.revenue) analytics.revenue += activityData.revenue;
    if (activityData.review) analytics.reviews += 1;
    if (activityData.wishlistAdd) analytics.wishlistAdds += 1;
    if (activityData.share) analytics.shares += 1;

    // Calculate rates
    if (analytics.views > 0) {
      analytics.conversionRate = (analytics.purchases / analytics.views) * 100;
      analytics.addToCartRate = (analytics.addToCartCount / analytics.views) * 100;
    }

    return await this.productAnalyticsRepository.save(analytics);
  }

  async getProductAnalytics(productId: string, startDate?: Date, endDate?: Date): Promise<ProductAnalytics[]> {
    const query = this.productAnalyticsRepository.createQueryBuilder('analytics')
      .where('analytics.productId = :productId', { productId });

    if (startDate && endDate) {
      query.andWhere('analytics.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    return await query.orderBy('analytics.date', 'DESC').getMany();
  }

  async getTopProducts(limit: number = 10, metric: 'revenue' | 'views' | 'conversionRate' = 'revenue'): Promise<any[]> {
    const query = this.productAnalyticsRepository
      .createQueryBuilder('analytics')
      .select('analytics.productId', 'productId')
      .addSelect(`SUM(analytics.${metric})`, 'total')
      .addSelect('SUM(analytics.views)', 'totalViews')
      .addSelect('SUM(analytics.purchases)', 'totalPurchases')
      .addSelect('AVG(analytics.averageRating)', 'avgRating')
      .groupBy('analytics.productId')
      .orderBy('total', 'DESC')
      .limit(limit);

    return await query.getRawMany();
  }

  // Dashboard Analytics
  async getDashboardStats(): Promise<any> {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const [todayStats, lastMonthStats] = await Promise.all([
      this.getSalesSummary(today, today),
      this.getSalesSummary(lastMonth, today),
    ]);

    return {
      today: todayStats,
      lastMonth: lastMonthStats,
      growth: {
        revenue: this.calculateGrowth(todayStats.totalRevenue, lastMonthStats.totalRevenue),
        orders: this.calculateGrowth(todayStats.totalOrders, lastMonthStats.totalOrders),
        customers: this.calculateGrowth(todayStats.newCustomers, lastMonthStats.newCustomers),
      },
    };
  }

  private calculateGrowth(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  }

  // Real-time Analytics
  async getRealTimeStats(): Promise<any> {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [todaySales, todayUsers, todayProducts] = await Promise.all([
      this.salesReportRepository.findOne({ where: { startDate: today } }),
      this.userAnalyticsRepository.count({ where: { date: today } }),
      this.productAnalyticsRepository.count({ where: { date: today } }),
    ]);

    return {
      todaySales: todaySales || { totalRevenue: 0, totalOrders: 0 },
      activeUsers: todayUsers,
      activeProducts: todayProducts,
      currentHour: now.getHours(),
    };
  }
} 