import { Router } from "express"
import { registerUser, loginUser, logoutUser, updateUserPassword, updateUserDetails, updateUserAvatar, updateUserCoverImage, currentUser, channelProfile, watchHistory, deleteUser } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

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
router.route("/current-user").get(verifyJWT, currentUser)
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/delete-user").patch(verifyJWT, deleteUser)
router.route("/update-user-password").patch(verifyJWT, updateUserPassword)
router.route("/update-user-details").patch(verifyJWT, updateUserDetails)
router.route("/update-user-avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/update-user-cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)
router.route("/c/:username").get(verifyJWT, channelProfile)
router.route("/history").get(verifyJWT, watchHistory)

export default router