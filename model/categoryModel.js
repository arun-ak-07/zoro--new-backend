const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    categoryName : {
        type : String,
        required : true
    },
    categoryImage : {
        type : String,
        required : true
    },
})


const productCategory = mongoose.model('category', categorySchema)

module.exports = productCategory