import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { auth } from '../config/firebase';

export const promotionService = {
  async addPromotion(promotionData) {
    if (!auth.currentUser) throw new Error('No autorizado');
    try {
      const docRef = await addDoc(collection(db, 'promotions'), {
        ...promotionData,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: auth.currentUser.uid
      });
      return docRef.id;
    } catch (error) {
      throw error;
    }
  },

  async updatePromotion(id, promotionData) {
    if (!auth.currentUser) throw new Error('No autorizado');
    try {
      const promotionRef = doc(db, 'promotions', id);
      await updateDoc(promotionRef, {
        ...promotionData,
        updatedAt: new Date()
      });
    } catch (error) {
      throw error;
    }
  },

  async deletePromotion(id) {
    if (!auth.currentUser) throw new Error('No autorizado');
    try {
      await deleteDoc(doc(db, 'promotions', id));
    } catch (error) {
      throw error;
    }
  },

  async getPromotions(pageSize = 20, lastDoc = null) {
    try {
      let q = query(
        collection(db, 'promotions'),
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      );
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }
      const querySnapshot = await getDocs(q);
      return {
        promotions: querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })),
        lastDoc: querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1] : null
      };
    } catch (error) {
      throw error;
    }
  },

  async searchPromotions(searchTerm, pageSize = 20, lastDoc = null) {
    try {
      let q = query(
        collection(db, 'promotions'),
        where('keywords', 'array-contains', searchTerm.toLowerCase()),
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      );
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }
      const querySnapshot = await getDocs(q);
      return {
        promotions: querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })),
        lastDoc: querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1] : null
      };
    } catch (error) {
      throw error;
    }
  }
}; 