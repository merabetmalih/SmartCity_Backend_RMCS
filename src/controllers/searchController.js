var SearchService = require('../services/searchService');
exports.searchStore = async (req, res) => {
	try {
		const stores = await SearchService.searchStore(req);
		res.send(stores);
	} catch (err) {
		res.status(500).send(err.message);
	}
};

exports.searchProduct = async (req, res) => {
	try {
		const products = await SearchService.searchProduct(req);
		res.send(products);
	} catch (err) {
		res.status(500).send(err.message);
	}
};
