import { Image, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useTheme } from '@/assets/context/ThemeContext';

type CardsProps = {
  title: string;
  image: any; 
  onPress?: () => void; 
};

const Cards: React.FC<CardsProps> = ({ title, image, onPress }) => {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { 
          backgroundColor: colors.card,
          shadowColor: isDark ? '#000' : '#000',
        }
      ]} 
      onPress={onPress}
    >
      <Image source={image} style={styles.banner} resizeMode="cover" />
      <Text style={[
        styles.title, 
        { color: colors.text }
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  )
}

export default Cards

const styles = StyleSheet.create({
    container: {
        width: 150,
        height: 200,
        borderRadius: 10,
        elevation: 3,
        margin: 10,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    banner: {
        width: 150,
        height: 130,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    title: {
        padding: 10,
        fontSize: 20,
        fontWeight: "bold",
    }
})