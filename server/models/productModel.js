const dbConnection = require("../config/db");

// Fetch all products
const getAllProducts = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM product";
    dbConnection.query(sql, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

// Fetch a product by id
const getProductById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM product WHERE `product_id` = ?";
    dbConnection.query(sql, [id], (err, data) => {
      if (err) reject(err);
      if (data.length === 0) reject("Product not found");
      resolve(data[0]);
    });
  });
};

// Add a new product
const addProduct = (product) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO product (
        product_name,
        product_jewelryTone,
        product_description,
        product_category_id_fk,
        product_supplierPrice,
        product_unitPrice,
        product_availabilityStatus,
        product_image,
        product_createdAt,
        supplier_id_fk,
        product_discount_id_fk
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      product.product_name,
      product.product_jewelryTone,
      product.product_description,
      product.product_category_id_fk,
      product.product_supplierPrice,
      product.product_unitPrice,
      product.product_availabilityStatus,
      product.productImages,
      product.product_createdAt,
      product.supplier_id_fk,
      product.product_discount_id_fk || null,
    ];

    dbConnection.query(sql, values, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

// Update a product
const updateProduct = (id, product) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE product
      SET
        product_name = ?,
        product_jewelryTone = ?,
        product_image = ?,
        product_category_id_fk = ?,
        product_description = ?,
        product_unitPrice = ?,
        product_availabilityStatus = ?,
        product_createdAt = ?,
        supplier_id_fk = ?,
        product_discount_id_fk = ?
      WHERE product_id = ?`;

    const values = [
      product.productName,
      product.productJewelryTone,
      product.productImages,
      product.productCategoryId,
      product.productDescription,
      product.productUnitPrice,
      product.productAvailabilityStatus,
      product.productCreatedAt,
      product.supplierId,
      product.productDiscountId,
      id,
    ];

    dbConnection.query(sql, values, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

// Delete a product
const deleteProduct = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM product WHERE `product_id` = ?";
    dbConnection.query(sql, [id], (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

// Upload images for a product
const uploadImages = (files) => {
  return new Promise((resolve, reject) => {
    if (!files || files.length === 0) {
      reject("No files uploaded");
    }
    const uploadedImages = files.map((file) => file.filename);
    resolve(uploadedImages);
  });
};

// Delete images for a product
const deleteImage = (filename) => {
  return new Promise((resolve, reject) => {
    const imagePath = path.join(__dirname, "public/images", filename);
    fs.unlink(imagePath, (err) => {
      if (err) reject("Error deleting image");
      resolve("Image deleted successfully");
    });
  });
};

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  uploadImages,
  deleteImage,
};
