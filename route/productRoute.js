const express = require('express')
const router = express.Router()
const productController = require('../controller/productController')

router.post('/products',productController.addProduct)
router.get('/products',productController.getAllProducts)
router.put('/products/:id',productController.editProduct)
router.delete('/products/:id',productController.deleteProduct)
router.get('/products/:id',productController.getSpecificProduct)
router.put('/updateStock/:id',productController.updateProductStock)

router.get('/searchProducts',productController.handleSearch)
// router.post('/cart',productController.addToCart)

router.get('/category',productController.getProductCategory)
router.post('/category',productController.addProductCategory)
router.put('/category/:id',productController.editProductCategory)
router.delete('/category/:id',productController.deleteProductCategory)

router.get('/trends',productController.getProductCategoryTrends)
router.post('/trends',productController.addProductCategoryTrends)
router.put('/trends/:id',productController.editProductCategoryTrends)
router.delete('/trends/:id',productController.deleteProductCategoryTrends)

module.exports = router