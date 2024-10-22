const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    gender: { type: String, required: true },
    profilePicture: { type: String, required: true },
    password: { type: String, required: true },
    age: { type: Number },
    location: { type: String },
    interests: { type: [String] }
  });
  

module.exports = mongoose.model('User', userSchema);