import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    // Get ConfigService instance
    const configService = app.get(ConfigService);

    // Get configuration from environment variables
    const port = configService.get<number>('PORT', 5001);
    const corsOrigin = configService.get<string>('CORS_ORIGIN', '*');

    console.log(`📋 Configuration loaded - Port: ${port}, CORS: ${corsOrigin}`);

    // API configuration
    const apiPrefix = 'api';
    const apiVersion = 'v1';

    // Enable global validation
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    // Enable CORS
    app.enableCors({
      origin: corsOrigin,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'x-apollo-operation-name',
        'apollo-require-preflight',
        'X-Requested-With',
        'Accept',
        'Origin',
      ],
      credentials: true,
    });

    // Set global API prefix
    app.setGlobalPrefix(`${apiPrefix}/${apiVersion}`);

    console.log(`🔄 Attempting to listen on port ${port}...`);

    // Start the application
    await app.listen(port);
    console.log(`✅ Server is listening on port ${port}`);

    console.log(
      `🚀 Application is running on: http://localhost:${port}/${apiPrefix}/${apiVersion}`,
    );
    console.log(`🎮 GraphQL Playground: http://localhost:${port}/graphql`);
  } catch (error) {
    console.error('❌ Failed to start application:', error);
    process.exit(1);
  }
}

void bootstrap();
