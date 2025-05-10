import express from 'express';
import { addProduct, getProducts, deleteProduct, updateProduct, getProductById } from '../controllers/product.controllers.js';
// import Product from '../models/product.model.js';

const router = express.Router();

// @route   POST /api/products
// @desc    Add a new product
router.post("/", addProduct);

// @route   GET /api/products
// @desc    Get all products
router.get("/", getProducts);

// @route   DELETE /api/products/:id
// @desc    Delete a product by ID
router.delete("/:id", deleteProduct);

// @route   PUT /api/products/:id
// @desc    Update a product by ID
router.put("/:id", updateProduct);

router.get('/:id', getProductById);

export default router;

