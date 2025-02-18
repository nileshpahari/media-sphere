import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

// route importing 
import userRouter from './routes/user.route.js'
import communityPostRouter from "./routes/communityPost.route.js"
// import subscriptionRouter from "./routes/subscription.route.js"
import videoRouter from "./routes/video.route.js"
import commentRouter from "./routes/comment.route.js"
import likeRouter from "./routes/like.route.js"
// import playlistRouter from "./routes/playlist.route.js"
// import dashboardRouter from "./routes/dashboard.route.js"

//routes declaration
app.use("/api/users", userRouter)
app.use("/api/community-posts", communityPostRouter)
// app.use("/api/subscriptions", subscriptionRouter)
app.use("/api/videos", videoRouter)
app.use("/api/comments", commentRouter)
app.use("/api/likes", likeRouter)
// app.use("/api/playlist", playlistRouter)
// app.use("/api/dashboard", dashboardRouter)



export default app