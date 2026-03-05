// http://localhost:5000/api

// /users/

// post, get, put , delete

// https://join.skype.com/JS2KDL5A0Xr2

const express = require("express");

const route = express.Router();

const UserController = require("../controllers/UserConroller");

const upload = require("../middlewares/upload");

const isauth = require("../middlewares/isauth");

const isadmin = require("../middlewares/isAdmin");

//create user public route
route.post("/createuser", isauth, isadmin, UserController.createuser);

route.post("/createFournisseur", isauth, isadmin, UserController.createFournisseur);
route.delete("/deleteFournisseur/:id", isauth, isadmin, UserController.deleteFournisseur);
route.get("/getAllFournisseurs", isauth, UserController.getAllFournisseur);
route.get("/getFournisseur/:id", isauth, UserController.getFournisseurById);
route.put("/updateFournisseur/:id", isauth, isadmin, UserController.updateFournisseur);

//get user by id private route
route.get("/me", isauth, UserController.getuserbyid);
route.get("/get/:id", isauth, UserController.getuserbyidparam);
// upadte user by id
route.put("/update/:id", isauth, isadmin, UserController.updateuser);
//delete user
route.delete("/delete/:id", isauth, isadmin, UserController.deleteuser);
//get all users
route.get("/", isauth, isadmin, UserController.getallusers);
//authenticate user public route
route.post("/login", UserController.authenticate);
route.post("/forgot-password", UserController.forgotPassword);
route.post("/forgot-password/request", UserController.requestPasswordReset);
route.post("/forgot-password/resend", UserController.resendPasswordResetOtp);
route.post("/forgot-password/verify", UserController.verifyPasswordResetOtp);
route.post("/forgot-password/reset", UserController.resetPasswordWithOtp);
//upload avatar
route.put("/uploadavatar", isauth, upload.single("avatar"), UserController.uploadavatar);

module.exports = route;

// create admin et client => amin etcleint avec password crypted
// authenticate api users/login (admin,client)
//consomer delete user api
