
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
















// const jwt = require('jsonwebtoken');
// const { promisify } = require('util');

// async function auth(req, res, next) {
//   const { authorization } = req.headers;

//   if (!authorization) {
//     return res.status(401).json({ message: 'You must log in first' });
//   }

//   try {
//     const decoded = await promisify(jwt.verify)(authorization.replace('Bearer ', ''), process.env.SECRET);
//     req.id = decoded.id; // Use the same convention as in follow and addPost functions
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
    console.log('Authorization Header:', authorization);

    // Extract the token from the Authorization header (remove 'Bearer ')
    const token = authorization.replace('Bearer ', '');

    // Verify the token using the promisified jwt.verify
    const decoded = await promisify(jwt.verify)(token, process.env.SECRET);
    console.log('Decoded Token:', decoded);

    // Attach the user ID to the request for further processing
    req.id = decoded.id;

    // Continue to the next middleware
    next();
  } catch (error) {
    console.error('Error in auth middleware:', error);

    // If the error is a JsonWebTokenError, it means there's an issue with the token
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token. Please log in again.' });
    }

    // Handle other errors (e.g., TokenExpiredError) as needed
    res.status(401).json({ message: 'Please log in first' });
  }
}

module.exports = { auth };



