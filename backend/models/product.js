import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, default: "" },

  // ✅ This creates a proper relationship between Product and Category
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },

  mainCategory: { type: String },
  subCategory: { type: String },
  description: { type: String, default: "No description available." }, // ✅ New field
  weight: { type: String, default: "N/A" }, // ✅ New field
});

export default mongoose.model("Product", productSchema);
