const router = require('express').Router();
var CartController = require('../controllers/cartController');
const { itemSchemaValidation } = require('../middleware/dataValidation');

const { verifyToken, verifyTokenAndAutherization } = require('../middleware/verifyToken');
const { query } = require('express');

//Add product to cart
router.post('/add', verifyToken, itemSchemaValidation, CartController.addToCart);

//get cart
router.get('/', verifyToken, CartController.getCart);

//update the cart
router.put('/:id', verifyToken, CartController.updateCart);
//delete from cart
router.delete('/:id', verifyToken, CartController.deleteProductFromCart);

//update the quantity of the product in the cart
router.put('/update/quantity/:idProduct/:idVaraint', verifyToken, CartController.updateQuantityCart);
//delete the product from the cart
router.delete('/delete/:id', verifyToken, CartController.deleteProductCart);
//delete the cart
router.delete('/delete', verifyToken, CartController.deleteCart);

module.exports = router;
