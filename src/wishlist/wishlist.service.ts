import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { WishlistItem } from './entities/wishlist-item.entity';
import { CreateWishlistDto } from './dtos/create-wishlist.dto';
import { AddItemDto } from './dtos/add-item.dto';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    @InjectRepository(WishlistItem)
    private wishlistItemRepository: Repository<WishlistItem>,
  ) {}

  async createWishlist(userId: string, createWishlistDto: CreateWishlistDto): Promise<Wishlist> {
    // If this is set as default, remove default from other wishlists
    if (createWishlistDto.isDefault) {
      await this.wishlistRepository.update(
        { userId, isDefault: true },
        { isDefault: false }
      );
    }

    const wishlist = this.wishlistRepository.create({
      ...createWishlistDto,
      userId,
    });

    return await this.wishlistRepository.save(wishlist);
  }

  async getUserWishlists(userId: string): Promise<Wishlist[]> {
    return await this.wishlistRepository.find({
      where: { userId, isActive: true },
      relations: ['items'],
      order: { isDefault: 'DESC', createdAt: 'DESC' },
    });
  }

  async getPublicWishlists(userId: string): Promise<Wishlist[]> {
    return await this.wishlistRepository.find({
      where: { userId, isPublic: true, isActive: true },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  async getWishlistById(id: string, userId: string): Promise<Wishlist> {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id, userId, isActive: true },
      relations: ['items'],
    });

    if (!wishlist) {
      throw new NotFoundException(`Wishlist with ID ${id} not found`);
    }

    return wishlist;
  }

  async getDefaultWishlist(userId: string): Promise<Wishlist> {
    let wishlist = await this.wishlistRepository.findOne({
      where: { userId, isDefault: true, isActive: true },
      relations: ['items'],
    });

    if (!wishlist) {
      // Create default wishlist if none exists
      wishlist = await this.createWishlist(userId, {
        name: 'My Wishlist',
        description: 'Default wishlist',
        isDefault: true,
        isPublic: false,
      });
    }

    return wishlist;
  }

  async updateWishlist(id: string, userId: string, updateData: Partial<Wishlist>): Promise<Wishlist> {
    const wishlist = await this.getWishlistById(id, userId);

    // If setting as default, remove default from other wishlists
    if (updateData.isDefault) {
      await this.wishlistRepository.update(
        { userId, isDefault: true, id: { $ne: id } },
        { isDefault: false }
      );
    }

    Object.assign(wishlist, updateData);
    return await this.wishlistRepository.save(wishlist);
  }

  async deleteWishlist(id: string, userId: string): Promise<void> {
    const wishlist = await this.getWishlistById(id, userId);
    
    // Delete all items first
    await this.wishlistItemRepository.delete({ wishlistId: id });
    
    // Delete wishlist
    await this.wishlistRepository.remove(wishlist);
  }

  async addItemToWishlist(
    wishlistId: string,
    userId: string,
    addItemDto: AddItemDto
  ): Promise<WishlistItem> {
    const wishlist = await this.getWishlistById(wishlistId, userId);

    // Check if item already exists in wishlist
    const existingItem = await this.wishlistItemRepository.findOne({
      where: { wishlistId, productId: addItemDto.productId },
    });

    if (existingItem) {
      throw new BadRequestException('Item already exists in wishlist');
    }

    const item = this.wishlistItemRepository.create({
      ...addItemDto,
      wishlistId,
    });

    const savedItem = await this.wishlistItemRepository.save(item);

    // Update wishlist item count
    wishlist.itemCount += 1;
    await this.wishlistRepository.save(wishlist);

    return savedItem;
  }

  async addItemToDefaultWishlist(userId: string, addItemDto: AddItemDto): Promise<WishlistItem> {
    const defaultWishlist = await this.getDefaultWishlist(userId);
    return await this.addItemToWishlist(defaultWishlist.id, userId, addItemDto);
  }

  async updateWishlistItem(
    itemId: string,
    userId: string,
    updateData: Partial<WishlistItem>
  ): Promise<WishlistItem> {
    const item = await this.wishlistItemRepository.findOne({
      where: { id: itemId },
      relations: ['wishlist'],
    });

    if (!item || item.wishlist.userId !== userId) {
      throw new NotFoundException(`Wishlist item with ID ${itemId} not found`);
    }

    Object.assign(item, updateData);
    return await this.wishlistItemRepository.save(item);
  }

  async removeItemFromWishlist(itemId: string, userId: string): Promise<void> {
    const item = await this.wishlistItemRepository.findOne({
      where: { id: itemId },
      relations: ['wishlist'],
    });

    if (!item || item.wishlist.userId !== userId) {
      throw new NotFoundException(`Wishlist item with ID ${itemId} not found`);
    }

    await this.wishlistItemRepository.remove(item);

    // Update wishlist item count
    const wishlist = item.wishlist;
    wishlist.itemCount = Math.max(0, wishlist.itemCount - 1);
    await this.wishlistRepository.save(wishlist);
  }

  async moveItemToWishlist(
    itemId: string,
    targetWishlistId: string,
    userId: string
  ): Promise<WishlistItem> {
    const item = await this.wishlistItemRepository.findOne({
      where: { id: itemId },
      relations: ['wishlist'],
    });

    if (!item || item.wishlist.userId !== userId) {
      throw new NotFoundException(`Wishlist item with ID ${itemId} not found`);
    }

    const targetWishlist = await this.getWishlistById(targetWishlistId, userId);

    // Check if item already exists in target wishlist
    const existingItem = await this.wishlistItemRepository.findOne({
      where: { wishlistId: targetWishlistId, productId: item.productId },
    });

    if (existingItem) {
      throw new BadRequestException('Item already exists in target wishlist');
    }

    // Update item count for source wishlist
    const sourceWishlist = item.wishlist;
    sourceWishlist.itemCount = Math.max(0, sourceWishlist.itemCount - 1);
    await this.wishlistRepository.save(sourceWishlist);

    // Move item to target wishlist
    item.wishlistId = targetWishlistId;
    const movedItem = await this.wishlistItemRepository.save(item);

    // Update item count for target wishlist
    targetWishlist.itemCount += 1;
    await this.wishlistRepository.save(targetWishlist);

    return movedItem;
  }

  async getWishlistAnalytics(userId: string): Promise<any> {
    const wishlists = await this.getUserWishlists(userId);
    
    const analytics = {
      totalWishlists: wishlists.length,
      totalItems: 0,
      publicWishlists: 0,
      averageItemsPerWishlist: 0,
      mostPopularProducts: [],
      priceRange: { min: 0, max: 0, average: 0 },
    };

    let totalPrice = 0;
    let itemCount = 0;
    const productCounts = {};

    for (const wishlist of wishlists) {
      analytics.totalItems += wishlist.itemCount;
      if (wishlist.isPublic) analytics.publicWishlists++;

      for (const item of wishlist.items) {
        itemCount++;
        if (item.currentPrice) {
          totalPrice += item.currentPrice;
          analytics.priceRange.min = Math.min(analytics.priceRange.min, item.currentPrice);
          analytics.priceRange.max = Math.max(analytics.priceRange.max, item.currentPrice);
        }

        productCounts[item.productId] = (productCounts[item.productId] || 0) + 1;
      }
    }

    analytics.averageItemsPerWishlist = analytics.totalWishlists > 0 
      ? analytics.totalItems / analytics.totalWishlists 
      : 0;

    analytics.priceRange.average = itemCount > 0 ? totalPrice / itemCount : 0;

    // Get most popular products
    analytics.mostPopularProducts = Object.entries(productCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([productId, count]) => ({ productId, count }));

    return analytics;
  }

  async checkPriceDrops(userId: string): Promise<any[]> {
    const wishlists = await this.getUserWishlists(userId);
    const priceDrops = [];

    for (const wishlist of wishlists) {
      for (const item of wishlist.items) {
        if (item.originalPrice && item.currentPrice && item.currentPrice < item.originalPrice) {
          const dropPercentage = ((item.originalPrice - item.currentPrice) / item.originalPrice) * 100;
          priceDrops.push({
            itemId: item.id,
            productId: item.productId,
            wishlistName: wishlist.name,
            originalPrice: item.originalPrice,
            currentPrice: item.currentPrice,
            dropPercentage: dropPercentage.toFixed(2),
            savings: item.originalPrice - item.currentPrice,
          });
        }
      }
    }

    return priceDrops.sort((a, b) => b.dropPercentage - a.dropPercentage);
  }

  async shareWishlist(wishlistId: string, userId: string): Promise<{ shareUrl: string; shareCode: string }> {
    const wishlist = await this.getWishlistById(wishlistId, userId);
    
    if (!wishlist.isPublic) {
      throw new BadRequestException('Cannot share private wishlist');
    }

    const shareCode = this.generateShareCode();
    const shareUrl = `/wishlist/shared/${shareCode}`;

    return { shareUrl, shareCode };
  }

  private generateShareCode(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
} 