import { DataSource } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Category } from '../../categories/entities/category.entity';
import { ProductImage } from '../../products/entities/product-image.entity';

export class ProductSeeder {
  constructor(private dataSource: DataSource) {}

  async run() {
    const productRepository = this.dataSource.getRepository(Product);
    const categoryRepository = this.dataSource.getRepository(Category);
    const imageRepository = this.dataSource.getRepository(ProductImage);

    // Create categories first
    const categories = await this.createCategories(categoryRepository);

    // Create products
    const products = [
      {
        name: 'Wireless Bluetooth Headphones',
        slug: 'wireless-bluetooth-headphones',
        description: 'High-quality wireless headphones with active noise cancellation, 30-hour battery life, and premium sound quality. Perfect for music lovers and professionals.',
        price: 79.99,
        discountPrice: 69.99,
        currency: 'USD',
        sku: 'WH-001',
        stock: 50,
        isActive: true,
        brand: 'AudioTech',
        category: categories[0], // Electronics
        images: [
          { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop', alt: 'Wireless Headphones', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop', alt: 'Headphones Side View', isPrimary: false },
        ]
      },
      {
        name: 'Smart Fitness Watch',
        slug: 'smart-fitness-watch',
        description: 'Advanced fitness tracking watch with heart rate monitor, GPS, and 7-day battery life. Tracks workouts, sleep, and daily activity.',
        price: 199.99,
        discountPrice: 179.99,
        currency: 'USD',
        sku: 'SW-001',
        stock: 25,
        isActive: true,
        brand: 'FitTech',
        category: categories[0], // Electronics
        images: [
          { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop', alt: 'Smart Watch', isPrimary: true },
        ]
      },
      {
        name: 'Premium Coffee Maker',
        slug: 'premium-coffee-maker',
        description: 'Programmable coffee maker with built-in grinder, thermal carafe, and 12-cup capacity. Perfect for coffee enthusiasts.',
        price: 149.99,
        currency: 'USD',
        sku: 'CM-001',
        stock: 30,
        isActive: true,
        brand: 'BrewMaster',
        category: categories[1], // Home & Kitchen
        images: [
          { url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop', alt: 'Coffee Maker', isPrimary: true },
        ]
      },
      {
        name: 'Organic Cotton T-Shirt',
        slug: 'organic-cotton-tshirt',
        description: 'Comfortable organic cotton t-shirt available in multiple colors and sizes. Sustainable and eco-friendly.',
        price: 24.99,
        discountPrice: 19.99,
        currency: 'USD',
        sku: 'TS-001',
        stock: 100,
        isActive: true,
        brand: 'EcoWear',
        category: categories[2], // Clothing
        images: [
          { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop', alt: 'Cotton T-Shirt', isPrimary: true },
        ]
      },
      {
        name: 'Wireless Gaming Mouse',
        slug: 'wireless-gaming-mouse',
        description: 'High-performance wireless gaming mouse with RGB lighting, 25K DPI sensor, and programmable buttons.',
        price: 89.99,
        currency: 'USD',
        sku: 'GM-001',
        stock: 40,
        isActive: true,
        brand: 'GameTech',
        category: categories[0], // Electronics
        images: [
          { url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=600&fit=crop', alt: 'Gaming Mouse', isPrimary: true },
        ]
      },
      {
        name: 'Yoga Mat Premium',
        slug: 'yoga-mat-premium',
        description: 'Non-slip yoga mat made from eco-friendly materials. Perfect for yoga, pilates, and fitness activities.',
        price: 39.99,
        discountPrice: 34.99,
        currency: 'USD',
        sku: 'YM-001',
        stock: 75,
        isActive: true,
        brand: 'FitLife',
        category: categories[3], // Sports & Fitness
        images: [
          { url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop', alt: 'Yoga Mat', isPrimary: true },
        ]
      }
    ];

    for (const productData of products) {
      const product = productRepository.create({
        ...productData,
        reviews: [],
        variants: []
      });

      const savedProduct = await productRepository.save(product);

      // Save images
      for (const imageData of productData.images) {
        const image = imageRepository.create({
          ...imageData,
          product: savedProduct
        });
        await imageRepository.save(image);
      }
    }

    console.log('✅ Products seeded successfully!');
  }

  private async createCategories(categoryRepository: any) {
    const categories = [
      { name: 'Electronics', description: 'Electronic devices and gadgets', slug: 'electronics' },
      { name: 'Home & Kitchen', description: 'Home appliances and kitchen items', slug: 'home-kitchen' },
      { name: 'Clothing', description: 'Fashion and apparel', slug: 'clothing' },
      { name: 'Sports & Fitness', description: 'Sports equipment and fitness gear', slug: 'sports-fitness' },
      { name: 'Books', description: 'Books and literature', slug: 'books' },
      { name: 'Beauty & Health', description: 'Beauty products and health items', slug: 'beauty-health' }
    ];

    const savedCategories = [];
    for (const categoryData of categories) {
      const category = categoryRepository.create(categoryData);
      const savedCategory = await categoryRepository.save(category);
      savedCategories.push(savedCategory);
    }

    console.log('✅ Categories seeded successfully!');
    return savedCategories;
  }
}