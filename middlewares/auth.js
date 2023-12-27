
// const jwt=require('jsonwebtoken')
// const {promisify}=require('util')
// async function auth(req,res,next){
// const {authorization}=req.headers

//     if(!authorization){
//         res.status(401).json({message:"You must log in first"})
//     }

//     try{
//         var decoded=await promisify(jwt.verify)(authorization,process.env.SECRET)
//         req.id=decoded.id
//         next()
//     }
//     catch(err){
//         res.status(401).json({message:"please login first"})
//     }
// }


// module.exports={auth}




// const jwt = require('jsonwebtoken');
// const { promisify } = require('util');

// async function auth(req, res, next) {
//   const { authorization } = req.headers;

//   if (!authorization) {
//     return res.status(401).json({ message: 'You must log in first' });
//   }

//   try {
//     const decoded = await promisify(jwt.verify)(authorization.replace('Bearer ', ''), process.env.SECRET);
//     req.id = decoded.id;
//     next();
//   } catch (error) {
//     console.error('Error in auth middleware:', error);
//     res.status(401).json({ message: 'Please log in first' });
//   }
// }

// module.exports = { auth };

const jwt = require('jsonwebtoken');
const { promisify } = require('util');

async function auth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: 'You must log in first' });
  }

  try {
    const decoded = await promisify(jwt.verify)(authorization.replace('Bearer ', ''), process.env.SECRET);
    req.id = decoded.id; // Use the same convention as in follow and addPost functions
    next();
  } catch (error) {
    console.error('Error in auth middleware:', error);
    res.status(401).json({ message: 'Please log in first' });
  }
}

module.exports = { auth };