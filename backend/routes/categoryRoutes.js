import express from "express";
import {
  addCategory,
  getCategories,
  getCategoryById,
  deleteCategoryById,
} from "../controller/categoryController.js";

const router = express.Router();

router.post("/", addCategory);          
router.get("/", getCategories);         
router.get("/:id", getCategoryById);   
router.delete("/:id", deleteCategoryById); 

export default router;
