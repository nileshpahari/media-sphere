import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    res.status(200).json({
        message: "OK"
    })
})

const loginUser = asyncHandler(async (req, res) => {
    // get the details
    const { username, password } = req.body
    // find the details in the db
    // check the details
    User.
    // gen access and refresh token 
    // if else check to see whether logeed or not

})


export { registerUser, loginUser }
