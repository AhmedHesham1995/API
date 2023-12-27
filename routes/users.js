// const express=require('express')

// var router=express.Router()

// const{authAdmin}=require('../middlewares/authAdmin')

// const {auth}=require('../middlewares/auth')

// const {getAllUsers,addUser,getOneUser,updateUser,deleteUser,login,posts4specificUser}=require('../controllers/users')




// router.get('/',getAllUsers)


// router.post('/signup',addUser)


// router.get('/:id',getOneUser)


// router.patch('/editprofile/:id',updateUser)


// router.delete('/:id',auth,authAdmin,deleteUser)


// router.get('/:id/posts',posts4specificUser)



// // router.get('/:userId/liked-posts',fetchLikedPosts);



// //authentication
// router.post('/login',login)

// module.exports=router








const express=require('express')

var router=express.Router()

const{authAdmin}=require('../middlewares/authAdmin')

const {auth}=require('../middlewares/auth')

const {getAllUsers,addUser,getOneUser,updateUser,deleteUser,login,posts4specificUser, 
    follow, unfollow, getFollowers, getFollowing, getFollowState ,verifyEmail,loginDashboard,toggleUserStatus}=require('../controllers/users')
    


router.get('/',getAllUsers)


router.post('/signup',addUser)


router.get('/:id',getOneUser)




router.put('/:id/toggle-status' ,toggleUserStatus)

router.post ('/logindashboard',loginDashboard )
router.patch('/editprofile/:id',updateUser)
router.get('/:id/verify/:token' ,verifyEmail)
router.delete('/:id',deleteUser)


router.get('/:id/posts',posts4specificUser)



// router.get('/:userId/liked-posts',fetchLikedPosts);
router.put('/follow/:userId',auth, follow);
router.put('/unfollow/:unfollowId',auth, unfollow);
router.get('/:id/followers', auth, getFollowers)
router.get('/:id/following', auth, getFollowing)
router.get('/:userId/follow-state', auth, getFollowState);





//authentication
router.post('/login',login)

module.exports=router