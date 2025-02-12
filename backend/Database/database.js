const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

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

module.exports = {
    Admin,
    User
}