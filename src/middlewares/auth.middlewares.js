import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js"
const verifyJWT = asyncHandler(async (req, res, next) => {
    const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Barier ", "")
    if (!accessToken) {
        throw new ApiError(401, "Unauthorized request")
    }

    const decodedAccessToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    console.log(decodedAccessToken)

    const user = User.findById(decodedAccessToken._id).select("-password refreshToken")
    if (!user) {
        throw new ApiError(401, "Invalid access token")
    }

    req.user = user
    next()
})

export { verifyJWT }