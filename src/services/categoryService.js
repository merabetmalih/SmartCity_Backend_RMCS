const Product = require('../models/Product');
const Offer = require('../models/Offer');
const Store = require('../models/Store');
const uuid = require('uuid');
const path = require('path');
const fileUpload = require('express-fileupload');
const Category = require('../models/Category');
const { Cookies } = require('nodemailer/lib/fetch');

//get All Categories
exports.getAllCategories = async (req) => {
	try {
		console.log('getAllCategories');
		const categories = await Category.find().select('-productIds -__v');
		//delete all the productIds from the response
		return categories;
	} catch (err) {
		throw err;
	}
};

//get Categories by id populating products
exports.getCategoryById = async (req) => {
	try {
		const category = await Category.findById(req.params.id).populate('productIds');
		return category;
	} catch (err) {
		throw err;
	}
};
//Creat Category
exports.createCategory = async (req) => {
	try {
		//check if image exists
		if (!req.files) return console.log('No files were uploaded.');
		else {
			//image upload
			console.log('there is a file');
			image = req.files.image;
			image.name = image.name.replace(/\s/g, '');
			const fileName = `${uuid.v4()}${image.name}`;
			const uploadPath = path.resolve(__dirname, '..', '..', 'public', 'images', 'categories', fileName);
			const storagePath = `images/categories/${fileName}`;
			console.log(storagePath, 'storagePath');
			let imageUrl = storagePath;
			console.log(imageUrl, 'imageUrl');
			image.mv(uploadPath, function (err) {
				if (err) return res.status(500).send(err);
			});

			console.log(imageUrl, 'imageUrl333');
			const newCategory = new Category({
				name: req.body.name,
				description: req.body.description,
				image: imageUrl || 'images/default-image.png',
			});
			await newCategory.save();
			return newCategory;
		}
	} catch (err) {
		throw err;
	}
};

//delete Category
exports.deleteCategory = async (req) => {
	try {
		verifyAdmin(req);
		const { error } = categorySchema.validate(req.body);
		if (error) throw Error(error.details[0].message);
		const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		});
		if (!category) throw Error('The category with the given ID was not found.');
		return category;
	} catch (err) {
		throw err;
	}
};

//get the categories for a store
exports.getCategoriesForStore = async (req) => {
	try {
		//check if the store exists
		const store = await Store.findById(req.params.id);
		if (!store) throw Error('The store with the given ID was not found.');
		//get the names of the categories of the store
		const categories = await (
			await Category.find().populate('productIds').where('storeId').equals(req.params.id)
		)
			.map((category) => {
				return category.name;
			})
			.sort();
		return categories;
	} catch (err) {
		throw err;
	}
};

//get categories names for a store
exports.getCategoriesNamesForStore = async (req) => {
	try {
		//check if the category exists
		console.log(req.params.category, 'category');
		console.log(req.params.id, 'store id');
		const category = await Category.findOne({ name: req.params.category });
		if (!category) throw Error('The category with the given name was not found.');
		//get the products of the category
		const products = await Product.find().where('categoryId').equals(category._id);
		return products;
	} catch (err) {
		throw err;
	}
};
//update category
exports.updateCategory = async (req) => {
	try {
		const { error } = categorySchema.validate(req.body);
		if (error) throw Error(error.details[0].message);
		const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		});
		if (!category) throw Error('The category with the given ID was not found.');
		return category;
	} catch (err) {
		throw err;
	}
};
