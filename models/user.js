const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    resetToken:String,
    expireToken:Date,
    pic:{
        type:String,
        default:"https://res.cloudinary.com/dizvlttbm/image/upload/v1588773783/images_tewsg1.jpg"
    },
    followers:[{type:ObjectId,ref:"user"}],
    following:[{type:ObjectId,ref:"user"}]  
})

mongoose.model("user",userSchema)