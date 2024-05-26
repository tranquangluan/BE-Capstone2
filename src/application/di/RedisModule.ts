import { Module, forwardRef } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';
import { RedisService } from '../services/RedisService';
import { GoogleAiModule } from './GoogleAiModule';
@Module({
  imports: [
    forwardRef(() => GoogleAiModule), 
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      isGlobal: true,
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          url: 'redis://default:password@localhost:6379',
          ttl: 3600000,
        }),
      }),
      
    }),
  ],
  providers: [RedisService, ConfigService],
  exports: [RedisService],
})
export class RedisModule {}