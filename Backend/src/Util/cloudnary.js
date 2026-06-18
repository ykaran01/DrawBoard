import {v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
    cloudinary.config({ 
        cloud_name:process.env.CLOUD_NAME, 
        api_key: process.env.API_KEY, 
        api_secret: process.env.API_SECRET
    });


 export   const uploadOnCloudnary = async (localfilepath)=>{
        try{
            if(!localfilepath) return;
            const response = await cloudinary.uploader.upload(localfilepath,{
              resource_type:'auto'
            })
            fs.unlinkSync(localfilepath)
            console.log('Uploaded Succesfully on Cloundanary ',response.url);
            return response;
            

        }catch(error){
            if(localfilepath)
                fs.unlinkSync(localfilepath)
        }
    }
 

    
