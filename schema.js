const Joi=require("joi");


module.exports.listingSchema = Joi.object({
  title: Joi.string().required(),
  imageUrl: Joi.string().uri().allow('').optional(), // Allow imageUrl to be optional
  description: Joi.string().required(),
  price: Joi.number().required(),
  location: Joi.string().required(),
  country: Joi.string().required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
      rating: Joi.number().required().min(1).max(5).required(),
      comment: Joi.string().required(),
  }).required(),
});
