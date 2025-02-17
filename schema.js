const Joi = require("joi");

const listingSchema=Joi.object(
    {
        listing:Joi.object(
            {
                title:Joi.string().required(),
                description:Joi.string().required(),
                location:Joi.string().required(),
                country:Joi.string().required(),
                price:Joi.number().required().min(0),
                image:Joi.string().allow("",null),
                category:Joi.string().required().valid("Trending","Rooms","Villas","Mountains","Castles","Beaches", "Camping","Farms","Arctic","Domes","Boat").messages({
                    "any.only": "Invalid category selected!", // Custom message for invalid values
                    "any.required": "Category is required!",
                  }),

            }
        ).required()
    }
);

module.exports.listingSchema=listingSchema;

module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        rating:Joi.number().min(0).max(5),
        comment:Joi.string().required(),
    }).required()
})