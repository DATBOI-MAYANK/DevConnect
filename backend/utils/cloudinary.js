import 'dotenv/config'
import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret:process.env.CLOUDINARY_API_KEY_SECRET 
});


const uploadOnCloudinary = async (localFilePath)=>{
    try {
        console.log("Cludinary----", localFilePath);
        
        if(!localFilePath) return "Could not access the file";

        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        })

        console.log("Response----", response);
        
        return response
    } catch (error) {
        console.log("Cloudinary Error",error);
        fs.unlinkSync(localFilePath)
        return null
        
    }
}


export {uploadOnCloudinary}