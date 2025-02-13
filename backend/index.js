import 'dotenv/config'
import express from 'express'
import ConnectDB from './Database/database.js';
const app = express();
const PORT = process.env.PORT || 3000;


(async ()=>{
    try {
        app.on("error",(error)=>{
            console.log("ERROR",error);
            throw error
        })
        app.listen(PORT,()=>{
            console.log(`App is listening to Port: ${PORT}`);
            ConnectDB()
            
        })
    } catch (error) {
        console.log("ERROR :",error);
        throw error
    }
})()