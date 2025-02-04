const User=require("../models/user");

module.exports.signup=async (req,res)=>{
    try{
        let {username,email,password}=req.body;
    let newUser=new User({
        email,username
    })
    registeredUser=await User.register(newUser,password);
    req.login(registeredUser,(err)=>{
        if(err){
            next(err);
        }
        req.flash("success","signup success");
    res.redirect("/listings");
    })
    
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/user")
    }
}

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
}
module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
}
module.exports.login=async (req,res)=>{
    req.flash("success","logged in");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}
module.exports.logout =(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","logged out");
        res.redirect("/listings");
    })
}