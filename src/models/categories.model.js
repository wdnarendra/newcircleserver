const mongoose = require('mongoose')

const Schema = mongoose.Schema({
    name: String,
    sub: [String]
}, { timestamps: true })

module.exports = mongoose.model('Categories', Schema, 'Categories')