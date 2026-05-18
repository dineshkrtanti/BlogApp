const express = require('express')
const {
    getAllBlogsController,
    getBlogByIdController,
    createBlogController,
    updateBlogController,
    deleteBlogController,
    userBlogController
} = require('../controllers/blogController')
const upload = require('../middlewares/uploadImage')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()

// ─── PUBLIC ───────────────────────────────────────────────
router.get('/all-blogs',      getAllBlogsController)
router.get('/get-blog/:id',   getBlogByIdController)

// ─── PROTECTED ────────────────────────────────────────────
router.post('/create-blog',    authMiddleware, upload.single('image'), createBlogController)
router.put('/update-blog/:id', authMiddleware, upload.single('image'), updateBlogController)
router.delete('/delete-blog/:id', authMiddleware, deleteBlogController)
router.get('/user-blog/:id',   authMiddleware, userBlogController)

module.exports = router