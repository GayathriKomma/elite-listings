const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose"); // Corrected the import

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true, // Ensure the email is unique
    },
});

// Add the passport-local-mongoose plugin to handle username and password
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
