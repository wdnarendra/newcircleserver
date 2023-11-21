const mongoose = require('mongoose')

const Schema = mongoose.Schema({
    status: Boolean,
    name: String,
    description: String,
    date: {
        start: Date,
        end: Date
    },
    location: {
        coordinates: { type: Map },
        address: { type: Map }
    },
    seats: Number,
    organiser: Map,
    price: Number,
    cover: String,
    category: String,
    subcategory: String,
    bookedBy: { type: Array, default: [] },
    createdBy: mongoose.Types.ObjectId
}, { timestamps: true })

module.exports = mongoose.model('Event', Schema, 'Event')