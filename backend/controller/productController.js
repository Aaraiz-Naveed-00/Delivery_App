import * as productService from "../services/productService.js";

// ✅ Filter products (by category, subCategory, etc.)
export const filterProducts = async (req, res) => {
  try {
    const products = await productService.filterProducts(req.query);

    if (!products.length) {
      return res.status(200).json([]); // return empty list instead of error
    }

    res.status(200).json(products);
  } catch (err) {
    console.error("Error filtering products:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Add new product
export const addProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      image,
      mainCategory,
      subCategory,
      description,
      weight,
    } = req.body;

    // Validate required fields
    if (!name || !price || !image || !mainCategory || !subCategory || !weight) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields." });
    }

    // Default description if not provided
    const finalDescription =
      description?.trim() || "There is no description for this product.";

    const newProductData = {
      name,
      price,
      image,
      mainCategory,
      subCategory,
      weight,
      description: finalDescription,
    };

    const result = await productService.addProduct(newProductData);

    res.status(201).json({
      product: result.product,
      notification: result.fcmMessageId
        ? { success: true, fcmMessageId: result.fcmMessageId }
        : null,
    });
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(400).json({ message: err.message });
  }
};

// ✅ Delete single product
export const deleteProductById = async (req, res) => {
  try {
    const product = await productService.deleteProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res
      .status(200)
      .json({ message: "Product deleted successfully", product });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Delete all products
export const deleteAllProducts = async (req, res) => {
  try {
    await productService.deleteAllProducts();
    res.status(200).json({ message: "All products deleted successfully" });
  } catch (err) {
    console.error("Error deleting all products:", err);
    res.status(500).json({ message: err.message });
  }
};
