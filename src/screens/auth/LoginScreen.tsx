// src/screens/auth/LoginScreen.tsx
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
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  Leaf,
  Facebook,
  Chrome,
  Apple
} from 'lucide-react-native';

interface LoginScreenProps {
  navigation: any;
}

const { width, height } = Dimensions.get('window');

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: 'YOUR_WEB_CLIENT_ID_HERE',
      offlineAccess: true,
    });
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed. Please try again.';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email address.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password. Please try again.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled.';
          break;
        default:
          errorMessage = error.message;
      }
      
      Alert.alert('Login Failed', errorMessage);
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

  const navigateToRegister = () => {
    navigation.navigate('Registration');
  };

  const navigateBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.accent }]}>
      {/* Plant Background */}
      <View style={styles.backgroundContainer}>
        <View style={styles.leafPattern} />
        <View style={[styles.leafPattern, styles.leafPattern2]} />
      </View>

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={navigateBack}>
        <View style={[styles.backButtonCircle, { backgroundColor: theme.colors.background }]}>
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

            <Text style={[styles.title, { color: theme.colors.text }]}>Welcome Back</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Login to your account
            </Text>

            {/* Form Fields */}
            <View style={styles.inputContainer}>
              <View style={[styles.inputWrapper, { borderColor: theme.colors.border }]}>
                <Mail size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: theme.colors.text }]}
                  placeholder="Email"
                  placeholderTextColor={theme.colors.muted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>

              <View style={[styles.inputWrapper, { borderColor: theme.colors.border }]}>
                <Lock size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: theme.colors.text }]}
                  placeholder="••••••••"
                  placeholderTextColor={theme.colors.muted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoComplete="password"
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
            </View>

            {/* Remember Me & Forgot Password */}
            <View style={styles.optionsContainer}>
              <TouchableOpacity 
                style={styles.rememberContainer}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View style={[
                  styles.checkbox, 
                  { borderColor: theme.colors.border },
                  rememberMe && { backgroundColor: theme.colors.primary }
                ]}>
                  {rememberMe && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={[styles.rememberText, { color: theme.colors.textSecondary }]}>
                  Remember Me
                </Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Text style={[styles.forgotText, { color: theme.colors.primary }]}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity 
              style={[
                styles.loginButton, 
                { backgroundColor: theme.colors.primary },
                (loading || googleLoading) && styles.buttonDisabled
              ]} 
              onPress={handleLogin}
              disabled={loading || googleLoading}
            >
              {loading ? (
                <ActivityIndicator color={theme.colors.background} />
              ) : (
                <Text style={[styles.loginButtonText, { color: theme.colors.background }]}>
                  Login
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

            {/* Sign Up Link */}
            <TouchableOpacity style={styles.signUpContainer} onPress={navigateToRegister}>
              <Text style={[styles.signUpText, { color: theme.colors.textSecondary }]}>
                Don't have account? {' '}
                <Text style={[styles.signUpLink, { color: theme.colors.primary }]}>
                  Sign up
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
  backgroundContainer: {
    position: 'absolute',
    width: width,
    height: height * 0.6,
    overflow: 'hidden',
  },
  leafPattern: {
    position: 'absolute',
    width: width * 1.5,
    height: height * 0.8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: width * 0.75,
    transform: [{ rotate: '15deg' }],
    top: -height * 0.4,
    left: -width * 0.25,
  },
  leafPattern2: {
    transform: [{ rotate: '-10deg' }],
    top: -height * 0.3,
    left: width * 0.2,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
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
    justifyContent: 'flex-end',
    paddingTop: height * 0.3,
  },
  formContainer: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    minHeight: height * 0.7,
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
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  rememberText: {
    fontSize: 14,
  },
  forgotText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
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
  signUpContainer: {
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 16,
  },
  signUpLink: {
    fontWeight: '600',
  },
});

export default LoginScreen;