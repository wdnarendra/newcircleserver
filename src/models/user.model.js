const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    email: { type: String, trim: true, unique: true },
    mobileNumber: { type: String, trim: true },
    backgroundPath: { type: String, trim: true, default: '' },
    gender: { type: String, enum: ['male', 'female'] },
    interest: { type: Array, default: [] },
    isVerified: Boolean,
    location: Map,
    title: String,
    bio: String,
    dob: String,
    education: [{
        etype: { type: String, enum: ['school', 'college'] },
        name: String,
        specialisation: String,
        degree: String,
        start: String,
        end: String
    }],
    profession: [{
        name: String,
        position: String,
        start: String,
        end: String
    }],
    name: { type: String, trim: true },
    userName: { type: String, trim: true, lowercase: true, unique: true },
    profilePath: { type: String, trim: true, default: '' },
    flag: Boolean
}, { timestamps: true })

module.exports = mongoose.model('Users', UserSchema, 'Users')