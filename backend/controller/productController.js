import * as productService from "../services/productService.js";

// ✅ Filter products
export const filterProducts = async (req, res) => {
  try {
    const products = await productService.filterProducts(req.query);
    res.json(products);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// ✅ Get single product
export const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// ✅ Add product
export const addProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      categoryId,
      image,
      mainCategory,
      subCategory,
      description,
      weight,
    } = req.body;

    const result = await productService.addProduct({
      name,
      price,
      categoryId,
      image,
      mainCategory,
      subCategory,
      description, // ✅ include description
      weight,      // ✅ include weight
    });

    res.status(201).json({
      product: result.product,
      notification: { success: true, fcmMessageId: result.fcmMessageId },
    });
  } catch (err) {
    console.error("❌ Add Product Error:", err);
    res.status(400).json({ message: err.message });
  }
};

// ✅ Delete single product
export const deleteProductById = async (req, res) => {
  try {
    const product = await productService.deleteProductById(req.params.id);
    res.json({ message: "Product deleted successfully", product });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// ✅ Delete all products
export const deleteAllProducts = async (req, res) => {
  try {
    await productService.deleteAllProducts();
    res.json({ message: "All products deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
