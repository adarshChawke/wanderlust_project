const express = require("express");
const router = express.Router({ mergeParams: true });

const reviewController = require("../contollers/reviews.js");




/*Accquiring an wrapAsync function. */
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");





/*Reviews*/

/*Post Review Route*/
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));


/*Delete Review Route */
router.delete("/:reviewID", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;