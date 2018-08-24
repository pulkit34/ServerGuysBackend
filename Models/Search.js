const mongoose=require('mongoose')
const Schema=mongoose.Schema
let searchSchema=new Schema({
    user:{
        type:String
    },
    search:{
        type:String
    }
})
module.exports=mongoose.model('search',searchSchema)