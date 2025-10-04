import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Get ConfigService instance
  const configService = app.get(ConfigService);
  
  // Get configuration from environment variables
  const port = configService.get<number>('PORT', 5001);
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');
  const corsOrigin = configService.get<string>('CORS_ORIGIN', '*');
  
  // API configuration
  const apiPrefix = 'api';
  const apiVersion = 'v1';

  
  // Enable CORS
  app.enableCors({
    origin: corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });
  
  // Set global API prefix
  app.setGlobalPrefix(`${apiPrefix}/${apiVersion}`);
  
  // Start the application
  await app.listen(port);
  
  console.log(`🚀 Application is running on: http://localhost:${port}/${apiPrefix}/${apiVersion}`);
  console.log(`📝 Environment: ${nodeEnv}`);

}
bootstrap();
