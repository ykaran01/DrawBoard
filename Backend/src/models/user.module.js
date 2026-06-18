import mongoose from "mongoose"
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        index: true
    },
    password: {
        type: String,
        required: true,

    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        index: true,
        max: [20, "Username Quite bigger "]
    },
    refreshToken: {
        type: String,
    },
    avatar: {
        type: String,

    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verifyOTP: {
        type: Number
    },
    expireOTP: {
        type: Date,
    }


}, { timestamps: true })

userSchema.methods.comparePassword = async function (enteredpassword) {
    return await bcrypt.compare(enteredpassword, this.password)
}
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.index({ createdAt: 1 }, {
    expireAfterSeconds: 5 * 60,
    partialFilterExpression: { isVerified: false }
})
export const  User = mongoose.model("User", userSchema)