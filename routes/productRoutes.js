// routes/product.routes.js
import express from 'express';
import {
  getProducts,
  addProduct,
  deleteProduct,
  updateProduct,
  getProductById
} from '../controllers/product.controllers.js';
import { verifyToken } from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.get('/', getProducts);
router.post("/", verifyToken, upload.single("imageFile"), addProduct);
router.get('/:id', getProductById);
router.put('/:id', verifyToken, upload.single("imageFile"), updateProduct);
router.delete('/:id', verifyToken, deleteProduct);

export default router;
