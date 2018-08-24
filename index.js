var express = require('express')
var app=express()
var mongoose=require("mongoose")
var bodyParser=require('body-parser')
var configuration=require("./App-Configuration/config")
var router=require('././Routing/route')

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*")
    res.header("Access-Control-Allow-Methods","GET,POST,PUT,DELETE,OPTIONS")
    res.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept")
    next();
})

mongoose.connect(configuration.db.uri)
mongoose.connection.on("open",function(err){
    if(err){
        console.log("Error")
    }
    else{
        console.log("Connected To MongoDB")
    }
})
router.setRouter(app)
app.listen(configuration.port,function(){
    console.log("Listening To Port 5500")
})