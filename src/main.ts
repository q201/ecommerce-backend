import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { runSeeders } from './database/seeds/run-seeders';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get the database connection
  const dataSource = app.get(DataSource);

  // Run seeders if in development mode
  if (process.env.NODE_ENV === 'development') {
    try {
      await runSeeders(dataSource);
    } catch (error) {
      console.log('Seeder already run or error occurred:', error.message);
    }
  }

  const config = new DocumentBuilder()
    .setTitle('E-commerce Backend API')
    .setDescription('API documentation for the e-commerce backend')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
