const mongoose = require('mongoose')

const commentsObjectSchema = mongoose.Schema({
    userName: {
        type: String,
        trim: true,
        lowercase: true,
        required: true
    },
    date: {
        type: Date,
        default: Date()
    },
    comment: {
        type: String,
        trim: true,
        default: ''
    },
    commentId: {
        type: String,
        trim: true,
        required: true
    }
}, { timestamps: true })

const commentSchema = mongoose.Schema({
    id: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    type: {
        type: String,
        required: true,
        enum: ['person', 'community']
    },
    comments: {
        type: [commentsObjectSchema],
        default: []
    }
}, { timestamps: true })

module.exports = mongoose.model('Comment', commentSchema, 'Comment')