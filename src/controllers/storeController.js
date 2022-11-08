var StoreService = require('../services/storeService');

exports.createStore = async (req, res) => {
	try {
		const store = await StoreService.createStore(req);
		return res.status(200).json({ status: 200, data: store, message: 'Succesfully Store Created' });
	} catch (err) {
		res.status(500).send(err.message);
	}
};

exports.updateStore = async (req, res) => {
	try {
		const store = await StoreService.updateStore(req);
		res.send(store);
	} catch (err) {
		res.status(500).send(err.message);
	}
};
exports.getStore = async (req, res) => {
	try {
		const store = await StoreService.getStore(req);
		res.send(store);
	} catch (err) {
		res.status(500).send(err.message);
	}
};

exports.getStoresByCity = async (req, res) => {
	try {
		const stores = await StoreService.getStoresByCity(req);
		res.send(stores);
	} catch (err) {
		res.status(500).send(err.message);
	}
};
//get seller stores
exports.getSellerStores = async (req, res) => {
	try {
		const stores = await StoreService.getSellerStores(req);
		res.send(stores);
	} catch (err) {
		res.status(500).send(err.message);
	}
};
exports.getStoresByLocation = async (req, res) => {
	try {
		const stores = await StoreService.getStoresByLocation(req);
		res.send(stores);
	} catch (err) {
		res.status(500).send(err.message);
	}
};
