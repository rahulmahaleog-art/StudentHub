
import { initializeApp } from 'firebase/app';

import { getAuth } from 'firebase/auth';

import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCrOqjhBO36ODA0lJ1N7ptR1Dyz8PZoapY",
  authDomain: "studenthub-42056.firebaseapp.com",
  projectId: "studenthub-42056",
  storageBucket: "studenthub-42056.firebasestorage.app",
  messagingSenderId: "71699705318",
  appId: "1:71699705318:web:ab3f6d6ea7020c1064ba27",
  measurementId: "G-3NTDQBZ9WW"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);
