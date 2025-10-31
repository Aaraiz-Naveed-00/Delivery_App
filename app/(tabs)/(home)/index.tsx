import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator } from "react-native";
import CustomSearchBar from "@/assets/components/CustomSearchBar";
import Cards from "@/assets/components/Cards";
import BackButton from "@/assets/components/BackButton";
import { router } from "expo-router";
import { useTheme } from "@/assets/context/ThemeContext";
import axios from "axios";

const Categories = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();

  

  const onBackPress = () => router.navigate("../welcome");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const baseURL = "http://192.168.18.71:5000/api";
        const res = await axios.get(`${baseURL}/categories`);
        setCategories(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const filteredData = categories.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center", backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image source={require("@/assets/images/back_ground_vegetable.png")} style={styles.topImage} />
      <BackButton onPress={onBackPress} />

      <Text style={[styles.title, { color: colors.text }]}>Categories</Text>

      <CustomSearchBar
        placeholder="Search"
        onChangeText={setSearchQuery}
        value={searchQuery}
      />

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item._id}
        numColumns={2}
        renderItem={({ item }) => (
          <Cards
            title={item.name}
            image={{ uri: item.image }} // ✅ dynamic image
            onPress={() =>
              router.push({
                pathname: "/CategoryDetail",
                params: { title: item.name, categoryId: item._id },
              })
            }
          />
        )}
        contentContainerStyle={styles.flatListContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Categories;

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 28, fontWeight: "bold", margin: 10, paddingLeft: 10 },
  flatListContainer: { paddingBottom: 100, marginTop: 20, justifyContent: "center", alignItems: "center" },
  topImage: { position: "absolute", top: -8, right: 0, width: 160, height: 170, resizeMode: "contain" },
});
