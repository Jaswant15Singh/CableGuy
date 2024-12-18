const express = require("express");
const Route = express.Router();
const { getAdmin, signupadmin, adminLogin, getSingleAdmin, updateAdmin, deleteAdmin, createProduct, createBatch, getProdBatch, getSupplier, addSupplier, prodBySupplier, placeOrder, getProducts, createProductsWithBatch, getIndProd, addIndProduct, orderHistory, getReceiptRecord } = require("../controller/admincontroller");
const mainmiddleware = require("../middleware/mainmiddleware");
const adminmiddleware = require("../middleware/adminmiddleware");
const { upload,uploads, multipleUpload } = require("../controller/admincontroller")
const usermiddleware = require("../middleware/usermiddleware")
Route.get("/admin", mainmiddleware, adminmiddleware, getAdmin);
Route.post("/signupadmin", mainmiddleware, adminmiddleware, signupadmin);
Route.post("/loginadmin", adminLogin);
Route.get("/admin/:id", mainmiddleware, adminmiddleware, getSingleAdmin);
Route.put("/admin/update/:id", mainmiddleware, adminmiddleware, updateAdmin);
Route.delete("/admin/delete/:id", mainmiddleware, adminmiddleware, deleteAdmin);
Route.post("/product/add", mainmiddleware, adminmiddleware, createProduct);
Route.get("/products", mainmiddleware, getProducts);
Route.get("/indproducts", mainmiddleware, adminmiddleware, getIndProd);
Route.post("/indproducts/add", uploads.single('image'), addIndProduct);
Route.post("/batch/add", mainmiddleware, adminmiddleware, createBatch);
Route.get("/product/batch", getProdBatch);
Route.get("/supplier", mainmiddleware, adminmiddleware, getSupplier);
Route.post("/supplier/add", mainmiddleware, adminmiddleware, addSupplier);
Route.get("/supplier/prod", mainmiddleware, adminmiddleware, prodBySupplier);
Route.post("/cr", multipleUpload, createProductsWithBatch)
Route.post("/placeorder", placeOrder);;
Route.post("/orderhistory", orderHistory);
Route.post("/receipt", getReceiptRecord)
module.exports = Route;