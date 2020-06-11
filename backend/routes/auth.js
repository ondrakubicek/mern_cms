const express = require('express');
const router = express.Router();
const User = require('../models/User');

const jwt = require('jsonwebtoken');
const bcryp = require('bcryptjs');
const { registerValidation, loginValidation } = require("../validation");
const verify = require('./verifyToken');




router.post('/register', async (req, res) => {
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send({message: "email exist"});

    const salt = await bcryp.genSalt(10);
    const hashPassword = await bcryp.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        password: hashPassword,
        email: req.body.email
    });
    
    try {
        const savedUser = await user.save();
        res.json({
            user: savedUser._id,
            password: savedUser.password
        });
    } catch (err) {
        res.status(400).json({message: err});
    }
});


router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    console.log(req.body.email);
    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).json({message:"Email is not exist"});

    const validPass = await bcryp.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).json({message:'invalid password'});

    // Create and assign token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.status(200).header('auth-token', token).json({user:user._id, token: token});
});

module.exports = router;