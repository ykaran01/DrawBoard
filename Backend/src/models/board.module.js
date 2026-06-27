
import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({
    title: {
        type: String,
        default: "Untitled Board",
        
    },
    boardId: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    elements: {
        type: [mongoose.Schema.Types.Mixed],
        default: []
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    password:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        default:'https://plus.unsplash.com/premium_vector-1721294461083-da2763b727a3?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

    }
},{timestamps:true})

export const Board = mongoose.model("Board", boardSchema)