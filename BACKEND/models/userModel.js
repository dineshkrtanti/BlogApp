const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            require: [true, "username is required"],
            unique: true
        },
        email: {
            type: String,
            require: [true, "email is required"],
            pattern: "^.+@.+\\..+$",
            unique: true
            
        },
        password: {
            type: String,
            require: [true, "password is required"]
        },
        blogs:[
            {
                type: mongoose.Types.ObjectId,
                ref: 'blog',
            }
        ]

    }, 
    { timestamps: true }
)

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;