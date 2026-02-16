// Firebase Admin SDK initialization for server-side operations
// For development, we use the client SDK from server context
// For production, you'd want to use proper service account credentials

import { getApps } from 'firebase/app';
import { getFirestore as getClientFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyB0HDl04elhNy40L22kg0ewduoos93xZug',
  authDomain: 'necrobridge.firebaseapp.com',
  projectId: 'necrobridge',
  storageBucket: 'necrobridge.firebasestorage.app',
  messagingSenderId: '438477827413',
  appId: '1:438477827413:web:5850179775ef8a19c413dc',
  measurementId: 'G-7970F5M2JC',
};

let adminDb: any = null;

try {
  // For development, we can use the client SDK from the server
  // This works because we have Anonymous Authentication enabled
  // For production, implement proper Admin SDK with service account
  
  if (typeof window === 'undefined') {
    // We're on the server
    // Import dynamically to avoid issues
    import('firebase/app').then(({ initializeApp }) => {
      import('firebase/firestore').then(({ getFirestore }) => {
        if (getApps().length === 0) {
          const app = initializeApp(firebaseConfig, 'server');
          adminDb = getFirestore(app);
        } else {
          adminDb = getClientFirestore(getApps()[0]);
        }
      });
    }).catch(err => {
      console.error('Failed to initialize server-side Firebase:', err);
    });
  }
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
}

// Export a fallback that will work with our current setup
export { adminDb };
export default adminDb;
