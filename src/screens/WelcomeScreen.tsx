// src/screens/auth/WelcomeScreen.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Leaf } from 'lucide-react-native';

interface WelcomeScreenProps {
  navigation: any;
}

const { width, height } = Dimensions.get('window');

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  const navigateToRegister = () => {
    navigation.navigate('Registration');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Plant Background */}
      <View style={[styles.backgroundContainer, { backgroundColor: theme.colors.accent }]}>
        <View style={styles.leafPattern} />
        <View style={[styles.leafPattern, styles.leafPattern2]} />
        <View style={[styles.leafPattern, styles.leafPattern3]} />
        
        {/* Decorative plant icons */}
        <View style={styles.decorativeIcon1}>
          <Leaf size={20} color="rgba(255,255,255,0.3)" />
        </View>
        <View style={styles.decorativeIcon2}>
          <Leaf size={16} color="rgba(255,255,255,0.2)" />
        </View>
        <View style={styles.decorativeIcon3}>
          <Leaf size={24} color="rgba(255,255,255,0.1)" />
        </View>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.colors.background }]}>
            The best{'\n'}app for{'\n'}your plants
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.primaryButton, { backgroundColor: theme.colors.background }]} 
            onPress={navigateToLogin}
          >
            <Text style={[styles.primaryButtonText, { color: theme.colors.accent }]}>
              Sign in
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton} 
            onPress={navigateToRegister}
          >
            <Text style={[styles.secondaryButtonText, { color: theme.colors.background }]}>
              Create an account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
    height: height,
    overflow: 'hidden',
  },
  leafPattern: {
    position: 'absolute',
    width: width * 1.2,
    height: height * 0.8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: width * 0.6,
    transform: [{ rotate: '15deg' }],
    top: -height * 0.3,
    left: -width * 0.1,
  },
  leafPattern2: {
    transform: [{ rotate: '-10deg' }],
    top: -height * 0.2,
    left: width * 0.3,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  leafPattern3: {
    transform: [{ rotate: '25deg' }],
    top: -height * 0.4,
    left: width * 0.1,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
  },
  decorativeIcon1: {
    position: 'absolute',
    top: height * 0.2,
    right: width * 0.1,
    transform: [{ rotate: '45deg' }],
  },
  decorativeIcon2: {
    position: 'absolute',
    top: height * 0.35,
    left: width * 0.15,
    transform: [{ rotate: '-30deg' }],
  },
  decorativeIcon3: {
    position: 'absolute',
    top: height * 0.15,
    left: width * 0.7,
    transform: [{ rotate: '60deg' }],
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingVertical: 60,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    lineHeight: 44,
    textAlign: 'left',
  },
  buttonContainer: {
    gap: 15,
  },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '500',
  },
});

export default WelcomeScreen;