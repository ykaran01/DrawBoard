import { v2 as cloudinary } from 'cloudinary'


import fs from 'fs'
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

export const uploadOnCloudnary = (buffer) => {
    return new Promise((resolve, reject) => {
        if (!buffer)
            return reject(new Error("Buffer is not prenent"))

        const strem = cloudinary.uploader.upload_stream({
            resource_type: 'auto'
        }, (error, result) => {
            if (error) {
                return reject(error)
            }
            resolve(result)
        })
        strem.end(buffer)
    })
}



