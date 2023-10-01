const route = require('express').Router()

const { userController } = require('../controller/')
const validatejwt = require('../middleware/validatejwt')

route.route('/getProfile/:userId').get(validatejwt, userController.getProfile)
route.route('/followandunfollow').patch(validatejwt, userController.getProfile)
route.route('/getPosts/:userId').get(validatejwt, userController.getPosts)
route.route('/getFollows/:userId').get(userController.getFollowing)
route.route('/getFollowers/:userId').get(userController.getFollowers)
route.route('/followandunfollow/:userId').get(validatejwt, userController.followAndUndo)
route.route('/likeandunlike/:postId').get(validatejwt, userController.likeAndUndo)
route.route('/search/:search').get(userController.search)


module.exports = route