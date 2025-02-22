if(process.env.NODE_ENV !="production"){
  require('dotenv').config()
}
// console.log(process.env.SECRET)

const dburl=process.env.ATLASDB_URL;
const express = require("express");
const mongoose = require("mongoose");
// const Listing = require("./models/listing.js");
// const Review = require("./models/review.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
// const wrapAsync=require("./utils/wrapAsync.js");
// const ExpressError=require("./utils/ExpressError.js");
// const {listingSchema,reviewSchema}=require("./schema.js");
const app = express();
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); // For form data

const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const store=MongoStore.create(
  {
    mongoUrl:dburl,
    crypto:{
      secret: process.env.SECRET
    },
    touchAfter: 24*3600,
  }
)
store.on("error",()=>{
  console.log("error in mongo session store",err);
})
const sessionOptions={
  store:store,
  secret : process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires: Date.now() + 1000*60*60*24*3,
    maxAge:1000*60*60*24*3,
    httpOnly:true
  }
};


app.use(session(sessionOptions))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.userlogged=req.user;
  next();
})
const listingsRouter=require("./routes/listings.js")
const reviewsRouter=require("./routes/reviews.js")
const userRouter=require("./routes/user.js");

// const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust';
// const dburl=process.env.ATLASDB_URL;
main()
  .then(() => {
    console.log('MongoDB connected!');
  })
  .catch((err) => {
    console.log('MongoDB connection error:',err);
  });

async function main() {
    await mongoose.connect(dburl);



  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

// Set up middlewares and configurations
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// Routes




// app.get("/listings/new", (req, res) => {
//   res.render("listings/new.ejs");
// });

// app.delete("/listings/:id", wrapAsync (async (req, res) => {
//   let { id } = req.params;
//   await Listing.findByIdAndDelete(id);
//   res.redirect("/listings");
// }));

// app.put("/listings/:id", wrapAsync (async (req, res) => {
//   let { id } = req.params;
//   let { title, description, price, location, country } = req.body;
//   console.log("PUT request activated");
//   let listing2 = await Listing.findByIdAndUpdate(
//     id,
//     {
//       title: title,
//       description: description,
//       price: price,
//       location: location,
//       country: country,
//     },
//     { runValidators: true, new: true }
//   );
//   res.redirect("/listings");
// }));

// app.post("/listings", wrapAsync ( async (req, res,next) => {
//   let result=listingSchema.validate(req.body)
//   const newList=new Listing(req.body.Listing);
//   await newList.save();
//   res.redirect("/listings");
  
// }));

// app.get("/listings/:id/edit", wrapAsync (async (req, res) => {
//   let { id } = req.params;
//   let list = await Listing.findById(id);
//   res.render("listings/edit.ejs", { list });
// }));


// app.get("/listings", wrapAsync (async (req, res) => {
//   const allListings = await Listing.find({});
//   res.render("listings/index.ejs", { allListings });
// }));

// app.get("/listings/:id", wrapAsync (async (req, res) => {
//   let { id } = req.params;
//   const list = await Listing.findById(id).populate("reviews");
//   res.render("listings/show.ejs", { list });
// }));
// const validateListing=(req,res,next)=>{
//   let {error}=listingSchema.validate(req.body);
//   if(error){
//     let errMsg = error.details.map((el)=> el.message).join(",");
//     throw new ExpressError(400,errMsg);
//   }else{
//     next();
//   }
// }
app.use("/listings",listingsRouter);
app.use('/listings/:id/reviews',reviewsRouter);
app.use("/",userRouter);




// const validateReview=(req,res,next)=>{
//   let {error}=reviewSchema.validate(req.body);
//   if(error){
//     let errMsg = error.details.map((el)=> el.message).join(",");
//     throw new ExpressError(400,errMsg);
//   }else{
//     next();
//   }
// }
// // app.post("/listings/:id/reviews", validateReview ,wrapAsync (async (req,res)=>{
//   let list=await Listing.findById(req.params.id)
//   let newReview=new Review(req.body.review);
//   list.reviews.push(newReview);
//   await newReview.save();
//   await list.save();
//   res.send("suuccessfully review submitted")

// }))
// app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async (req,res)=>{
//   let {id,reviewId}=req.params;
//   await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
//   await Review.findByIdAndDelete(reviewId);


//   res.redirect(`/listings/`);
// }))
app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"No page"))
})
app.use((err,req,res,next)=>{
  let {status=500,message="your desired page is not available"}=err;
  // res.status(status).send(message);
  res.render("error.ejs",{message})
})
// Start the server
app.listen(8080, () => {
  console.log("Listening on port 8080");
});
