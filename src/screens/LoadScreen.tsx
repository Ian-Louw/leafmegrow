// src/screens/LoadScreen.tsx
import React from 'react';
import { StyleSheet, ActivityIndicator, View, Text } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Leaf, Sprout } from 'lucide-react-native';

const LoadScreen: React.FC = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Plant-themed loading animation */}
      <View style={[styles.loadingBox, { backgroundColor: theme.colors.surface }]}>
        {/* Plant Icon with Animation */}
        <View style={styles.iconContainer}>
          <View style={[styles.plantIconContainer, { backgroundColor: theme.colors.primary }]}>
            <Sprout size={32} color={theme.colors.background} />
          </View>
          
          {/* Floating leaf decorations */}
          <View style={styles.floatingLeaf1}>
            <Leaf size={16} color={theme.colors.primary} style={{ opacity: 0.6 }} />
          </View>
          <View style={styles.floatingLeaf2}>
            <Leaf size={12} color={theme.colors.secondary} style={{ opacity: 0.4 }} />
          </View>
        </View>
        
        <ActivityIndicator 
          size="large" 
          color={theme.colors.primary}
          style={styles.spinner}
        />
        
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          Growing your experience...
        </Text>
        
        <Text style={[styles.subText, { color: theme.colors.textSecondary }]}>
          Please wait while we prepare everything
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBox: {
    paddingHorizontal: 40,
    paddingVertical: 32,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 280,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plantIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingLeaf1: {
    position: 'absolute',
    top: -8,
    right: -12,
    transform: [{ rotate: '45deg' }],
  },
  floatingLeaf2: {
    position: 'absolute',
    bottom: -4,
    left: -8,
    transform: [{ rotate: '-30deg' }],
  },
  spinner: {
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default LoadScreen;