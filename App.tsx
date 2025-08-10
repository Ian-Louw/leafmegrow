// App.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';

import { ThemeProvider, useTheme } from './src/theme/ThemeProvider';
import { toNavigationTheme } from './src/theme/navigation';

// Screens
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegistrationScreen from './src/screens/auth/RegistrationScreen';
import HomeScreen from './src/screens/HomeScreen';
import LoadScreen from './src/screens/LoadScreen';

// Types
export type RootStackParamList = {
  Welcome: undefined;
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
      <>
        <StatusBar
          barStyle={theme.name === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={theme.colors.background}
        />
        <LoadScreen />
      </>
    );
  }

  return (
    <NavigationContainer theme={toNavigationTheme(theme)}>
      <StatusBar
        barStyle={theme.name === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <Stack.Navigator
        initialRouteName={user ? 'Home' : 'Welcome'}
        screenOptions={{
          headerShown: false, // Hide headers for custom designs
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
          animation: 'slide_from_right',
        }}
      >
        {user ? (
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'Home',
              headerShown: true,
              headerStyle: {
                backgroundColor: theme.colors.surface,
              },
              headerTintColor: theme.colors.text,
              headerTitleStyle: {
                fontWeight: 'bold',
                color: theme.colors.text,
              },
              headerLeft: () => null, // Prevent going back
            }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Welcome"
              component={WelcomeScreen}
              options={{
                title: 'Welcome',
              }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                title: 'Sign In',
              }}
            />
            <Stack.Screen
              name="Registration"
              component={RegistrationScreen}
              options={{
                title: 'Create Account',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// App root wraps everything with the ThemeProvider
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;