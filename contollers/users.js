
/*Accquiring the Listing model , Review Model and User Model */
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const User = require("../models/Users");

module.exports.renderSignUpForm=async (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signUp=async (req, res) => {
    try {
        let { username, email, password } = req.body;

        const newUser = new User({ email, username });

        const registeredUser = await User.register(newUser, password);

        console.log(registeredUser);

        req.login(registeredUser,(err)=>{
            if(err){// Meaning there is some error is encountered while logging in the user and the user is still not logged out due the error encountered.
            
                return next(err);
            }

                    // Meaning there is not any error encountered while logging in the user.

             req.flash("success", "Welcome to Wanderlust");

        res.redirect("/listings");
        });

        
    }
    catch (err) {
        req.flash("error", err.message);

        res.redirect("/users/signup");

    }
};

module.exports.renderLogInForm=async (req,res)=>{

    res.render("users/login.ejs");
};


module.exports.logIn=async(req,res)=>{

    req.flash("success","Welcome back to Wanderlust!");

    
   let redirectUrl=res.locals.redirectUrl || "/listings"; 

   res.redirect(redirectUrl);
};

module.exports.logOut=async(req,res,next)=>{
    req.logout((err)=>{
        if(err){// Meaning there is some error is encountered while logging out the user and the user is still not logged out due the error encountered.
            return next(err);
        }
        
        // Meaning there is not any error encountered while logging out the user.
            req.flash("success","You are logged out!");
            res.redirect("/listings");
        
/*The above code can also be written like the below one

        if(err){// Meaning there is some error is encountered while logging out the user and the user is still not logged out due the error encountered.
            next(err);
        }else{// Meaning there is not any error encountered while logging out the user.
            req.flash("success","You are logged out!");
            res.redirect("/listings");
        }

        */
    })
};
