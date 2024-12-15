const mongoose = require('mongoose')

const connectDB = async () => {
    try{
        mongoose.connect(process.env.MONGOBD_CONN_URL)
        .then(()=>{
            console.log("DB connected")
        })
    }
    catch (error){
        console.log(error)
    }
}

module.exports = connectDB