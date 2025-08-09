// src/components/ThemedButton.tsx
import React from 'react';
import { Pressable, Text, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

type Props = {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export const ThemedButton: React.FC<Props> = ({ title, onPress, style, textStyle }) => {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          backgroundColor: theme.colors.primary,
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 12,
        },
        style,
      ]}
    >
      <Text
        style={[
          { color: theme.colors.primary, textAlign: 'center', fontWeight: '600' },
          textStyle,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
};
