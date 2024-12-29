import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { cloudinaryDelete, cloudinaryUpload } from "../utils/cloudinary.services.js"
const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})


const publishVideo = asyncHandler(async (req, res) => {
    const { title, description, isPublished } = req.body
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path
    const videoLocalPath = req.files?.videoFile[0]?.path
    if (!(title && description && thumbnailLocalPath && videoFile && isPublished)) {
        throw new ApiError(400, "Title, description, thumbnail or video file is missing")
    }

    const thumbnail = await cloudinaryUpload(thumbnailLocalPath)
    if (!thumbnail.url) {
        throw new ApiError(500, "Something went wrong while uploading the thumbnail")
    }
    const videoFile = await cloudinaryUpload(videoLocalPath)
    if (!videoFile.url) {
        throw new ApiError(500, "Something went wrong while uploading the video file")
    }


    const video = await Video.create({
        title,
        description,
        isPublished,
        thumbnail: thumbnail?.url,
        videoFile: videoFile?.url,
        owner: req.user._id,
        views: 0,
        duration: 0,
    })
    return res.status(201).json(new ApiResponse(201, video, "Video created successfully"))
})
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Unable to find the video")
    }
    return res.status(200).json(new ApiResponse(200, video, "Video found successfully"))

})
const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { title, description } = req.body
    const thumbnailLocalPath = req.file?.path

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Unable to find the video")
    }

    if (req.user?._id.toString() !== video.owner.toString()) {
        throw new ApiError(401, "You are not authorized to delete this Video")
    }

    if (!(title && description && thumbnailLocalPath)) {
        throw new ApiError(400, "Title, description or thumbnail is required")
    }

    if (thumbnailLocalPath) {
        const newThumbnail = await cloudinaryUpload(thumbnailLocalPath)
        if (!newThumbnail.url) {
            throw new ApiError(500, "Something went wrong while uploading the thumbnail")
        }
        await cloudinaryDelete(video.thumbnail)
        video.thumbnail = newThumbnail.url
    }

    video.title = title
    video.description = description
    await video.save({ validateBeforeSave: false })

    const updatedVideo = await Video.findById(videoId)

    return res.status(200).json(new ApiResponse(200, updatedVideo, "Video updated successfully"))


})
const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video Id")
    }
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Unable to find Video")
    }

    if (req.user?._id.toString() !== video.owner.toString()) {
        throw new ApiError(401, "You are not authorized to delete this Video")
    }
    const deletedVideo = await Video.findByIdAndDelete(videoId)
    if (!deletedVideo) {
        throw new ApiError(404, "Failed to delete the Video")
    }
    await cloudinaryDelete(video.thumbnail)
    await cloudinaryDelete(video.videoFile)
    return res.status(204).json(new ApiResponse(204, "Video deleted successfully"))

})
const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found")
    }
    if (req.user._id.toString() !== video.owner.toString()) {
        throw new ApiError(401, "You are not authorized to toggle publish status of this video")
    }
    video.isPublished = !video.isPublished
    await video.save()
    return res.status(200).json(new ApiResponse(200, video, "Publish status updated successfully"))
})
export {
    getAllVideos,
    publishVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}