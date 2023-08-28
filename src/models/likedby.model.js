const mongoose = require('mongoose')

const likedbySchema = mongoose.Schema({
    id: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['person', 'community']
    },
    likedby: {
        type: Array,
        default: []
    }
},{ timestamps: true })

module.exports = mongoose.model('Likedby', likedbySchema, 'Likedby')