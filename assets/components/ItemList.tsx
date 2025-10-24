// ProductCard.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, GestureResponderEvent } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '@/assets/context/ThemeContext';

type ProductCardProps = {
  image: any;
  name: string;
  price: string;
  onPressHeart: () => void;
  onPressCart: () => void;
  onPressItem: () => void;
};

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  name,
  price,
  onPressHeart,
  onPressCart,
  onPressItem
}) => {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <TouchableOpacity 
      style={styles.cardContainer}
      onPress={onPressItem}
    >
      <Image source={image} style={styles.image} />
      <View style={styles.contentContainer}>
        <Text style={[styles.productName, { color: colors.text }]}>{name}</Text>
        <Text style={[styles.productPrice, { color: colors.text }]}>
          {price} 
          <Text style={[styles.priceUnit, { color: isDark ? '#aaa' : '#8D8D8D' }]}> / piece</Text>
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[
              styles.heartButton, 
              { 
                borderColor: isDark ? '#444' : '#EFE9F3',
                backgroundColor: isDark ? '#1E1E1E' : 'transparent'
              }
            ]} 
            onPress={onPressHeart}
          >
            <Icon 
              name="heart" 
              size={24} 
              color={isDark ? '#fff' : '#6E5F81'} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.cartButton, 
              { backgroundColor: colors.primary }
            ]} 
            onPress={onPressCart}
          >
            <Image 
              source={require("@/assets/images/shopping-cart.png")} 
              style={{ tintColor: '#FFF' }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    borderRadius: 15,
    marginVertical: 15
  },
  image: {
    width: 160,
    height: 120,
    borderRadius: 8,
    marginRight: 15,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 20,
    fontWeight: '500',
  },
  productPrice: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  priceUnit: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: "flex-end",
    marginTop: 10,
  },
  heartButton: {
    width: 70,
    height: 40,
    borderRadius: 10,
    marginRight: 8,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartButton: {
    width: 70,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProductCard;