const express = require("express");
const { getAlluser, signup, getSingleUser, login, updateUser, deleteUser } = require("../controller/usercontroller");
const Route = express.Router();
const mainmiddleware=require("../middleware/mainmiddleware");
const usermiddleware=require("../middleware/usermiddleware");
const adminmiddleware=require("../middleware/adminmiddleware");

Route.get("/users", mainmiddleware,adminmiddleware, getAlluser);
Route.post("/add",signup);
Route.post("/login", login);
Route.get("/users/:id",mainmiddleware, getSingleUser);
Route.put("/users/update/:id", mainmiddleware, updateUser)
Route.delete("/delete/:id",mainmiddleware , deleteUser);
module.exports = Route;