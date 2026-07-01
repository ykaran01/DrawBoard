import { OTP } from "../helper/heplerFunctions.js"
import { User } from "../models/user.module.js"
import { ApiError } from "../Util/apiError.js"
import { asyncHandler } from "../Util/asyncHandler.js"
import { ApiResponse } from "../Util/apiResponse.js"
import { generaeteAccesstokenAndRefrehToken } from "../helper/heplerFunctions.js"
import jwt from 'jsonwebtoken'
import { uploadOnCloudnary } from "../Util/cloudnary.js"
import { sendMail } from '../helper/email.helper.js'
import bcrypt from "bcryptjs"
import mongoose from "mongoose"


export const registerUser = asyncHandler(async (req, res) => {

    const { name, email, password, username } = req.body
    let user = await User.findOne({ email: email })
    if (user) {
        throw new ApiError(400, "User is Already present")
    }

    const otp = OTP()

    const otpExpiryTime = new Date(Date.now() + 5 * 60 * 1000)

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const newUser = await User.create([{
            email,
            name,
            password,
            username,
            verifyOTP: otp,
            expireOTP: otpExpiryTime
        }], { session: session });
        const createdUser = newUser[0];

        await sendMail(email, otp)
        await session.commitTransaction();
        session.endSession();
        res.status(200).json(new ApiResponse(200, null, "User created successfully"))
    } catch (err) {
        await session.abortTransaction()
        session.endSession()
        console.log(err)
        throw err

    }


})

export const verifyUser = asyncHandler(async (req, res) => {
    const { OTP, email } = req.body

    const user = await User.findOne({ email: email });

    if (!user) {
        throw new ApiError(404, "user Not Found")
    }

    if (user.isVerified) {
        throw new ApiError(400, "user is Already verified")
    }


    if (user.expireOTP && Date(user.expireOTP) < Date.now()) {
        throw new ApiError(400, "OTP has expired. Please request a new one.")
    }

    if (Number(OTP) !== Number(user.verifyOTP)) {
        throw new ApiError(401, "OTP is  Wrong")
    }
    user.isVerified = true,
        user.verifyOTP = null;
    user.expireOTP = null;
    await user.save();
    res.status(200).json(new ApiResponse(200, null, "user is Verified"))
})

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email })


    if (!user) {
        throw new ApiResponse(404, "User do not Found");
    }

    const userpassword = await user.password

    const isPasswordCorrect = await bcrypt.compare(password, userpassword)


    if (!isPasswordCorrect) {
        throw new ApiError(400, "Login Unsuccesfull")
    }

    const cookieOptions = {
        httpOnly: true,
        sameSite: "strict"
    };
    const accessToken = await generaeteAccesstokenAndRefrehToken.generateaccesToken(email, user.isVerified, user._id)
    const refreshToken = await generaeteAccesstokenAndRefrehToken.generaterefreshToken(user._id)
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    let loggedInUser = user.toObject()
    delete loggedInUser.password
    delete loggedInUser.verifyOTP
    return res
        .status(200)
        .cookie("accessToken", accessToken)
        .cookie("refreshToken", refreshToken)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, accessToken, refreshToken },
                "User logged in successfully"
            )
        );
})

export const addOrUpdateAvatar = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const file = req.file;

    if (!file) {
        throw new ApiError(400, "Avatar file is required");
    }

    const image = await uploadOnCloudnary(file.path);
    
    if (!image || !image.url) {
        throw new ApiError(500, "Failed to upload avatar");
    }


    const user = await User.findByIdAndUpdate(
        _id,
        {
            $set: {
                avatar: image.url,
            },
        },
        
    );

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(200, null, "Avatar updated successfully")
    );
});

export const getUser = asyncHandler(async (req, res) => {

    const { email, _id } = req.user

    const user = await User.findOne({ _id: _id }).select("-verifyOTP -expireOTP -password  -refreshToken")
    if (!user) {
        throw new ApiError(401, "User Not Found")
    }

    res.status(200).json(new ApiResponse(200, user, "User fetched Successfully"))
})

export const refresh = asyncHandler(async (req, res) => {
    const token = req.cookies?.refreshToken

    if (!token) {
        throw new ApiError(404, "token Not Found")
    }
    const { _id } = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
    if (!_id) {
        throw new ApiError(402, "Unauthorized")
    }

    const user = await User.findOne({ _id: _id })
    if (!user) {
        throw new ApiError(402, "Unauthorized")
    }

    const accessToken = await generaeteAccesstokenAndRefrehToken.generateaccesToken(user.email, user.isVerified, user._id)

    const cookieOptions = {
        httpOnly: true,
        sameSite: "strict"
    };
    res.status(200).cookie("accessToken", accessToken).json(new ApiResponse(200, null, "token generated sucessfully"))

})

export const changeName = asyncHandler(async(req,res)=>{
    const {_id} = req.user
    const {name} = req.body
    console.log(name)
    if(!name ){
        throw new ApiError(400,"Name is required")
    }
    const user = await User.findByIdAndUpdate(_id,{
        $set:{name:name}
        
        }
    ,{
        new :true
    })
    if(!user){
        throw new ApiError(404,"User Not Found")
    }
    res.status(200).json(new ApiResponse(200,null,"User Name SuccessFully Change"))
})