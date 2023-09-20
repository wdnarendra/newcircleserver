const catchAsync = require("../utils/catchAsync");
const firebase = require('../config/firebase');
const httpStatus = require("http-status");
const jwt = require('jsonwebtoken')
const User = require('../models/user.model')
const { JWT_SECRET } = require('../config/config')
const college = require('../models/college.model')
const specilization = require('../models/speciliazation.model')
const degree = require('../models/degree.model')
const categories = require('../models/categories.model')
const Follow = require('../models/follow.model')
const Follower = require('../models/followers.model')
const Like = require('../models/likes.model')
const checkUser = catchAsync(async (req, res, next) => {
    const { userName, email, token } = req.query
    if (email) {
        const data = await firebase.getUserByEmail(email)
        if (!data.emailVerified) throw new ApiError('/checkUser', httpStatus.FORBIDDEN, 'Email is not verified yet! Please verify your mail first!!')
        return res.json({ statusCode: 200, data })
    }
    if (userName) {
        const data = await User.findOne({ userName })
        if (!data) throw new NotFoundError('/checkUser')
        return res.json({ statusCode: 200, data: true })
    }
    if (token) {
        const data = await firebase.verifyIdToken(token)
        if (!data.email_verified) throw new ApiError('/checkUser', httpStatus.FORBIDDEN, 'Email is not verified yet! Please verify your mail first!!')
        let user = await User.findOne({ email: data.email })
        if (!user) { user = await User.create({ email: data.email }) }
        return res.json({ statusCode: 200, data: { adddeatils: user?.userName ? true : false, jwt: jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '30d' }) } })
    }
    return res.json({ statusCode: 200, data: 1.0 })
})

const updateUser = catchAsync(async (req, res, next) => {

    const user = await User.findOne({ _id: req.userId })
    if (!user) throw new NotFoundError('/checkUser')
    if (!user.flag) {
        await Promise.all([Follow.create({ userName: user.userName, follows: [] }),
        Follower.create({ id: user.userName, type: 'person', followers: [] }),
        Like.create({ userName: user.userName, personLikes: [] })
        ])
    }
    Object.assign(user, req.body)
    Object.assign(user, { flag: true })
    await user.save()
    return res.json({ statusCode: 200, data: user })

})

const fetchData = catchAsync(async (req, res, next) => {

    const { type } = req.params

    let model = college

    if (type === 'specilization') model = specilization

    if (type === 'degree') model = degree

    if (type === 'categories') model = categories

    const response = await model.find({})

    return res.json({ statusCode: 200, data: response })

})

module.exports = { checkUser, updateUser, fetchData }