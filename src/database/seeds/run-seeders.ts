import { DataSource } from 'typeorm';
import { ProductSeeder } from './product-seeder';

export async function runSeeders(dataSource: DataSource) {
  try {
    console.log('🌱 Starting database seeding...');

    // Run product seeder
    const productSeeder = new ProductSeeder(dataSource);
    await productSeeder.run();

    console.log('✅ All seeders completed successfully!');
  } catch (error) {
    console.error('❌ Error running seeders:', error);
    throw error;
  }
}