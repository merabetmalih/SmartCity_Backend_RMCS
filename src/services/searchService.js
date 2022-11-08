const Product = require('../models/Product');
const Store = require('../models/Store');
//search the nearest stores
exports.searchStore = async (req) => {
	try {
		const stores = await Store.aggregate([
			{
				$geoNear: {
					near: {
						type: 'Point',
						coordinates: [parseFloat(req.query.langitude), parseFloat(req.query.latitude)],
					},
					key: 'location',
					distanceField: 'dist.calculated',
					maxDistance: parseFloat(req.query.radius),
					spherical: true,
					includeLocs: 'dist.location',
				},
			},
		]);

		return stores;
	} catch (err) {
		throw err;
	}
};
// search product by nearest store
exports.searchProduct = async (req) => {
	try {
		if (!req.query.page) {
			req.query.page = 1;
		}
		if (!req.query.limit) {
			req.query.limit = 10;
		}

		//get the nearest stores
		const stores = await Store.aggregate([
			{
				$geoNear: {
					near: {
						type: 'Point',
						coordinates: [parseFloat(req.query.langitude), parseFloat(req.query.latitude)],
					},
					key: 'location',
					distanceField: 'dist.calculated',
					maxDistance: parseFloat(req.query.radius),
					spherical: true,
					includeLocs: 'dist.location',
				},
			},
		]);
		console.log(stores);
		//get the products by nearest stores
		//search for the products in those stores
		const products = await Product.find({
			store: {
				$in: stores.map((store) => store._id),
			},
			name: {
				$regex: req.query.name,
				$options: 'i',
			},
		})
			.skip((req.query.page - 1) * req.query.limit)
			.limit(parseInt(req.query.limit))
			.sort({ createdAt: -1 });
		return products;
	} catch (err) {
		throw err;
	}
};
