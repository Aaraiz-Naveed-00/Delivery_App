import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Animated,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useCart } from "@/assets/context/CartContect";
import { Ionicons } from "@expo/vector-icons";
import BackButton from "@/assets/components/BackButton";
import { useTheme } from "@/assets/context/ThemeContext";
import axios from "axios";
import { ViewToken } from "react-native";

const { width, height } = Dimensions.get("window");

export default function ItemDetails() {
  const { category } = useLocalSearchParams<{ category: string }>(); // ✅ Used as mainCategory
  const { addToCart } = useCart();
  const { colors, theme } = useTheme();

  const [categoryItems, setCategoryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const flatListRef = useRef<FlatList>(null);

  // ✅ Fetch products by mainCategory using new backend /filter endpoint
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `http://192.168.18.82:5000/api/products/filter?mainCategory=${encodeURIComponent(
            category
          )}`
        );
        setCategoryItems(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  // ✅ Viewable Items Ref (for smooth fade animation)
  const onViewRef = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start();
        setCurrentIndex(viewableItems[0].index!);
      }
    }
  );

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const handleAddToCart = () => {
    const item = categoryItems[currentIndex];
    if (item) {
      addToCart({ ...item, quantity: 1 });
    }
  };

  const onBackPress = () => router.back();

  // ✅ Loading State
  if (loading) {
    return (
      <View
        style={[styles.container, { justifyContent: "center", alignItems: "center" }]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // ✅ No Items Found
  if (categoryItems.length === 0) {
    return (
      <View
        style={[styles.container, { justifyContent: "center", alignItems: "center" }]}
      >
        <Text style={{ color: colors.text }}>
          No products found for this category.
        </Text>
      </View>
    );
  }

  // ✅ Main Render
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Back Button */}
      <View style={styles.backButtonWrapper}>
        <BackButton onPress={onBackPress} />
      </View>

      {/* Animated Background */}
      {categoryItems[currentIndex]?.image && (
        <Animated.Image
          source={{ uri: categoryItems[currentIndex].image }}
          style={[styles.backgroundImage, { opacity: fadeAnim }]}
          resizeMode="cover"
        />
      )}

      {/* Overlay */}
      <View style={styles.overlay} />

      {/* Dots */}
      <View style={styles.dotContainer}>
        {categoryItems.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  currentIndex === index
                    ? colors.primary
                    : theme === "dark"
                    ? "#555"
                    : "#D8D8D8",
              },
            ]}
          />
        ))}
      </View>

      {/* Product Details */}
      <FlatList
        ref={flatListRef}
        data={categoryItems}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item._id || item.name}
        renderItem={({ item }) => (
          <View style={{ width, alignItems: "center" }}>
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>

                <View style={styles.priceRow}>
                  <Text style={[styles.price, { color: colors.text }]}>
                    {item.price}
                  </Text>
                  <Text style={[styles.unit, { color: colors.text }]}>€ / piece</Text>
                </View>

                <Text style={[styles.weight, { color: colors.primary }]}>
                  ~ 150 gr / piece
                </Text>

                <Text
                  style={[
                    styles.description,
                    { color: theme === "dark" ? "#ccc" : "#9586A8" },
                  ]}
                >
                  This product belongs to the{" "}
                  <Text style={{ color: colors.primary }}>{item.category}</Text> category.
                </Text>

                <View style={styles.actions}>
                  <TouchableOpacity
                    style={[styles.heartButton, { borderColor: colors.border }]}
                  >
                    <Ionicons name="heart-outline" size={24} color={colors.text} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.cartButton, { backgroundColor: colors.primary }]}
                    onPress={handleAddToCart}
                  >
                    <Ionicons name="cart-outline" size={20} color="#fff" />
                    <Text style={[styles.cartText, { color: "#fff" }]}>ADD TO CART</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        )}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: {
    position: "absolute",
    top: 0,
    width,
    height: height * 0.47,
  },
  overlay: { position: "absolute", top: 0, width, height: height * 0.45 },
  backButtonWrapper: { zIndex: 10, top: height * 0.06, left: width * 0.04 },
  dotContainer: {
    position: "absolute",
    top: height * 0.42,
    alignSelf: "center",
    flexDirection: "row",
    gap: 6,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  card: {
    width,
    marginTop: height * 0.35,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: width * 0.06,
    paddingVertical: height * 0.03,
    elevation: 8,
    marginBottom: 50,
  },
  name: { fontSize: width * 0.07, fontWeight: "700" },
  priceRow: { flexDirection: "row", alignItems: "flex-end", paddingVertical: 10 },
  price: { fontSize: width * 0.08, fontWeight: "700" },
  unit: { fontSize: width * 0.05, fontWeight: "500", marginLeft: 6 },
  weight: { fontSize: width * 0.04, marginTop: 5, marginBottom: 8 },
  description: { fontSize: width * 0.04, lineHeight: 22, marginBottom: 15 },
  actions: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  heartButton: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.04,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cartButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: width * 0.12,
    borderRadius: width * 0.04,
    marginLeft: width * 0.03,
  },
  cartText: { fontWeight: "700", fontSize: width * 0.04, marginLeft: 8 },
});
