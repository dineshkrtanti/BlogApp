const mongoose  = require('mongoose')
const blogModel = require('../models/blogModel')
const userModel = require('../models/userModel')

// Get All Blogs
exports.getAllBlogsController = async (req, res) => {
    try {
        const blogs = await blogModel.find({})
        if (!blogs) {
            return res.status(404).send({
                success: false,
                message: "No Blogs Found"
            })
        }
        return res.status(200).send({
            success: true,
            BlogCount: blogs.length,
            message: "All Blogs List!",
            blogs
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error while getting all blogs!",
            error
        })
    }
}

// Create Blog
exports.createBlogController = async (req, res) => {
    try {
        const { title, description, image, user } = req.body;
        // validation
        if (!title || !description || !image || !user) {
            return res.status(400).send({
                success: false,
                message: "Please provide all fields!",
            })
        }

        const existingUser = await userModel.findById(user)
        // /validation
        if(!existingUser){
            return res.status(404).send({
                success:false,
                message:"User not exists!!"
            })
        }
        
        const newBlog = new blogModel({ title, description, image, user });
        const session = await mongoose.startSession()
        session.startTransaction()                  //❓ Why do we use a session?
        await newBlog.save({session})               //Because you want two operations to behave like one single unit:
        existingUser.blogs.push(newBlog)            // 1.Save the new blog
        await existingUser.save({session})          // 2.Add the blog to the user's blogs array
        await session.commitTransaction()           //➡️ If any one of them fails, both should be cancelled.
        //await newBlog.save()                      //➡️ This prevents half-saved data.
        return res.status(201).send({               //This is called a transaction.
            success: true,
            message: "Blog created successfully !!",
            newBlog
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error while creating blog!",
            error
        })
    }
}



// Get Single Blog By Id
exports.getBlogByIdController = async (req, res) => {
    try {
        const { id } = req.params
        const singleBlog = await blogModel.findById(id)
        if (!singleBlog) {
            return res.status(400).send({
                success: false,
                message: "No blog found!",
            })
        }
        return res.status(200).send({
            success:true,
            message:"Blog fetched successfully!!",
            singleBlog
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error while getting a specific blog!",
            error
        })
    }
}



// Update Blog
exports.updateBlogController = async (req, res) => {
    try {
        const { id } = req.params
        const { title, description, image } = req.body
        const updateBlog = await blogModel.findByIdAndUpdate(id, { ...req.body }, { new: true })
        return res.status(200).send({
            success: true,
            message: "Blog updated successfully!",
            updateBlog
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error while updating blog!",
            error
        })
    }
}


// Delete Blog
exports.deleteBlogController = async (req, res) => {
    try {
        const {id} = req.params
        const deleteBlog = await blogModel.findByIdAndDelete(id).populate('user')
        console.log(deleteBlog);
        
        await deleteBlog.user.blogs.pull(deleteBlog)
        await deleteBlog.user.save()

        res.status(200).send({
            seccess:true,
            message:"Blog deleted successfully!!"
        })
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).send({
            success: false,
            message: "Error while deleting blogs!",
            error
        })
    }
}



// get Blog by User - Controller
exports.userBlogController = async(req,res) => {
    try{
        const userBlog = await userModel.findById(req.params.id).populate('blogs')
        
        if(!userBlog){
            return res.status(404).send({
                success:false,
                message:"No User's blogs found!!",
                userBlog
            })
        }
        return res.status(200).send({
            success:true,
            message:"User's blogs found successfully!!",
            userBlog
        })
    }
    catch(error){
        console.log(error);
        return res.status(400).send({
            success:false,
            message:"Error getting blogs of the user!!",
            error
        })
        
    }
}