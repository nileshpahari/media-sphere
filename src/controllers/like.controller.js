import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { Video } from "../models/video.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { CommunityPost } from "../models/communityPost.model.js"
const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Unable to find Video")
    }

    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: req.user._id
    })
    if (!existingLike) {
        await Like.create({
            video: videoId,
            likedBy: req.user._id
        })
    } else {
        await existingLike.remove()
    }

    return res.status(201).json(new ApiResponse(201, video, "Like toggled successfully"))

})
const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new ApiError(404, "Unable to find Comment")
    }

    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id
    })
    if (!existingLike) {
        await Like.create({
            comment: commentId,
            likedBy: req.user._id
        })
    } else {
        await existingLike.remove()
    }

    return res.status(201).json(new ApiResponse(201, comment, "Like toggled successfully"))
})

const toggleCommunityPostLike = asyncHandler(async (req, res) => {
    const { communityPostId } = req.params
    const communityPost = await CommunityPost.findById(communityPostId)

    if (!communityPost) {
        throw new ApiError(404, "Unable to find Community Post")
    }

    const existingLike = await Like.findOne({
        communityPost: communityPostId,
        likedBy: req.user._id
    })
    if (!existingLike) {
        await Like.create({
            communityPost: communityPostId,
            likedBy: req.user._id
        })
    } else {
        await existingLike.remove()
    }

    return res.status(201).json(new ApiResponse(201, communityPost, "Like toggled successfully"))

})

const getLikedVideos = asyncHandler(async (req, res) => {
    const videos = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(req.user._id)
            },
        }, {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "videoList",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        username: 1,
                                        avatar: 1,
                                        fullName: 1,
                                    }
                                }]
                        }
                    }
                ]
            }
        }, {
            $project: {
                videoList: 1
            }
        }
    ])
    return res.status(200).json(new ApiResponse(200, videos[0], "Liked videos fetched successfully"))
})
export {
    toggleCommentLike,
    toggleCommunityPostLike,
    toggleVideoLike,
    getLikedVideos
}