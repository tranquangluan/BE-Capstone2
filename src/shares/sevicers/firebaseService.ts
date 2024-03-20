import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class MyService {
  private db: FirebaseFirestore.Firestore;

  constructor() {
    this.db = admin.firestore();
  }

  async getData() {
    const docRef = this.db.collection('myCollection').doc('myDocument');
    const doc = await docRef.get();
    if (doc.exists) {
      const data = doc.data();
      // Xử lý dữ liệu
      return data;
    }
    return null;
  }

  // Các phương thức khác để thao tác với Firebase
}