import express from "express";
import * as productController from "../controller/productController.js";

const router = express.Router();

/**
 * @route   GET /api/products/filter
 * @desc    Get all products or filter by mainCategoryId, subCategoryId, or search
 * @query   ?categoryId=ObjectId | ?subCategory=string | ?search=string
 */
router.get("/filter", productController.filterProducts);

/**
 * @route   GET /api/products/id/:id
 * @desc    Get a single product by its MongoDB ID
 */
router.get("/id/:id", productController.getProductById);

/**
 * @route   POST /api/products
 * @desc    Add a new product
 */
router.post("/", productController.addProduct);

/**
 * @route   DELETE /api/products/id/:id
 * @desc    Delete a single product by its MongoDB ID
 */
router.delete("/id/:id", productController.deleteProductById);

/**
 * @route   DELETE /api/products
 * @desc    Delete all products
 */
router.delete("/", productController.deleteAllProducts);

export default router;
