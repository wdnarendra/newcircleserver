const mongoose = require('mongoose')

const postObjectSchema = mongoose.Schema({
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
    postLoc: {
        type: Map
    },
    postInterest: {
        type: Array,
        default: []
    },
    filePath: [{
        type: String,
        trim: true,
        default: 'nopicture.circle'
    }]
}, { timestamps: true })

const PostSchema = mongoose.Schema({
    userName: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true
    }, posts: { type: [postObjectSchema], default: [] }
}, { timestamps: true })

module.exports = mongoose.model('Posts', PostSchema, 'Posts')