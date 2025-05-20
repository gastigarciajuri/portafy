import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const provider = new GoogleAuthProvider();

export const authService = {
  async loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Verificar si el usuario está autorizado
      const userDoc = await getDoc(doc(db, 'authorizedUsers', user.email));
      if (!userDoc.exists()) {
        await signOut(auth);
        throw new Error('Usuario no autorizado');
      }
      
      return user;
    } catch (error) {
      throw error;
    }
  },

  async logout() {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  },

  getCurrentUser() {
    return auth.currentUser;
  }
}; 