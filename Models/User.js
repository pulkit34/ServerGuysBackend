var mongoose=require("mongoose")
let Schema=mongoose.Schema
let userSchema=new Schema({
    userId:{
        type:String,
        unique:true
    },
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String,
        unique:true
    },
    phone:{
        type:Number,
    }
})
module.exports=mongoose.model('user',userSchema)