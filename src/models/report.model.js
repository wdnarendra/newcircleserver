const mongoose = require('mongoose')

const Schema = mongoose.Schema({
    postId: String,
    userId: { type: mongoose.Schema.Types.ObjectId },
    comment: String
}, { timestamps: true })

module.exports = mongoose.model('Report', Schema, 'Report')