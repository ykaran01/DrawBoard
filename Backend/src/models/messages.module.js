import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({

    roomId: {
        type: String,
        recquired: true,
        index: true,
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    text:{
        type:String,
        recquired: true,

    }


}, { timestamps: true })

export  const  Message = mongoose.model('Messages',messageSchema)