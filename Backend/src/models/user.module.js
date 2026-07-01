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
    },
    refreshToken: {
        type: String,
    },
    avatar: {
        type: String,
        default:"https://img.magnific.com/premium-vector/user-icon-flat-style_162100-1423.jpg?semt=ais_hybrid&w=740&q=80"

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


userSchema.pre("save", async function () {
    if (!this.isModified("password")) return ;
    this.password = await bcrypt.hash(this.password, 10);

});

userSchema.index({ createdAt: 1 }, {
    expireAfterSeconds: 5 * 60,
    partialFilterExpression: { isVerified: false }
})
export const  User = mongoose.model("User", userSchema)