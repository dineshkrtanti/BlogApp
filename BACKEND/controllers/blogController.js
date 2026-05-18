const cloudinary = require("../config/cloudinary")
const mongoose = require('mongoose')
const blogModel = require('../models/blogModel')
const userModel = require('../models/userModel')


// Helper: upload buffer to Cloudinary
const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                folder: "card_blog_images",
                transformation: [{ width: 800, height: 600, crop: "limit" }],
            },
            (err, result) => {
                if (err) reject(err)
                else resolve(result)
            }
        ).end(buffer)
    })
}


// GET || All Blogs (public)
exports.getAllBlogsController = async (req, res) => {
    try {
        const blogs = await blogModel
            .find({})
            .populate("user", "-password")   // never expose password
            .sort({ createdAt: -1 })

        if (!blogs || blogs.length === 0) {
            return res.status(404).send({ success: false, message: "No Blogs Found" })
        }

        return res.status(200).send({
            success: true,
            BlogCount: blogs.length,
            message: "All Blogs List!",
            blogs,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: "Error while getting all blogs!",
        })
    }
}


// GET || Single Blog by ID (public)
exports.getBlogByIdController = async (req, res) => {
    try {
        const { id } = req.params
        const singleBlog = await blogModel.findById(id).populate('user', '-password')

        if (!singleBlog) {
            return res.status(404).send({ success: false, message: "No blog found!" })
        }

        return res.status(200).send({
            success: true,
            message: "Blog fetched successfully!",
            singleBlog,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: "Error while getting blog!",
        })
    }
}


// POST || Create Blog (protected)
exports.createBlogController = async (req, res) => {
    try {
        const { title, description } = req.body
        const user = req.user.id   // ✅ taken from JWT, not req.body (prevents spoofing)

        if (!title || !description) {
            return res.status(400).send({ success: false, message: "Please provide all fields!" })
        }

        if (!req.file) {
            return res.status(400).send({ success: false, message: "Please upload an image" })
        }

        const existingUser = await userModel.findById(user)
        if (!existingUser) {
            return res.status(404).send({ success: false, message: "User not found" })
        }

        const uploadedImage = await uploadToCloudinary(req.file.buffer)

        const newBlog = new blogModel({
            title,
            description,
            image: uploadedImage.secure_url,
            user,
        })

        const session = await mongoose.startSession()
        session.startTransaction()

        await newBlog.save({ session })
        existingUser.blogs.push(newBlog)
        await existingUser.save({ session })

        await session.commitTransaction()

        return res.status(201).send({
            success: true,
            message: "Blog created successfully",
            newBlog,
        })

    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: "Error while creating blog!",
        })
    }
}


// PUT || Update Blog (protected + owner only)
exports.updateBlogController = async (req, res) => {
    try {
        const { id } = req.params
        const { title, description } = req.body

        // ✅ Ownership check
        const blog = await blogModel.findById(id)
        if (!blog) {
            return res.status(404).send({ success: false, message: "Blog not found" })
        }
        if (blog.user.toString() !== req.user.id) {
            return res.status(403).send({ success: false, message: "Forbidden: You don't own this blog" })
        }

        const updateData = { title, description }

        if (req.file) {
            const uploadedImage = await uploadToCloudinary(req.file.buffer)
            updateData.image = uploadedImage.secure_url
        }

        const updatedBlog = await blogModel.findByIdAndUpdate(id, updateData, { new: true })

        return res.status(200).send({
            success: true,
            message: "Blog updated successfully!",
            updatedBlog,
        })

    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: "Error while updating blog!",
        })
    }
}


// DELETE || Delete Blog (protected + owner only)
exports.deleteBlogController = async (req, res) => {
    try {
        const { id } = req.params

        const blog = await blogModel.findById(id)
        if (!blog) {
            return res.status(404).send({ success: false, message: "Blog not found" })
        }

        // ✅ Ownership check
        if (blog.user.toString() !== req.user.id) {
            return res.status(403).send({ success: false, message: "Forbidden: You don't own this blog" })
        }

        const session = await mongoose.startSession()
        session.startTransaction()

        await blogModel.findByIdAndDelete(id, { session })
        await userModel.findByIdAndUpdate(blog.user, { $pull: { blogs: id } }, { session })

        await session.commitTransaction()

        return res.status(200).send({
            success: true,
            message: "Blog deleted successfully",
        })

    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: "Error while deleting blog",
        })
    }
}


// GET || Blogs by User (protected)
exports.userBlogController = async (req, res) => {
    try {
        const userBlog = await userModel.findById(req.params.id).populate('blogs').select('-password')

        if (!userBlog) {
            return res.status(404).send({ success: false, message: "No user found!" })
        }

        return res.status(200).send({
            success: true,
            message: "User's blogs found successfully!",
            userBlog,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: "Error getting blogs of the user!",
        })
    }
}