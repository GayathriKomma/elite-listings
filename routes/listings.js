const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage})

const app = express();
const listingController=require("../controllers/listings.js");

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn, upload.single("listing[image]"),wrapAsync(listingController.createListing));

// router.get("/",wrapAsync(listingController.index));

router.get("/new", isLoggedIn, listingController.renderNewForm);


router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn, isOwner, upload.single("listing[image]"),wrapAsync(listingController.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));



// router.get("/:id",wrapAsync(listingController.showListing));

router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.renderEditForm));

// router.post('/',isLoggedIn,wrapAsync(listingController.createListing));

// router.put("/:id", isLoggedIn, isOwner, wrapAsync(listingController.updateListing));

// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));









// Error handling middleware
router.use((err, req, res, next) => {
    const { status = 500, message = 'Something went wrong' } = err;
    res.status(status).render('error', { message }); // Or any error view you have
});

module.exports = router;
