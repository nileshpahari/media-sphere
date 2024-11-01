import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { cloudinaryUpload } from "../utils/cloudinary.services.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Global vars


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

export { registerUser }
