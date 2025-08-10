// src/screens/auth/RegistrationScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { useTheme } from '../../theme/ThemeProvider';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  Leaf,
  Check,
  Facebook,
  Chrome,
  Apple
} from 'lucide-react-native';

interface RegistrationScreenProps {
  navigation: any;
}

const { width, height } = Dimensions.get('window');

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: 'YOUR_WEB_CLIENT_ID_HERE',
      offlineAccess: true,
    });
  }, []);

  const validateForm = () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    if (!agreeToTerms) {
      Alert.alert('Error', 'Please agree to our Terms of Service and Privacy Policy');
      return false;
    }

    return true;
  };

  const handleRegistration = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      await userCredential.user.updateProfile({
        displayName: fullName,
      });
      Alert.alert('Success', 'Account created successfully!');
    } catch (error: any) {
      console.error('Registration error:', error);
      let errorMessage = 'Registration failed. Please try again.';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already registered. Please use a different email or try logging in.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Please choose a stronger password.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address. Please check and try again.';
          break;
        default:
          errorMessage = error.message;
      }
      
      Alert.alert('Registration Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const { idToken }: any = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
    } catch (error: any) {
      console.error('Google Sign-In error:', error);
      let errorMessage = 'Google Sign-In failed. Please try again.';
      
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        errorMessage = 'Sign-in cancelled by user.';
      } else if (error.code === statusCodes.IN_PROGRESS) {
        errorMessage = 'Sign-in already in progress.';
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        errorMessage = 'Google Play Services not available.';
      }
      
      Alert.alert('Google Sign-In Failed', errorMessage);
    } finally {
      setGoogleLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  const navigateBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={navigateBack}>
        <View style={[styles.backButtonCircle, { backgroundColor: 'rgba(255,255,255,0.9)' }]}>
          <ArrowLeft size={20} color={theme.colors.accent} />
        </View>
      </TouchableOpacity>

      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Form Container */}
          <View style={[styles.formContainer, { backgroundColor: theme.colors.background }]}>
            {/* Plant Icon */}
            <View style={styles.iconContainer}>
              <View style={[styles.plantIconContainer, { backgroundColor: theme.colors.primary }]}>
                <Leaf size={24} color={theme.colors.background} />
              </View>
            </View>

            <Text style={[styles.title, { color: theme.colors.text }]}>Register</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Create your new account
            </Text>

            {/* Form Fields */}
            <View style={styles.inputContainer}>
              <View style={[styles.inputWrapper, { borderColor: theme.colors.border }]}>
                <User size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: theme.colors.text }]}
                  placeholder="Full Name"
                  placeholderTextColor={theme.colors.muted}
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                  autoComplete="name"
                />
              </View>

              <View style={[styles.inputWrapper, { borderColor: theme.colors.border }]}>
                <Mail size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: theme.colors.text }]}
                  placeholder="user@gmail.com"
                  placeholderTextColor={theme.colors.muted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
                {email && email.includes('@') && (
                  <Check size={20} color={theme.colors.primary} />
                )}
              </View>

              <View style={[styles.inputWrapper, { borderColor: theme.colors.border }]}>
                <Lock size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: theme.colors.text }]}
                  placeholder="Password"
                  placeholderTextColor={theme.colors.muted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoComplete="new-password"
                />
                <TouchableOpacity 
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} color={theme.colors.textSecondary} />
                  ) : (
                    <Eye size={20} color={theme.colors.textSecondary} />
                  )}
                </TouchableOpacity>
              </View>

              <View style={[styles.inputWrapper, { borderColor: theme.colors.border }]}>
                <Lock size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: theme.colors.text }]}
                  placeholder="Confirm Password"
                  placeholderTextColor={theme.colors.muted}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoComplete="new-password"
                />
                <TouchableOpacity 
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} color={theme.colors.textSecondary} />
                  ) : (
                    <Eye size={20} color={theme.colors.textSecondary} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Terms Agreement */}
            <TouchableOpacity 
              style={styles.termsContainer}
              onPress={() => setAgreeToTerms(!agreeToTerms)}
            >
              <View style={[
                styles.checkbox, 
                { borderColor: theme.colors.border },
                agreeToTerms && { backgroundColor: theme.colors.primary }
              ]}>
                {agreeToTerms && <Check size={14} color={theme.colors.background} />}
              </View>
              <Text style={[styles.termsText, { color: theme.colors.textSecondary }]}>
                By signing you agree to our{' '}
                <Text style={[styles.termsLink, { color: theme.colors.primary }]}>Terms of use</Text>
                {' '}and{' '}
                <Text style={[styles.termsLink, { color: theme.colors.primary }]}>privacy notice</Text>
              </Text>
            </TouchableOpacity>

            {/* Sign Up Button */}
            <TouchableOpacity 
              style={[
                styles.signUpButton, 
                { backgroundColor: theme.colors.primary },
                (loading || googleLoading) && styles.buttonDisabled
              ]} 
              onPress={handleRegistration}
              disabled={loading || googleLoading}
            >
              {loading ? (
                <ActivityIndicator color={theme.colors.background} />
              ) : (
                <Text style={[styles.signUpButtonText, { color: theme.colors.background }]}>
                  Sign Up
                </Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
              <Text style={[styles.dividerText, { color: theme.colors.textSecondary }]}>
                Or continue with
              </Text>
              <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            </View>

            {/* Social Login Buttons */}
            <View style={styles.socialContainer}>
              <TouchableOpacity 
                style={[styles.socialButton, { borderColor: theme.colors.border }]}
                onPress={() => Alert.alert('Coming Soon', 'Facebook login coming soon!')}
              >
                <Facebook size={24} color="#1877F2" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.socialButton, { borderColor: theme.colors.border }]}
                onPress={handleGoogleSignIn}
                disabled={loading || googleLoading}
              >
                {googleLoading ? (
                  <ActivityIndicator size="small" color={theme.colors.primary} />
                ) : (
                  <Chrome size={24} color="#4285F4" />
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.socialButton, { borderColor: theme.colors.border }]}
                onPress={() => Alert.alert('Coming Soon', 'Apple login coming soon!')}
              >
                <Apple size={24} color="#000000" />
              </TouchableOpacity>
            </View>

            {/* Login Link */}
            <TouchableOpacity style={styles.loginContainer} onPress={navigateToLogin}>
              <Text style={[styles.loginText, { color: theme.colors.textSecondary }]}>
                Already have an account? {' '}
                <Text style={[styles.loginLink, { color: theme.colors.primary }]}>
                  Sign in
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingTop: 80,
  },
  formContainer: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    minHeight: height * 0.85,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  plantIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    gap: 16,
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    backgroundColor: '#F8F9FA',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
  },
  eyeIcon: {
    padding: 4,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingRight: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 4,
    marginRight: 12,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  termsText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  termsLink: {
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  signUpButton: {
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  signUpButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loginContainer: {
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
  },
  loginLink: {
    fontWeight: '600',
  },
});

export default RegistrationScreen;