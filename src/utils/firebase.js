const auth = require('../config/firebase')

module.exports = async (token) => {
    const decodedToken = await auth.verifyIdToken(token)
    if (!decodedToken.email_verified) throw new UnauthorizedError('./utils/firebase')
    return decodedToken
}