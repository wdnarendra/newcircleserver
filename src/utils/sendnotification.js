const expo = require('../config/exposervice')


module.exports = async (exp) => {
    try {
        await expo(exp)
    } catch (err) {
        console.log(err)
    }
}
