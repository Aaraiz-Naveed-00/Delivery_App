import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { Chip } from "react-native-paper";
import axios from "axios";
import BackButton from "@/assets/components/BackButton";
import ItemList from "@/assets/components/ItemList";
import CustomSearchBar from "@/assets/components/CustomSearchBar";
import { router, useLocalSearchParams } from "expo-router";
import { useCart } from "@/assets/context/CartContect";
import { useTheme } from "@/assets/context/ThemeContext";

// ------------------ TYPES ------------------
type CategoryItem = {
  name: string;
  count: number;
};

type ProductItem = {
  _id: string;
  name: string;
  price: string;
  category: string;
  image: string; // will come as URL from backend
};
// --------------------------------------------

const CategoryDetail = () => {
  const { title } = useLocalSearchParams();
  const { addToCart } = useCart();
  const { colors } = useTheme();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  // ---------------- FETCH PRODUCTS & CATEGORIES ----------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with your deployed/local backend URL
        const baseURL = "http://192.168.18.82:5000/api"; 

        const [productsRes, categoriesRes] = await Promise.all([
          axios.get(`${baseURL}/products`),
          axios.get(`${baseURL}/categories`),
        ]);

        setProducts(productsRes.data);

        // Map categories with product counts
        const categoryCounts = categoriesRes.data.map((cat: any) => ({
          name: cat.name,
          count: productsRes.data.filter((p: any) => p.category === cat.name).length,
        }));

        setCategories(categoryCounts);

        // Default select first category
        if (categoryCounts.length > 0) {
          setSelectedCategory(categoryCounts[0].name);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ---------------- FILTER PRODUCTS ----------------
  const filteredItems = products.filter(
    (item) =>
      item.category === selectedCategory &&
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onPressHeart = () => {};
  const onPressCart = (item: ProductItem) => addToCart({
    ...item, quantity: 1,
    id: item._id
  });
  const onPressItem = (item: ProductItem) => {
    router.push({
      pathname: "/(tabs)/(home)/ItemDetails",
      params: {
        id: item._id,
        name: item.name,
        price: item.price,
        image: item.image,
        category: item.category,
      },
    });
  };

  const onBackPress = () => router.navigate("../(home)");

  // ---------------- RENDER CATEGORY CHIPS ----------------
  const renderChip = ({ item }: { item: CategoryItem }) => {
    const isSelected = item.name === selectedCategory;
    return (
      <Chip
        key={item.name}
        mode="flat"
        selected={isSelected}
        onPress={() => setSelectedCategory(item.name)}
        style={[
          styles.chip,
          {
            backgroundColor: isSelected ? colors.primary : colors.card,
          },
        ]}
        textStyle={{
          color: isSelected ? "#FFFFFF" : colors.text,
          fontWeight: isSelected ? "600" : "500",
        }}
      >
        {item.name} ({item.count})
      </Chip>
    );
  };

  // ---------------- LOADING STATE ----------------
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // ---------------- MAIN UI ----------------
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <BackButton onPress={onBackPress} />
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

        <CustomSearchBar placeholder="Search" onChangeText={setSearchQuery} value={searchQuery} />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipScrollContainer}
        >
          <View>
            <View style={styles.rowContainer}>
              {categories
                .slice(0, Math.ceil(categories.length / 2))
                .map((item) => renderChip({ item }))}
            </View>
            <View style={styles.rowContainer}>
              {categories
                .slice(Math.ceil(categories.length / 2))
                .map((item) => renderChip({ item }))}
            </View>
          </View>
        </ScrollView>

        {/* ✅ Product List */}
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <ItemList
              image={{ uri: item.image }}
              name={item.name}
              price={`${item.price} €`}
              onPressHeart={onPressHeart}
              onPressCart={() => onPressCart(item)}
              onPressItem={() => onPressItem(item)}
            />
          )}
          contentContainerStyle={styles.itemsListContainer}
          scrollEnabled={false}
        />
      </ScrollView>
    </View>
  );
};

export default CategoryDetail;

// ------------------ STYLES ------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    margin: 15,
  },
  chipScrollContainer: {
    paddingVertical: 10,
  },
  rowContainer: {
    marginHorizontal: 20,
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  chip: {
    borderRadius: 25,
  },
  itemsListContainer: {
    marginHorizontal: 15,
    paddingBottom: 20,
  },
});
