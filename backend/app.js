const express = require('express');
const app = express();
const mongoose = require('mongoose'); 
const multer = require("multer");
app.use(express.json())

require('dotenv/config');

app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, auth-token');

    // Pass to next layer of middleware
    next();
});

//Import Routes

const authRoute = require('./routes/auth');
app.use('/api/user', authRoute);

const authUser = require('./routes/user');
app.use('/api/user', authUser);

const image = require('./routes/image');
app.use('/api/image', image);

const upload = require('./routes/upload');
app.use('/api/upload', upload);


const postsRoute = require('./routes/posts');
app.use('/api/post', postsRoute);

// Home
app.get('/', (req, res) => {
    res.send('We are on home');
});


// Database

mongoose.connect(
    process.env.DB_CONNECTION,
    {useNewUrlParse: true},
    () => console.log('connected to DB') 
);


// Error

function errHandler(err, req, res, next) {
    if (err instanceof multer.MulterError) {
        res.json({
            success: 0,
            message: err.message
        })
    }
}


// Public path
app.use('/public', express.static('public/'))

app.use(errHandler);
app.listen(4000);