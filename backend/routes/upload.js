const express = require('express');
const path = require("path");
const multer = require("multer");
const router = express.Router();
const Image = require('../models/Image');

const storage = multer.diskStorage({
    destination: "./public/upload/",
    filename: function (req, file, cb) {
        cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
});


router.post("/image", upload.single('image'),async (req, res) => {
    console.log(req.file.filename);
    const image = new Image({
        name: req.file.filename,
        path: `/public/upload/${req.file.filename}`,
    });

    const savedImage = await image.save();
    res.json(savedImage);
});

module.exports = router;