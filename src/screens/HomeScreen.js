import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import AuthService from '../services/AuthService';
import FirestoreService from '../services/FirestoreService';
import useNetworkStatus from '../hooks/useNetworkStatus';

const HomeScreen = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [syncStatus, setSyncStatus] = useState('synced');
  const [user, setUser] = useState(null);
  const [dataSource, setDataSource] = useState('server');

  const { isConnected, connectionType } = useNetworkStatus();

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);

    if (currentUser) {
      // Subscribe to real-time updates
      const unsubscribe = FirestoreService.subscribeToCollection(
        'items',
        handleDataUpdate,
        currentUser.uid
      );

      return () => unsubscribe();
    }
  }, []);

  const handleDataUpdate = (result) => {
    if (result.success) {
      setItems(result.data);
      
      // Update status indicators
      setDataSource(result.fromCache ? 'cache' : 'server');
      setSyncStatus(result.hasPendingWrites ? 'pending' : 'synced');
      
      console.log(`Data updated: ${result.data.length} items from ${result.fromCache ? 'cache' : 'server'}`);
    } else {
      Alert.alert('Data Error', result.error);
    }
  };

  const addItem = async () => {
    if (!newItem.trim()) {
      Alert.alert('Error', 'Please enter item text');
      return;
    }

    setLoading(true);
    
    const result = await FirestoreService.addDocument('items', {
      text: newItem.trim(),
      userId: user.uid,
      completed: false,
    });

    setLoading(false);

    if (result.success) {
      setNewItem('');
      console.log('Item added successfully');
    } else {
      Alert.alert('Add Error', result.error);
    }
  };

  const toggleItem = async (item) => {
    const result = await FirestoreService.updateDocument('items', item.id, {
      completed: !item.completed,
    });

    if (!result.success) {
      Alert.alert('Update Error', result.error);
    }
  };

  const deleteItem = async (itemId) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            const result = await FirestoreService.deleteDocument('items', itemId);
            if (!result.success) {
              Alert.alert('Delete Error', result.error);
            }
          }
        },
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Force a network request by enabling network
    await FirestoreService.enableNetwork();
    setRefreshing(false);
  };

  const goOffline = async () => {
    const result = await FirestoreService.disableNetwork();
    if (result.success) {
      Alert.alert('Offline Mode', 'Network disabled. The app will now work offline.');
    }
  };

  const goOnline = async () => {
    const result = await FirestoreService.enableNetwork();
    if (result.success) {
      Alert.alert('Online Mode', 'Network enabled. Syncing data...');
    }
  };

  const signOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            const result = await AuthService.signOut();
            if (!result.success) {
              Alert.alert('Sign Out Error', result.error);
            }
          }
        },
      ]
    );
  };

  const getStatusColor = () => {
    if (!isConnected) return '#dc3545'; // Red for offline
    if (syncStatus === 'pending') return '#ffc107'; // Yellow for pending
    return '#28a745'; // Green for synced
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity 
        style={styles.itemContent} 
        onPress={() => toggleItem(item)}
      >
        <Text style={[
          styles.itemText,
          item.completed && styles.completedText
        ]}>
          {item.text}
        </Text>
        <Text style={styles.itemStatus}>
          {item.completed ? '✓ Completed' : '○ Pending'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => deleteItem(item.id)}
      >
        <Text style={styles.deleteText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Tasks</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>
        <TouchableOpacity onPress={signOut} style={styles.signOutButton}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Status Bar */}
      <View style={[styles.statusBar, { backgroundColor: getStatusColor() }]}>
        <Text style={styles.statusText}>
          {isConnected 
            ? `Online`
            :  `Offline`}
        </Text>
      </View>
    </View>
  )
}
