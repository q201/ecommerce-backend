import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dtos/create-wishlist.dto';
import { AddItemDto } from './dtos/add-item.dto';

@ApiTags('wishlist')
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new wishlist' })
  @ApiResponse({ status: 201, description: 'Wishlist created successfully' })
  createWishlist(
    @Body() createWishlistDto: CreateWishlistDto,
    @Body('userId') userId: string
  ) {
    return this.wishlistService.createWishlist(userId, createWishlistDto);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get user wishlists' })
  @ApiResponse({ status: 200, description: 'User wishlists' })
  getUserWishlists(@Param('userId') userId: string) {
    return this.wishlistService.getUserWishlists(userId);
  }

  @Get('user/:userId/public')
  @ApiOperation({ summary: 'Get user public wishlists' })
  @ApiResponse({ status: 200, description: 'User public wishlists' })
  getPublicWishlists(@Param('userId') userId: string) {
    return this.wishlistService.getPublicWishlists(userId);
  }

  @Get('user/:userId/default')
  @ApiOperation({ summary: 'Get user default wishlist' })
  @ApiResponse({ status: 200, description: 'User default wishlist' })
  getDefaultWishlist(@Param('userId') userId: string) {
    return this.wishlistService.getDefaultWishlist(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get wishlist by ID' })
  @ApiResponse({ status: 200, description: 'Wishlist found' })
  @ApiResponse({ status: 404, description: 'Wishlist not found' })
  getWishlistById(
    @Param('id') id: string,
    @Query('userId') userId: string
  ) {
    return this.wishlistService.getWishlistById(id, userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update wishlist' })
  @ApiResponse({ status: 200, description: 'Wishlist updated successfully' })
  updateWishlist(
    @Param('id') id: string,
    @Query('userId') userId: string,
    @Body() updateData: any
  ) {
    return this.wishlistService.updateWishlist(id, userId, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete wishlist' })
  @ApiResponse({ status: 200, description: 'Wishlist deleted successfully' })
  deleteWishlist(
    @Param('id') id: string,
    @Query('userId') userId: string
  ) {
    return this.wishlistService.deleteWishlist(id, userId);
  }

  // Wishlist items
  @Post(':id/items')
  @ApiOperation({ summary: 'Add item to wishlist' })
  @ApiResponse({ status: 201, description: 'Item added to wishlist successfully' })
  addItemToWishlist(
    @Param('id') wishlistId: string,
    @Query('userId') userId: string,
    @Body() addItemDto: AddItemDto
  ) {
    return this.wishlistService.addItemToWishlist(wishlistId, userId, addItemDto);
  }

  @Post('default/items')
  @ApiOperation({ summary: 'Add item to default wishlist' })
  @ApiResponse({ status: 201, description: 'Item added to default wishlist successfully' })
  addItemToDefaultWishlist(
    @Query('userId') userId: string,
    @Body() addItemDto: AddItemDto
  ) {
    return this.wishlistService.addItemToDefaultWishlist(userId, addItemDto);
  }

  @Put('items/:itemId')
  @ApiOperation({ summary: 'Update wishlist item' })
  @ApiResponse({ status: 200, description: 'Wishlist item updated successfully' })
  updateWishlistItem(
    @Param('itemId') itemId: string,
    @Query('userId') userId: string,
    @Body() updateData: any
  ) {
    return this.wishlistService.updateWishlistItem(itemId, userId, updateData);
  }

  @Delete('items/:itemId')
  @ApiOperation({ summary: 'Remove item from wishlist' })
  @ApiResponse({ status: 200, description: 'Item removed from wishlist successfully' })
  removeItemFromWishlist(
    @Param('itemId') itemId: string,
    @Query('userId') userId: string
  ) {
    return this.wishlistService.removeItemFromWishlist(itemId, userId);
  }

  @Put('items/:itemId/move')
  @ApiOperation({ summary: 'Move item to another wishlist' })
  @ApiResponse({ status: 200, description: 'Item moved successfully' })
  moveItemToWishlist(
    @Param('itemId') itemId: string,
    @Query('userId') userId: string,
    @Body('targetWishlistId') targetWishlistId: string
  ) {
    return this.wishlistService.moveItemToWishlist(itemId, targetWishlistId, userId);
  }

  // Analytics and features
  @Get('user/:userId/analytics')
  @ApiOperation({ summary: 'Get wishlist analytics' })
  @ApiResponse({ status: 200, description: 'Wishlist analytics' })
  getWishlistAnalytics(@Param('userId') userId: string) {
    return this.wishlistService.getWishlistAnalytics(userId);
  }

  @Get('user/:userId/price-drops')
  @ApiOperation({ summary: 'Check for price drops in wishlist items' })
  @ApiResponse({ status: 200, description: 'Price drops found' })
  checkPriceDrops(@Param('userId') userId: string) {
    return this.wishlistService.checkPriceDrops(userId);
  }

  @Post(':id/share')
  @ApiOperation({ summary: 'Share wishlist' })
  @ApiResponse({ status: 200, description: 'Wishlist share URL generated' })
  shareWishlist(
    @Param('id') wishlistId: string,
    @Query('userId') userId: string
  ) {
    return this.wishlistService.shareWishlist(wishlistId, userId);
  }
} 