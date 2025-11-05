import { useTheme } from "@/assets/context/ThemeContext";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// ✅ Backend API Base URL
const API_BASE = "http://192.168.18.73:5000/api";

// ✅ Cloudinary Credentials
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/duqffmi9a/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "Delivery_App";

const AddItemsScreen: React.FC = () => {
  const { colors } = useTheme();

  const [activeTab, setActiveTab] = useState<"category" | "product">("category");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Category
  const [categoryName, setCategoryName] = useState("");

  // Product
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [productWeight, setProductWeight] = useState("");
  const [productDescription, setProductDescription] = useState("");

  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // ✅ Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_BASE}/categories`);
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        Alert.alert("Error", "Failed to fetch categories.");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // ✅ Pick and Upload Image to Cloudinary
  const pickAndUploadImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Please allow access to photos.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled || !result.assets?.length) {
        Alert.alert("No image selected");
        return;
      }

      let uri = result.assets[0].uri;

      // ✅ Fix Android "content://" URI
      if (Platform.OS === "android" && uri.startsWith("content://")) {
       const FS: any = FileSystem;
          const cacheDir = FS.documentDirectory;
          const fileUri = `${cacheDir}temp_${Date.now()}.jpg`;
          await FS.copyAsync({ from: uri, to: fileUri });
          uri = fileUri;
      }
      const uploadedUrl = await uploadToCloudinary(uri);
      if (uploadedUrl) {
        setImageUri(uploadedUrl);
        Alert.alert("✅ Image Uploaded!", "Image hosted on Cloudinary");
      }
    } catch (err) {
      console.error("Image upload error:", err);
      Alert.alert("Error", "Failed to pick or upload image.");
    }
  };

  // ✅ Upload to Cloudinary
  const uploadToCloudinary = async (uri: string): Promise<string | null> => {
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
      Alert.alert("Upload Failed", "Could not upload image to Cloudinary.");
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
      await axios.post(`${API_BASE}/categories`, {
        name: categoryName,
        image: imageUri,
      });

      Alert.alert("✅ Success", "Category added successfully!");
      setCategoryName("");
      setImageUri(null);
    } catch (err) {
      console.error("Add Category Error:", err);
      Alert.alert("Error", "Failed to add category.");
    }
  };

  // ✅ Add Product
  const handleAddProduct = async () => {
  
    if (!productName || !productPrice || !categoryId || !subCategory || !imageUri) {
      Alert.alert("Missing Fields", "Please complete all fields and upload an image.");
      return;
    }
    console.log("🧾 Product data being sent:", {
      name: productName,
      price: productPrice,
      categoryId,
      image: imageUri,
      mainCategory: "General",
      subCategory,
      weight: productWeight,
      description: productDescription,
    });

    try {
      await axios.post(`${API_BASE}/products`, {
        name: productName,
        price: productPrice,
        categoryId, // ✅ Correct key expected by backend
        image: imageUri,
        mainCategory: "General", // ✅ optional field — you can change as needed
        subCategory,
         weight: productWeight || "N/A",
          description: productDescription || "No description provided.",
      });

      Alert.alert("✅ Success", "Product added successfully!");
      setProductName("");
      setProductPrice("");
      setCategoryId("");
      setSubCategory("");
      setProductWeight("");
      setProductDescription("");
      setImageUri(null);
    } catch (err: any) {
      console.error("Error adding product:", err.response?.data || err);
      Alert.alert("Error", err.response?.data?.message || "Failed to add product.");
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* 🔹 Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => setActiveTab("category")}
          style={[
            styles.tabButton,
            { backgroundColor: activeTab === "category" ? colors.primary : "transparent", borderColor: colors.border },
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
            { backgroundColor: activeTab === "product" ? colors.primary : "transparent", borderColor: colors.border },
          ]}
        >
          <Text style={[styles.tabText, { color: activeTab === "product" ? "#FFF" : colors.text }]}>
            Add Product
          </Text>
        </TouchableOpacity>
      </View>

      {/* 🔹 Image Picker */}
      <TouchableOpacity style={styles.imagePicker} onPress={pickAndUploadImage}>
        {uploading ? (
          <ActivityIndicator color={colors.primary} />
        ) : imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Text style={{ color: colors.text }}>📷 Pick & Upload Image</Text>
        )}
      </TouchableOpacity>

      {/* 🔹 Category Form */}
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

      {/* 🔹 Product Form */}
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

          {loadingCategories ? (
            <ActivityIndicator color={colors.primary} style={{ marginVertical: 10 }} />
          ) : (
            <View style={[styles.pickerContainer, { borderColor: colors.border }]}>
              <Picker selectedValue={categoryId} onValueChange={(v) => setCategoryId(v)} style={{ color: colors.text }}>
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
            placeholder="Weight (e.g., 1kg, 500g)"
            placeholderTextColor="#999"
            value={productWeight}
            onChangeText={setProductWeight}
          />

          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text, height: 100 }]}
            placeholder="Product Description"
            placeholderTextColor="#999"
            value={productDescription}
            multiline
            onChangeText={setProductDescription}
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

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  tabContainer: { flexDirection: "row", justifyContent: "space-around", marginBottom: 20 },
  tabButton: { flex: 1, marginHorizontal: 5, borderWidth: 1, borderRadius: 8, alignItems: "center", padding: 10 },
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
  input: { borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 16, marginBottom: 12 },
  pickerContainer: { borderWidth: 1, borderRadius: 10, marginBottom: 12, overflow: "hidden" },
  submitButton: { marginTop: 10, padding: 15, borderRadius: 10, alignItems: "center" },
  submitText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
});
