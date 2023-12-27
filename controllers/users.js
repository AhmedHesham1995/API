const usersModel=require('../models/users')
const postsModel=require('../models/posts')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const Token = require ('../models/token')
const sendMail = require ('../utils/sendEmail')
const crypto = require ('crypto')
const express=require('express')
var router=express.Router()

const getAllUsers=async(req,res)=>{
    try{
        let users=await usersModel.find({})
        res.status(200).json(users)
    }
    catch(err){
        res.status(500).json({message:"something went wrong"})

    }
}
 

const verifyEmail =async (req,res) =>{
    try{
        const user=await usersModel.findOne({_id:req.params.id}) ;
        console.log(user) ;
        if (!user){
            return res.status(400).send({message :"Invalid link"})
        }
        const token = await Token.findOne({
            userId : user._id,
            token:req.params.token 
        })
        if (!token){
            return res.status(400).send({message :"Invalid link"})
        }
        await usersModel.updateOne({ _id: user._id }, { $set: { verified: true } });

        // await Token.deleteOne({ _id: token._id });
        res.status(200).json({message:"Email verified successfully"})
    }catch(error){
        res.status(400).json({message:error.message})
    }
}
const toggleUserStatus = async (req, res) => {
    const userId = req.params.id;
    try {
      const user = await usersModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      user.status = user.status === "Active" ? "Inactive" : "Active";
      const updatedUser = await user.save();
      res.status(200).json({ message: "User status toggled", data: updatedUser });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
const addUser=async(req,res)=>{
    var user=req.body
    try{
        const newuser=await usersModel.create(user)
        const token = await new Token ({
            userId : newuser._id,
            token : crypto.randomBytes(32).toString('hex')
        }).save()
        const url =`http://localhost:5173/users/${newuser._id}/verify/${token.token}`
        await sendMail(newuser.email , "Verify Email" , url)
        res.json({message:"An Email Sent to your Account please verify it"})
    }
    catch(err){
        res.status(400).json({message:err.message})
    }

}

const getOneUser=async(req,res)=>{
    const userId=req.params.id
    // const userId = req.query.userId;

    try{
        const wanted=await usersModel.findOne({_id:userId})
        if (!wanted) {
            return res.status(404).json({ message: "User not found" });}
        // console.log(wanted);
        res.status(200).json({message:"s",data:wanted})
    }
    catch(err){
        res.json({message: err.message})
    }
}

const updateUser = async (req, res) => {
    const { name, profilePicture, profileCover, location, bio, birthDate } = req.body;
    const userId = req.params.id;

    try {
        const updatedUser = await usersModel.findOneAndUpdate(
            { _id: userId },
            { name, profilePicture, profileCover, location, bio, birthDate },
            { new: true }
        );

        if (updatedUser.nModified === 0) {
            return res.status(404).json({ msg: 'User not found or no changes applied' });
        }

        res.json({ msg: 'Profile edited successfully', data: { name, profilePicture, profileCover, location, bio, birthDate } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
};




const deleteUser=async(req,res)=>{
    let userId=req.params.id
    try{
        await usersModel.deleteOne({_id:userId})
        res.status(200).json({message: "deleted success"})
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
}



const posts4specificUser=async(req,res)=>{
    let user=req.params.id
    console.log(user);
    try{
        let wanted=await postsModel.find({userId:user})
        if(wanted.length) {
            res.status(200).json(wanted)
            console.log(wanted);
        }
        else res.status(404).json({message: "This user hadn't posted never"})
    }
    catch(err){
        res.status(500).json({message: message.err})
    }
}

const follow = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await usersModel.findById(userId);
        if (user.followers.includes(req.id)) {
            return res.status(400).json({ message: 'You are already following this user' });
        }

        await usersModel.findByIdAndUpdate(
            userId,
            { $push: { followers: req.id } },
            { new: true }
        );

        const result = await usersModel.findByIdAndUpdate(
            req.id,
            { $push: { following: userId } },
            { new: true }
        );

        res.json(result);
    } catch (error) {
        return res.status(422).json({ error: error.message });
    }
};


const unfollow = async (req, res) => {
    try {
        const { unfollowId } = req.params;

        await usersModel.findByIdAndUpdate(
            unfollowId,
            { $pull: { followers: req.id } },
            { new: true }
        );

        const result = await usersModel.findByIdAndUpdate(
            req.id,
            { $pull: { following: unfollowId } },
            { new: true }
        )

        res.json(result);
    } catch (error) {
        return res.status(422).json({ error: error.message });
    }
};

const getFollowers = async (req, res) => {
    try {
        // const userId = req.params.id;
        const userId = req.id;
        const user = await usersModel.findById(userId).populate('followers', 'name  profilePicture');
        res.status(200).json({ followers: user.followers });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getFollowing = async (req, res) => {
    try {
        // const userId = req.params.id;
        const userId = req.id;
        const user = await usersModel.findById(userId).populate('following', 'name profilePicture');
        res.status(200).json({ following: user.following });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getFollowState = async (req, res) => {
    try {
        const { userId } = req.params;
        const loggedInUserId = req.id;

        const isFollowing = await usersModel.findById(loggedInUserId)
            .select('following')
            .then(user => user.following.includes(userId));

        res.json({ following: isFollowing });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};






//authentication
async function login(req,res){
    const {email,password}=req.body
    if(!email && !password){
        return res.status(400).json({message:"you must enter your email and password"})
    }
    if(!email ){
        return res.status(400).json({message:"you must enter your email"})
    }
    if( !password){
        return res.status(400).json({message:"you must enter your password"})
    }
    const user=await usersModel.findOne({email:email})
    if(!user){
        return res.status(404).json({message:"you must sign up first"})
    }


    const isValid=await bcrypt.compare(password,user.password);
    if(!isValid){
        return res.status(401).json({message:"invalid password"})
    }
    if (user.status == "Inactive" ) {
            return res.status(401).json({message:"Your account is inactive. Please contact support for assistance."})
    }
    if (!user.verified) {
        // let token = await Token.findOne({ userId: user._id });
        // if (!token) {
        //     token = await new Token({
        //         userId: user._id,
        //         token: crypto.randomBytes(32).toString("hex"),
        //     }).save();
        //     const url = `http://localhost:5173/users/${user.id}/verify/${token.token}`;
        //     await sendMail(user.email, "Verify Email", url);
        // }

        return res
            .status(400)
            .send({ message: "An Email sent to your account please verify" });
     }
    // // console.log(user.status);
    // // 

    //generate token
    const token=jwt.sign({id:user._id,name:user.username},process.env.SECRET)
    res.status(200).json({token:token, id:user._id})
}


async function loginDashboard(req,res){
    const {email,password}=req.body
    if(!email || !password){
        return res.status(400).json({message:"you must provide email and password"})
    }

    const user=await usersModel.findOne({email:email})
    if(!user){
        return res.status(404).json({message:"invalid email or password"})
    }

    const isValid=await bcrypt.compare(password,user.password)
    if(!isValid){
        return res.status(401).json({message:"invalid password"})
    }

    if (user.role!="ADMIN") {
        return res.status(401).json({message:"You are donot admin"})
    }
    //generate token
    const token=jwt.sign({id:user._id,name:user.username},process.env.SECRET)
    res.status(200).json({token:token, id:user._id})
}

module.exports={loginDashboard ,toggleUserStatus,verifyEmail,getAllUsers,addUser,getOneUser,updateUser,deleteUser,login,posts4specificUser,follow,
    unfollow,
    getFollowers,
    getFollowing,getFollowState}