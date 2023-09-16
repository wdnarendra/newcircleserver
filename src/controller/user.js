const catchAsync = require("../utils/catchAsync")
const User = require('../models/user.model')
const Post = require('../models/post.model')
const Follow = require('../models/follow.model')
const Followers = require('../models/followers.model')

const getProfile = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ _id: req.userId })
    if (!user) throw NotFoundError('user not exist')
    return res.json({ statusCode: 200, data: user })
})

const getPosts = catchAsync(async (req, res, next) => {
    const { userId } = req.params
    let { limit, page } = req.query
    limit = Number(limit) || 10
    page = Number(page) || 1
    const skip = (page - 1) * limit
    const user = await User.findOne({ _id: userId })
    if (!user)
        throw new NotFoundError('user not exist')
    const posts = await Post.aggregate([{ $match: { userName: user.userName } }, {
        $project: {
            post: { $sortArray: { input: '$posts', sortBy: { date: -1 } } }
        }
    }, {
        $unwind: { path: '$post' }
    }, {
        $skip: skip
    }, { $limit: limit }])
    return res.json({ statusCode: 200, data: posts })
})

const getFollowers = catchAsync(async (req, res, next) => {
    const { userId } = req.params
    let { limit, page } = req.query
    limit = Number(limit) || 10
    page = Number(page) || 1
    const skip = (page - 1) * limit
    const user = await User.findOne({ _id: userId })
    if (!user)
        throw new NotFoundError('user not exist')
    const posts = await Followers.aggregate([{ $match: { id: user.userName } }, {
        $project: {
            followers: { $slice: ['$followers', skip, limit] }
        }
    }, {
        $lookup: {
            from: 'Users',
            localField: 'followers',
            foreignField: 'userName',
            as: 'followers'
        }
    }])
    return res.json({ statusCode: 200, data: posts })
})

const getFollowing = catchAsync(async (req, res, next) => {
    const { userId } = req.params
    let { limit, page } = req.query
    limit = Number(limit) || 10
    page = Number(page) || 1
    const skip = (page - 1) * limit
    const user = await User.findOne({ _id: userId })
    if (!user)
        throw new NotFoundError('user not exist')
    const posts = await Follow.aggregate([{ $match: { userName: user.userName } }, {
        $project: {
            follows: { $slice: ['$follows', skip, limit] }
        }
    }, {
        $lookup: {
            from: 'Users',
            localField: 'follows',
            foreignField: 'userName',
            as: 'follows'
        }
    }])
    return res.json({ statusCode: 200, data: posts })
})


module.exports = { getProfile, getPosts, getFollowers, getFollowing }