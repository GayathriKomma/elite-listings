const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: {
        type: String,
        required: true, // Ensure comment is required
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true, // Ensure rating is required and within the 1-5 range
    },
    createdAt: {
        type: Date,
        default: Date.now, 
    },
    listing: {
        type: Schema.Types.ObjectId,
        ref: "Listing", // Reference to the Listing model to link the review with a listing
        required: true, // Ensure each review is associated with a listing
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User", 
        required: true, // Ensure each review has an author
    },
    
});

// Create and export the Review model based on the schema
module.exports = mongoose.model("Review", reviewSchema);
