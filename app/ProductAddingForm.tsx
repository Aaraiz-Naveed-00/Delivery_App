import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import { useTheme } from "@/assets/context/ThemeContext";

// Your backend API
const API_BASE = "http://192.168.18.82:5000/api";

// Cloudinary credentials
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/duqffmi9a/upload";
const CLOUDINARY_UPLOAD_PRESET = "Delivery_App"; // unsigned preset

const AddItemsScreen = () => {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<"category" | "product">("category");

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Category states
  const [categoryName, setCategoryName] = useState("");

  // Product states
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [productWeight, setProductWeight] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // ✅ Fetch categories for dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_BASE}/categories`);
        setCategories(res.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        Alert.alert("Error", "Failed to fetch categories.");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // ✅ Pick & upload image
  const pickAndUploadImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "We need access to your photos to continue.");
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        let uri = result.assets[0].uri;

        if (Platform.OS === "android" && uri.startsWith("content://")) {
          const FS: any = FileSystem;
          const cacheDir = FS.documentDirectory;
          const fileUri = `${cacheDir}temp_${Date.now()}.jpg`;
          await FS.copyAsync({ from: uri, to: fileUri });
          uri = fileUri;
        }

        const uploadedUrl = await uploadToCloudinary(uri);
        setImageUri(uploadedUrl);
        Alert.alert("✅ Image uploaded!", "Image hosted on Cloudinary");
      } else {
        Alert.alert("No image selected");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to pick or upload image");
    }
  };

  const uploadToCloudinary = async (uri: string) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", {
        uri,
        type: "image/jpeg",
        name: `image_${Date.now()}.jpg`,
      } as any);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const response = await axios.post(CLOUDINARY_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data.secure_url;
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      Alert.alert("Upload Failed", "Failed to upload image to Cloudinary");
      return null;
    } finally {
      setUploading(false);
    }
  };

  // ✅ Add Category
  const handleAddCategory = async () => {
    if (!categoryName || !imageUri) {
      Alert.alert("Missing Fields", "Please fill all fields and upload an image.");
      return;
    }

    try {
      await axios.post(`${API_BASE}/categories`, { name: categoryName, image: imageUri });
      Alert.alert("Success", "Category added!");
      setCategoryName("");
      setImageUri(null);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to add category.");
    }
  };

  // ✅ Add Product
  const handleAddProduct = async () => {
    if (!productName || !productPrice || !selectedCategoryId || !subCategory || !imageUri) {
      Alert.alert("Missing Fields", "Please complete all fields and upload an image.");
      return;
    }

    try {
      await axios.post(`${API_BASE}/products`, {
        name: productName,
        price: productPrice,
        categoryId: selectedCategoryId,
        subCategory,
        image: imageUri,
        weight: productWeight,
        description: productDescription || "There is no description for this product.",
      });

      Alert.alert("✅ Success", "Product added successfully!");
      setProductName("");
      setProductPrice("");
      setSelectedCategoryId("");
      setSubCategory("");
      setProductWeight("");
      setProductDescription("");
      setImageUri(null);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to add product.");
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 80 }}
    >
      {/* Tab Switch */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => setActiveTab("category")}
          style={[
            styles.tabButton,
            {
              backgroundColor: activeTab === "category" ? colors.primary : "transparent",
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.tabText, { color: activeTab === "category" ? "#FFF" : colors.text }]}>
            Add Category
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab("product")}
          style={[
            styles.tabButton,
            {
              backgroundColor: activeTab === "product" ? colors.primary : "transparent",
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.tabText, { color: activeTab === "product" ? "#FFF" : colors.text }]}>
            Add Product
          </Text>
        </TouchableOpacity>
      </View>

      {/* Image Picker */}
      <TouchableOpacity style={styles.imagePicker} onPress={pickAndUploadImage}>
        {uploading ? (
          <ActivityIndicator color={colors.primary} />
        ) : imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Text style={{ color: colors.text }}>📷 Pick & Upload Image</Text>
        )}
      </TouchableOpacity>

      {/* Category Form */}
      {activeTab === "category" && (
        <View>
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            placeholder="Category Name"
            placeholderTextColor="#999"
            value={categoryName}
            onChangeText={setCategoryName}
          />
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: colors.primary }]}
            onPress={handleAddCategory}
          >
            <Text style={styles.submitText}>Add Category</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Product Form */}
      {activeTab === "product" && (
        <View>
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            placeholder="Product Name"
            placeholderTextColor="#999"
            value={productName}
            onChangeText={setProductName}
          />
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            placeholder="Price"
            keyboardType="numeric"
            placeholderTextColor="#999"
            value={productPrice}
            onChangeText={setProductPrice}
          />

          {/* Category Dropdown */}
          {loadingCategories ? (
            <ActivityIndicator color={colors.primary} style={{ marginVertical: 10 }} />
          ) : (
            <View style={[styles.pickerContainer, { borderColor: colors.border }]}>
              <Picker
                selectedValue={selectedCategoryId}
                onValueChange={(value) => setSelectedCategoryId(value)}
                style={{ color: colors.text }}
              >
                <Picker.Item label="Select Category" value="" />
                {categories.map((cat) => (
                  <Picker.Item key={cat._id} label={cat.name} value={cat._id} />
                ))}
              </Picker>
            </View>
          )}

          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            placeholder="Sub Category"
            placeholderTextColor="#999"
            value={subCategory}
            onChangeText={setSubCategory}
          />

          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            placeholder="Weight (e.g., ~150 gr / piece)"
            placeholderTextColor="#999"
            value={productWeight}
            onChangeText={setProductWeight}
          />

          <TextInput
            style={[
              styles.input,
              styles.descriptionInput,
              { borderColor: colors.border, color: colors.text },
            ]}
            placeholder="Product Description"
            placeholderTextColor="#999"
            value={productDescription}
            onChangeText={setProductDescription}
            multiline
          />

          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: colors.primary }]}
            onPress={handleAddProduct}
          >
            <Text style={styles.submitText}>Add Product</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

export default AddItemsScreen;

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  tabContainer: { flexDirection: "row", justifyContent: "space-around", marginBottom: 20 },
  tabButton: {
    flex: 1,
    marginHorizontal: 5,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    padding: 10,
  },
  tabText: { fontSize: 16, fontWeight: "600" },
  imagePicker: {
    height: 150,
    borderWidth: 1,
    borderRadius: 10,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  image: { width: "100%", height: "100%", borderRadius: 10 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 12,
    overflow: "hidden",
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: "top",
  },
  submitButton: { marginTop: 10, padding: 15, borderRadius: 10, alignItems: "center" },
  submitText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
});
