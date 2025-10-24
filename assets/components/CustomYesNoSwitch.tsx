import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/assets/context/ThemeContext';

type CustomYesNoSwitchProps = {
  value: boolean;
  onValueChange: (newValue: boolean) => void;
};

export default function CustomYesNoSwitch({ value, onValueChange }: CustomYesNoSwitchProps) {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onValueChange(!value)}
      style={[
        styles.container,
        value 
          ? [styles.activeContainer, { backgroundColor: colors.primary }]
          : [styles.inactiveContainer, { backgroundColor: isDark ? '#555' : '#ccc' }],
      ]}
    >
      <View
        style={[
          styles.circle,
          value ? styles.activeCircle : styles.inactiveCircle,
          { backgroundColor: colors.background }
        ]}
      />

      <Text
        style={[
          styles.text,
          value 
            ? [styles.activeText, { color: colors.background }]
            : [styles.inactiveText, { color: isDark ? '#aaa' : '#555' }],
          value ? styles.textRight : styles.textLeft,
        ]}
      >
        {value ? 'YES' : 'NO'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 65,
    height: 28,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingHorizontal: 6,
  },
  activeContainer: {
    // backgroundColor will be set dynamically using colors.primary
  },
  inactiveContainer: {
    // backgroundColor will be set dynamically
  },
  circle: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    top: 3,
  },
  activeCircle: {
    right: 3,
  },
  inactiveCircle: {
    left: 3,
  },
  text: {
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  activeText: {
    // Color will be set dynamically using colors.background
  },
  inactiveText: {
    // Color will be set dynamically
  },
  textLeft: {
    marginLeft: 10,
  },
  textRight: {
    marginRight: 10,
  },
});