const route = require('express').Router()

const authencationRoutes = require('./authentication')

route.use('/authentication', authencationRoutes)

module.exports = route