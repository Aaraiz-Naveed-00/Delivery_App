import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
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
  _id: string;
  name: string;

};

type ProductItem = {
  _id: string;
  name: string;
  price: string;
  category: string;
  image: string;
};
// --------------------------------------------

const CategoryDetail = () => {
  const { title, categoryId } = useLocalSearchParams();
  const { addToCart } = useCart();
  const { colors } = useTheme();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  const baseURL = "http://192.168.18.82:5000/api";

  // ---------------- FETCH CATEGORIES ----------------
 useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${baseURL}/categories`);
      setCategories(res.data);

      // ✅ Normalize categoryId (convert to string if it's an array)
      const normalizedId = Array.isArray(categoryId) ? categoryId[0] : categoryId;

      // ✅ Use the passed categoryId if available
      if (normalizedId) {
        setSelectedCategoryId(normalizedId);
        await fetchProductsByCategory(normalizedId);
      } else if (res.data.length > 0) {
        // fallback to first category if no ID passed
        const firstCategoryId = res.data[0]._id;
        setSelectedCategoryId(firstCategoryId);
        await fetchProductsByCategory(firstCategoryId);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchCategories();
}, [categoryId]);


  // ---------------- FETCH PRODUCTS BY CATEGORY ----------------
  const fetchProductsByCategory = async (categoryId: string) => {
  if (!categoryId) return; // ✅ Prevents empty request if categoryId not yet loaded
  try {
    setLoading(true);
    const res = await axios.get(
      `${baseURL}/products/filter?categoryId=${categoryId}`
    );
    setProducts(res.data);
  } catch (error) {
    console.error("Error fetching products:", error);
  } finally {
    setLoading(false);
  }
};
  // ---------------- FILTER BY SEARCH ----------------
  const filteredItems = products.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onPressHeart = () => {};
  const onPressCart = (item: ProductItem) =>
    addToCart({ ...item, quantity: 1, id: item._id });

  const onPressItem = (item: ProductItem) => {
    router.push({
      pathname: "/(tabs)/(home)/ItemDetails",
      params: {
        _id: item._id, // ✅ Pass _id for ItemDetails to match
      },
    });
  };

  const onBackPress = () => router.navigate("../(home)");

  // ---------------- RENDER CATEGORY CHIPS ----------------
  const renderChip = ({ item }: { item: CategoryItem }) => {
    const isSelected = item._id === selectedCategoryId;
    return (
      <Chip
        key={item._id}
        mode="flat"
        selected={isSelected}
        onPress={() => {
          setSelectedCategoryId(item._id);
          fetchProductsByCategory(item._id);
        }}
        style={[
          styles.chip,
          { backgroundColor: isSelected ? colors.primary : colors.card },
        ]}
        textStyle={{
          color: isSelected ? "#FFFFFF" : colors.text,
          fontWeight: isSelected ? "600" : "500",
        }}
      >
        {item.name}
      </Chip>
    );
  };

  // ---------------- LOADING STATE ----------------
  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
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

        <CustomSearchBar
          placeholder="Search"
          onChangeText={setSearchQuery}
          value={searchQuery}
        />

        {/* ✅ Category Chips */}
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
        {filteredItems.length === 0 ? (
          <Text
            style={{
              color: colors.text,
              textAlign: "center",
              marginTop: 30,
              fontSize: 16,
            }}
          >
            No products found for this category.
          </Text>
        ) : (
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
        )}
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
