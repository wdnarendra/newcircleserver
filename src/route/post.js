const route = require('express').Router()

const { postController } = require('../controller/')
const validatejwt = require('../middleware/validatejwt')

route.route('/createPost').post(validatejwt, postController.createPost)


module.exports = route