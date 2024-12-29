import { Router } from 'express';
import {
    createCommunityPost,
    deleteCommunityPost,
    getUserCommunityPosts,
    updateCommunityPost,
} from "../controllers/CommunityPost.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/").post(createCommunityPost);
router.route("/user/:userId").get(getUserCommunityPosts);
router.route("/:communityPostId").patch(updateCommunityPost)
router.route("/:communityPostId").delete(deleteCommunityPost);

export default router