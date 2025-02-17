const mongoose = require("mongoose");
const initData = require("./data.js"); // Here we are accquiring the exported object in which the key data is referencing to the array sampelListings which carry all the data for the listings

const Listing = require("../models/listing.js");// Here we are accquiring the exported Model (class) from the listing.js

const Mongo_URL = "mongodb://127.0.0.1:27017/wanderlust"

async function main() {
    await mongoose.connect(Mongo_URL);
};

main()
    .then((res) => {
        console.log("Connected to DB");
        console.log(res);
    })
    .catch((err) => {
        console.log(err);
    });


const initDB = async () => {
    await Listing.deleteMany({});
   initData.data= initData.data.map((objElement)=>({...objElement,owner:'679e1211e473583b470ed31c'}))
    await Listing.insertMany(initData.data);
    console.log("Data was intialized.")
}

initDB();// calling the initDB function