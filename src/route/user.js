const route = require('express').Router()

const { userController } = require('../controller/')
const validatejwt = require('../middleware/validatejwt')
const upload = require('../middleware/upload')
route.route('/getProfile/:userId').get(validatejwt, userController.getProfile)
route.route('/followandunfollow').patch(validatejwt, userController.getProfile)
route.route('/getPosts/:userId').get(validatejwt, userController.getPosts)
route.route('/getFollows/:userId').get(userController.getFollowing)
route.route('/getFollowers/:userId').get(userController.getFollowers)
route.route('/followandunfollow/:userId').get(validatejwt, userController.followAndUndo)
route.route('/likeandunlike/:postId').get(validatejwt, userController.likeAndUndo)
route.route('/search/:search').get(userController.search)
route.route('/home').get(validatejwt, userController.home)
route.route('/upload').post(upload.array('file'), userController.upload)


module.exports = route