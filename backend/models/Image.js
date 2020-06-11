const mongoose = require('mongoose'); 

const ImageSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    path: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Image', ImageSchema);