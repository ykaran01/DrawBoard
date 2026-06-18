import { OTP } from "../helper/heplerFunctions.js"
import { User } from "../models/user.module.js"
import { ApiError } from "../Util/apiError.js"
import { asyncHandler } from "../Util/asyncHandler.js"
import { ApiResponse } from "../Util/apiResponse.js"
import { generaeteAccesstokenAndRefrehToken } from "../helper/heplerFunctions.js"
import jwt from 'jsonwebtoken'
import { uploadOnCloudnary } from "../Util/cloudnary.js"
import {sendMail} from '../helper/email.helper.js'

export const registerUser = asyncHandler(async(req, res) => {
    const { name, email, password, username } = req.body
    let user = await userModule.findOne({ email: email })
    if (user) {
        throw new ApiError(400, "User is Already present")
    }
    const OTP = OTP()
    const otpExpiryTime = new Date(Date.now() + 5 * 60 * 1000)
     user = await User.create({
        email,
        name,
        password,
        username,
        verifyOTP: OTP,
        expireOTP: otpExpiryTime
    });
    user = await User.findOne({ email: email }).select("-password ,-verifyOTP ")
    await sendMail(email,OTP)
    if (!user) {
        throw new ApiError(500, "Internal Sever Eroor ")
    }
    
    user = await User.findOne()
    res.status(200).json(new ApiResponse(200, user, "User created syccesfully"))
})

export const verifyUser = asyncHandler(async(req, res) => {
    const { OTP, email } = req.body
    const user = await User.findOne({ email: email });
    if (!user) {
        throw new ApiError(404, "user Not Found")
    }
    if (user.isVerified) {
        throw new ApiError(400, "user is Already verified")
    }
    if (user.expireOTP && user.expireOTP < Date.now()) {
        throw new ApiError(400, "OTP is been expired")
    }
    if (OTP !== user.verifyOTP) {
        throw new ApiError(401, "OTP is  Wrong")
    }
    user.isVerified = true,
        user.verifyOTP = null;
    user.expireOTP = null;
    await user.save();
    res.status(200).json(new ApiResponse(200, null, "user is Verified"))
})

export const loginUser = asyncHandler(async(req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email })
    if (!user) {
        throw new ApiResponse(404, "User do not Found");
    }
    const isPasswordCorrect = await User.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Login Unsuccesfull")
    }
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    };
    const accessToken = generaeteAccesstokenAndRefrehToken.generateaccesToken(email, user.isVerified, user._id)
    const refreshToken = generaeteAccesstokenAndRefrehToken.generaterefreshToken(user._id)
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

export const addOrUpdateAvatar = asyncHandler(async(req, res) => {
    const { email, _id } = req.user;
    const file = req.file
    if (!file) {
        throw new ApiError(404, "Avatar does not fount")
    }
    const image = uploadOnCloudnary(file)

    const user = await User.findByIdAndUpdate(_id,
        {
            $set: { avatar: image.url }
        },
        { new: true }
    )
    if (!user) {
        throw new ApiError(400, "user Not found")
    }
    res.status(200).json(new ApiResponse(200, user, "Avatar Changed Coorectly"))
})