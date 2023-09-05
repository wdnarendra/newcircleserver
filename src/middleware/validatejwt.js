const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/config')
module.exports = (req, res, next) => {
    try {
        const token = req.get('Authorization')
        const data = jwt.verify(token, JWT_SECRET)
        req.userId = data.id
        next()
    } catch (err) {
        next(new UnauthorizedError('/src/middleware/validatejwt'))
    }
}