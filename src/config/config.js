require('dotenv').config('../../.env')

module.exports = {
    MONGO_URL: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/fakeshop',
    PORT: process.env.PORT || 80,
    NODE_ENV: process.env.NODE_ENV || 'staging',
    JWT_SECRET: process.env.JWT_SECRET || 'soemlajsdflkaslkdjfk'
}