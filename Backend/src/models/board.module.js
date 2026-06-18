
import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({
    title: {
        type: String,
        default: "Untitled Board"
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
        type: Array,
        default: []
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

export const Board = mongoose.model("Board", boardSchema)