const mongoose = require('mongoose')

const communityObjectSchema = mongoose.Schema({
    communityId: {
        type: String,
        lowercase: true,
        required: true,
        trim: true
    },
    communityType: {
        type: String,
        enum: ['public', 'private'],
        required: true
    },
    communityName: {
        type: String,
        trim: true,
        required: true
    },
    communityInterest: {
        type: Array,
        default: []
    },
    communityLoc: Map,
    communityInterest: {
        type: Array,
        default: []
    },
    description: {
        type: String,
        trim: true
    },
    backgroundPath: {
        type: String,
        trim: true,
        default: 'nopicture.circle'
    },
    profilePath: {
        type: String,
        trim: true,
        default: 'nopicture.circle'
    }
}, { timestamps: true })

const communitySchema = mongoose.Schema({
    userName: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: true
    },
    community: {
        type: [communityObjectSchema],
        default: []
    }
}, { timestamps: true })

module.exports = mongoose.model('Community', communitySchema, 'Community')