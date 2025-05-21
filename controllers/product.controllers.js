import mongoose from "mongoose";
import Product from "../models/product.model.js";
import path from "path";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const addProduct = async (req, res) => {
  try {
    const { name, price, imageUrl } = req.body;

    let imagePath = "";

    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    if (req.file) {
      imagePath = `${process.env.VITE_API_BASE_URL}/uploads/${req.file.filename}`;
    } else if (imageUrl) {
      imagePath = imageUrl;
    } else {
      return res.status(400).json({ message: "Image file or URL is required" });
    }

    const newProduct = new Product({ name, price, image: imagePath });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully", deletedProduct });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { name, price, image } = req.body;
    const productId = req.params.id;
    console.log(productId);

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { name, price, image },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product updated successfully", updatedProduct });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
