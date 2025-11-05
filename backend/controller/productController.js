import * as productService from "../services/productService.js";

// ✅ Filter products
export const filterProducts = async (req, res) => {
  try {
    const products = await productService.filterProducts(req.query);
    res.status(200).json(products);
  } catch (err) {
    console.error("❌ Filter Error:", err);
    res.status(500).json({ message: "Failed to filter products", error: err.message });
  }
};

// ✅ Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    console.error("❌ Get Product Error:", err);
    res.status(404).json({ message: err.message });
  }
};

// ✅ Add new product
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

    // ✅ Basic validation to avoid crashes
    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    const result = await productService.addProduct({
      name,
      price,
      categoryId: categoryId || null,  // optional
      image: image || "",              // fallback empty string
      mainCategory: mainCategory || "General",
      subCategory: subCategory || "Default",
      description: description || "No description provided",
      weight: weight || "N/A",
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: result.product,
      notification: {
        success: true,
        expo: result.notificationResponse || null,
      },
    });
  } catch (err) {
    console.error("❌ Add Product Error:", err);
    res.status(500).json({ message: "Failed to add product", error: err.message });
  }
};

// ✅ Delete single product
export const deleteProductById = async (req, res) => {
  try {
    const product = await productService.deleteProductById(req.params.id);
    res.status(200).json({
      message: "Product deleted successfully",
      deletedProduct: product,
    });
  } catch (err) {
    console.error("❌ Delete Product Error:", err);
    res.status(404).json({ message: err.message });
  }
};

// ✅ Delete all products
export const deleteAllProducts = async (req, res) => {
  try {
    await productService.deleteAllProducts();
    res.status(200).json({ message: "All products deleted successfully" });
  } catch (err) {
    console.error("❌ Delete All Products Error:", err);
    res.status(500).json({ message: "Failed to delete all products", error: err.message });
  }
};
