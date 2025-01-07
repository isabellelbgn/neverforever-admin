const Product = require("../models/productModel");

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.getAllProducts();
    res.json(products);
  } catch (err) {
    console.error("Error querying the database:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get a product by id
const getProductById = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Product.getProductById(productId);
    res.json(product);
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Add a new product
const addProduct = async (req, res) => {
  const product = req.body;
  try {
    const result = await Product.addProduct(product);
    res.json({ message: "Product and images added successfully" });
  } catch (err) {
    console.error("Error inserting product into the database:", err);
    res.status(500).json({ message: "Error" });
  }
};

// Update a product
const updateProduct = async (req, res) => {
  const productId = req.params.id;
  const product = req.body;
  try {
    await Product.updateProduct(productId, product);
    res.json("Product has been updated successfully.");
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    await Product.deleteProduct(productId);
    res.json("Product has been deleted successfully.");
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Upload product images
const uploadProductImages = async (req, res) => {
  try {
    const uploadedImages = await Product.uploadImages(req.files);
    res.json({ message: "Images uploaded", images: uploadedImages });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

// Delete product images
const deleteProductImage = async (req, res) => {
  const filename = req.params.filename;
  try {
    await Product.deleteImage(filename);
    res.json({ message: "Image deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

module.exports = {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  deleteProductImage,
};
