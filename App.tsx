// App.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, StyleSheet, StatusBar } from 'react-native';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';

import { ThemeProvider, useTheme } from './src/theme/ThemeProvider';
import { toNavigationTheme } from './src/theme/navigation';

// Screens
import LoginScreen from './src/screens/auth/LoginScreen';
import RegistrationScreen from './src/screens/auth/RegistrationScreen';
import HomeScreen from './src/screens/HomeScreen';

// Types
export type RootStackParamList = {
  Login: undefined;
  Registration: undefined;
  Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Extracted so we can use the theme hook inside
const AppContent: React.FC = () => {
  const { theme } = useTheme();
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((u) => {
      setUser(u);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  if (isLoading) {
    return (
      <View style={[
        styles.loadingContainer,
        { backgroundColor: theme.colors.background }
      ]}>
        <StatusBar
          barStyle={theme.name === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={theme.colors.background}
        />
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={toNavigationTheme(theme)}>
      <StatusBar
        barStyle={theme.name === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <Stack.Navigator
        initialRouteName={user ? 'Home' : 'Login'}
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.surface, // card color
          },
          headerTintColor: theme.colors.text,       // back button / title tint
          headerTitleStyle: {
            fontWeight: 'bold',
            color: theme.colors.text,
          },
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      >
        {user ? (
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'Home',
              headerLeft: () => null, // Prevent going back
            }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                title: 'Sign In',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Registration"
              component={RegistrationScreen}
              options={{
                title: 'Create Account',
                headerShown: false,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// App root wraps everything with the ThemeProvider
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
