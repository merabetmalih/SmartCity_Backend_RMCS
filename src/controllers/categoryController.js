var CategoryService = require('../services/categoryService');

exports.getCategories = async (req, res) => {
	try {
		const categories = await CategoryService.getAllCategories();
		res.send(categories);
	} catch (err) {
		res.status(500).send(err.message);
	}
};

exports.getCategoryById = async (req, res) => {
	try {
		const category = await CategoryService.getCategoryById(req);
		res.send(category);
	} catch (err) {
		res.status(500).send(err.message);
	}
};

exports.createCategory = async (req, res) => {
	try {
		const category = await CategoryService.createCategory(req);
		res.send(category);
	} catch (err) {
		res.status(500).send(err.message);
	}
};

exports.deleteCategory = async (req, res) => {
	try {
		const category = await CategoryService.deleteCategory(req);
		res.send(category);
	} catch (err) {
		res.status(500).send(err.message);
	}
};

exports.getCategoriesForStore = async (req, res) => {
	try {
		const categories = await CategoryService.getCategoriesForStore(req);
		res.send(categories);
	} catch (err) {
		res.status(500).send(err.message);
	}
};
exports.getCategoriesNamesForStore = async (req, res) => {
	try {
		const categories = await CategoryService.getCategoriesNamesForStore(req);
		res.send(categories);
	} catch (err) {
		res.status(500).send(err.message);
	}
};
exports.updateCategory = async (req, res) => {
	try {
		const category = await CategoryService.updateCategory(req.body);
		res.send(category);
	} catch (err) {
		res.status(500).send(err.message);
	}
};
