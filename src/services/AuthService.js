import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

class AuthService {
  // Email/Password Sign Up
  async signUpWithEmail(email, password) {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      console.log('User signed up:', userCredential.user.email);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.log('Sign up error:', error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  // Email/Password Sign In
  async signInWithEmail(email, password) {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      console.log('User signed in:', userCredential.user.email);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.log('Sign in error:', error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  // Google Sign In
  async signInWithGoogle() {
    try {
      // Check if device supports Google Play Services
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      // Get the user's ID token
      const { idToken } = await GoogleSignin.signIn();
      
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      
      // Sign-in the user with the credential
      const userCredential = await auth().signInWithCredential(googleCredential);
      console.log('Google sign in successful:', userCredential.user.email);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.log('Google sign in error:', error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  // Sign Out
  async signOut() {
    try {
      await GoogleSignin.signOut(); // Clear Google sign-in cache
      await auth().signOut();
      console.log('User signed out');
      return { success: true };
    } catch (error) {
      console.log('Sign out error:', error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  // Get current user
  getCurrentUser() {
    return auth().currentUser;
  }

  // Auth state listener
  onAuthStateChanged(callback) {
    return auth().onAuthStateChanged(callback);
  }

  // Error message helper
  getErrorMessage(error) {
    const errorMessages = {
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/email-already-in-use': 'An account with this email already exists.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    };

    return errorMessages[error.code] || error.message || 'An unexpected error occurred.';
  }
}

export default new AuthService();