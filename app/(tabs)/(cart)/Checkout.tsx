import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  StyleSheet,
  Image,
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '@/assets/context/CartContect';
import { useProfile } from '@/assets/context/ProfileContext';
import CustomYesNoSwitch from '@/assets/components/CustomYesNoSwitch';
import { useTheme } from '@/assets/context/ThemeContext';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

export default function Checkout() {
  const { cartItems, clearCart, getTotalPrice } = useCart();
  const { addOrder } = useProfile();
  const params = useLocalSearchParams();
  const { colors } = useTheme();

  const [payment, setPayment] = useState<string>('');
  const [address, setAddress] = useState<any>(null);
  const [deliveryOption, setDeliveryOption] = useState<string>('By Drone');
  const [nonContact, setNonContact] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [deliveryModal, setDeliveryModal] = useState(false);

  type FormFields = {
    fullName: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  const [formData, setFormData] = useState<FormFields>({
    fullName: '',
    street: '',
    city: '',
    postalCode: '',
    country: '',
  });

  useEffect(() => {
    if (params.selectedPayment) {
      setPayment(params.selectedPayment as string);
    }
  }, [params]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  );
  const deliveryFee = subtotal > 0 ? 2.5 : 0;
  const total = subtotal + deliveryFee;

  const handleSaveAddress = () => {
    if (
      !formData.fullName ||
      !formData.street ||
      !formData.city ||
      !formData.postalCode ||
      !formData.country
    ) {
      alert('Please fill in all address fields.');
      return;
    }
    setAddress(formData);
    setModalVisible(false);
  };

  const handleFetchLocation = () => {
    alert('Fetching location (to be integrated later)');
  };

  const formatAddress = (addr: any) => {
    if (!addr) return '';
    return `${addr.fullName}\n${addr.street}\n${addr.city}\n${addr.postalCode}\n${addr.country}`;
  };

  const handlePayNow = () => {
    if (!payment || !address || !deliveryOption) {
      alert('Please fill all fields before proceeding.');
      return;
    }

    const newOrder = {
      id: Date.now().toString(),
      paymentMethod: payment,
      deliveryAddress: formatAddress(address),
      deliveryOption,
      nonContact,
      totalAmount: getTotalPrice(),
      items: cartItems,
      date: new Date().toLocaleString(),
    };

    addOrder(newOrder);
    clearCart();
    alert('Payment Successful! Your order has been added.');
    // Navigate back to cart screen which will show empty cart
    router.replace('/(tabs)/(cart)');
  };

  const handlePaymentChange = () => {
    router.push({
      pathname: '/PaymentMethod',
      params: { currentPayment: payment },
    });
  };

  const onBackPress = () => {
    router.back();
  };

  const handleCancelOrder = () => {
    clearCart();
    // Navigate back to cart screen
    router.replace('/(tabs)/(cart)');
  };

  const deliveryOptions = [
    {
      label: "I'll pick it up myself",
      value: 'Pickup',
      icon: require('@/assets/images/walking.png'),
    },
    {
      label: 'By courier',
      value: 'Courier',
      icon: require('@/assets/images/bike.png'),
    },
    {
      label: 'By Drone',
      value: 'By Drone',
      icon: require('@/assets/images/Drone.png'),
    },
  ];

  // Dynamic styles based on theme
  const dynamicStyles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      paddingHorizontal: 16,
      paddingBottom: 150,
      backgroundColor: colors.background,
    },
    headerTitle: { 
      fontSize: 22, 
      fontWeight: '700', 
      color: colors.text, 
      textAlign: 'center', 
      flex: 1 
    },
    receiptContainer: {
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 16,
      marginBottom: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    emptyCartContainer: {
      backgroundColor: colors.card,
      padding: 20,
      borderRadius: 16,
      marginBottom: 24,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    emptyCartText: {
      fontSize: 16,
      color: colors.text,
      textAlign: 'center',
      opacity: 0.7,
    },
    receiptTitle: { 
      fontSize: 18, 
      fontWeight: '700', 
      marginBottom: 10, 
      color: colors.text 
    },
    receiptItem: { 
      color: colors.text, 
      fontSize: 15,
      opacity: 0.8,
    },
    receiptPrice: { 
      color: colors.text, 
      fontWeight: '600' 
    },
    receiptLabel: { 
      color: colors.text,
      opacity: 0.6,
    },
    receiptValue: { 
      color: colors.text, 
      fontWeight: '600' 
    },
    totalLabel: { 
      fontSize: 16, 
      fontWeight: '700', 
      color: colors.text 
    },
    totalValue: { 
      fontSize: 16, 
      fontWeight: '700', 
      color: colors.text 
    },
    section: {
      marginBottom: 20,
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    sectionTitle: { 
      fontSize: 16, 
      fontWeight: '600', 
      color: colors.text 
    },
    changeText: { 
      color: colors.primary, 
      fontWeight: '600' 
    },
    infoText: { 
      marginTop: 8, 
      color: colors.text, 
      fontSize: 14, 
      lineHeight: 20,
      opacity: 0.8,
    },
    placeholder: { 
      marginTop: 8, 
      color: colors.text,
      fontSize: 14,
      opacity: 0.6,
    },
    optionText: { 
      flex: 1, 
      color: colors.text, 
      fontSize: 15,
      opacity: 0.8,
    },
    selectedOption: { 
      color: colors.primary, 
      fontWeight: 'bold' 
    },
    nonContactRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 16,
      paddingVertical: 12,
      paddingHorizontal: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    switchLabel: { 
      fontSize: 16, 
      fontWeight: '600', 
      color: colors.text 
    },
    bottomContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.background,
      paddingHorizontal: 16,
      paddingVertical: 12,
      paddingBottom: Platform.OS === 'ios' ? 50 : 80, // Increased from 60 to 80 for Android
      borderTopWidth: 1,
      borderTopColor: colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5,
    },
    modalContainer: {
      width: '100%',
      maxWidth: 400,
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    modalTitle: { 
      fontSize: 18, 
      fontWeight: 'bold', 
      color: colors.text, 
      marginBottom: 16 
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.card,
    },
    cancel: { 
      color: colors.text, 
      fontWeight: '600', 
      fontSize: 16,
      opacity: 0.6,
    },
    save: { 
      color: colors.primary, 
      fontWeight: 'bold', 
      fontSize: 16 
    },
  });

  return (
    <SafeAreaView style={dynamicStyles.safeArea}>
      <KeyboardAvoidingView 
        style={dynamicStyles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={dynamicStyles.scrollContent}
        >
          {/* HEADER */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.customBackButton}
              onPress={onBackPress}>
              <Ionicons name="chevron-back" size={28} color={colors.text} />
            </TouchableOpacity>
            <Text style={dynamicStyles.headerTitle}>Checkout</Text>
            <View style={{ width: 40 }} /> {/* Spacer for centering */}
          </View>

          {/* 🧾 ORDER SUMMARY */}
          {cartItems.length > 0 ? (
            <View style={dynamicStyles.receiptContainer}>
              <Text style={dynamicStyles.receiptTitle}>Order Summary</Text>
              {cartItems.map((item) => (
                <View key={item.id} style={styles.receiptRow}>
                  <Text style={dynamicStyles.receiptItem}>
                    {item.name} × {item.quantity}
                  </Text>
                  <Text style={dynamicStyles.receiptPrice}>
                    {(parseFloat(item.price) * item.quantity).toFixed(2)} €
                  </Text>
                </View>
              ))}
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <View style={styles.receiptRow}>
                <Text style={dynamicStyles.receiptLabel}>Subtotal</Text>
                <Text style={dynamicStyles.receiptValue}>{subtotal.toFixed(2)} €</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={dynamicStyles.receiptLabel}>Delivery Fee</Text>
                <Text style={dynamicStyles.receiptValue}>{deliveryFee.toFixed(2)} €</Text>
              </View>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <View style={styles.receiptRow}>
                <Text style={dynamicStyles.totalLabel}>Total</Text>
                <Text style={dynamicStyles.totalValue}>{total.toFixed(2)} €</Text>
              </View>
            </View>
          ) : (
            <View style={dynamicStyles.emptyCartContainer}>
              <Text style={dynamicStyles.emptyCartText}>Your cart is empty</Text>
            </View>
          )}

          {/* 💳 PAYMENT METHOD */}
          <View style={dynamicStyles.section}>
            <View style={styles.sectionHeader}>
              <Text style={dynamicStyles.sectionTitle}>Payment method</Text>
              <TouchableOpacity onPress={handlePaymentChange}>
                <Text style={dynamicStyles.changeText}>CHANGE</Text>
              </TouchableOpacity>
            </View>
            {payment ? (
              <Text style={dynamicStyles.infoText}>{payment}</Text>
            ) : (
              <Text style={dynamicStyles.placeholder}>No payment method added</Text>
            )}
          </View>

          {/* 🏠 DELIVERY ADDRESS */}
          <View style={dynamicStyles.section}>
            <View style={styles.sectionHeader}>
              <Text style={dynamicStyles.sectionTitle}>Delivery address</Text>
              <TouchableOpacity
                onPress={() => {
                  setFormData(address || formData);
                  setModalVisible(true);
                }}>
                <Text style={dynamicStyles.changeText}>{address ? 'CHANGE' : 'ADD'}</Text>
              </TouchableOpacity>
            </View>
            {address ? (
              <Text style={dynamicStyles.infoText}>{formatAddress(address)}</Text>
            ) : (
              <Text style={dynamicStyles.placeholder}>No delivery address added</Text>
            )}
          </View>

         {/* 🚚 DELIVERY OPTIONS */}
        <View style={dynamicStyles.section}>
          <View style={styles.sectionHeader}>
            <Text style={dynamicStyles.sectionTitle}>Delivery options</Text>
            <TouchableOpacity onPress={() => setDeliveryModal(true)}>
              <Text style={dynamicStyles.changeText}>CHANGE</Text>
            </TouchableOpacity>
          </View>
          {deliveryOptions.map((option) => (
            <View key={option.value} style={styles.optionRow}>
              <Image 
                source={option.icon} 
                style={[
                  styles.optionIcon,
                  deliveryOption === option.value && { tintColor: colors.primary } // Add tint for active icon
                ]} 
              />
              <Text
                style={[
                  dynamicStyles.optionText,
                  deliveryOption === option.value && dynamicStyles.selectedOption,
                ]}>
                {option.label}
              </Text>
              {deliveryOption === option.value && (
                <Ionicons name="checkmark" size={20} color={colors.primary} />
              )}
            </View>
          ))}
        </View>

          {/* 🤝 NON-CONTACT DELIVERY */}
          <View style={dynamicStyles.nonContactRow}>
            <Text style={dynamicStyles.switchLabel}>Non-contact delivery</Text>
            <CustomYesNoSwitch value={nonContact} onValueChange={setNonContact} />
          </View>

          {/* Extra bottom padding for scroll view */}
          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* FIXED BOTTOM BUTTONS - Always visible above navigation */}
        <View style={dynamicStyles.bottomContainer}>
          {/* 💰 PAY NOW */}
          <TouchableOpacity 
            style={[
              styles.payButton, 
              (!payment || !address || !deliveryOption || cartItems.length === 0) && styles.disabledButton
            ]} 
            onPress={handlePayNow}
            disabled={!payment || !address || !deliveryOption || cartItems.length === 0}
          >
            <Text style={styles.payText}>Pay Now</Text>
          </TouchableOpacity>

          {/* ❌ CANCEL BUTTON */}
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancelOrder}>
            <Text style={styles.cancelText}>Cancel Order</Text>
          </TouchableOpacity>
        </View>

        {/* ADDRESS MODAL */}
        <Modal visible={modalVisible} transparent animationType="fade">
          <View style={styles.modalBackground}>
            <View style={dynamicStyles.modalContainer}>
              <Text style={dynamicStyles.modalTitle}>Enter Delivery Address</Text>
              {(['fullName', 'street', 'city', 'postalCode', 'country'] as (keyof FormFields)[]).map(
                (key) => (
                  <TextInput
                    key={key}
                    style={dynamicStyles.input}
                    placeholder={
                      key === 'fullName' ? 'Full Name' : key.charAt(0).toUpperCase() + key.slice(1)
                    }
                    placeholderTextColor={colors.text}
                    keyboardType={key === 'postalCode' ? 'numeric' : 'default'}
                    value={formData[key]}
                    onChangeText={(text) => setFormData({ ...formData, [key]: text })}
                  />
                )
              )}
              <TouchableOpacity style={styles.locationButton} onPress={handleFetchLocation}>
                <Text style={styles.locationText}>Fetch Current Location</Text>
              </TouchableOpacity>
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={styles.modalButton} 
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={dynamicStyles.cancel}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.modalButton} 
                  onPress={handleSaveAddress}
                >
                  <Text style={dynamicStyles.save}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* DELIVERY OPTION MODAL */}
        <Modal visible={deliveryModal} transparent animationType="fade">
          <View style={styles.modalBackground}>
            <View style={dynamicStyles.modalContainer}>
              <Text style={dynamicStyles.modalTitle}>Select Delivery Option</Text>
              {deliveryOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.modalOption}
                  onPress={() => {
                    setDeliveryOption(option.value);
                    setDeliveryModal(false);
                  }}>
                  <Image source={option.icon} style={styles.optionIcon} />
                  <Text style={dynamicStyles.optionText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Static styles that don't change with theme
const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Platform.OS === 'ios' ? 10 : 40,
    marginBottom: 24,
  },
  customBackButton: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  optionIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  bottomSpacer: {
    height: 20,
  },
  payButton: {
    backgroundColor: '#7B3EFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: '#C4C4C4',
    opacity: 0.6,
  },
  payText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  cancelText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  locationButton: {
    backgroundColor: '#7B3EFF',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  locationText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
    marginTop: 8,
  },
  modalButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});