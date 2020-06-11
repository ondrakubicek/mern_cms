const express = require('express');
const router = express.Router();
const Image = require('../models/Image');


router.get('/', async (req, res) => {
    try {
        const images = await Image.find();
        res.json(images);
    } catch (err) {
        res.json({ message: err });
    }
});


router.get('/:imageId', async function (req, res) {
    try {
        const image = await Image.findById(req.params.imageId);
        res.json(image);
    } catch (err) {
        res.json({ message: err });
    }
});


module.exports = router;
