import 'dotenv/config'
import mongoose from 'mongoose';
import { DB_NAME } from '../constants/constants.js';

const ConnectDB = async() =>{
    try {
        const ConnectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log(`\n MongoDB Host connected !! DB Host : ${ConnectionInstance.connection.host}`);
        
    } catch (error) {
        console.log("MongoDB Connection Error:", error);
        process.exit(1);
    }
}

const AdminSchema = new mongoose.Schema({
    username:String,
    password:String,
    AvatarImage:String
});
const UserSchema = new mongoose.Schema({
    username:String,
    password:String,
    AvatarImage:String
});

const Admin = mongoose.model('Admin',AdminSchema);
const User = mongoose.model('User',UserSchema);

// module.exports = {
//     Admin,
//     User
    
// }

export default ConnectDB;