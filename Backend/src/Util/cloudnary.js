import {v2 as cloudinary } from 'cloudinary'

import fs from 'fs'
    cloudinary.config({ 
        cloud_name:'djd2xqjzs', 
        api_key: '593598238342361', 
        api_secret: 'LJ95NhPEYpVlrZt0qZ-9-1jj5v0'
    });

 export   const uploadOnCloudnary = async (localfilepath)=>{
        try{
            
            if(!localfilepath) return;
            const response = await cloudinary.uploader.upload(localfilepath,{
              resource_type:'auto'
            })
            await fs.unlinkSync(localfilepath)
            console.log('Uploaded Succesfully on Cloundanary ',response.url);
            return response;
            

        }catch(error){
            if(localfilepath)
                fs.unlinkSync(localfilepath)
        }
    }
 

    
