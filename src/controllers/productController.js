var ProductService = require('../services/productService');

exports.updateProduct = async (req, res) => {
	try {
		const product = await ProductService.updateProduct(req);
		res.send(product);
	} catch (err) {
		res.status(500).send(err.message);
	}
};

exports.addProduct = async (req, res) => {
	try {
		const product = await ProductService.addProduct(req);
		res.send(product);
	} catch (err) {
		res.status(500).send(err.message);
	}
};
exports.deleteProduct = async (req, res) => {
	try {
		const product = await ProductService.deleteProduct(req);
		res.send(product);
	} catch (err) {
		res.status(500).send(err.message);
	}
};
exports.getProduct = async (req, res) => {
	try {
		const product = await ProductService.getProduct(req);
		res.send(product);
	} catch (err) {
		res.status(500).send(err.message);
	}
};
exports.getProducts = async (req, res) => {
	try {
		const products = await ProductService.getProducts(req);
		res.send(products);
	} catch (err) {
		res.status(500).send(err.message);
	}
};
exports.getProductsLimit = async (req, res) => {
	try {
		const products = await ProductService.getProductsLimit(req);
		res.send(products);
	} catch (err) {
		res.status(500).send(err.message);
	}
};
exports.searchProduct = async (req, res) => {
	try {
		const products = await ProductService.searchProduct(req);
		res.send(products);
	} catch (err) {
		res.status(500).send(err.message);
	}
};
exports.searchProductStore = async (req, res) => {
	try {
		const products = await ProductService.getProducts(req);
		res.send(products);
	} catch (err) {
		res.status(500).send(err.message);
	}
};
exports.reportProduct = async (req, res) => {
	try {
		const products = await ProductService.reportProduct(req);
		res.send(products);
	} catch (err) {
		res.status(500).send(err.message);
	}
};
//get all reports for a product
exports.getReports = async (req, res) => {
	try {
		const products = await ProductService.getReports(req);
		res.send(products);
	} catch (err) {
		res.status(500).send(err.message);
	}
};
//get all reported products
exports.getReportedProducts = async (req, res) => {
	try {
		const products = await ProductService.getReportedProducts(req);
		res.send(products);
	} catch (err) {
		res.status(500).send(err.message);
	}
};
