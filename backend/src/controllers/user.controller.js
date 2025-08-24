import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

const generateRefreshAndAccessToken = async(userId)=>{
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave:false})

        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating refresh and access token");
    }
}

const register = asyncHandler(async(req,res)=>{
    const {name,email,password} = req.body

    if(!email || !name || !password){
        throw new ApiError(400,"All the fields are required")
    }

    const exisitingUser = await User.findOne({email:email})

    if(exisitingUser){
        throw new ApiError(400,"User with this email already exists,Please login")
    }

    const newUser = await User.create({
        name:name,
        email:email,
        password:password
    })

    const {accessToken,refreshToken} = await generateRefreshAndAccessToken(newUser._id)

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(new ApiResponse(200,newUser,"User registered successfully"))
})

const login = asyncHandler(async(req,res)=>{
    const {email,password} = req.body

    if(!email || !password){
        throw new ApiError(400,"Both the fields are required")
    }

    const exist = await User.findOne({email:email})

    if(!exist){
        throw new ApiError(400,"No user found with this email,Please register")
    }

    const isValidPassword = await exist.isPasswordCorrect(password)

    if(!isValidPassword){
        throw new ApiError(400,"invalid password")
    }

    const {accessToken,refreshToken} = await generateRefreshAndAccessToken(exist._id)

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(new ApiResponse(200,exist,"User logged in successfully"))

})

export {register,login}