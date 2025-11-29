const mongoose  = require('mongoose')
const blogModel = require('../models/blogModel')
const userModel = require('../models/userModel')

// Get All Blogs
exports.getAllBlogsController = async (req, res) => {
  try {
    const blogs = await blogModel
      .find({})
      .populate("user")
      .sort({ createdAt: -1 }); // NEWEST FIRST

    if (!blogs || blogs.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No Blogs Found",
      });
    }

    return res.status(200).send({
      success: true,
      BlogCount: blogs.length,
      message: "All Blogs List!",
      blogs,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error while getting all blogs!",
      error,
    });
  }
};



// Create Blog
exports.createBlogController = async (req, res) => {
  try {
    const { title, description, user } = req.body;
    let image;

    if (req.file && req.file.path) {
      image = req.file.path; // Cloudinary URL
    } else {
      return res.status(400).send({
        success: false,
        message: "Please upload an image",
      });
    }

    if (!title || !description || !user) {
      return res.status(400).send({
        success: false,
        message: "Please provide all fields!",
      });
    }

    const existingUser = await userModel.findById(user);
    if (!existingUser) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const newBlog = new blogModel({ title, description, image, user });

    const session = await mongoose.startSession();
    session.startTransaction();

    await newBlog.save({ session });
    existingUser.blogs.push(newBlog);
    await existingUser.save({ session });

    await session.commitTransaction();

    return res.status(201).send({
      success: true,
      message: "Blog created successfully",
      newBlog,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error while creating blog!",
      error,
    });
  }
};




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
    const { id } = req.params;
    const { title, description } = req.body;

    const updateData = { title, description };

    if (req.file && req.file.path) {
      updateData.image = req.file.path; // new Cloudinary image
    }

    const updatedBlog = await blogModel.findByIdAndUpdate(id, updateData, { new: true });

    return res.status(200).send({
      success: true,
      message: "Blog updated successfully!",
      updatedBlog,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error while updating blog!",
      error,
    });
  }
};


// Delete Blog
exports.deleteBlogController = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Find the blog first (so we get user id)
    const blog = await blogModel.findById(id);
    if (!blog) {
      return res.status(404).send({
        success: false,
        message: "Blog not found",
      });
    }

    // 2️⃣ Delete the blog
    await blogModel.findByIdAndDelete(id);

    // 3️⃣ Remove the blog reference from user
    await userModel.findByIdAndUpdate(
      blog.user,
      { $pull: { blogs: id } }
    );

    // 4️⃣ Send response
    return res.status(200).send({
      success: true,
      message: "Blog deleted successfully",
    });

  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error while deleting blog",
      error,
    });
  }
};



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