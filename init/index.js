const mongoose=require("mongoose");
const Listing=require("../models/listing.js");
const initdata=require("./data.js");

main().then(()=>{
    console.log("connected")
}).catch((err)=>{
    console.log(err);
})
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')
  
}






const initDb=async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data);
}
initDb();
