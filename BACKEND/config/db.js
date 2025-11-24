const mongoose = require('mongoose')

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log(`Successfully connected to Mongodb Database : ${mongoose.connection.host}`);        
    }
    catch(error){
        console.log(`Failed to connect to Mongodb Database - Error : ${error}`);        
    }
}


module.exports = connectDB