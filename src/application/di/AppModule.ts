import { Module } from '@nestjs/common';
import { GoogleAiModule } from './GoogleAiModule';
import { ConfigModule } from '@nestjs/config';
import { FirebaseModule } from './FirebaseModule';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    GoogleAiModule,
    FirebaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
