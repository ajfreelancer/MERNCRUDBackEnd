import mongoose from "mongoose";
import Product from "../models/product.model.js";
import path from "path";
import fs from "fs";
import { URL } from "url";

export const getProducts = async (req, res) => {
  try {
    const {
      search,
      page = 1,
      limit = 10,
      sort,
      minPrice,
      maxPrice,
    } = req.query;

    const query = {};

    // Search by name (case-insensitive)
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Sorting
    let sortOption = {};
    if (sort === "price_asc") sortOption.price = 1;
    else if (sort === "price_desc") sortOption.price = -1;
    else if (sort === "name_asc") sortOption.name = 1;
    else if (sort === "name_desc") sortOption.name = -1;
    else sortOption.createdAt = -1; // Default sort by newest

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(query).sort(sortOption).skip(skip).limit(Number(limit)),
      Product.countDocuments(query),
    ]);

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      products,
    });
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

    const imageUrl = deletedProduct.image;
    const localHosts = [
      "http://localhost:5000",
      "https://merncrudbackend-production-6be6.up.railway.app",
    ];

    if (imageUrl) {
      const isLocalImage = localHosts.some((host) => imageUrl.startsWith(host));

      if (isLocalImage) {
        const parsedUrl = new URL(imageUrl);
        const filename = path.basename(parsedUrl.pathname); // just the file name

        const imagePath = path.join(process.cwd(), "uploads", filename); // fixed path

        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Failed to delete image file:", err.message);
          }
        });
      }
    }

    res.json({ message: "Product deleted successfully", deletedProduct });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { name, price, imageUrl } = req.body;
    const productId = req.params.id;

    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    let imagePath = req.body.image; // fallback if nothing is provided

    if (req.file) {
      imagePath = `${process.env.VITE_API_BASE_URL}/uploads/${req.file.filename}`;
    } else if (imageUrl) {
      imagePath = imageUrl;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { name, price, image: imagePath },
      { new: true, runValidators: true }
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
