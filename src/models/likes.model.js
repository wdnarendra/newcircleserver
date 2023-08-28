const mongoose = require('mongoose')

const likeSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    personLikes: {
        type: Array,
        default: []
    },
    communityLikes: {
        type: Array,
        default: []
    }
}, { timestamps: true })

module.exports = mongoose.model('Likes', likeSchema, 'Likes')

