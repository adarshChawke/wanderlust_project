
module.exports=(fn)=>{//This fn is an async function
    return function(req,res,next){
        fn(req,res,next)// This fn call will return a promise because it is an async function
        .catch((err)=>{
            next(err);
        }
    );
    }
}