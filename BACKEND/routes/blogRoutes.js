const express = require('express')
const { getAllBlogsController,
        getBlogByIdController,
        createBlogController,
        updateBlogController,
        deleteBlogController,
        userBlogController
      } = require('../controllers/blogController')

const router = express.Router()

// routes
// GET || All Blogs
router.get('/all-blogs', getAllBlogsController)

// GET || Get Single Blogs
router.get('/get-blog/:id', getBlogByIdController)

// POST || Create Blog
router.post('/create-blog', createBlogController)

// PUT || Update Blog
router.put('/update-blog/:id', updateBlogController)

// DELETE || Delete Blog
router.delete('/delete-blog/:id', deleteBlogController)

// GET || Get blogs by User
router.get('/user-blog/:id',  userBlogController)


module.exports = router;