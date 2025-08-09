import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

interface HomeScreenProps {
  navigation?: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isGoogleUser, setIsGoogleUser] = useState(false);

  useEffect(() => {
    const currentUser = auth().currentUser;
    if (currentUser) {
      setUser(currentUser);
      // Check if user signed in with Google
      const googleProvider = currentUser.providerData.find(
        provider => provider.providerId === 'google.com'
      );
      setIsGoogleUser(!!googleProvider);
    }
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              // Sign out from Google if user signed in with Google
              if (isGoogleUser) {
                await GoogleSignin.signOut();
              }
              
              // Sign out from Firebase
              await auth().signOut();
              // Navigation will be handled by auth state listener in App.tsx
            } catch (error: any) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    // Refresh user data
    const currentUser = auth().currentUser;
    if (currentUser) {
      await currentUser.reload();
      setUser(auth().currentUser);
    }
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const formatDate = (timestamp: string | undefined) => {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getSignInMethod = () => {
    if (!user || !user.providerData || user.providerData.length === 0) {
      return 'Unknown';
    }
    
    const providers = user.providerData.map(provider => {
      switch (provider.providerId) {
        case 'google.com':
          return 'Google';
        case 'password':
          return 'Email/Password';
        case 'facebook.com':
          return 'Facebook';
        case 'twitter.com':
          return 'Twitter';
        default:
          return provider.providerId;
      }
    });
    
    return providers.join(', ');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>
            Welcome back{user?.displayName ? `, ${user.displayName}` : ''}!
          </Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* User Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name:</Text>
            <Text style={styles.infoValue}>
              {user?.displayName || 'Not provided'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Sign-in Method:</Text>
            <Text style={styles.infoValue}>{getSignInMethod()}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email Verified:</Text>
            <Text style={[
              styles.infoValue,
              user?.emailVerified ? styles.verified : styles.unverified
            ]}>
              {user?.emailVerified ? 'Yes' : 'No'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Member Since:</Text>
            <Text style={styles.infoValue}>
              {formatDate(user?.metadata?.creationTime)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Last Sign In:</Text>
            <Text style={styles.infoValue}>
              {formatDate(user?.metadata?.lastSignInTime)}
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          
          {!user?.emailVerified && (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => Alert.alert('Info', 'Email verification feature would be implemented here')}
            >
              <Text style={styles.actionButtonText}>Verify Email</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => Alert.alert('Info', 'Profile update feature would be implemented here')}
          >
            <Text style={styles.actionButtonText}>Update Profile</Text>
          </TouchableOpacity>
          
          {/* Only show change password for email/password users */}
          {!isGoogleUser && (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => Alert.alert('Info', 'Password change feature would be implemented here')}
            >
              <Text style={styles.actionButtonText}>Change Password</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* App Features */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Explore Features</Text>
          <Text style={styles.featureDescription}>
            This is your home screen! From here you can access all the features of your app.
            Add your own content and functionality to make this screen uniquely yours.
          </Text>
          
          <TouchableOpacity 
            style={styles.featureButton}
            onPress={() => Alert.alert('Coming Soon', 'This feature is coming soon!')}
          >
            <Text style={styles.featureButtonText}>Explore App Features</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  verified: {
    color: '#34C759',
  },
  unverified: {
    color: '#FF9500',
  },
  actionButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  actionButtonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  featureDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
  },
  featureButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 8,
  },
  featureButtonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;