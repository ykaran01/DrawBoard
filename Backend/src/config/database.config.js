import mongoose from 'mongoose'

export   const connectDB = async()=>{
    try{
        const connection  =  await mongoose.connect("")
       
            console.log("Mongoose is Connected")
        
            console.log("Unaable to Coonect DB")
        
    }catch(err){
        console.log("Error Has beeen occurred", err.message)
        process.exit(1) 
    }
}