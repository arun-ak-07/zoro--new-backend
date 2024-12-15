const mongoose = require('mongoose')

const bannedSchema = new mongoose.Schema({
    bannedUser : {
        type : String,
        required : true
    }
})

const ban = mongoose.model('Banned',bannedSchema)

module.exports = ban