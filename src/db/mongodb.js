const mongoose=require("mongoose")

const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        .then(()=>console.log("mongo db started successfully"))
        .catch((error)=>console.log("error in database",error))
    } catch (error) {
        (error)=>console.log("error in database",error)
    }
}

module.exports=connectDB