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
  startAfter,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { auth } from '../config/firebase';

export const notesService = {
  async addNote(userId, noteData) {
    if (!auth.currentUser || auth.currentUser.uid !== userId) throw new Error('No autorizado');
    try {
      const docRef = await addDoc(collection(db, 'notes'), {
        ...noteData,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        searchKeywords: this.generateSearchKeywords(noteData.title, noteData.content)
      });
      return docRef.id;
    } catch (error) {
      throw error;
    }
  },

  async updateNote(id, noteData, userId) {
    if (!auth.currentUser || auth.currentUser.uid !== userId) throw new Error('No autorizado');
    try {
      const noteRef = doc(db, 'notes', id);
      await updateDoc(noteRef, {
        ...noteData,
        updatedAt: serverTimestamp(),
        searchKeywords: this.generateSearchKeywords(noteData.title, noteData.content)
      });
    } catch (error) {
      throw error;
    }
  },

  async deleteNote(id, userId) {
    if (!auth.currentUser || auth.currentUser.uid !== userId) throw new Error('No autorizado');
    try {
      await deleteDoc(doc(db, 'notes', id));
    } catch (error) {
      throw error;
    }
  },

  async getUserNotes(userId, pageSize = 20, lastDoc = null, searchTerm = '', sortBy = 'createdAt') {
    if (!auth.currentUser || auth.currentUser.uid !== userId) throw new Error('No autorizado');
    try {
      let q = query(
        collection(db, 'notes'),
        where('userId', '==', userId)
      );

      // Solo aplicar búsqueda si hay término de búsqueda
      if (searchTerm) {
        const searchKeywords = this.generateSearchKeywords(searchTerm);
        q = query(
          collection(db, 'notes'),
          where('userId', '==', userId),
          where('searchKeywords', 'array-contains-any', searchKeywords)
        );
      }

      // Agregar ordenamiento
      q = query(q, orderBy(sortBy, 'desc'), limit(pageSize));

      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const querySnapshot = await getDocs(q);
      return {
        notes: querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate()
        })),
        lastDoc: querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1] : null
      };
    } catch (error) {
      throw error;
    }
  },

  generateSearchKeywords(title, content = '') {
    const text = `${title} ${content}`.toLowerCase();
    const words = text.split(/\s+/);
    const keywords = new Set();
    
    // Agregar palabras completas
    words.forEach(word => {
      if (word.length > 2) {
        keywords.add(word);
      }
    });

    // Agregar substrings para búsqueda parcial
    words.forEach(word => {
      if (word.length > 3) {
        for (let i = 3; i <= word.length; i++) {
          keywords.add(word.substring(0, i));
        }
      }
    });

    return Array.from(keywords);
  }
}; 