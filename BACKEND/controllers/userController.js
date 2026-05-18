const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Helper: generate token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, username: user.username, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    )
}


// Register Controller
exports.registerController = async (req, res) => {
    try {
        const { username, email, password } = req.body

        // Validation
        if (!username) {
            return res.status(400).send({ success: false, message: "Username is required" })
        }
        if (!email) {
            return res.status(400).send({ success: false, message: "Email is required" })
        }
        if (!password) {
            return res.status(400).send({ success: false, message: "Password is required" })
        }

        // Check duplicates
        const existingUser = await userModel.findOne({ username })
        if (existingUser) {
            return res.status(409).send({
                success: false,
                message: "Username already exists! Please choose another one."
            })
        }

        const existingEmail = await userModel.findOne({ email })
        if (existingEmail) {
            return res.status(409).send({
                success: false,
                message: "Email already exists! Please use another email or try logging in."
            })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Save user
        const user = new userModel({ username, email, password: hashedPassword })
        await user.save()

        // Return token immediately (no need to log in separately)
        return res.status(201).send({
            success: true,
            message: "User created successfully!",
            token: generateToken(user),
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            }
        })

    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: "Error in register controller",
        })
    }
}



// Get All Users
exports.getAllUsersController = async (req, res) => {
    try {
        // Never return passwords — select('-password')
        const users = await userModel.find({}).select('-password')
        return res.status(200).send({
            success: true,
            userCount: users.length,
            message: "All users fetched successfully!",
            users
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: "Error in getAllUsers controller",
        })
    }
}



// Login Controller
exports.loginController = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).send({
                success: false,
                message: "Please provide email and password."
            })
        }

        // Find user — explicitly select password (excluded by default via schema later)
        const user = await userModel.findOne({ email }).select('+password')
        if (!user) {
            return res.status(401).send({
                success: false,
                message: "Invalid email or password."   // intentionally vague
            })
        }

        const isMatching = await bcrypt.compare(password, user.password)
        if (!isMatching) {
            return res.status(401).send({
                success: false,
                message: "Invalid email or password."   // intentionally vague
            })
        }

        return res.status(200).send({
            success: true,
            message: "Logged in successfully!",
            token: generateToken(user),
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            }
        })

    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: "Error in login controller",
        })
    }
}

