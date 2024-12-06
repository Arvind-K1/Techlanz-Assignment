import User from "../models/user.model.js";
import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import { AppError } from "../utils/appError.js";

const cookieOptions = {
    secure: process.env.NODE_ENV === 'production' ? true : false,
    maxAge: 7*24*60*60*1000,
    httpOnly: true
};

const register = asyncHandler( async (req, res, next) => {
    const { fullName, email, password } = req.body;

    if(!fullName || !email || !password){
        return next(new AppError('User already exists',400));
    }

    const user = await User.create({
        fullName,
        email,
        password
    });

    if(!user){
        return next(new AppError('User not created',400));
    }

    await user.save();

    const token = await user.generateJWTToken();

    user.password = undefined;

    res.cookie('token',token, cookieOptions);

    res.status(200).json({
        success: true,
        meassage: "User registered Successfully",
        data: user
    });
});

const login = asyncHandler( async (req, res, next) => {
    const { email, password } = req.body;

    if(!email || !password){
        return next(new AppError('Please provide email and password',400));
    }

    const user = await User.findOne({email}).select('+password');

    if (!(user && (await user.comparePassword(password)))){
        return next(
          new AppError('Email or Password do not match or user does not exist', 401)
        );
    }

    const token = await user.generateJWTToken();
    user.password = undefined;

    res.cookie('token',token, cookieOptions);

    res.status(201).json({
        success: true,
        message: "User logged in successfully",
        data: user
    });
    
});

const logout = asyncHandler( async (req, res, next) => {
    res.cookie('token', null, {
        secure: process.env.NODE_ENV === 'production' ? true : false,
        maxAge: 0,
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: 'User logged out successfully'
    });
});

export {
    register,
    login,
    logout
}