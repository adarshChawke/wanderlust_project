const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const reviewSchema=new Schema({
    comment: String,
    rating: {
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default: Date.now()
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"//Always mention the collection name which you mention while declaring the model of that shcema.
    }
});

const Review=mongoose.model("review",reviewSchema);

module.exports=Review;