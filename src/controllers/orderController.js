var OrderService = require('../services/orderService');
exports.createOrder = async (req, res) => {
	try {
		const order = await OrderService.createOrder(req);
		res.send(order);
	} catch (err) {
		res.status(500).send(err.message);
	}
};
exports.getOrders = async (req, res) => {
	try {
		const orders = await OrderService.getOrders(req);
		res.send(orders);
	} catch (err) {
		res.status(500).send(err.message);
	}
};
exports.getOrder = async (req, res) => {
	try {
		const order = await OrderService.getOrder(req);
		res.send(order);
	} catch (err) {
		res.status(500).send(err.message);
	}
};
exports.getOrdersByStore = async (req, res) => {
	try {
		const orders = await OrderService.getOrdersByStore(req);
		res.send(orders);
	} catch (err) {
		res.status(500).send(err.message);
	}
};

exports.getOrdersByStatus = async (req, res) => {
	try {
		const orders = await OrderService.getOrdersByStatus(req);
		res.send(orders);
	} catch (err) {
		res.status(500).send(err.message);
	}
};
exports.getOrdersByShippingStatus = async (req, res) => {
	try {
		const orders = await OrderService.getOrdersByShippingStatus(req);
		res.send(orders);
	} catch (err) {
		res.status(500).send(err.message);
	}
};

exports.getOrdersByPaymentStatus = async (req, res) => {
	try {
		const orders = await OrderService.getOrdersByPaymentStatus(req);
		res.send(orders);
	} catch (err) {
		res.status(500).send(err.message);
	}
};
