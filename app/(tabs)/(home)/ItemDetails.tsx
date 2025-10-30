import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useCart } from "@/assets/context/CartContect";
import { Ionicons } from "@expo/vector-icons";
import BackButton from "@/assets/components/BackButton";
import { useTheme } from "@/assets/context/ThemeContext";
import axios from "axios";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

interface Product {
  _id: string;
  name: string;
  price: string;
  image: string;
  mainCategory?: string;
  subCategory?: string;
  weight?: string;
  description?: string;
}

export default function ItemDetails() {
  const { _id } = useLocalSearchParams<{ _id?: string }>();
  const { addToCart } = useCart();
  const { colors, theme } = useTheme();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const fetchProduct = async () => {
      if (!_id) return;
      try {
        setLoading(true);
        const res = await axios.get<Product>(
          `http://192.168.18.71:5000/api/products/id/${_id}`
        );
        setProduct(res.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [_id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product._id,
        name: product.name || "Unnamed Product",
        price: product.price || "0",
        image:
          product.image ||
          "https://via.placeholder.com/600x400?text=No+Image+Available",
        quantity: 1,
      });
    }
  };

  const onBackPress = () => router.back();

  // ✅ Loader while fetching
  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background, justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ShimmerPlaceholder
          LinearGradient={LinearGradient}
          style={{
            width: width * 0.9,
            height: height * 0.3,
            borderRadius: 16,
            marginBottom: 20,
          }}
        />
        <ShimmerPlaceholder
          LinearGradient={LinearGradient}
          style={{ width: width * 0.6, height: 25, borderRadius: 5, marginBottom: 10 }}
        />
        <ShimmerPlaceholder
          LinearGradient={LinearGradient}
          style={{ width: width * 0.8, height: 60, borderRadius: 8 }}
        />
      </View>
    );
  }

  if (!product) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background, justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={{ color: colors.text }}>Product not found.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Back Button */}
      <View style={styles.backButtonWrapper}>
        <BackButton onPress={onBackPress} />
      </View>

      {/* Product Image */}
      <Animated.View style={{ opacity: fadeAnim }}>
        <Image
          source={{
            uri: product.image || "https://via.placeholder.com/600x400?text=No+Image+Available",
          }}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
      </Animated.View>

      <View style={styles.overlay} />

      {/* Product Detail Card */}
      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, height: height * 0.5 }, // ✅ fixed height card
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <Text style={[styles.name, { color: colors.text }]}>{product.name}</Text>

          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: colors.text }]}>{product.price}</Text>
            <Text style={[styles.unit, { color: colors.text }]}>€ / piece</Text>
          </View>

          <Text style={[styles.weight, { color: colors.primary }]}>
            {product.weight ? `~ ${product.weight}` : "~ 150 gr / piece"}
          </Text>

          <Text
            style={[
              styles.description,
              { color: theme === "dark" ? "#ccc" : "#9586A8" },
            ]}
          >
            {product.description && product.description.trim() !== ""
              ? product.description
              : "There is no description for this product."}
          </Text>
        </ScrollView>

        {/* ✅ Buttons inside card now */}
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
      </View>
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
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
  },
  overlay: {
    position: "absolute",
    top: 0,
    width,
    height: height * 0.45,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  backButtonWrapper: {
    position: "absolute",
    zIndex: 10,
    top: height * 0.06,
    left: width * 0.04,
  },
  card: {
    position: "absolute",
    bottom: 80, // ✅ leaves 70–80px for bottom nav
    width,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: width * 0.06,
    paddingVertical: height * 0.03,
    elevation: 8,
  },
  name: { fontSize: width * 0.07, fontWeight: "700" },
  priceRow: { flexDirection: "row", alignItems: "flex-end", paddingVertical: 10 },
  price: { fontSize: width * 0.08, fontWeight: "700" },
  unit: { fontSize: width * 0.05, fontWeight: "500", marginLeft: 6 },
  weight: { fontSize: width * 0.04, marginTop: 5, marginBottom: 8 },
  description: {
    fontSize: width * 0.04,
    lineHeight: 22,
    marginBottom: 15,
    textAlign: "justify",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
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
