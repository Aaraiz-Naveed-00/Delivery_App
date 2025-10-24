import { View, TextInput, StyleSheet } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@/assets/context/ThemeContext';

type CustomSearchBarProps = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
};

const CustomSearchBar: React.FC<CustomSearchBarProps> = ({ placeholder, value, onChangeText }) => {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <View style={[
      styles.container,
      { 
        backgroundColor: colors.card,
        borderColor: colors.border
      }
    ]}>
      <Icon 
        name="search-outline" 
        size={24} 
        color={isDark ? '#aaa' : '#6C6C6C'} 
        style={styles.icon} 
      />
      <TextInput
        style={[
          styles.input,
          { color: colors.text }
        ]}
        placeholder={placeholder}
        placeholderTextColor={isDark ? '#888' : '#BDBDBD'}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    borderWidth: 1.5,
    marginHorizontal: 20,
    height: 50,
    marginVertical: 13
  },
  icon: {
    marginLeft: 15,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
});

export default CustomSearchBar;