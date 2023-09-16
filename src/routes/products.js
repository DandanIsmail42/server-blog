const express = require('express')

const router = express.Router()

const productController = require('../controllers/products')

router.post('/product', productController.createProduct)
router.get('/products', productController.getAllProducts)



module.exports = router
