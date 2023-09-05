const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    email: { type: String, trim: true, unique: true },
    mobileNumber: { type: String, trim: true },
    backgroundPath: { type: String, trim: true, default: 'nopicture.circle' },
    gender: { type: String, enum: ['male', 'female'] },
    interest: { type: Array, default: [] },
    isVerified: Boolean,
    location: Map,
    name: { type: String, trim: true },
    userName: { type: String, trim: true, lowercase: true, unique: true },
    profilePath: { type: String, trim: true, default: 'nopicture.circle' },
    flag: Boolean
}, { timestamps: true })

module.exports = mongoose.model('Users', UserSchema, 'Users')