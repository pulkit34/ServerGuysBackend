let generateResponse=(error,message,code,data)=>{
    let response={
        error:error,
        message:message,
        code:code,
        data:data
    }
    return response
}
module.exports={
    generate:generateResponse
}