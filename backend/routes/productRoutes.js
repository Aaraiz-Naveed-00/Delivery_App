import express from "express";
import * as productController from "../controllers/productController.js";

const router = express.Router();

router.get("/", productController.filterProducts);
router.get("/:id", productController.getProductById);
router.post("/", productController.addProduct);
router.delete("/:id", productController.deleteProductById);
router.delete("/", productController.deleteAllProducts);

export default router;
