const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    image : {
        type : String,
        required : true
    },
    category : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    anime : {
        type : String,
    },
    qty : {
        type : Number,
        required : true,
    },
    size : {
        type : String,
        required : true,
    },
    stock:{
        S:{
            type:Number,
            required : false
        },
        M:{
            type:Number,
            required : false
        },
        X:{
            type:Number,
            required:false,
        },
        XL:{
            type:Number,
            required:false,
        },
        XXL: {
            type:Number,
            required:false
        }
    }
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product