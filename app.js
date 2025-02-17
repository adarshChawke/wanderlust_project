if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

/*Accquring the express-session */
const session=require("express-session");

/*Accquring the connect-mongo */
const MongoStore=require("connect-mongo");


/*Accquring the express-session */
const flash=require("connect-flash");

/*Accquring the passport */
const passport=require("passport");
const LocalStrategy=require("passport-local");

const User=require("./models/Users.js");






/*Requiring the listing router object from the listing.js inside the routes folder. */
const listingsRouter=require("./routes/listing.js");


/*Requiring the review router object from the review.js inside the routes folder. */
const reviewsRouter=require("./routes/review.js");


/*Requiring the user router object from the user.js inside the routes folder. */
const usersRouter=require("./routes/user.js");

/*
EJS-Mate is used as a rendering engine(or ejs-mate file  rendering function  is used for rendering) for EJS files, replacing the default EJS renderer ( or default ejs renderer function) to provide additional features like layout and partial support.
*/
app.engine("ejs", ejsMate);
/*sets the view engine for .ejs files to use EJS-Mate instead of the default EJS renderer. This allows you to leverage the additional features provided by EJS-Mate, such as layout and partial support, for rendering your .ejs templates.
*/


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "/public")));

app.use(express.urlencoded({ extended: true }));/*
When this option is set to true, the query string library used is qs. This library allows for parsing nested objects, meaning it can handle complex and deeply nested objects in the request body.
*/


/*Creating or Settingup our Database */

const dbURL=process.env.ATLASDB_URL;

async function main() {
    await mongoose.connect(dbURL);
}

main()
    .then((res) => {
        console.log("connected to DB .")
        // console.log(res);
    })
    .catch((err) => {
        console.log(err);
    });


/* Starting the server which listens for the request on the mention port and provide response of that request to the client via that port. */
app.listen(8080, () => {
    console.log("server is listening to port 8080");
});



const store=MongoStore.create({
    mongoUrl:dbURL,
    crypto:{
    secret:process.env.SECRET,
},    
touchAfter:24*3600,

});

store.on("error",(err)=>{
    console.log("ERROR in MONGO SESSION STORE",err); 
})

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUnintialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,

    }
};

app.use(session(sessionOptions));
app.use(flash());

/*In order to implement the localStartegy we need session i.e. implementation of the session object. */
app.use(passport.initialize());

app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



/* The below code is only for test and for actual application.
app.get("/testListing",async(req,res)=>{

    let sampleListing=new Listing({
        title:"My Home New Villa",
        description:'by the beach',
        price:1200,
        location:"Andman and Nicobar",
        country:"India"
    })

 await sampleListing.save();
    console.log("sample was saved");
    res.send("successful testing");

    });

*/



app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    
    res.locals.error=req.flash("error");

    res.locals.currUser=req.user;
    
    next();
});



/*Setting the Route Handler for the listings. */
app.use("/listings",listingsRouter);



/*Setting the Route Handler for the reviews. */
app.use("/listings/:id/reviews",reviewsRouter);



/*Setting the Route Handler for the users. */
app.use("/users",usersRouter);














app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

/*Middleware to hanlde error. */
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;

    console.log(`Error Status: ${statusCode}   Error Message: ${message}`);
    res.status(statusCode).render("listings/error.ejs", { err });
    // res.status(statusCode).send(message+" The error status code is "+statusCode);
});

