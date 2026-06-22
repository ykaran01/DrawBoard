import mongoose from 'mongoose'

export   const connectDB = async()=>{
    try{
        const connection  =  await mongoose.connect(process.env.MONGODB_URL)
       
            console.log("Database is Connected ")
    
        
    }catch(err){
        console.log("Error Has beeen occurred", err.message)
        process.exit(1) 
    }
}