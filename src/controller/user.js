const catchAsync = require("../utils/catchAsync")
const User = require('../models/user.model')
const Post = require('../models/post.model')
const Follow = require('../models/follow.model')
const Followers = require('../models/followers.model')
const Like = require('../models/likes.model')
const LikedBy = require('../models/likedby.model')
const Token = require('../models/token.model')
// const expo = require('../utils/sendnotification')

const getProfile = catchAsync(async (req, res, next) => {
    let { userId } = req.params
    if (userId === 'self') {
        userId = req.userId
    }
    const [user, requestUser] = await Promise.all([User.findOne({ _id: userId }), User.findOne({ _id: req.userId })])
    if (!user) throw NotFoundError('user not exist')
    const [follows, followers, isfollowed] = await Promise.all([Follow.findOne({ userName: user.userName }),
    Followers.findOne({ id: user.userName }), Follow.findOne({ userName: requestUser.userName })])
    const temp = isfollowed.follows?.some((value2) => (value2 === user.userName))
    return res.json({
        statusCode: 200, data: {
            ...user.toObject(), follows: follows?.follows?.length,
            followers: followers?.followers?.length, isfollowed: temp
        }
    })
})

const getPosts = catchAsync(async (req, res, next) => {
    let { userId } = req.params
    let { limit, page, postId } = req.query
    limit = Number(limit) || 10
    page = Number(page) || 1
    const skip = (page - 1) * limit
    let query = {
        $project: {
            post: {
                $sortArray: {
                    input: '$posts',
                    sortBy: { date: -1 }
                }
            }
        }
    }
    if (postId) {
        userId = (await User.findOne({ userName: postId.split('-')[0] }))?._id
        if (!userId) throw new NotFoundError('user not exist')
        query = {
            $project: {
                post: {
                    $filter: {
                        input: "$posts",
                        as: "item",
                        cond: { $eq: ["$$item.postId", postId] }
                    }
                }
            }
        }
    }
    const [user, requestUser] = await Promise.all([User.findOne({ _id: userId }), User.findOne({ _id: req.userId })])
    if (!user)
        throw new NotFoundError('user not exist')
    let [posts, likedpost, followed] = await Promise.all([Post.aggregate([{ $match: { userName: user.userName } },
        query, {
        $unwind: { path: '$post' }
    }, {
        $lookup: {
            from: "Likedby",
            localField: "post.postId",
            foreignField: "id",
            as: "likedby"
        }
    }, {
        $unwind: { path: '$likedby' }
    }, {
        $set: {
            likedby: {
                $cond: {
                    if: { $isArray: "$likedby.likedby" },
                    then: { $size: "$likedby.likedby" },
                    else: 0
                }
            }
        }
    }, {
        $lookup: {
            from: "Comment",
            localField: "post.postId",
            foreignField: "id",
            as: "comment"
        }
    }, {
        $unwind: { path: '$comment' }
    }, {
        $set: {
            comment: {
                $cond: {
                    if: { $isArray: "$comment.comments" },
                    then: { $size: "$comment.comments" },
                    else: 0
                }
            }
        }
    }, {
        $skip: skip
    }, { $limit: limit }]), Like.findOne({ userName: requestUser.userName }), Follow.findOne({ userName: requestUser.userName })])
    const temp = followed.follows?.some((value2) => (value2 === user.userName))
    posts = posts.map((value) => {
        value.user = {
            _id: user.id,
            userName: user.userName,
            backgroundPath: user.backgroundPath,
            name: user.name,
            profilePath: user.profilePath,
            bio: user.bio,
            isVerified: user.isVerified,
            isfollowed: temp,
            gender: user.gender
        }
        value.isliked = likedpost.personLikes?.some((value2) => (value2 === value?.post?.postId))
        return value
    })
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
    },
    {
        $lookup: {
            from: 'Users',
            let: { temp: '$followers' },
            pipeline: [
                {
                    $match: {
                        $expr: { $in: ['$userName', '$$temp'] }
                    }
                },
            ],
            as: 'followers'
        }
    }
    ])
    return res.json({ statusCode: 200, data: posts[0] })
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
    },
    {
        $lookup: {
            from: 'Users',
            let: { temp: '$follows' },
            pipeline: [
                {
                    $match: {
                        $expr: { $in: ['$userName', '$$temp'] }
                    }
                },
            ],
            as: 'follows'
        }
    }
    ])
    return res.json({ statusCode: 200, data: posts[0] })
})

const followAndUndo = catchAsync(async (req, res, next) => {
    const user_id = req.userId
    const { userId } = req.params
    let operator;
    const [user, secondUser] = await Promise.all([User.findOne({ _id: user_id }), User.findOne({ _id: userId })])
    const check = await Follow.findOne({ userName: user.userName, follows: secondUser.userName })
    if (check) operator = '$pull'
    else operator = '$addToSet'
    const [_, __, ___] = await Promise.all([Follow.updateOne({ userName: user.userName }, { [operator]: { follows: secondUser.userName } }),
    Followers.updateOne({ id: secondUser.userName }, { [operator]: { followers: user.userName } }),
    Token.findOne({ userName: secondUser.userName })
    ])
    if ((user_id !== userId) && !check) { }
    // expo([{
    //     to: ___?.expoToken,
    //     sound: 'default',
    //     body: `${user.userName} started following you`,
    //     data: { url: `/user/${user.userName}`, userID: userId },
    // }])
    return res.json({ statusCode: 200, data: true })
})

const likeAndUndo = catchAsync(async (req, res, next) => {
    const userId = req.userId
    const { postId } = req.params
    let operator;
    const user = await User.findOne({ _id: userId })
    const postUserName = postId.split('-')[0]
    const check = await Like.findOne({ userName: user.userName, personLikes: postId })
    if (check) operator = '$pull'
    else operator = '$addToSet'
    const [_, __, ___] = await Promise.all([Like.updateOne({ userName: user.userName }, { [operator]: { personLikes: postId } }),
    LikedBy.updateOne({ id: postId }, { [operator]: { likedby: user.userName } }),
    Token.findOne({ userName: postUserName })
    ])
    if ((user !== postUserName) && !check) { }
    // expo([{
    //     to: ___?.expoToken,
    //     sound: 'default',
    //     body: `${user.userName} liked your post`,
    //     data: { url: `/post/${postId}`, postID: postId },
    // }])
    return res.json({ statusCode: 200, data: true })
})

const search = catchAsync(async (req, res, next) => {
    const { search } = req.params
    let { limit, page } = req.query
    limit = Number(limit) || 10
    page = Number(page) || 1
    const skip = (page - 1) * limit

    const response = await User.find({ $or: [{ name: { $regex: search, $options: 'i' } }, { userName: { $regex: search, $options: 'i' } }] }).skip(skip).limit(limit).select('name gender userName _id profilePath isVerified')

    return res.json({ statusCode: 200, data: response })

})

const home = catchAsync(async (req, res, next) => {

    const userId = req.userId
    let { limit, page, long, lat } = req.query
    limit = Number(limit) || 10
    page = Number(page) || 1
    const skip = (page - 1) * limit
    const user = await User.findOne({ _id: userId })
    let [post, isliked, isfollowed] = await Promise.all([Post.aggregate([{
        $match:
            { 'posts.postLoc': { $geoWithin: { $centerSphere: [[Number(long), Number(lat)], 12 / 3963.2] } } }
    }, { $project: { userName: 1, posts: 1, _id: 1 } }, { $unwind: "$posts" }, { $match: { 'posts.postLoc': { $geoWithin: { $centerSphere: [[Number(long), Number(lat)], 12 / 3963.2] } } } },
    { $sort: { 'posts.date': -1 } }, { "$skip": skip }, { "$limit": limit },
    { $set: { post: '$posts' } }, { $unset: 'posts' },
    {
        $lookup: {
            from: "Likedby",
            localField: "post.postId",
            foreignField: "id",
            as: "likedby"
        }
    }, {
        $unwind: { path: '$likedby' }
    }, {
        $set: {
            likedby: {
                $cond: {
                    if: { $isArray: "$likedby.likedby" },
                    then: { $size: "$likedby.likedby" },
                    else: 0
                }
            }
        }
    }, {
        $lookup: {
            from: "Comment",
            localField: "post.postId",
            foreignField: "id",
            as: "comment"
        }
    }, {
        $unwind: { path: '$comment' }
    }, {
        $set: {
            comment: {
                $cond: {
                    if: { $isArray: "$comment.comments" },
                    then: { $size: "$comment.comments" },
                    else: 0
                }
            }
        }
    }, {
        $lookup: {
            from: 'Users',
            let: { temp: '$userName' },
            pipeline: [{ $match: { $expr: { $eq: ['$$temp', '$userName'] } } }, { $project: { name: 1, _id: 1, profilePath: 1, gender: 1, userName: 1, isVerified: 1 } }],
            as: 'user'
        }
    }, { $unwind: '$user' }
    ]), Like.findOne({ userName: user.userName }), Follow.findOne({ userName: user.userName })])

    post = post.map((value) => {
        value.user.isfollowed = isfollowed.follows?.some((value2) => (value2 === value.user.userName))
        value.isliked = isliked.personLikes?.some((value2) => (value2 === value?.post?.postId))
        return value
    })

    return res.json({ statusCode: 200, data: post })

})

const upload = catchAsync(async (req, res, next) => {
    if (req.files) {
        return res.json({ statusCode: 200, data: req.files })
    }
    throw new NotFoundError('files are not present')
})
module.exports = { upload, getProfile, getPosts, getFollowers, getFollowing, followAndUndo, likeAndUndo, search, home }