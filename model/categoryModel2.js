const mongoose = require('mongoose')

const catTrendsSchema = new mongoose.Schema({
    catTrendName : {
        type : String,
        required : true
    },
    catTrendImage : {
        type : String,
        required : true,
    },
})


const prodTrendsCat = mongoose.model('Trends', catTrendsSchema)

module.exports = prodTrendsCat