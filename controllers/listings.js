const Listing=require("../models/listing")

module.exports.index=async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm=(req, res) => {
    res.render("listings/new.ejs");
};

// module.exports.showListing=async (req,res)=>{
//     let {id}=req.params;
//     const list=await Listing.findById(id)
//     .populate({
//         path : "reviews",
//         populate : {
//             path : "author",
//         },
//     })
//     .populate("owner");
//     if(!list){
//         req.flash("error","Listing does not exist");
//         res.redirect("/listings");
//     }
//     res.render("listings/show.ejs",{list})
// };


module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    try {
        const list = await Listing.findById(req.params.id)
  .populate({
    path: "reviews",
    populate: {
      path: "author",select: 'username' // Nested population to get the 'author' field within 'reviews'
    }
  })
  .populate("owner"); // Populate the 'owner' field

        if (!list) {
            req.flash("error", "Listing does not exist");
            return res.redirect("/listings");
        }
        
        // Rendering the listing page and passing the populated data
        res.render("listings/show.ejs", { list });
    } catch (err) {
        console.error(err);
        req.flash("error", "An error occurred while fetching the listing");
        res.redirect("/listings");
    }
};



module.exports.createListing = async (req, res) => {
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing= new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    console.log(req.body)
    console.log(req.file)
    await newListing.save();
    req.flash("success", "Listing successfully added!");

    
    res.redirect(`/listings`);
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const { title, description, price, location, country } = req.body.listing;

    // Find the existing listing
    const updatedListing = await Listing.findById(id);

    if (!updatedListing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    // Update text fields
    updatedListing.title = title;
    updatedListing.description = description;
    updatedListing.price = price;
    updatedListing.location = location;
    updatedListing.country = country;

    // If a new file is uploaded, update the image
    if (req.file) {
        updatedListing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    // Save the updated listing
    await updatedListing.save();

    console.log(updatedListing);
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
};


module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;
    const list = await Listing.findById(id);
    if (!list){
        req.flash("error","Listing you requested for doesnot exist");
        res.redirect("/listings");
    }
    let originalImageUrl=list.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs", { list,originalImageUrl });
};



module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}