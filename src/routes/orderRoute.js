const router = require('express').Router();
var OrderController = require('../controllers/orderController');
const { orderSchemaValidation } = require('../middleware/dataValidation');

const { verifyToken } = require('../middleware/verifyToken');

//creat an order for a user
router.post('/', verifyToken, orderSchemaValidation, OrderController.createOrder);

//get the order by id
router.get('/:id', verifyToken, OrderController.getOrder);
//get order by user id
router.get('/user/:id', verifyToken, OrderController.getOrders);
//get order by store id
router.get('/store/:id', verifyToken, OrderController.getOrdersByStore);
//get order by status
router.get('/status/:status', verifyToken, OrderController.getOrdersByStatus);
//get order by shipping status
router.get('/shippingStatus/:shippingStatus', verifyToken, OrderController.getOrdersByShippingStatus);
//get order by payment status
router.get('/paymentStatus/:paymentStatus', verifyToken, OrderController.getOrdersByPaymentStatus);
//get order by payment id
//router.get('/paymentId/:paymentId', verifyToken, OrderController.getOrderByPaymentId);

module.exports = router;
