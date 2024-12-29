import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
})
const addComment = asyncHandler(async (req, res) => {
    const {content} = req.body
    const {videoId} = req.params

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id
    })
    return res.status(201).json(new ApiResponse(201, comment, "Comment added successfully"))
})
const updateComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    const {newContent} = req.body
    const comment = await Comment.findByIdAndUpdate(commentId, {
        $set: {content: newContent}
    }, {
        new: true
    })
    
    return res.status(200).json(new ApiResponse(200, comment, "Comment updated successfully"))
})
const deleteComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    if (!commentId) {
        throw new ApiError(404, "Invalid Comment Id")
    }
    const comment = await Comment.findByIdAndDelete(commentId)
    if (!comment) {
        throw new ApiError(400, "Failed to delete the comment")
    }
})
export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }