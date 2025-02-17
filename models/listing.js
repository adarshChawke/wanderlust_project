const mongoose = require("mongoose");
const Schema = mongoose.Schema;// So basically here we are assigning the mongoose.Schema function into the variable Schema
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "review"//Always mention the collection name which you mention while declaring the model of that shcema.
        }
    ],

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"//Always mention the collection name which you mention while declaring the model of that shcema.
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],// Don't do '{ location: { type:String } }' 
            required: true,// geometry.type ' must be 'Point' 
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    category:{
        type:String,
        enum:['Arctic','Farms','Mountains','Villas','Camping','Beaches','Castles','Rooms','Trending','Boat','Domes'],
        required:true,
    },
});

listingSchema.post("findOneAndDelete", async (deletedListing) => {//deletedListing is actually that listing which was get deleted in the mention query operation this listing is passed as an arguement inside the callback function of the post middleware.
    if (deletedListing) {
        await Review.deleteMany({ _id: { $in: deletedListing.reviews } });
    }
})

//Creating a Model(Class) from the listingSchema
const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;