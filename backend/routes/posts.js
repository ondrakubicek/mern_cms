const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const verify = require('./verifyToken');


router.get('/list', async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch(err) {
        res.json({message: err});
    }
});

router.post('/new', verify, async (req, res) => {
    try {
        const post = new Post({
            title: req.body.title,
            description: req.body.description,
            author: req.user
        });

        const savedPost = await post.save();
        res.json(savedPost);
    } catch(err) {
        res.json({message: err});
    }
});

router.get('/item/:postId', async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        res.json(post);
    } catch(err) {
        res.json({message: err});
    }
});

router.patch('/:postId', async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);

        if (req.body.image) {
            if (post.image && post.image !== req.body.image) {
                const oldImage = await Image.findById(post.image);
                if (oldImage.path && fs.existsSync(`.${oldImage.path}`)) {
                    fs.unlinkSync(`.${oldImage.path}`);
                }
                await Image.findByIdAndDelete(post.image);
            }
            post.image = req.body.image;
        }
        if (req.body.title) {
            post.title = req.body.title;
        }

        if (req.body.description) {
            post.description = req.body.description;
        }
        await post.save();
        res.json(post);
    } catch (err) {
        res.json({ message: err });
    }
});


module.exports = router;
