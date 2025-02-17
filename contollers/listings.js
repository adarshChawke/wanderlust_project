
const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const ExpressError = require("../utils/ExpressError");
const mapToken = process.env.MAP_TOKEN;

const geocodingClient = mbxGeocoding({ accessToken: mapToken });//This returns an mapbox in the form of object which allows us to do geocoding i.e. basically it returns the object



module.exports.index = async (req, res, next) => {

    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });


};

module.exports.showListing = async (req, res, next) => {

    let { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author",
        }
    }).populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    else {
        // console.log(listing);
        res.render("listings/show.ejs", { listing });
    }


};

module.exports.renderNewForm = async (req, res) => {

    res.render("listings/new.ejs");

};

module.exports.createListing = async (req, res, next) => {

    let responseCoordinatae = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1// By default it can send us 5 different coordinates pair of longitude and latitude
    })
    .send();


    let url = req.file.path;

    let filename = req.file.filename;

    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send Valid data for listing.");
    // }

    //In HTML, using the `name` attribute in the format `object[key]` will create an object inside the `req.body` object. This created object will contain the specified `key` properties with their respective values.
    let listing = req.body.listing;//we are assigning the nested listing obeject inside the req.body object to the reference variable listing.

    const newListing = new Listing(listing);

    newListing.owner = req.user._id;

    newListing.image = { url, filename };

    newListing.geometry= responseCoordinatae.body.features[0].geometry;

    let savedListing = await newListing.save();

    console.log(savedListing);

    req.flash("success", "New Listing Created!");

    res.redirect("/listings");

};


module.exports.renderEditForm = async (req, res, next) => {

    let { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    else {
        let orignalImageUrl = listing.image.url;
        orignalImageUrl = orignalImageUrl.replace("/upload", "/upload/w_250");//this method retures a new string with the changed value

        res.render("listings/edit.ejs", { listing, orignalImageUrl });
    }

};


module.exports.updateListing = async (req, res, next) => {

    // if (!req.body.listing) {
    //     throw new ExpressError(400, "Send Valid data for listing.");
    // }
    let { id } = req.params;


    const listing = req.body.listing;//we are assigning the nested listing obeject inside the req.body object to the reference variable listing.


    /*Getting the coordinates*/
    let responseCoordinatae = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1// By default it can send us 5 different coordinates pair of longitude and latitude
    })
    .send();

    listing.geometry=responseCoordinatae.body.features[0].geometry; 

    let updatedListing = await Listing.findByIdAndUpdate(id, { ...listing });//Here we are deconstructing the listing object and all its key and value are assigning to the new object which is passsed as a second argument in this function or method.

    /*Updating the image if the new image is being provided. */
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;

        updatedListing.image = { url, filename };

        await updatedListing.save();
    }

    req.flash("success", "Listing Updated!");

    res.redirect(`/listings/${id}/show`);
};


module.exports.destroy = async (req, res, next) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);

    /*Here the try and catch block is used to handle the error which can be cause while searching in the database.*/

    req.flash("success", "Listing Deleted!");

    res.redirect("/listings");
};

module.exports.showCategroyListing=async(req,res,next)=>{
    let {categoryValue}=req.params;

    let categoryListings=await Listing.find({category:categoryValue});// If there is no lisiting available for the category value it returns an empty array

    if(categoryListings.length){
res.render("listings/category.ejs",{categoryValue,categoryListings});
    }else{
        throw new ExpressError(404,"Sorry, no Airbnbs are available for your selected category at the moment. You can use the Explore or Search option to find other Airbnb.");
    }

};

module.exports.showSearchResult=async(req,res,next)=>{
    let {searchedDestination}=req.body;

    let foundListings=await Listing.find({
        $or:[
            {title:{$regex:searchedDestination,$options:'i'}},
            {location:{$regex:searchedDestination,$options:'i'}},
            {country:{$regex:searchedDestination,$options:'i'}}]});

    if(foundListings.length){
        res.render("listings/searchResult.ejs",{foundListings,searchedDestination});
    }else{
        throw new ExpressError(404,"We're sorry, but there are currently no Airbnb listings available in the location you searched. Please try searching in a different area or check back later!");
    }


};