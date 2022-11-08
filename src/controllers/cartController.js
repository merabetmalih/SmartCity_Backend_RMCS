var CartService = require('../services/cartService');

exports.addToCart = async (req, res) => {
	try {
		const cart = await CartService.addToCart(req);
		res.send(cart);
	} catch (err) {
		res.status(500).send(err.message);
	}
};
exports.getCartt = async (req, res) => {
	try {
		const cart = await CartService.getCart(req);
		res.send(cart);
	} catch (err) {
		res.status(500).send(err.message);
	}
};
exports.updateCart = async (req, res) => {
	try {
		const cart = await CartService.updateCart(req);
		res.send(cart);
	} catch (err) {
		res.status(500).send(err.message);
	}
};
exports.deleteProductFromCart = async (req, res) => {
	try {
		const cart = await CartService.deleteProductFromCart(req);
		res.send(cart);
	} catch (err) {
		res.status(500).send(err.message);
	}
};
exports.getCart = async (req, res) => {
	try {
		console.log('getCart Controller');
		const cart = await CartService.getCart(req);
		res.send(cart);
	} catch (err) {
		res.status(500).send(err.message);
	}
};
exports.updateQuantityCart = async (req, res) => {
	try {
		const cart = await CartService.updateQuantityCart(req);
		res.send(cart);
	} catch (err) {
		res.status(500).send(err.message);
	}
};
exports.deleteProductCart = async (req, res) => {
	try {
		const cart = await CartService.deleteProductCart(req);
		res.send(cart);
	} catch (err) {
		res.status(500).send(err.message);
	}
};
exports.deleteCart = async (req, res) => {
	try {
		const cart = await CartService.deleteCart(req);
		res.send(cart);
	} catch (err) {
		res.status(500).send(err.message);
	}
};
