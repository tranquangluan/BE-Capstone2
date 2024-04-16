import { NestFactory } from '@nestjs/core';
import { AppModule } from './application/di/AppModule';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, NotFoundException  } from '@nestjs/common';
import * as admin from 'firebase-admin';

const serviceAccount = {
  "type": "service_account",
  "project_id": "hicv-8be71",
  "private_key_id": "30b522739664fcf308d756386dc64bc4427775e2",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDlN0PNo6MOP8SW\nUG8LjnLJlwngY6PTgl867dDxVb6RRiYhC9Z6+liTZXi7ZV1VF4nU3AqZLRBy6wYl\nFAKHinmb7Y1t6D5gJV0X1kfPQjSYFTLZMx4LTNVf/0L/URQlXaoivp8t8u1hB6Ht\nMMP4s1bGB9PUN+Se7brqN66gviLaKGB0XfGthlh93J/c+wsMDkFb0rQ7W4MQJZrw\nL9eMtzuw3OrDjbagWk8OhuPc1ZLXf3oTktHTmmBli/M6QY9yLfsitDy+7uTr2P9h\n0XkNZuQ6SOlTG9hB7al/yxqmT5eLzN2FSozmF4kQf9Jgknl7jzpbcNKMzBO8qZKT\nwPU2fRs9AgMBAAECggEAGnxrKHZu+iUH3XSi4uYiwRo4/nA/tx+FSy+9aT2cB85g\nITPBz15hNiWksJwTD6jozitfoCPdwYxYc+1e03RT/rQRl8XH0LVQj1dn3yefyy5b\n507UUGr1lvejMWcYLwR74Ig//X++H+xRW4aQhorhN9XMtjoqf+t+zIoC8uO1mZlB\nFQjcp8eWTqn8Dkd6Per9K+WZTIAmXlPPHRMiOWjcX1vB6Mj6ETpdbw8YqMbqeUsg\nLZ6RFG2TUKVs0YpoY7uo8orVtNKk9QXwiL135F+FOmA5zTY9+/CZt/6ML+fvePNJ\ndhrofE6Ra2BkAsWR8+cyNUU2Ndrh8zdJv0wfK3pYUwKBgQD+vuK0A8ehq1UIwwBA\ndg3c3Dm55CFDQK1fs8WlSVquB85utPvk6QbWungHolWJU+4aXOo9CnCbdbjJgYjA\nt1MgnUGg1YtMYrdnsB/jvIT9sWFZ+1UTbbWeUu1tvqrY4y+RjtlAHajNscLsYy/X\nGchlw2BRIaTzPnjyrgEjGg05lwKBgQDmWDLBpPtF4HnDHjW1C11nddGbIwAeyg97\nmV7Pks5gbt45dxTucvl7LRozOuc8SaUq7g6E6433AYCeLOy8BQnUtKK43EFUoe+0\npF5oOEC1gQpw1I4Wi+mmZ6NlHxRlSxEtg3tNnAoAiu7iClXkuxtsf4TivbUO8dze\nQl5IdBwkSwKBgQDpz1uV644z1WQzqX62q2Pn3X1iH39kEZ3PI9n47Y28A1A2DgjQ\nPgzX0sfOAfHOHGmCattW8RkPponW8PwKHXi/i3Yr3zN+BXDeSynJxUKu8jou815P\nebdjPCvNOV3nuQT07Q57KX3AZTJJ8nN7Up+6vwrNDDswQpuR6aEDjaqruwKBgAkQ\ngXbTWjwGuGPwRWbJerR+k3AKcY/EndVcVLnQaiSrWD1krUMw7RZm0PghIkZiE4jb\n82BRsLV+rqQK2ooPnLJtJVYm/L8q3Db8nOZ3CDzcRh/ojWrfuKMewvRQw8m0qYlj\n+i80q8QXs4zboUOuBUdAwWb21jAvXmS0seciApV/AoGAMO4DpRuXnz4xPZG8vgBB\nPRSxPoxAf9gBv5N+DeEGUMZ9mA9ngRndQZfU/mVnVlhKdA2B0DTvn3kYD5ZX4bo4\nFHRY7ElLLxtslIUhuKrrjE9zRpSzy4tJNslJX4HUcBAI2QPfQyyb2mZqAuBG1QY3\ntxo30f5DUJjoLBedB/ZcoTM=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-n0uny@hicv-8be71.iam.gserviceaccount.com",
  "client_id": "116331445575272012426",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-n0uny%40hicv-8be71.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: 'https://hicv-8be71.firebaseio.com'
});

const db = admin.firestore();

async function createUser(user: any) {
  try {
    const docRef = db.collection('userss').doc();
    await docRef.set(user);
    return docRef.id;
  } catch (error) {
    Logger.error(`Failed to create user: ${error.message}`);
    throw new NotFoundException('Failed to create user');
  }
}

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

bootstrap().then(async () => {
  const userId = await createUser({
    name: 'Test User',
    email: 'test@example.com',
  });
  // console.log("Created new user with ID:" ${userId});
});