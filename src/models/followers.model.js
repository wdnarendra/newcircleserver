const mongoose = require('mongoose')

const followerSchema = mongoose.Schema({
    id: {
        type: String,
        unique: true,
        trim: true,
        required: true,
    },
    type: {
        type: String,
        enum: ['person', 'community'],
        required: true
    },
    followers: {
        type: Array,
        default: []
    }
}, { timestamps: true })

module.exports = mongoose.model('Followers', followerSchema, 'Followers')