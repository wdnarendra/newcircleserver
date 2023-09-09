const mongoose = require('mongoose')

const Schema = mongoose.Schema({
    Degree: [String]
}, { timestamps: true })

module.exports = mongoose.model('Degree', Schema, 'Degree')