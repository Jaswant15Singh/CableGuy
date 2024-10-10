const express = require("express");
const Route = express.Router();
const { getAdmin, signupadmin, adminLogin, getSingleAdmin, updateAdmin, deleteAdmin, createProduct, createBatch, getProdBatch, getSupplier, addSupplier, prodBySupplier, placeOrder, getProducts, createProductsWithBatch, getIndProd } = require("../controller/admincontroller");
const mainmiddleware=require("../middleware/mainmiddleware");
const adminmiddleware=require("../middleware/adminmiddleware");
Route.get("/admin", mainmiddleware,adminmiddleware, getAdmin);
Route.post("/signupadmin", mainmiddleware,adminmiddleware, signupadmin);
Route.post("/loginadmin", adminLogin);
Route.get("/admin/:id", mainmiddleware,adminmiddleware, getSingleAdmin);
Route.put("/admin/update/:id", mainmiddleware,adminmiddleware, updateAdmin);
Route.delete("/admin/delete/:id", mainmiddleware,adminmiddleware, deleteAdmin);
Route.post("/product/add",createProduct);
Route.get("/products",getProducts);
Route.get("/indproducts",getIndProd)
Route.post("/batch/add",createBatch);
Route.get("/product/batch",getProdBatch);
Route.get("/supplier",getSupplier);
Route.post("/supplier/add",addSupplier);
Route.get("/supplier/prod",prodBySupplier);
Route.post("/placeorder",placeOrder);
Route.post("/cr",createProductsWithBatch)
module.exports = Route;