const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: String,
    description: String,
    image: {
        url: String,
        filename :String,
    },
    price: {
        type: Number,
        required: true,
        default: 0,
    },
    location: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    category:{
        type:String,
        enum: ["arctic","farms","desserts","camping"],
    },
});

// Delete associated reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async function (listing) {
    if (listing && listing.reviews.length) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

// Ensure proper population of reviews when querying a listing
listingSchema.pre(/^find/, function () {
    this.populate("reviews");
});

module.exports = mongoose.model("Listing", listingSchema);
