import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Configure Google Sign-In (get web client ID from google-services.json)
GoogleSignin.configure({
  webClientId: 'your-web-client-id-from-google-services-json',
});

// Configure Firestore with offline persistence
const initializeFirestore = () => {
  const db = firestore();
  
  // Enable offline persistence
  db.settings({
    persistence: true,
    cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED,
  });
  
  console.log('Firestore initialized with offline persistence');
  return db;
};

// Initialize Firestore
const db = initializeFirestore();

export { auth, firestore, GoogleSignin, db };