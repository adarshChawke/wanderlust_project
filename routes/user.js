const express = require("express");
const router = express.Router();
const passport=require("passport");
const User = require("../models/Users.js");

const userController=require("../contollers/users.js");

const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middleware.js");




router.route("/signup")
.get( wrapAsync(userController.renderSignUpForm))
.post( wrapAsync(userController.signUp));


router.route("/login")
.get(wrapAsync(userController.renderLogInForm))
.post(
    saveRedirectUrl,
    passport.authenticate("local",{
        failureRedirect:"/users/login", 
        failureFlash:true,
    }),
       userController.logIn);


router.get("/logout",userController.logOut);


module.exports = router;