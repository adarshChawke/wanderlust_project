const Listing=require("./models/listing.js");
const Review=require("./models/review.js");

const ExpressError = require("./utils/ExpressError.js");
const { listingSchema,reviewSchema } = require("./schema.js");



module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create listing!");
        return res.redirect("/users/login");// Here we can also instead of creating the below
        //  else block we can simply write return here and the below code is without 
        // the else block
    }

    next();
};


module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next();
};


module.exports.isOwner=async(req,res,next)=>{
    let { id } = req.params;

    let listingFound = await Listing.findById(id);
    
    if(!listingFound.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of the listing ");
       return res.redirect(`/listings/${id}/show`);
    }

    next();
};



/*Listing Schema Validation middleware with the help of Joi */
module.exports.validateListing= (req, res, next) => {


    let schemaValidationResult = listingSchema.validate(req.body);
    console.log(schemaValidationResult);
    /*"On calling the validate function of the Joi schema object, it returns a 
    result object. If the error key in this object contains a message, it indicates 
    that there is a schema validation error."*/
    if (schemaValidationResult.error) {
        let errMsg = schemaValidationResult.error.details.map((el) => el.message).join(",");/*The map() function in JavaScript is used to create a new array by applying a callback function to each element of an existing array.*/

        throw new ExpressError(400, errMsg);
    }
    else {
        next();
    }
};


/*Review Schema Validation middleware with the help of Joi */
module.exports.validateReview = (req, res, next) => {
    let reviewValidationResult = reviewSchema.validate(req.body);
    // console.log(reviewValidationResult);

    if (reviewValidationResult.error) {
        let errMessage = reviewValidationResult.error.details.map((el) => { el.message }).join(",");
        throw new ExpressError(400, reviewValidationResult.error)
    }
    else {
        next();
    }
};


module.exports.isReviewAuthor=async(req,res,next)=>{
    let { id,reviewID } = req.params;

    let reviewFound= await Review.findById(reviewID);

    console.log(reviewFound);

    if(!reviewFound.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of the review ");
       return res.redirect(`/listings/${id}/show`);
    }

    next();
};
