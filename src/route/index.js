const route = require('express').Router()

const { authenticationController } = require('../controller/')

// const apiController = require('../controller/controller')

route.route('/authentication').post(authenticationController)

module.exports = route