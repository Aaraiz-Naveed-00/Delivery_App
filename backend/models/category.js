import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, default: "" }, // ✅ New optional field
});

export default mongoose.model("Category", categorySchema);