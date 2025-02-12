const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://mayankroy106106:m36YQRTJt9n2NeLb@cluster0.0wjlj.mongodb.net/DevConnect');

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