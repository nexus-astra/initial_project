import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Users } from './user/user.entity';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // Load environment variables globally
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Configure TypeORM with environment variables
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, UserModule, AuthModule], // Ensure ConfigModule is imported
      inject: [ConfigService], // Inject ConfigService to access .env variables
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [Users], // Register entities here
        autoLoadEntities: true, // Automatically load entities
        synchronize: true, // Set to false in production
      }),
    }),
  ],
})
export class AppModule {}
