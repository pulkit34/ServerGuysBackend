var express = require('express')
var configuration=require("./../App-Configuration/config")
var userController=require("./../Controller/UserController")
let setRouter=(app)=>{
    let baseURL=configuration.version
    app.post(`${baseURL}/login`,userController.loginFunction)
    app.post(`${baseURL}/signup`,userController.signupFunction)
    app.get(`${baseURL}/history/:id`,userController.getHistory)
    app.delete(`${baseURL}/del/:id`,userController.deleteHistory)
    app.post(`${baseURL}/save`,userController.saveHistory)
   
}
module.exports={
    setRouter:setRouter
}

