const route = require('express').Router()

const { authenticationController } = require('../controller/')
const validatejwt = require('../middleware/validatejwt')
route.route('/checkUser').get(authenticationController.checkUser)
route.route('/updateUser').patch(validatejwt, authenticationController.updateUser)

module.exports = route