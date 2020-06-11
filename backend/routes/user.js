const express = require('express');
const router = express.Router();
const User = require('../models/User');

const Image = require('../models/Image');
const fs = require('fs')
const verify = require('./verifyToken');


router.get('/list', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.json({ message: err });
    }
});


router.get('/item/:userId', async (req, res) => {
    try {
        const users = await User.findById(req.params.userId);
        res.json(users);
    } catch (err) {
        res.json({ message: err });
    }
});

router.delete('/:userId', verify, async (req, res) => {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json({message: "delete"});
});

router.patch('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);

        if (req.body.image) {
            if (user.image && user.image !== req.body.image) {
                const oldImage = await Image.findById(user.image);
                if (oldImage.path && fs.existsSync(`.${oldImage.path}`)) {
                    console.log(`.${oldImage.path}`);
                    fs.unlinkSync(`.${oldImage.path}`);
                }
                await Image.findByIdAndDelete(user.image);
            }
            user.image = req.body.image;
        }
        if (req.body.role) {
            user.role = req.body.role;
        }
        if (req.body.name) {
            user.name = req.body.name;
        }
        if (req.body.email) {
            const emailExist = await User.findOne({ email: req.body.email });
            if (emailExist) return res.status(400).send({ message: "email exist" });

            user.email = req.body.email;
        }
        await user.save();
        res.json(user);
    } catch (err) {
        res.json({ message: err });
    }
});


module.exports = router;
