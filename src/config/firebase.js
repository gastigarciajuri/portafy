import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAk6nzRp8vK_SMLb-YW5LF-7cOquIOKIoc",
    authDomain: "portafy-6e89d.firebaseapp.com",
    projectId: "portafy-6e89d",
    storageBucket: "portafy-6e89d.firebasestorage.app",
    messagingSenderId: "41602613351",
    appId: "1:41602613351:web:21febc7b9681457a0f14c2",
    measurementId: "G-T1X82NLZZE"
  };
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app; 