import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OpenaiChatModule } from './openai-chat/openai-chat.module';
import { PdfFormateModule } from './pdf-formate/pdf-formate.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = {
          type: 'postgres' as const,
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: false,
          ssl: {
            rejectUnauthorized: false,
          },
        };

        // Also try using DATABASE_URL if individual config fails
        const databaseUrl = configService.get('DATABASE_URL');

        console.log('🔍 Database config:', {
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          database: configService.get('DB_DATABASE'),
          hasUrl: !!databaseUrl
        });

        if (databaseUrl) {
          return {
            ...dbConfig,
            url: databaseUrl,
          };
        }

        return dbConfig;
      },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      playground: true,
      introspection: true,
      cache: 'bounded',
    }),
    OpenaiChatModule,
    PdfFormateModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
