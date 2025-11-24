const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "username is required"],
            unique: true
        },
        email: {
            type: String,
            required: [true, "email is required"],
            pattern: "^.+@.+\\..+$",
            unique: true
            
        },
        password: {
            type: String,
            required: [true, "password is required"]
        }

    }, 
    { timestamps: true }
)

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;