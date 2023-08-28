const mongoose = require('mongoose')

const logger = require('./winston')

mongoose.set('strictQuery', false)

const connectToDb = (url) => {
    return mongoose.connect(url, (err) => {
        if (!err)
            logger.info(`connect to db at ${new Date()}`)
        else
            logger.error(`error during connected to db at ${new Date()}`)
    })
}

module.exports = connectToDb