const mongoose = require('mongoose')

const communityPostObjectSchema = mongoose.Schema({
    date: {
        type: Date,
        default: Date()
    },
    post: {
        type: String,
        trim: true,
        default: ''
    },
    postId: {
        type: String,
        trim: true,
        required: true
    },
    filePath: {
        type: String,
        trim: true,
        default: ''
    }
}, { timestamps: true })

const communityPostSchema = mongoose.Schema({
    communityId: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    posts: {
        type: [communityPostObjectSchema],
        default: []
    }
}, { timestamps: true })

module.exports = mongoose.model('CommunityPost', communityPostSchema, 'CommunityPost')