
// const jwt=require('jsonwebtoken')
// const {promisify}=require('util')


async function authAdmin(req,res,next){
    if(req.body.role=="ADMIN"){
        next()
    }
    else{
        res.json({message:"sorry you are not an admin"})
    }
}


module.exports={authAdmin}