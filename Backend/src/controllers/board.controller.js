import { asyncHandler } from "../Util/asyncHandler.js";
import { Board } from "../models/board.module.js";
import { ApiError } from "../Util/apiError.js";
import { ApiResponse } from "../Util/apiResponse.js";

export const createBoard = asyncHandler(async (req, res) => {
    const { boardId, title } = req.body;
    const owner = req.user;

    if (!boardId) {
        throw new ApiError(400, "Board Id is required");
    }

    const existingBoard = await Board.findOne({ boardId });

    if (existingBoard) {
        throw new ApiError(400, "Board already exists");
    }

    const board = await Board.create({
        boardId,
        title: title || "Untitled Board",
        owner
    });

    if (!board) {
        throw new ApiError(500, "Board creation failed");
    }

    return res.status(201).json(
        new ApiResponse(201, board, "Board created successfully")
    );
});

export const getBoard = asyncHandler(async (req, res) => {
    const { Id } = req.params;

    const board = await Board.findOneBy({ boardId:Id })
        .populate("owner", "username email");

    if (!board) {
        throw new ApiError(404, "Board not found");
    }

    return res.status(200).json(
        new ApiResponse(200, board, "Board fetched successfully")
    );
});

export const getMyBoards = asyncHandler(async (req, res) => {
    const boards = await Board.find({
        owner: req.user
    });

    return res.status(200).json(
        new ApiResponse(200, boards, "Boards fetched successfully")
    );
});

export const updateBoard = asyncHandler(async (req, res) => {
    const { Id } = req.params;
    const { title } = req.body;

    const board = await Board.findOne({ boardId:Id });

    if (!board) {
        throw new ApiError(404, "Board not found");
    }

    if (board.owner.toString() !== req.user.toString()) {
        throw new ApiError(403, "Unauthorized");
    }
    board.title = title || board.title;

    await board.save();

    return res.status(200).json(
        new ApiResponse(200, board, "Board updated successfully")
    );
});


export const deleteBoard = asyncHandler(async (req, res) => {
    const { boardId } = req.params;

    const board = await Board.findOne({ boardId });

    if (!board) {
        throw new ApiError(404, "Board not found");
    }

    if (board.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized");
    }

    await Board.deleteOne({ _id: board._id });

    return res.status(200).json(
        new ApiResponse(200, {}, "Board deleted successfully")
    );
});

export const addElement = asyncHandler(async (req, res) => {
    const { elements } = req.body
    const { id } = req.params
    if (!Array.isArray(elements)) {
        throw new ApiError(400, "Elements must be an array");
    }
    const board = await Board.findByIdAndUpdate(id,
        { elements }, { new: true })
    if (!board) {
        throw new ApiError(404, "Board Doest not found")
    }

    res.status(200).json(new ApiResponse(200, board, "Board updated Successfully"))

})