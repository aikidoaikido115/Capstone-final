//ไฟล์หลักของ backend

require('dotenv').config()
const port = process.env.PORT

// Set the default encoding globally to UTF-8
process.env.UV_THREADPOOL_SIZE = 128;
process.env.UV_THREADPOOL_SIZE = 128;

const express = require("express")
const expressSession = require('express-session')
const cookieParser = require('cookie-parser')
const multer = require('multer')
const cors = require('cors');

const app = express()


// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './upload') // Specify your upload directory
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname) // Keep the original filename
//     }
// });

const upload = multer();

app.use(cors({
  origin: ["http://localhost:5173"],
  methods: ["POST", "GET", "PUT", "DELETE"],
  credentials: true
}));


app.use(express.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173'); // Replace with your React app's domain
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next()
  });


app.use(cookieParser())

app.use(expressSession({
  secret: 'Misha Necron',
  cookie: {
    secure:false,
    //cookie นาน 3 ชั่วโมง
    maxAge:1000*60*60*1
  }
}));

//GET CONTROLLER
const imageDescriptionController = require('./controllers/AnimeInfo/imageDescriptionController')
const AnimeInfoController = require('./controllers/AnimeInfo/AnimeInfoController')
const arrayBasicInfoController = require('./controllers/AnimeInfo/arrayBasicInfoController')
const arrayFilterInfoController = require('./controllers/AnimeInfo/arrayFilterInfoController')
const arrayBasicInfo_resultController = require('./controllers/AnimeInfo/arrayBasicInfo_resultController')
const arrayWatchListInfoController = require('./controllers/AnimeInfo/arrayWatchListInfoController')
const nextAnimeController = require('./controllers/AnimeInfo/nextAnimeController')

const videoController = require('./controllers/AnimeInfo/videoController')
const episodeNumberController = require('./controllers/AnimeInfo/episodeNumberController')
const fetchUserInfoController = require('./controllers/UserInfo/fetchUserInfoController')
const fetchSpecificUserInfoController = require('./controllers/UserInfo/fetchSpecificUserInfoController')
const fetchEmailController = require('./controllers/UserInfo/fetchEmailController')
const homeController = require('./controllers/SystemAndAuth/homeController')
const logoutController = require('./controllers/SystemAndAuth/logoutController')
const recommendationSystemController = require('./controllers/SystemAndAuth/recommendationSystemController')
const adminController = require('./controllers/Admin/adminController')
const userTableController = require('./controllers/Admin/userTableController')
const arrayGenreController = require('./controllers/AnimeInfo/arrayGenreController')
const otherDataController = require('./controllers/AnimeInfo/otherDataController')
const premiumStatusController = require('./controllers/AnimeUserInfo/premiumStatusController')
const premiumInfoController = require('./controllers/AnimeUserInfo/premiumInfoController')
const premiumGetController = require('./controllers/AnimeUserInfo/premiumGetController')
const timerController = require('./controllers/SystemAndAuth/timerController')
const fetchCommentController = require('./controllers/AnimeUserInfo/fetchCommentController')
const fetchDanmakuController = require('./controllers/AnimeUserInfo/fetchDanmakuController')
const fetchNewAnimeController = require('./controllers/AnimeInfo/fetchNewAnimeController')

//POST CONTROLLER
const registerUserController = require('./controllers/SystemAndAuth/registerUserController')
const loginUserController = require('./controllers/SystemAndAuth/loginUserController')
const createAnimeController = require('./controllers/Admin/createAnimeController')
const saveHistoryController = require('./controllers/UserInfo/saveHistoryController')
const createCommentController = require('./controllers/SystemAndAuth/createCommentController')
const createFlyCommentController = require('./controllers/SystemAndAuth/createFlyCommentController')
const createToWatchListController = require('./controllers/AnimeUserInfo/createToWatchListController')

//DELETE CONTROLLER
const deleteAnimeController = require('./controllers/Admin/deleteAnimeController')
const deleteUserController = require('./controllers/Admin/deleteUserController')
const deleteWatchListController = require('./controllers/SystemAndAuth/deleteWatchListController')
const deleteCommentController = require('./controllers/AnimeUserInfo/deleteCommentController')

//PUT CONTROLLER
const updateAnimeController = require('./controllers/Admin/updateAnimeController')
const increaseViewController = require('./controllers/SystemAndAuth/increaseViewController')
const updateProfileController = require('./controllers/SystemAndAuth/updateProfileController')


//Middleware
const testMiddleware = require('./middleware/testMiddleware')
const LoginAuthMiddleware = require('./middleware/LoginAuthMiddleware')


//GET route

//AI Machine Learning
app.get("/api/ml", recommendationSystemController)

//anime data
app.get("/api/basic_info", imageDescriptionController)
app.get("/api/array_basic_info", arrayBasicInfoController)
app.get("/api/array_filter_info", arrayFilterInfoController)
app.get("/api/array_basic_info_watch_list", arrayWatchListInfoController)
app.get("/api/next_anime", nextAnimeController)
app.get("/api/anime_info", AnimeInfoController)
app.get("/api/array_basic_info_result", arrayBasicInfo_resultController)
app.get("/api/video/:anime_title/:episode_number", testMiddleware, videoController)
app.get("/api/episode_number/:anime_title", episodeNumberController)
app.get('/api/other_data', otherDataController)
app.get('/api/array_new_anime', fetchNewAnimeController)

//user data
app.get("/api/user_info", fetchUserInfoController)
app.get("/api/user_specific_info", fetchSpecificUserInfoController)
app.get("/api/email", fetchEmailController)

//AnimeUser data
app.get("/api/comment", fetchCommentController)
app.get("/api/danmaku", fetchDanmakuController)

//system
app.get("/", LoginAuthMiddleware, homeController)
app.get("/api/logout", logoutController)

//admin
app.get("/api/admin", adminController)
app.get("/api/admin/user_table", userTableController)
app.get("/api/array_genre", arrayGenreController)

//premium and timer
app.get("/api/premium_status", premiumStatusController)
app.get("/api/premium_info", premiumInfoController)
app.get("/api/premium_get", premiumGetController)
app.get("/api/timer", timerController)



//POST route
app.post("/api/user/register", registerUserController)
app.post("/api/user/login", loginUserController)
app.post("/api/admin/createAnime", upload.fields([
    { name: 'animeImage', maxCount: 1 }, // Expect single image upload
    {name: 'bigImage', maxCount: 1},
    { name: 'animeFile', maxCount: 24 } // Expect up to 24 video uploads
]), createAnimeController)

app.post("/api/user/history", saveHistoryController)
app.post("/api/user/createComment", createCommentController)
app.post("/api/user/createFlyComment", createFlyCommentController)
app.post("/api/user/to_watch_list", createToWatchListController)


//DELETE route
app.delete("/api/admin/deleteAnime/:title", deleteAnimeController)
app.delete("/api/admin/deleteUser/:username",deleteUserController)
app.delete("/api/user/delete_watch_list/:title",deleteWatchListController)
app.delete("/api/user/comment/:comment_id",deleteCommentController)

//UPDATE route
app.put("/api/admin/updateAnime", upload.fields([
    { name: 'animeImage', maxCount: 1 }, // Expect single image upload
    {name: 'bigImage', maxCount: 1},
    { name: 'animeFile', maxCount: 24 } // Expect up to 24 video uploads
]), updateAnimeController)

app.put("/api/user/sum_view", increaseViewController)
app.put("/api/user/update_user_profile", upload.fields([
    { name: 'image', maxCount: 1 }, // Expect single image upload
]), updateProfileController)



app.listen(port, () => console.log(`backend running on port ${port}`))