import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, get, update, remove, query, orderByChild } from 'firebase/database';
import type { Moment, MomentInput } from '../types/moments';

const firebaseConfig = {
  apiKey: "AIzaSyBQxB9qnN6QkWEZC_KhUxYBxbYe3-_wQXA",
  authDomain: "champagne-bay.firebaseapp.com",
  databaseURL: "https://champagne-bay-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "champagne-bay",
  storageBucket: "champagne-bay.appspot.com",
  messagingSenderId: "475982790193",
  appId: "1:475982790193:web:d4e5f6a8b8c9d0e1f2g3h4"
};

// Initialize Firebase only once
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  if (!/already exists/.test((error as Error).message)) {
    console.error('Firebase initialization error:', error);
  }
}

const db = getDatabase(app);
const momentsRef = ref(db, 'moments');

export async function getMoments(): Promise<Moment[]> {
  try {
    const snapshot = await get(query(momentsRef, orderByChild('timestamp')));
    if (!snapshot.exists()) return [];

    const moments: Moment[] = [];
    snapshot.forEach((child) => {
      moments.unshift({
        id: child.key!,
        ...child.val()
      });
    });

    return moments;
  } catch (error) {
    console.error('Error getting moments:', error);
    throw error;
  }
}

export async function addMoment({ text, weather }: MomentInput): Promise<Moment> {
  try {
    const newMomentRef = push(momentsRef);
    const moment: Omit<Moment, 'id'> = {
      text,
      timestamp: Date.now(),
      likes: 0,
      weather
    };
    
    await update(newMomentRef, moment);
    
    return {
      id: newMomentRef.key!,
      ...moment
    };
  } catch (error) {
    console.error('Error adding moment:', error);
    throw error;
  }
}

export async function likeMoment(id: string): Promise<void> {
  try {
    const momentRef = ref(db, `moments/${id}`);
    const snapshot = await get(momentRef);
    if (!snapshot.exists()) throw new Error('Moment not found');
    
    const currentLikes = snapshot.val().likes || 0;
    await update(momentRef, { likes: currentLikes + 1 });
  } catch (error) {
    console.error('Error liking moment:', error);
    throw error;
  }
}

export async function deleteMoment(id: string): Promise<void> {
  try {
    const momentRef = ref(db, `moments/${id}`);
    await remove(momentRef);
  } catch (error) {
    console.error('Error deleting moment:', error);
    throw error;
  }
}