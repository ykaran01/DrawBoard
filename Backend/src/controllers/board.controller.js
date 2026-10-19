import { asyncHandler } from "../Util/asyncHandler.js";
import { Board } from "../models/board.module.js";
import { ApiError } from "../Util/apiError.js";
import { ApiResponse } from "../Util/apiResponse.js";
import bcrypt from "bcryptjs";
import { uploadOnCloudnary } from "../Util/cloudnary.js";

export const createBoard = asyncHandler(async (req, res) => {

    const { boardId, title, password } = req.body;
    const owner = req.user._id;


    if (!title || !password || !boardId) {
        throw new ApiError(400, "Data is not found")
    }

    const newpassword = await bcrypt.hash(password, 10)
    const board = await Board.create({
        boardId,
        title: title || 'Board',
        owner,
        password: newpassword
    });

    if (!board) {
        throw new ApiError(500, "Board creation failed");
    }


    return res.status(201).json(
        new ApiResponse(201, null, "Board created successfully")
    );
});

export const getBoard = asyncHandler(async (req, res) => {
    const { Id } = req.params;
    
    const board = await Board.findOne({ boardId: Id }).select('-password -boardId ').populate('users', 'username email');
  

    if (!board) {
        throw new ApiError(404, "Board not found");
    }

    return res.status(200).json(
        new ApiResponse(200, board, "Board fetched successfully")
    );
});

export const getMyBoards = asyncHandler(async (req, res) => {

    const boards = await Board.find({
        owner: req.user._id
    }).select('-password -elements ');

    res.status(200).json(
        new ApiResponse(200, boards, "Boards fetched successfully")
    );
});

export const updateBoard = asyncHandler(async (req, res) => {
    const { Id } = req.params;
    const { title } = req.body;

    const board = await Board.findOne({ boardId: Id });


    if (!board) {
        throw new ApiError(404, "Board not found");
    }

    if (board.owner.toString() !== req.user.toString()) {
        throw new ApiError(403, "Unauthorized");
    }
    board.title = title || board.title;

    await board.save();

    return res.status(200).json(
        new ApiResponse(200, null, "Board updated successfully")
    );
});


export const deleteBoard = asyncHandler(async (req, res) => {
    const { Id } = req.params;

    const board = await Board.findById(Id);

    if (!board) {
        throw new ApiError(404, "Board not found");
    }

    if (board.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized");
    }

    await Board.deleteOne({ _id: Id });

    return res.status(200).json(
        new ApiResponse(200, null, "Board deleted successfully")
    );
});

export const addElement = asyncHandler(async (req, res) => {
    const { objects } = req.body
    const { id } = req.params
    const { _id } = req.user
   
    if (!id) {
        throw new ApiError(400, "Id is Not Given");
    }
    
    const board = await Board.findOne({ boardId: id })
    if (!board) {
        throw new ApiError(404, "Board Doest not found")
    }
    
    const role = board.owner.toString() === _id.toString() ? "admin" : board.users.find((u) => u.user.toString() === _id.toString())?.role
   
    if (role !== "admin" && role !== "editor") {
        throw new ApiError(403, "You cannot edit this board");
    }
    
    board.elements = objects;
    await board.save();
    


    res.status(200).json(new ApiResponse(200, null, "Board updated Successfully"))

})

export const joinBoard = asyncHandler(async (req, res) => {
    const { boardId, password } = req.body;
    const userId = req.user._id;

    if (!boardId || !password) {
        throw new ApiError(400, "Board ID and password are required");
    }

    const board = await Board.findOne({ boardId });

    if (!board) {
        throw new ApiError(404, "Board not found");
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        board.password
    );

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password");
    }

    const alreadyJoined = board.users.some(
        (u) => u.user === userId
    );
    if (!alreadyJoined) {
        board.users.push({
            user: userId,
            role: "viewer"
        });
        await board.save();
    }
    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Joined board successfully"
        )
    );
});

export const changeImage = asyncHandler(async (req, res) => {
    const { roomId } = req.params;

    if (!req.file) {
        throw new ApiError(400, "Image file is required");
    }

    const uploadedImage = await uploadOnCloudnary(req.file.buffer);

    if (!uploadedImage) {
        throw new ApiError(500, "Failed to upload image");
    }

    const board = await Board.findById(roomId);

    if (!board) {
        throw new ApiError(404, "Board not found");
    }

    board.image = uploadedImage.secure_url;

    await board.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            board,
            "Image uploaded successfully"
        )
    );
});

export const authoriseUser = asyncHandler(async (req, res) => {
    const { roomId } = req.params
    const { _id } = req.user

    const board = await Board.findOne({ boardId: roomId })
    if (!board) {
        throw new ApiError(401, "Board Not found")
    }
    const user = board.users.find((u) => u.user?.toString() === _id.toString())

    if (!user && board.owner.toString() !== _id.toString()) {
        throw new ApiError(401, "User Not Authorised")
    }

    res.status(200).json(new ApiResponse(200, null, "User Authorised"))


})

export const searhBoard = asyncHandler(async (req, res) => {
    const { name = "", sort = -1 } = req.query
    const owner = req.user._id

    const boards = await Board.find({
        $and:
            [{ owner: owner },
            { title: { $regex: name, $options: 'i' } }]
    })
        .sort({ createdAt: Number(sort) }).select("-password -elements");
    if (!boards) {
        throw new ApiError(401, 'Board Does Not Found');
    }
    res.status(200).json(new ApiResponse(200, boards, "Boards Fetched Succesfully"));

})


