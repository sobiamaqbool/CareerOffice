import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBt-dYcSX6lySMp1fqf4ESyEPTGnhrCvSo',
  authDomain: 'career-office.firebaseapp.com',
  projectId: 'career-office',
  storageBucket: 'career-office.firebasestorage.app', // ✅ fixed bucket
  messagingSenderId: '681933299430',
  appId: '1:681933299430:web:3b8192f44c31a5b6c96527',
  measurementId: 'G-7R10M1X2JS',
};

// ✅ Only initialize if no apps exist
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
