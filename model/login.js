import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const loginSchema = new mongoose.Schema({
    its: {
        type: Number,
        required: [true, "ITS Number Needed"],
        trim: true,
        minLength: [8, "ITS Number must be 8 characters"],
        maxLength: [8, "ITS Number must be 8 characters"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is Required"],
        minLength: [8, "Password must be atleast 8 characters"]
    },
    team:{
        type:Number,
        required:[true, "Team Number Is Required"],
        
    }
})

loginSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

loginSchema.methods.createJWT = function () {
    return jwt.sign({ userId: this._id, its: this.its }, process.env.JWT_TOKEN, { expiresIn: process.env.JWT_LIFETIME })
}

loginSchema.methods.comparePass = async function(comparePassword){
    const isMatched = await bcrypt.compare(comparePassword, this.password)
    return isMatched
}

export default mongoose.model('Login', loginSchema);
