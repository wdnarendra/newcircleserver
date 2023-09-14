const catchAsync = require("../utils/catchAsync")
const User = require('../models/user.model')


const getProfile = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ _id: req.userId })
    if (!user) throw NotFoundError('user not exist')
    return res.json({ statusCode: 200, data: user })
})

module.exports = { getProfile }