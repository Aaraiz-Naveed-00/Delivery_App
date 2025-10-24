import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '@/assets/context/CartContect';
import { router } from 'expo-router';
import { useTheme } from '@/assets/context/ThemeContext';

const CartScreen = () => {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    getTotalPrice,
  } = useCart();

  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  const subtotal = getTotalPrice();
  const deliveryFee = subtotal > 0 ? 2.5 : 0;
  const total = subtotal + deliveryFee;

  const onCheckout = () => {
    router.push({ pathname: '/(tabs)/(cart)/Checkout' });
  };

  const onBackPress = () => {
    router.back();
  };

  const renderItem = ({ item }: any) => (
    <View
      style={[
        styles.itemContainer,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <Image source={item.image} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={[styles.itemTitle, { color: colors.text }]}>
          {item.name || 'Product Name'}
        </Text>
        {item.category && (
          <Text style={[styles.itemCategory, { color: isDark ? '#ccc' : '#9586A8' }]}>
            {item.category}
          </Text>
        )}

        <View style={styles.priceRow}>
          <Text style={[styles.itemPrice, { color: colors.primary }]}>
            {typeof item.price === 'string' || typeof item.price === 'number' 
              ? item.price 
              : '0.00'} €
          </Text>
        </View>

        <View style={styles.quantityRow}>
          <TouchableOpacity
            style={[styles.qtyButton, { backgroundColor: isDark ? '#222' : '#E6F5EE' }]}
            onPress={() => decreaseQuantity(item.id)}
          >
            <Ionicons
              name="remove"
              size={18}
              color={isDark ? '#fff' : '#2D0C57'}
            />
          </TouchableOpacity>

          <Text style={[styles.quantityText, { color: colors.text }]}>
            {item.quantity || 0}
          </Text>

          <TouchableOpacity
            style={[styles.qtyButton, { backgroundColor: isDark ? '#222' : '#E6F5EE' }]}
            onPress={() => increaseQuantity(item.id)}
          >
            <Ionicons name="add" size={18} color={isDark ? '#fff' : '#2D0C57'} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.removeBtn}>
        <Ionicons name="trash-outline" size={22} color="#FF6B6B" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.backButtonWrapper}>
          <TouchableOpacity style={styles.customBackButton} onPress={onBackPress}>
            <Ionicons
              name="chevron-back"
              size={28}
              color={isDark ? '#fff' : '#3c3066'}
            />
          </TouchableOpacity>
        </View>
        <Text style={[styles.title, { color: colors.text }]}>My Cart</Text>
        <View style={styles.placeholder} />
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image 
            source={require('@/assets/images/cart.png')} 
            style={styles.emptyImage}
          />
          <Text style={[styles.emptyText, { color: isDark ? '#aaa' : '#9586A8' }]}>
            Your cart is empty
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />

          {/* Summary */}
          <View
            style={[
              styles.summaryContainer,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: isDark ? '#ccc' : '#9586A8' }]}>
                Subtotal
              </Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {subtotal.toFixed(2)} €
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: isDark ? '#ccc' : '#9586A8' }]}>
                Delivery Fee
              </Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {deliveryFee.toFixed(2)} €
              </Text>
            </View>

            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />

            <View style={styles.summaryRow}>
              <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
              <Text style={[styles.totalValue, { color: colors.text }]}>
                {total.toFixed(2)} €
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.checkoutBtn, { backgroundColor: colors.primary }]}
              onPress={onCheckout}
            >
              <Ionicons name="cart-outline" size={20} color="#FFF" />
              <Text style={styles.checkoutText}>Proceed to Checkout</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.clearBtn} onPress={clearCart}>
              <Text
                style={[
                  styles.clearText,
                  { color: isDark ? '#A259FF' : '#A259FF' },
                ]}
              >
                Clear Cart
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default CartScreen;

// ------------------ STYLES ------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    marginBottom: 60,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 50,
    marginBottom: 15,
    height: 40,
  },
  backButtonWrapper: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    flex: 1,
    textAlignVertical: 'center',
    lineHeight: 40,
  },
  placeholder: {
    width: 40,
  },
  listContainer: {
    paddingBottom: 250,
    marginBottom: 80,
  },
  itemContainer: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 12,
    marginBottom: 14,
    alignItems: 'center',
    borderWidth: 1,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 15,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  itemCategory: {
    fontSize: 13,
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  qtyButton: {
    borderRadius: 8,
    padding: 6,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 10,
  },
  removeBtn: {
    padding: 8,
  },
  summaryContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    padding: 20,
    paddingBottom: 30,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  summaryLabel: {
    fontSize: 16,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  checkoutBtn: {
    flexDirection: 'row',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 14,
  },
  checkoutText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  clearBtn: {
    alignSelf: 'center',
    marginTop: 10,
  },
  clearText: {
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  emptyText: {
    fontSize: 16,
    marginTop: 10,
  },
  customBackButton: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
});