import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';

const serviceAccount = require('E:\hicv-8be71-firebase-adminsdk-n0uny-30b5227396.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://hicv-8be71.firebaseio.com'});

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{cors:false});
  app.enableCors({
    origin: 'http://localhost:3000', // Replace with your client's origin
  });
  const swaggerConfig = new DocumentBuilder().setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/api/docs', app, document);
  await app.listen(4000, () => {
    Logger.log(`
      ################################################
      ☕️  Server listening on port: ${process.env.PORT || 4000}
      🍀 Swagger: http://localhost:${process.env.PORT || 4000}/api/docs
      ################################################
    `);
  });
}
bootstrap();
