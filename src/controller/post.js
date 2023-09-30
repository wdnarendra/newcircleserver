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


const createComment = catchAsync(async (req, res, next) => {


    let { comment, postId, commentId, nested } = req.body

    const user = await User.findOne({ _id: req.userId })

    let find = { id: postId }
    let update = 'comments'
    if (commentId) {
        find = { id: postId, 'comments.commentId': commentId }
        update = 'comments.$.nested'
        commentId = commentId + '-' + generateRandomString(10)
    }
    else {
        commentId = postId + '-' + generateRandomString(10)
    }
    const date = new Date()

    await Comment.updateOne(find, { $push: { [update]: { date, comment, commentId, userName: user.userName } } })

    return res.json({ statusCode: 200, data: { date, postId, commentId, comment, userName: user.userName } })

})


const loadComment = catchAsync(async (req, res, next) => {

    let { postId } = req.params

    let { limit, page, nested, commentId } = req.query
    limit = Number(limit) || 10
    page = Number(page) || 1
    const skip = (page - 1) * limit
    let response = ''
    if (commentId) {
        response = await Comment.aggregate([
            {
                $match: { id: postId }
            },
            {
                $project: {
                    comments: {
                        $filter: {
                            input: "$comments",
                            as: "item",
                            cond: { $eq: ["$$item.commentId", commentId] }
                        }
                    }
                }
            }, { $set: { comments: { $arrayElemAt: ['$comments', 0] } } }, { $set: { comments: '$comments.nested' } }, { $unwind: '$comments' },
            { $skip: skip }, { $limit: limit },
            {
                $lookup: {
                    from: 'Users',
                    localField: 'comments.userName',
                    foreignField: 'userName',
                    as: 'user'
                }
            }, { $unwind: '$user' }, { $set: { 'comments.user': { profilePath: '$user.profilePath', name: '$user.name' } } }, { $unset: 'user' }
        ]);
    }
    else {
        response = await Comment.aggregate([{ $match: { id: postId } }, {
            $project: {
                comments: { $slice: ['$comments', skip, limit] }
            }
        }, { $unwind: '$comments' }, {
            $lookup: {
                from: 'Users',
                localField: 'comments.userName',
                foreignField: 'userName',
                as: 'user'
            }
        }, { $unwind: '$user' }, { $set: { 'comments.user': { profilePath: '$user.profilePath', name: '$user.name' } } }, { $unset: 'user' },
        ])
    }

    return res.json({ statusCode: 200, data: response })

})
module.exports = { createPost, createComment, loadComment }