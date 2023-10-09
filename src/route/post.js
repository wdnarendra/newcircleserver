const route = require('express').Router()

const { postController } = require('../controller/')
const validatejwt = require('../middleware/validatejwt')

route.route('/createPost').post(validatejwt, postController.createPost)
route.route('/createComment').post(validatejwt, postController.createComment)
route.route('/loadComment/:postId').get(postController.loadComment)
route.route('/deletePost/:postId').delete(validatejwt, postController.deletePost)
route.route('/reportPost').post(validatejwt, postController.reportPost)


module.exports = route