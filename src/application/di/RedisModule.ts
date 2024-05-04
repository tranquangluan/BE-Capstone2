import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';
import { RedisService } from '../services/RedisService';
@Module({
  imports: [
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
