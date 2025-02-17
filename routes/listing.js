const express = require("express");
const router = express.Router();

const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});


const listingController = require("../contollers/listings.js");

const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

/*Accquiring the Listing model */
const Listing = require("../models/listing.js");


/*Accquiring an wrapAsync function. */
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");




//Index Route and Create Route

router.route("/")
.get( wrapAsync(listingController.index))
 .post( isLoggedIn,upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListing));
 
 //Search Route
 router.post("/search",upload.none(),wrapAsync(listingController.showSearchResult));



//Category Route
router.get("/category/:categoryValue",wrapAsync(listingController.showCategroyListing));



//New Route
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));


//Update Route and Delete Route
router.route("/:id")
.put( isLoggedIn, wrapAsync(isOwner),upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))
.delete( isLoggedIn, wrapAsync(isOwner), wrapAsync(listingController.destroy));





//Show Route
router.get("/:id/show", wrapAsync(listingController.showListing));


//Edit Route
router.get("/:id/edit", isLoggedIn, wrapAsync(isOwner), wrapAsync(listingController.renderEditForm));

module.exports = router;
