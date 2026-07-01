import { Message } from "../models/messages.module.js";
import { ApiResponse } from "../Util/apiResponse.js";
import { asyncHandler } from "../Util/asyncHandler.js";


export const createMessage = async (message, roomId, sender) => {
    return await Message.create({
        roomId,
        message,
        sender,
    
    }).then((msg) =>
        msg.populate("sender", "username avatar")
    );
};


export const getAllMessages = asyncHandler(async(req,res)=>{
    const {roomId} = req.params

    const messages = await Message.find({roomId:roomId})
                    .populate("sender","avatar username")
                    .sort({ createdAt: 1 })
                    .limit(80)

    res.status(200).json(new ApiResponse(200,messages,'Messages Fetched Succesfully'))
})