import { Version } from "../models/version.module.js";
import { ApiError } from "../Util/apiError.js";
import { ApiResponse } from "../Util/apiResponse.js";
import { asyncHandler } from "../Util/asyncHandler.js";
import mongoose from "mongoose";
export const saveVersion = asyncHandler(async (req, res) => {
    const { _id: userId } = req.user;
    const { id } = req.params;
    const { objects ,message=""} = req.body;
  

    const version = await Version.create({
        boardId: id,
        owner: userId,
        elements: objects,
        message: message,
    });

    return res.status(201).json(
        new ApiResponse(201, version, "Version saved successfully")
    );
});

export const getVersion = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Version ID is required");
    }

    const result = await Version.findById(id);

    if (!result) {
        throw new ApiError(404, "Version not found");
    }

    if (result.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to access this version");
    }

    return res.status(200).json(
        new ApiResponse(200, result, "Version fetched successfully")
    );
});

export const getAllUserVerionBoard = asyncHandler(async (req, res) => {
   

    const { _id: userId } = req.user;
    const { id: boardId } = req.params;
    
    const the_versions = await Version.aggregate([
        {
            $match: {
                boardId: boardId,
                owner: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $sort: { createdAt: -1 },
        },
        {
            $project: {
                _id: 1,
                boardId: 1,
                createdAt: 1,
                message:1
            },
        },
    ]);

    return res.status(200).json(
        new ApiResponse(200, the_versions, "Versions fetched successfully")
    );
});

export const deleteVersion = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Version ID is required");
    }

    const deletedVersion = await Version.findOneAndDelete({ _id: id, owner: req.user._id, });

    if (!deletedVersion) {
        throw new ApiError(404, "Version not found or access denied");
    }

    return res.status(200).json(
        new ApiResponse(200, deletedVersion._id, "Version deleted successfully")
    );
});


