const catchAsync = require("../utils/catchAsync");
const Post = require('../models/post.model')
const User = require('../models/user.model')
const Comment = require('../models/comment.model')

const LikedBy = require('../models/likedby.model')


function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charactersLength);
        result += characters.charAt(randomIndex);
    }

    return result;
}

const createPost = catchAsync(async (req, res, next) => {

    const { postInterest, postLoc, post, filePath } = req.body

    const user = await User.findOne({ _id: req.userId })

    const postId = user.userName + '-' + generateRandomString(10)

    const date = new Date()

    await Promise.all([Post.updateOne({ userName: user.userName }, { $push: { posts: { date, postInterest, postLoc, post, filePath, postId } } })
        , LikedBy.create({ id: postId, type: 'person', likedby: [] }),
    Comment.create({ id: postId, type: 'person', comments: [] })
    ])
    return res.json({ statusCode: 200, data: { date, postId, postInterest, postLoc, filePath, post } })

})

module.exports = { createPost }