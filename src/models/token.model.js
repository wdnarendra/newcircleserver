const mongoose = require('mongoose')

const Schema = mongoose.Schema({
    userName: String,
    socketId: String,
    firebaseToken: String,
    expoToken: String
}, { timestamps: true })

module.exports = mongoose.model('Token', Schema, 'Token')