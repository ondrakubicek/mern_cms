const mongoose = require('mongoose'); 
const Image = require('./Image');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 4,
        max: 255
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    date: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        default: "user"
    },
    image: {
        type: String
    }
});

module.exports = mongoose.model('Users', UserSchema);