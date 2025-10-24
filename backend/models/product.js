import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  price: String,
  image: String,
  mainCategory: String,   // e.g., "Fruits & Vegetables"
  subCategory: String,    // e.g., "Cabbage and lettuce"
});

export default mongoose.model("Product", productSchema);