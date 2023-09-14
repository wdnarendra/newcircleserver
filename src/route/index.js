const route = require('express').Router()

const authencationRoutes = require('./authentication')
const userRoutes = require('./user')

route.use('/authentication', authencationRoutes)
route.use('/user', userRoutes)

module.exports = route