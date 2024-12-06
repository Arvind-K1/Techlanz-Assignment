import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required : [true, 'Please provide your full Name'],
        minLength : [5, 'Your name must be at least 5 characters'],
        maxLength : [50, 'Your name must be less than 50 characters'],
        lowercase : true,
        trim : true
    },
    email: {
        type : String,
        required : [true, 'Please provide your email'],
        unique : [true, 'Email already registered'],
        lowercase : true,
        trim : true,
    },
    password: {
        type : String,
        required : [true, 'Please provide your password'],
        minLength : [6, 'Your password must be at least 8 characters'],
        select : false // This will hide the password field while fetching data from database.
    }
},{
    timestamps : true 
});

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods = {
    comparePassword : async function(plainTextPassword){
        return await bcrypt.compare(plainTextPassword, this.password);
    },
    generateJWTToken : function(){
        return jwt.sign(
        {
            id: this._id,
            email: this.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRY
        }
    );
    },
};

const User = mongoose.model('User',userSchema);

export default User