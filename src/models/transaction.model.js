const mongoose = require('mongoose')

const Schema = mongoose.Schema({
    userId: mongoose.Types.ObjectId,
    orderId: String,
    transactionId: String,
    for: mongoose.Types.ObjectId,
    amount: Number,
    hasProcessed: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model('Transaction', Schema, 'Transaction')