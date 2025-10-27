import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  type: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  image: { type: String, default: "" }, // ✅ New optional field
});

export default mongoose.model("Category", categorySchema);