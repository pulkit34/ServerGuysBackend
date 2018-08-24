var userModel = require('./../Models/User')
var searchModel=require('./../Models/Search')
var shortid = require('shortid')
var encrypt = require('./../Libraries/encrypt')
var response = require('./../Libraries/responseLib')
var validate = require('./../Libraries/validateEmail')


let saveHistory=(req,res)=>{
    let newSearch=new searchModel()
    newSearch.user=req.body.userID
    newSearch.search=req.body.search
    newSearch.save((err,result)=>{
        if(err){
        let apiResponse = response.generate("true", "Error Occured While Save", 500, null)
        res.send(apiResponse)
        }
        else{
            let apiResponse = response.generate("false", "Data Saved", 200, result)
            res.send(apiResponse)
        }
    })
}

let getHistory=(req,res)=>{

searchModel.find({user:req.params.id},(err,result)=>{
    if(err){
        let apiResponse = response.generate("true", "Error Occured While Getting History", 500, null)
        res.send(apiResponse)
    }
    else if(result==null||result==""||result==undefined){
        let apiResponse = response.generate("true", "No Search History", 404, null)
        res.send(apiResponse)
    }
    else{
        let apiResponse = response.generate("false", "Records Found", 200, result)
        res.send(apiResponse)
    }
})
}

let deleteHistory=(req,res)=>{
    searchModel.deleteMany({user:req.params.id},(err,result)=>{
        if(err){
            let apiResponse = response.generate("true", "Error Occured While Deleting History", 500, null)
        res.send(apiResponse)
        }
        else{
            let apiResponse = response.generate("false", "History Cleared", 200, result)
        res.send(apiResponse)
        }

    })
}

//Sign-UP Function:

let signupFunction = (req, res) => {
    let validateUserInput = () => {
        return new Promise((resolve, reject) => {

            if (req.body.email) {
                if (!validate.email(req.body.email)) {
                    let apiResponse = response.generate("true", "Email Does Not Meet Requirement", 500, null)
                    reject(apiResponse)
                }
                else if (req.body.password == null || req.body.password == '' || req.body.password == undefined) {
                    let apiResponse = response.generate("true", "Enter Your Password", 500, null)
                    reject(apiResponse)
                }
                else {
                    resolve(req)
                }
            }
            else {
                let apiResponse = response.generate("true", "Email Parameter Is Missing", 500, null)
                reject(apiResponse)
            }
        })
    }

    let createUser = (req, res) => {
        return new Promise((resolve, reject) => {
            userModel.findOne({ email: req.body.email }, (err, userDetails) => {
                if (err) {
                    let apiResponse = response.generate("true", "Failed To Find User Details", 500, null)
                    reject(apiResponse)
                }
                else if (userDetails == null || userDetails == undefined || userDetails == "") {
                    console.log(userDetails)
                    let newUser = new userModel({
                        userId: shortid.generate(),
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email.toLowerCase(),
                        phone: req.body.phone,
                        password: encrypt.hashPassword(req.body.password)
                    })
                    newUser.save((err, result) => {
                        if (err) {
                            let apiResponse = response.generate("true", "Error Occured While Saving Data", 500, null)
                            reject(apiResponse)
                        }
                        else {
                            let userObject = result.toObject()
                            console.log(userObject)
                            resolve(userObject)
                        }
                    })

                }
                else {
                    let apiResponse = response.generate("true", "User With Email Already Exists", 500, null)
                    reject(apiResponse)
                }
            })
        })
    }

    validateUserInput(req, res).then(createUser).then((resolve) => {
        delete resolve.password
        delete resolve.__v
        delete resolve._id
        let apiResponse = response.generate("false", "User Created", 200, resolve)
        res.send(apiResponse)
    }).catch((error) => {
        res.send(error)
    })
}

let loginFunction = (req, res) => {
let findUser=()=>{
    return new Promise((resolve,reject)=>{
        if(req.body.email){
            console.log("Email Is There")
            userModel.findOne({email:req.body.email},(err,result)=>{
                if(err){
                    let apiResponse = response.generate("true", "Error Occured", 500, null)
                    reject(apiResponse)
                }
                else if(result==undefined||result==null||result==""){
                    let apiResponse = response.generate("true", "User Does Not Exist", 404, null)
                    reject(apiResponse)
                }
                else{
                    console.log(result)
                    resolve(result)
                }
        })
    }
    })
}

let validatePassword=(personDetails)=>{
    return new Promise((resolve,reject)=>{
        encrypt.comparePassword(req.body.password,personDetails.password,(err,isMatch)=>{
            if(err){
                let apiResponse = response.generate("true", "Error Occured", 400, null)
                res.send(apiResponse)
            }
            else if(isMatch){
                let personDetailsObj = personDetails.toObject();
                    delete personDetailsObj.password;
                    delete personDetailsObj._id;
                    delete personDetailsObj.__v;
                    resolve(personDetailsObj)
            }
            else{
                let apiResponse = response.generate("true", "Wrong Password", 500, null)
                res.send(apiResponse)
            }
    })
})
}
findUser(req, res).then(validatePassword).then((resolve) => {
    let apiResponse = response.generate("false", "Login Successfull", 200, resolve)
    res.send(apiResponse)
}).catch((err) => {
    console.log(err)
    res.send(err)
})
}
module.exports = {
    signupFunction: signupFunction,
    loginFunction: loginFunction,
    getHistory:getHistory,
    deleteHistory:deleteHistory,
    saveHistory:saveHistory
    
}