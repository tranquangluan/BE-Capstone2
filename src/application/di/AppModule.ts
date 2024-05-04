import { Module } from '@nestjs/common';
import { GoogleAiModule } from './GoogleAiModule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FirebaseModule } from './FirebaseModule';
import { RedisModule } from './RedisModule';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    GoogleAiModule,
    FirebaseModule,
    RedisModule
    
  ],
  controllers: [],
  providers: [],
  exports:[]
})
export class AppModule {}
