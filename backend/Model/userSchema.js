const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    profilePicture:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        uniquie:true
    },
    password:{
        type:String,
        required:true,
    }
},{
    timestamp:true
})

module.exports = mongoose.model("user", userSchema)