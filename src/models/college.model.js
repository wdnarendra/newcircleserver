const mongoose = require('mongoose')

const Schema = mongoose.Schema({
    'College Name': [String]
}, { timestamps: true })

module.exports = mongoose.model('College Name', Schema, 'College Name')