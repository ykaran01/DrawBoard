import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({

    roomId: {
        type: String,
        recquired: true,
        index: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    message: {
        type: String,
        recquired: true,

    },
    

}, { timestamps: true })


messageSchema.index({ createdAt: 1 },
    { expireAfterSeconds: 10 * 60 })

export const Message = mongoose.model('Messages', messageSchema)