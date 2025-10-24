import Product from "../models/product.js";
import { sendNotificationToTopic } from "./fcmService.js";

// Get all or filtered products
export const filterProducts = async ({ mainCategory, subCategory, search }) => {
  const query = {};
  if (mainCategory) query.mainCategory = mainCategory;
  if (subCategory) query.subCategory = subCategory;
  if (search) query.name = { $regex: search, $options: "i" };
  return await Product.find(query);
};

// Get single product
export const getProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found");
  return product;
};

// Add product + send notification
export const addProduct = async (productData) => {
  const product = new Product(productData);
  await product.save();

  const fcmMessageId = await sendNotificationToTopic(
    "🆕 New Product Added!",
    `${product.name} has been added to the store.`
  );

  return { product, fcmMessageId };
};

// Delete single product
export const deleteProductById = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new Error("Product not found");
  return product;
};

// Delete all products
export const deleteAllProducts = async () => {
  await Product.deleteMany();
  return true;
};
