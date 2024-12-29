import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { cloudinaryUpload, cloudinaryDelete } from "../utils/cloudinary.services.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import generateToken from "../utils/generateToken.js";
import mongoose from "mongoose";

// Global vars
const cookieOptions = {
    httpOnly: true,
    secure: true
}

// controllers
const registerUser = asyncHandler(async (req, res) => {
    // get user details 
    const { username, email, fullName, password } = req.body
    console.log(`${username}, ${email}, ${fullName}`)
    // validation - not empty
    if ([username, email, fullName, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "Please fill all the required fields");
    }
    // check email formatting

    // check if user with username and email already exists
    const userExists = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (userExists) {
        throw new ApiError(409, "User with the provided username or email already exists");
    }
    console.log(req.files)
    // check for images, check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar not provided");
    }
    // upload them to cloudinary, avatar
    const avatar = await cloudinaryUpload(avatarLocalPath)
    const coverImage = await cloudinaryUpload(coverImageLocalPath)

    if (!avatar?.url) {
        throw new ApiError(500, "Failed to upload avatar");
    }

    // create user object - create entry in db
    const userCreationObj = await User.create({
        username: username.toLowerCase(),
        email,
        fullName,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
    })

    // remove password and refresh token field from response (re calling the db, could have also modified userObj)
    const user = await User.findOne({ username }).select("-password -refreshToken");
    // check for user creation
    if (!user) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }
    // return res
    res.status(201).json(new ApiResponse(201, user, "User registered successfully"))
})

const loginUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!(username || email)) {
        throw new ApiError(400, "username or email is required")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }
    const isPassValid = await user.isPassCorrect(password)
    if (!isPassValid) {
        throw new ApiError(401, "Invalid user credentials")
    }
    const { accessToken, refreshToken } = await generateToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    res.status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in succesfully")
        )

})

const logoutUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        }, { new: true }
    ).select("-password")

    res.status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, {}, "User logged out successfully"))
})

const updateUserPassword = asyncHandler(async (req, res) => {

    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "Password cannot be empty")
    }

    const user = await User.findById(req.user?._id)
    const isPassValid = await user.isPassCorrect(oldPassword)
    if (!isPassValid) {
        throw new ApiError(401, "Incorrect password")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })
    res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"))
})

const updateUserDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body

    if (!fullName || !email) {
        throw new ApiError(400, "fullName or email is empty")
    }

    const user = await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            fullName, email
        }
    }, { new: true }
    ).select("-password -refreshToken")

    res.status(200).json(new ApiResponse(200, user, "user details updated successfully"))
})

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "avatar is required")
    }

    const avatar = await cloudinaryUpload(avatarLocalPath)
    if (!avatar.url) {
        throw new ApiError(500, "Something went wrong while uploading the avatar")
    }

    const user = await User.findById(req.user?._id).select("-password, -refreshToken")

    const oldAvatarPath = user?.avatar
    await cloudinaryDelete(oldAvatarPath)

    user.avatar = avatar.url
    await user.save({ validateBeforeSave: false })
    const newUser = await User.findById(req.user._id).select("-password -refreshToken")

    res.status(200).json(new ApiResponse(200, newUser, "avatar updated successfully"))

})

const updateUserCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path

    if (!coverImageLocalPath) {
        throw new ApiError(400, "cover image is required")
    }

    const coverImage = await cloudinaryUpload(coverImageLocalPath)
    if (!coverImage.url) {
        throw new ApiError(500, "Something went wrong while uploading the cover image")
    }

    const user = await User.findById(req.user?._id).select("-password, -refreshToken")

    const oldCoverImagePath = user?.coverImage
    await cloudinaryDelete(oldCoverImagePath)

    user.coverImage = coverImage.url

    await user.save({ validateBeforeSave: false })

    const newUser = await User.findById(req.user?._id).select("-password -refreshToken")

    res.status(200).json(new ApiResponse(200, newUser, "cover image updated successfully"))
})

const currentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(200, req.user, "User fetched successfully"))
})

const channelProfile = asyncHandler(async (req, res) => {
    const { channelName } = req.params;
    const channel = await User.aggregate([
        {
            $match: {
                username: channelName
            }
        }, {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscriptions"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $addFields: {
                subscribersCount: { $size: "$subscribers" },
                subscriptionsCount: { $size: "$subscriptions" },
                isSubscribed: {
                    $cond: {
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                subscribersCount: 1,
                subscriptionsCount: 1,
                subscriptions: 1,
                username: 1,
                fullName: 1,
                avatar: 1,
                coverImage: 1,
                isSubscribed: 1
            }
        }

    ])
    if (!channel?.length) {
        throw new ApiError(404, "Channel not found");
    }
    req.status(200).json(new ApiResponse(200, channel[0], "channel profile fetched successfully"))
})

const watchHistory = asyncHandler(async (req, res) => {
    const user = await User.aggregate([{
        $match: {
            _id: new mongoose.Types.ObjectId(req.user?._id)
        }
    }, {
        $lookup: {
            from: "videos",
            localField: "watchHistory",
            foreignField: "_id",
            as: "watchHistory",
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
                            }

                        ]
                    },
                },
                {
                    $addFields: {
                        owner: { $first: "$owner" }
                    }
                }
            ]

        }
    }


    ])
    const watchHistory = user[0]?.watchHistory
    if (!watchHistory?.length) {
        throw new ApiError(404, "Watch history not found")
    }
    res.status(200).json(new ApiResponse(200, watchHistory, "Watch history fetched successfully"))

})

const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user?._id)
    if (!user) {
        throw new ApiError(404, "User not found")
    }
    await User.findByIdAndDelete(req.user?._id)
    res.status(200).json(new ApiResponse(200, {},  "User deleted successfully"))
})

export {
    registerUser,
    loginUser,
    logoutUser,
    updateUserPassword,
    updateUserDetails,
    updateUserAvatar,
    updateUserCoverImage,
    currentUser,
    channelProfile,
    watchHistory,
    deleteUser
}
