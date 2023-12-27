const postsModel = require('../models/posts');
const multer = require('multer');
const fs = require('fs');
const usersModel= require('../models/users')

// Define storage for uploaded images
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//posts (ahmed hesham)
const getAllPosts = async (req, res) => {
    try {
        let posts = await postsModel.find()
            .populate('userId')
            .populate('replies', 'text created')
            .populate('replies.postedBy', '_id name');
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

// const addPost = async (req, res) => {
//     const post = req.body;
//     post.userId = req.id; // It knows the id from the last middleware; no need to add userId to create a Post by a specific user

//     try {
//         // Create a new post
//         const newPost = new postsModel({
//             title: post.title,
//             userId: post.userId,
//             replies: post.replies || [], 
//         });

//         // Save the new post 
//         await newPost.save();

//         res.status(201).json({ message: "Added successfully", data: newPost });
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// }


// const addPost = async (req, res) => {
//     const post = req.body;
//     post.userId = req.id; // It knows the id from the last middleware; no need to add userId to create a Post by a specific user

//     try {
//         // Create a new post
//         const newPost = new postsModel({
//             title: post.title,
//             userId: post.userId,
//             userProfilePicture: post.userProfilePicture,
//             replies: post.replies || [],
//         });

//         // Save the new post
//         await newPost.save();

//         res.status(201).json({ message: "Added successfully", data: newPost });
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// }

const addPost = async (req, res) => {
    const { title, userProfilePicture, image, replies } = req.body;
    const userId = req.id;
  
    try {
      // Create a new post
      const newPost = new postsModel({
        title,
        userId,
        userProfilePicture,
        image,
        replies: replies || [],
      });
  
      // Save the new post
      await newPost.save();
  
      res.status(201).json({ message: "Added successfully", data: newPost });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
  
  // Add other controller functions as needed
  


const getOnePost = async (req, res) => {
    let postId = req.params.id;
    try {
        let wanted = await postsModel.findById(postId);
        if (wanted) res.status(200).json(wanted);
        else res.status(404).json({ message: "Not exist" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const updatePost = async (req, res) => {
    let postId = req.params.id;
    let newTitleObj = req.body.title;
    try {
        const queryRes = await postsModel.findByIdAndUpdate(postId, { title: newTitleObj });
        console.log(queryRes);
        res.status(200).json({ message: "Edited successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const deletePost = async (req, res) => {
    let postId = req.params.id;
    try {
        await postsModel.findByIdAndDelete(postId);
        res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


//replies (essam)
const addReply = async (req, res) => {
    const { postId, userId, text } = req.body;

    try {
        // Create a new reply object
        const reply = {
            text,
            created: new Date(),
            postedBy: userId,
        };

        const updatedPost = await postsModel.findByIdAndUpdate(
            postId,
            { $push: { replies: reply } },
            { new: true }
        )
        .populate('replies.postedBy', '_id name')
        .populate('userId', '_id name');

        res.json(updatedPost);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

const editReply = async (req, res) => {
    const { postId, replyId, text } = req.body;

    try {
        const updatedPost = await postsModel.findOneAndUpdate(
            { _id: postId, "replies._id": replyId }, // Find the post and the specific reply
            { $set: { "replies.$.text": text } }, // Update the text of the specified reply
            { new: true }
        )
        .populate('replies.postedBy', '_id name')
        .populate('userId', '_id name');

        if (!updatedPost) {
            return res.status(404).json({ message: "Post or reply not found" });
        }

        res.json(updatedPost);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

const removeReply = async (req, res) => {
    const { postId, replyId } = req.body;

    try {
        // Find the post by ID and remove the specified reply by its _id
        const updatedPost = await postsModel.findByIdAndUpdate(
            postId,
            { $pull: { replies: { _id: replyId } } },
            { new: true }
        )
        .populate('replies.postedBy', '_id name')
        .populate('userId', '_id name');

        if (!updatedPost) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.json(updatedPost);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}



const toggleLike = async (req, res) => {
    const { postId } = req.body;
    const userId = req.id;

    try {
        const post = await postsModel.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const isLiked = post.likes.some(like => like.userId.equals(userId));

        if (isLiked) {
            // Remove like
            post.likes = post.likes.filter(like => !like.userId.equals(userId));
        } else {
            // Add like
            post.likes.push({ userId });
        }

        const updatedPost = await post.save();
        res.json(updatedPost);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// const toggleRepost = async (req, res) => {
//     const { postId } = req.body;
//     const userId = req.id;
  
//     try {
//       const post = await postsModel.findById(postId);
  
//       if (!post) {
//         return res.status(404).json({ message: 'Post not found' });
//       }
  
//       const existingRepost = post.reposts.find((repost) => repost.userId.toString() === userId);
  
//       if (existingRepost) {
//         // User already reposted the post, remove the repost
//         post.reposts = post.reposts.filter((repost) => repost.userId.toString() !== userId);
//       } else {
//         // User hasn't reposted the post, add the repost
//         post.reposts.push({ userId });
//       }
  
//       await post.save();
  
//       res.status(200).json({ message: 'Repost toggled successfully', data: post });
//     } catch (error) {
//       console.error('Error toggling repost:', error);
//       res.status(500).json({ message: 'Internal Server Error' });
//     }
//   };

// controllers/postsController.js

// ... (existing code)

// const toggleRepost = async (req, res) => {
//   const { postId } = req.body;
//   const userId = req.id;

//   try {
//     const originalPost = await postsModel.findById(postId).populate('userId');

//     if (!originalPost) {
//       return res.status(404).json({ message: 'Original post not found' });
//     }

//     // Create a new post based on the original post
//     const newPost = new postsModel({
//       // Include the title field from the original post
//       title: originalPost.title,

//       // Copy other relevant fields from the original post
//       content: originalPost.content,
//       // ... (copy other relevant fields)

//       // Change the user ID to the one reposting
//       userId: userId,

//       // Add information about the repost
//       originalPost: {
//         postId: originalPost._id,
//         userId: originalPost.userId,
//       },

//       // ... (other fields, if any)
//     });

//     // Save the new post
//     await newPost.save();

//     res.status(200).json({ message: 'Repost created successfully', data: newPost });
//   } catch (error) {
//     console.error('Error creating repost:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };


const toggleRepost = async (req, res) => {
  const { postId } = req.body;
  const userId = req.id;

  try {
    // Use Mongoose's populate method to get the original post with user details
    const originalPost = await postsModel.findById(postId).populate('userId');

    if (!originalPost) {
      return res.status(404).json({ message: 'Original post not found' });
    }

    // Create a new post based on the original post
    const newPostData = {
      title: originalPost.title,
      content: originalPost.content,
      userId: userId,
      originalPost: {
        postId: originalPost._id,
        userId: originalPost.userId,
      },
      // ... (other fields, if any)
    };

    // Include image details if the original post has an image
    if (originalPost.image) {
      newPostData.image = originalPost.image;
      // Include other image-related fields if needed
    }

    const newPost = new postsModel(newPostData);

    // Save the new post
    await newPost.save();

    res.status(200).json({ message: 'Repost created successfully', data: newPost });
  } catch (error) {
    console.error('Error creating repost:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};








  const toggleSaved = async (req, res) => {
    const { postId } = req.body;
    const userId = req.id;
  
    try {
      const post = await postsModel.findById(postId);
  
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      const savedPost = post.saved.find((savedPost) => savedPost.userId.toString() === userId);
  
      if (savedPost) {
        // User already reposted the post, remove the repost
        post.saved = post.saved.filter((savedPost) => savedPost.userId.toString() !== userId);
      } else {
        // User hasn't reposted the post, add the repost
        post.saved.push({ userId });
      }
  
      await post.save();
  
      res.status(200).json({ message: 'Repost toggled successfully', data: post });
    } catch (error) {
      console.error('Error toggling repost:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };




const fetchLikedPosts = async (req, res) => {
    const userId = req.params.userId;
  
    try {
      
      const likedPosts = await postsModel
        .find({ 'likes.userId': userId })
        .populate('userId'); 
  
      res.json(likedPosts);
    } catch (error) {
      console.error('Error fetching liked posts:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  

  const fetchRepostedPosts = async (req, res) => {
    const userId = req.params.userId;
  
    try {
      const repostedPosts = await postsModel
        .find({ 'reposts.userId': userId })
        .populate('userId');
      res.json(repostedPosts);
    } catch (error) {
      console.error('Error fetching reposted posts:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  


  const fetchSavedPosts = async (req, res) => {
    const userId = req.params.userId;
  
    try {
      
      const savedPosts = await postsModel
        .find({ 'saved.userId': userId })
        .populate('userId'); 
  
      res.json(savedPosts);
    } catch (error) {
      console.error('Error fetching saved posts:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  
  

  // controllers/postsController.js

const followingPosts = async (req, res) => {
  try {
    const loggedInUserId = req.id;

    // Fetch the followings of the logged-in user
    const user = await usersModel.findById(loggedInUserId).populate('followings');

    // Extract the array of followings' user IDs
    const followingsIds = user.followings.map(following => following._id);

    // Fetch posts from followings
    const posts = await postsModel.find({ userId: { $in: followingsIds } })
      .sort({ createdAt: -1 })
      .populate('userId', 'name username profilePicture');

    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts from followings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};






  
  
  
  




  
  module.exports = { getAllPosts, addPost, getOnePost, updatePost, deletePost, addReply, editReply, removeReply,toggleLike,toggleRepost,fetchLikedPosts,fetchRepostedPosts,fetchSavedPosts,toggleSaved,followingPosts};
  



  
  






