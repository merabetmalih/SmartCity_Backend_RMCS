const path = require('path');
const uuid = require('uuid');
const fileUpload = require('express-fileupload');
const User = require('../models/User');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Offer = require('../models/Offer');
const Store = require('../models/Store');
const Payment = require('../models/Payment');
const Bill = require('../models/Bill');
const Order = require('../models/Order');
//createStore
exports.createStore = async (req) => {
	try {
		if (typeof req.body.location === 'string') {
			req.body.location = JSON.parse(req.body.location);
		}
		if (typeof req.body.address === 'string') {
			req.body.address = JSON.parse(req.body.address);
		}
		if (typeof req.body.policies === 'string') {
			req.body.policies = JSON.parse(req.body.policies);
		}
		console.log(req.body);
		let image;

		if (!req.files || Object.keys(req.files).length === 0) {
			throw new Error('No files were uploaded.');
		}

		// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file

		image = req.files.image;
		const fileName = `${uuid.v4()}${image.name}`;
		const uploadPath = path.resolve(__dirname, '..', '..', 'public', 'images', 'stores', fileName);
		const storagePath = `images/stores/${fileName}`;
		console.log(storagePath, 'storagePath');

		// Use the mv() method to place the file somewhere on your server

		image.mv(uploadPath, function (err) {
			if (err) throw err;
		});

		const newStore = new Store({
			sellerId: req.user.id,
			name: req.body.name,
			description: req.body.description,
			image: storagePath,
			address: {
				city: req.body.address.city,
				streetName: req.body.address.streetName,
				postalCode: req.body.address.postalCode,
				fullAdress: req.body.address.fullAdress,
				region: req.body.address.region,
				country: req.body.address.country,
				countryCode: req.body.address.countryCode,
			},
			policies: {
				delivery: req.body.policies.delivery,
				selfPickUp: req.body.policies.selfPickUp,
				selfPickUpPrice: req.body.policies.selfPickUpPrice,
				tax: req.body.policies.tax,
				openWeekend: req.body.policies.openWeekend,
				openTime: req.body.policies.openTime,
				closeTime: req.body.policies.closeTime,
			},

			location: {
				type: 'Point',

				coordinates: [parseFloat(req.body.location.coordinates[0]), parseFloat(req.body.location.coordinates[1])],
			},
		});

		const store = await newStore.save();
		return store;
	} catch (err) {
		throw err;
	}
};
//updateStore
exports.updateStore = async (req) => {
	try {
		console.log(req.body);
		const store = await Store.findById(req.params.id);
		if (!Store) {
			throw new Error({ message: 'Store not found' });
		} else {
			if (store.sellerId != req.user.id) {
				throw new Error({ message: 'You are not authorized to update this store' });
			} else {
				const updatedStore = await Store.findByIdAndUpdate(
					req.params.id,
					{
						$set: req.body,
					},
					{ new: true }
				);
				return updatedStore;
			}
		}
	} catch (err) {
		throw err;
	}
};
//get store
exports.getStore = async (req) => {
	try {
		console.log(req.params.id);
		const store = await Store.findById(req.params.id);
		if (!store) {
			throw new Error({ message: 'Store not found' });
		} else {
			return store;
		}
	} catch (err) {
		throw err;
	}
};
//get seller stores
exports.getSellerStores = async (req) => {
	try {
		const stores = await Store.find({ sellerId: req.user.id });
		if (!stores) {
			throw new Error({ message: 'Stores not found' });
		} else {
			return stores;
		}
	} catch (err) {
		throw err;
	}
};
//get stores by location
exports.getStoresByLocation = async (req) => {
	try {
		const stores = await Store.find({
			location: {
				$near: {
					$geometry: {
						type: 'Point',
						coordinates: [parseFloat(req.body.location.coordinates[0]), parseFloat(req.body.location.coordinates[1])],
					},
					$maxDistance: parseFloat(req.body.location.maxDistance),
				},
			},
		});
		if (!stores) {
			throw new Error({ message: 'Stores not found' });
		} else {
			return stores;
		}
	} catch (err) {
		throw err;
	}
};

//get stores by city
exports.getStoresByCity = async (req) => {
	try {
		const stores = await Store.aggregate([
			{
				$unwind: '$address',
			},
			{
				$match: {
					'address.city': req.params.city,
				},
			},
		]);
		return stores;
	} catch (err) {
		throw err;
	}
};
