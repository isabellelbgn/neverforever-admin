const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const upload = require("../config/multerConfig");

router.get("/products", productController.getProducts);
router.get("/products/:id", productController.getProductById);
router.post("/products", productController.addProduct);
router.put("/products/update/:id", productController.updateProduct);
router.delete("/products/:id", productController.deleteProduct);

router.post(
  "/products/add/upload",
  upload.array("file", 5),
  productController.uploadProductImages
);
router.delete("/images/:filename", productController.deleteProductImage);

module.exports = router;
