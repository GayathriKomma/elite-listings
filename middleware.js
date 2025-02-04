const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError"); // Ensure correct path

const { listingSchema, reviewSchema } = require("./schema");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) { // Check if user is authenticated
        req.session.redirectUrl = req.originalUrl; // Store the current URL to redirect after login
        req.flash("error", "You must be logged in to create a listing");
        return res.redirect("/login"); // Redirect to login if not authenticated
    }
    next(); // Proceed to next middleware or route handler if logged in
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl; // Set the redirect URL
    }
    next(); // Move to next middleware
};

module.exports.isOwner = async (req, res, next) => {
    try {
        const { id } = req.params; // Get the listing ID from the route parameters
        const listing = await Listing.findById(id); // Fetch the listing from the database

        // If listing not found, redirect to listings page
        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }

        // Check if the logged-in user is the owner of the listing
        if (!listing.owner || listing.owner.toString() !== req.user._id.toString()) {
            req.flash("error", "You do not have permission to do that!");
            return res.redirect(`/listings/${id}`);
        }

        res.locals.listing = listing; // Pass the listing to the next middleware/route
        next();
    } catch (err) {
        console.error("Error in isOwner middleware:", err);
        req.flash("error", "Something went wrong!");
        res.redirect("/listings"); // Redirect to listings page if error occurs
    }
};

module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body); // Validate listing data using schema
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(","); // Format error messages
        throw new ExpressError(400, errMsg); // Pass error to the ExpressError handler
    } else {
        next(); // Proceed to the next middleware or route handler if no error
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    try {
        const { listingId, reviewId } = req.params; // Ensure correct parameter names
        const review = await Review.findById(reviewId); // Find the review by ID

        // If review not found, redirect to the listing page
        if (!review) {
            req.flash("error", "Review not found!");
            return res.redirect(`/listings/${listingId}`);
        }

        // Debugging logs (optional, remove after testing)
        console.log("Logged-in user ID:", req.user._id);
        console.log("Review author ID:", review.author);

        // Check if the logged-in user is the author of the review
        if (!review.author || review.author.toString() !== req.user._id.toString()) {
            req.flash("error", "You do not have permission to delete this review!");
            return res.redirect(`/listings/${listingId}`);
        }

        res.locals.review = review; // Pass review to next middleware/route
        next();
    } catch (err) {
        console.error("Error in isReviewAuthor middleware:", err);
        req.flash("error", "Something went wrong!");
        res.redirect(`/listings/${req.params.listingId}`); // Ensure proper redirection
    }
};
