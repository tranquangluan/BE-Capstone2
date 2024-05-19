import { Module, forwardRef } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';
import { RedisService } from '../services/RedisService';
import { GoogleAiModule } from './GoogleAiModule';
@Module({
  imports: [
    forwardRef(() => GoogleAiModule), // Sử dụng forwardRef để giải quyết vòng phụ thuộc
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      isGlobal: true,
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          url: 'redis://default:password@localhost:6379',
          ttl: 360000,
        }),
      }),
      
    }),
  ],
  providers: [RedisService, ConfigService],
  exports: [RedisService],
})
export class RedisModule {}