import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// React Native Firebase automatically reads configuration from:
// - android/app/google-services.json (Android)
// - ios/Runner/GoogleService-Info.plist (iOS)
// No manual configuration needed!

// Export the services
export { auth, firestore };

// For compatibility with the screens, export auth as default auth instance
export const db = firestore();
export default auth();