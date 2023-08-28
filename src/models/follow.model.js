const mongoose = require('mongoose')

const followSchema = mongoose.Schema({
    userName:{
        type:String,
        trim:true,
        lowercase:true,
        required:true,
        unique:true
    },
    communityFollows:{
        type:Array,
        default: []
    },
    follows:{
        type:Array,
        default: []
    }
},{ timestamps: true })

module.exports = mongoose.model('Follows',followSchema,'Follows')