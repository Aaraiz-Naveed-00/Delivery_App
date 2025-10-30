import Product from "../models/product.js";
import { sendNotificationToTopic } from "./fcmService.js";

// ✅ Filter products (supports categoryId, mainCategory, subCategory, search)
export const filterProducts = async ({ categoryId, mainCategory, subCategory, search }) => {
  const query = {};

  // 🔹 Filter by MongoDB ObjectId of category
  if (categoryId) query.categoryId = categoryId;

  // 🔹 Optional filters
  if (mainCategory) query.mainCategory = mainCategory;
  if (subCategory) query.subCategory = subCategory;

  // 🔹 Name-based search
  if (search) query.name = { $regex: search, $options: "i" };

  // ✅ Fetch & populate category name for reference
  const products = await Product.find(query).populate("categoryId", "name");
  return products; // Return empty [] if no match
};

// ✅ Get single product by ID
export const getProductById = async (id) => {
  const product = await Product.findById(id).populate("categoryId", "name");
  if (!product) throw new Error("Product not found");
  return product;
};

// ✅ Add new product + send FCM notification
export const addProduct = async (productData) => {
  // Destructure for clarity and ensure defaults
  const {
    name,
    price,
    image,
    mainCategory,
    subCategory,
    description = "There is no description for this product.",
    weight = "N/A",
    categoryId,
  } = productData;

  // Basic validation
  if (!name || !price) throw new Error("Name and price are required");

  // Create and save product
  const product = new Product({
    name,
    price,
    image,
    mainCategory,
    subCategory,
    description,
    weight,
    categoryId,
  });

  await product.save();

  // Send FCM notification (optional)
  const fcmMessageId = await sendNotificationToTopic(
    "🆕 New Product Added!",
    `${product.name} has been added to the store.`
  );

  return { product, fcmMessageId };
};

// ✅ Delete single product
export const deleteProductById = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new Error("Product not found");
  return product;
};

// ✅ Delete all products
export const deleteAllProducts = async () => {
  await Product.deleteMany();
  return true;
};