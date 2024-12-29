import mongoose, { isValidObjectId } from "mongoose"
import { CommunityPost } from "../models/communityPost.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createCommunityPost = asyncHandler(async (req, res) => {
    const { content } = req?.body;
    if (!content) {
        throw new ApiError(400, "content is required")
    }
    const communityPost = await CommunityPost.create({
        owner: req.user?._id,
        content
    })
    res.send(201).json(new ApiResponse(201, communityPost, "CommunityPost created successfully"))
})

const getUserCommunityPosts = asyncHandler(async (req, res) => {
    const {userId} = req.params
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid User Id")
    }

    const user = await User.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(userId) }
        }, {
            $lookup: {
                from: "communityPosts",
                localField: "_id",
                foreignField: "owner",
                as: "communityPosts"
            }
        },
        
        {
            $project: {
                communityPosts: 1,
                username: 1,
                fullName: 1,
                avatar: 1,
                coverImage: 1
            }
        }
    ])
    const communityPosts = user?.[0]?.communityPosts
    if (!communityPosts) {
        throw new ApiError(404, "Unable to find CommunityPosts")
    }
    res.send(200).json(new ApiResponse(200, communityPosts, "CommunityPosts fetched successfully"))
})


const updateCommunityPost = asyncHandler(async (req, res) => {
    const { communityPostId } = req.params
    if (!isValidObjectId(communityPostId)) {
        throw new ApiError(400, "Invalid Community Post Id")
    }
    const newContent = req.body
    const communityPost = await CommunityPost.findById(communityPostId)
    if (!communityPost) {
        throw new ApiError(404, "Unable to find Community Post")
    }
    if (req.user?._id.toString() !== communityPost.owner.toString()) {
        throw new ApiError(401, "You are not authorized to update this Community Post")
    }
    if (newContent) {
        const newCommunityPost = await CommunityPost.findByIdAndUpdate(communityPostId, {  
            $set: {
                content: newContent
            }
        }, { new: true })
        if (!newCommunityPost) {
            throw new ApiError(404, "Failed to update the Community Post")
        }
        return res.status(200).json(new ApiResponse(200, newCommunityPost, "Community Post updated successfully"))
    }
    return null
    })



const deleteCommunityPost = asyncHandler(async (req, res) => {
    const { communityPostId } = req.params
    if (!isValidObjectId(communityPostId)) {
        throw new ApiError(400, "Invalid Community Post Id")
    }  
    const communityPost = await CommunityPost.findById(communityPostId)
    if (!communityPost) {
        throw new ApiError(404, "Unable to find Community Post")
    }
    if (req.user?._id.toString() !== communityPost.owner.toString()) {
        throw new ApiError(401, "You are not authorized to delete this Community Post")
    }
    const deletedCommunityPost = await CommunityPost.findByIdAndDelete(communityPostId)
    if (!deletedCommunityPost) {
        throw new ApiError(404, "Failed to delete the Community Post")
    }
    return res.status(204).json(new ApiResponse(204,  "Community Post deleted successfully"))
})

export {
    createCommunityPost,
    getUserCommunityPosts,
    updateCommunityPost,
    deleteCommunityPost
}