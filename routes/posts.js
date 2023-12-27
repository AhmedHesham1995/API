
const express=require('express')
var router=express.Router()
const {auth}=require('../middlewares/auth')

var {getAllPosts,addPost,getOnePost,updatePost,deletePost, addReply, editReply, removeReply,toggleLike,toggleRepost,fetchLikedPosts, fetchRepostedPosts, toggleSaved, fetchSavedPosts, followingPosts}=require('../controllers/posts')

//posts (ahmed hesham)
router.get('/',getAllPosts)


// router.use(auth) in case we apply authorization authentication on all methods






router.post('/addPost',auth,addPost)


router.get('/:id',getOnePost)


router.patch('/:id',updatePost)


router.delete('/:id',deletePost)


//replies (essam)
router.put('/replies',auth, addReply)

router.patch('/', editReply)

router.delete('/',removeReply)



router.post('/toggle-like', auth, toggleLike);

router.post('/toggle-repost', auth, toggleRepost);

router.post('/toggle-saved', auth, toggleSaved);


router.get('/:userId/likedPosts', fetchLikedPosts);

router.get('/:userId/reposted', fetchRepostedPosts);

router.get('/:userId/saved', fetchSavedPosts);







router.get('/followingPosts', followingPosts);




module.exports=router