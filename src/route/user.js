const route = require('express').Router()

const { userController } = require('../controller/')
const validatejwt = require('../middleware/validatejwt')

route.route('/getProfile').get(validatejwt, userController.getProfile)


module.exports = route