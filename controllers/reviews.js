const Review = require("../models/review");
const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");

module.exports.createReview = async (req, res, next) => {
    try {
        console.log("Received Review Data:", req.body);
        console.log("Listing ID from URL:", req.params.id);

        if (!req.params.id) {
            console.log("Error: listingId is undefined!");
            req.flash("error", "Invalid listing ID!");
            return res.redirect("/listings");
        }

        const listing = await Listing.findById(req.params.id);
        console.log("Fetched Listing:", listing);

        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }

        const review = new Review({
            rating: req.body.review.rating,
            comment: req.body.review.comment,
            listing: listing._id,
            author: req.user.id,
        });
       console.log(review)

        await review.save();
        listing.reviews.push(review);
        await listing.save();

        req.flash("success", "Review added successfully!");
        res.redirect(`/listings/${listing._id}`);
    } catch (error) {
        console.error("Error in createReview:", error);
        next(error);
    }
};

module.exports.destroyReview = async (req, res, next) => {
  try {
    const { id, reviewId } = req.params;

    // Remove the review from the listing
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // Delete the review itself
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);
  } catch (error) {
    next(error);
  }
};
