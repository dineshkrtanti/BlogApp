const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')



// Register Controller
exports.registerController = async (req,res) => {
    try{
        const {username, email, password} = req.body 
        // validation
        if(!username){
            return res.status(400).send({
                success: false,
                message:"Username is required"
            })
        }
        if(!email){
            return res.status(400).send({
                success: false,
                message:"Email is required"
            })
        }
        if(!password){
            return res.status(400).send({
                success: false,
                message:"Password is required"
            })
        }


        // Existing user ? 
        const existingUser =  await userModel.findOne({username})
        const existingEmail =  await userModel.findOne({email})
        if(existingUser){
            return res.status(401).send({
                success : false,
                message : "Username alredy exists! Please choose another one!" 
            })
        }
        if(existingEmail){
            return res.status(401).send({
                success : false,
                message : "Email alredy exists! Please use another email or try logging in instead!" 
            })
        }

        // Hashed password
        const hashedPassword = await bcrypt.hash(password, 10)


        // save new user
        const user = new userModel({username, email, password: hashedPassword})
        await user.save()
        return res.status(200).send({
            succes: true,
            message: " User created successfully!"
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).send({
            message: "Error in register callback",
            success: false,
            error
        })        
    }
}







// Get All Users
exports.getAllUsersController = async (req, res) => {
    try{
        const users = await userModel.find({})
        return res.status(200).send({
            userCount : users.length,
            success : true,
            message : "All users fetched successfully!",
            users
        })
    }
    catch(error){
        console.log(error);
        return res.status(400).send({
            success : false,
            message : "Error in getAllUsers callback",
            error
        })
    }
}






exports.loginController = async (req,res) => {
    try{
        const {email, password} = req.body

        // validation
        if(!email || !password){
            return res.status(401).send({
                success:false,
                message:"Please provide email or password!",                
            })
        }

        // validation user
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(200).send({
                success:false,
                message:"Unauthorized User!!"
            })
        }
        // Validating password
        const isMatching = await bcrypt.compare(password, user.password)
        if(!isMatching){
            return res.status(400).send({
                success:false,
                message: "Invalid username or password!!"
            })
        }
        return res.status(200).send({
            success: true,
            message : "Logged in successfully!!",
            user
        })

    }
    catch(error){
        console.log(error);
        return res.status(400).send({
            success:false,
            message:"Error in login callback",
            error
        })
        
    }
}