import { Router } from "express"
import { registerUser, loginUser } from "../controllers/user.controllers.js"
import { upload } from "../middlewares/multer.middlewares.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js"

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)

// secure routes
router.route("update-password").post(verifyJWT, updatePassword)
router.route("update-user-details").patch(verifyJWT, updateUserDetails)
router.route("update-avatar").patch(verifyJWT, updateAvatar)
router.route("update-cover-image").patch(verifyJWT, updateCoverImage)

export default router