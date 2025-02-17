
/*Accquiring the Listing model and Review Model */
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");



module.exports.createReview = async (req, res, next) => {
    let { id } = req.params;
    // console.log(req.params.id);
    let listingFound = await Listing.findById(id);

    let reviewObj = req.body.review;
    let newReview = new Review(reviewObj);

    newReview.author = req.user._id;

    await newReview.save();

    listingFound.reviews.push(newReview);

    await listingFound.save();/*When we save an existing document in the database using 
.save() in Mongoose, the document gets updated with the latest changes made to its 
fields (i.e. the latest version of itself). This ensures that the modified version is persisted in the database.*/

    console.log("new review saved")

    req.flash("success", "New Review Created!");


    res.redirect(`/listings/${id}/show`);
};

module.exports.destroyReview = async (req, res, next) => {
    let { id, reviewID } = req.params;


    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewID } })
    let deletedResult = await Review.findByIdAndDelete(reviewID);


    req.flash("success", "Review Deleted!");

    res.redirect(`/listings/${id}/show`);
};