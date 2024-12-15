const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

const userMiddleware = (req,res,next) => {
    const token = req.headers.authorization || req.cookies.token;

    console.log('Token :' , token)
    if(!token){
        return res.status(401).json({message : 'Unauthorized - No token provided' })
    }


try {
    const authtoken=token.split(" ")[1]
    const decoded = jwt.verify(authtoken, process.env.JWT_SECRET, {
        ignoreExpiration: true,
    })
    next()
}
catch (err){
    console.log('Error in userMiddleware : ', err)
    res.status(401).json({ message : 'Unauthorized - Invalid token'})
}
}

module.exports = userMiddleware;