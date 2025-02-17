
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({//  configure means to set up something for a specific purpose SO BAISCALLY SET UP A CONNECTION WITH THE MENTTION CLOUD ACCOUNT
    // HERE EVERY TIME THE KEY NAME SHOULD BE AS IT IS
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
});


/*HERE WE ARE MENTIONING ON WHICH FOLDER IN THE CLOUD THE FILES SHOULD BE SAVE*/
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
      allowedFormats: ["png","jpeg","jpg"],
    },
  });


  module.exports={cloudinary,storage};