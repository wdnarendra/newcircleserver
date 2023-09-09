const mongoose = require('mongoose')

const Schema = mongoose.Schema({
    Specialization: [String]
}, { timestamps: true })

module.exports = mongoose.model('specialization', Schema, 'specialization')