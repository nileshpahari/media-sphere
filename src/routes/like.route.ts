import { Router } from 'express';
import {
    getLikedVideos,
    toggleCommentLike,
    toggleVideoLike,
    toggleCommunityPostLike,
} from "../controllers/like.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file
router.route("/toggle/v/:videoId").post(toggleVideoLike);
router.route("/toggle/c/:commentId").post(toggleCommentLike);
router.route("/toggle/t/:communityPostId").post(toggleCommentLike);
router.route("/videos").get(getLikedVideos);
export default router