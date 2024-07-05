const mongoose = require("mongoose")

const connectDB  = async () => {
    try{
      const connection = await mongoose.connect(process.env.MONGO_URI)
      console.log(`DB Connected`)
    }catch(error){
        console.log("DB connection failed due to Error: " + error)
    }
} 

module.exports = connectDB