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

export const budgetService = {
  async createBudget(userId, budgetData) {
    if (!auth.currentUser || auth.currentUser.uid !== userId) throw new Error('No autorizado');
    try {
      const docRef = await addDoc(collection(db, 'budgets'), {
        ...budgetData,
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      throw error;
    }
  },

  async updateBudget(id, budgetData, userId) {
    if (!auth.currentUser || auth.currentUser.uid !== userId) throw new Error('No autorizado');
    try {
      const budgetRef = doc(db, 'budgets', id);
      await updateDoc(budgetRef, {
        ...budgetData,
        updatedAt: new Date()
      });
    } catch (error) {
      throw error;
    }
  },

  async deleteBudget(id, userId) {
    if (!auth.currentUser || auth.currentUser.uid !== userId) throw new Error('No autorizado');
    try {
      await deleteDoc(doc(db, 'budgets', id));
    } catch (error) {
      throw error;
    }
  },

  async getUserBudgets(userId, pageSize = 20, lastDoc = null) {
    if (!auth.currentUser || auth.currentUser.uid !== userId) throw new Error('No autorizado');
    try {
      let q = query(
        collection(db, 'budgets'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      );
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }
      const querySnapshot = await getDocs(q);
      return {
        budgets: querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })),
        lastDoc: querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1] : null
      };
    } catch (error) {
      throw error;
    }
  },

  calculateTotal(items) {
    return items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  },

  formatBudget(items) {
    return items.map(item => 
      `${item.name} - ${item.quantity} x $${item.price} = $${item.quantity * item.price}`
    ).join('\n');
  }
}; 