const route = require('express').Router()

const authencationRoutes = require('./authentication')
const userRoutes = require('./user')
const postRoutes = require('./post')
route.use('/authentication', authencationRoutes)
route.use('/user', userRoutes)
route.use('/post', postRoutes)

module.exports = route