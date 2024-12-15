const express = require('express')
const route = express.Router()
const userController = require('../controller/userController')
const userMiddleWare = require('../middleware/userMiddleware')

route.get('/users',userController.getUser)
route.post('/users',userController.userRegister)
route.put('/editUsers',userController.editUser)
route.put('/editEmail',userController.editUserEmail)
route.post('/banUser',userController.banUser)

route.post('/login',userController.loginUser)
route.put('/cart',userMiddleWare,userController.addToCart)
route.post('/getCart',userController.getCart)
route.put('/deleteCart/:id',userController.removeCart)

route.post('/getCategory/:category', userController.getCategoryWise)

route.put('/cart/:id',userController.increeementQty)

route.post('/address/:userId',userController.addAddress)
route.post('/address',userController.getAddress)
route.post('/deleteAddress/:index',userController.deleteAddress)
route.put('/updateAddress/:index',userController.updateAddress)
route.post('/getAddressByIndex/:index',userController.getAddressByIndex)

route.post('/myOrders/:userId',userController.myOrders)
route.post('/deletemyOrders/:index',userController.deleteMyOrders)

route.post('/wishlist',userController.addToWishlist)
route.post('/getWishlist',userController.getWishlist)
route.put('/deleteWishlist/:id',userController.removeWishlist)

module.exports = route