const { json } = require('express');
var ProductController = require('../controllers/productController');
const { updateProductSchemaValidation, createProductSchemaValidation } = require('../middleware/dataValidation');

const { verifyToken, verifyAdmin, verifySeller } = require('../middleware/verifyToken');

const router = require('express').Router();

router.put('/:id', verifySeller, updateProductSchemaValidation, ProductController.updateProduct);

//Add Product
router.post('/', verifySeller, createProductSchemaValidation, ProductController.addProduct);
//delete Product
router.delete('/:id', verifySeller, ProductController.deleteProduct);
//get Product
router.get('/:id', verifyToken, ProductController.getProduct);
//get all products for a store
router.get('/store/:id', verifyToken, ProductController.searchProductStore);
//get limit products for a store
//router.get('/store/:id/limit/:limit', verifyToken, ProductController.getProductsForStoreLimit);
//search product by his name
router.get('/search/:name', verifyToken, ProductController.searchProduct);
//search product by his name and store id
router.get('/search/:name/store/:id', verifyToken, ProductController.searchProductStore);

module.exports = router;
