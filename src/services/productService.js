const Product = require('../models/Product');
const Store = require('../models/Store');
const Category = require('../models/Category');
const uuid = require('uuid');
const path = require('path');
const fileUpload = require('express-fileupload');
//Update product
exports.updateProduct = async (req) => {
	try {
		// Validation request
		const product = await Product.findById(req.params.id);
		//test if the product is existe
		if (!product) throw new Error('The product with the given ID was not found.');
		const category = await Category.findById(req.body.categoryId);
		//test the Owner Product
		if (product.sellerId != req.user.id) {
			throw new Error('You are not authorized to perform this action.');
		} //test that the category ID existe
		if (!category) throw new Error('The category with the given ID was not found.');
		const store = await Store.findById(req.body.storeId);
		//test that the Strore with the entred id existe
		if (!store) throw new Error('The store with the given ID was not found.');
		//search the varient in the product
		for (let i = 0; i < req.body.variantes.length; i++) {
			const varient = req.body.variantes[i];
			const varientInProduct = product.variants.find((v) => v._id == varient._id);
			//test that the varient is in the product
			//test the varient Id
			if (!varientInProduct) throw new Error('The varient with the given ID' + varient._id + ' was not found.');
			//update the varient

			varientInProduct.quantity = varient.quantity;
			varientInProduct.price = varient.price;
			//varientInProduct.img = varient.image;
			varientInProduct.characterstics = varient.characterstics;
			product.variants[i] = varientInProduct;
		}
		//Update the product
		product.name = req.body.name || product.name;
		product.price = req.body.price || product.price;
		product.description = req.body.description || product.description;
		product.tags = req.body.tags || product.tags;
		product.discount = req.body.discount || product.discount;
		product.images = req.body.images || product.images;
		product.storeId = req.body.storeId || product.storeId;
		product.categoryId = req.body.categoryId || product.categoryId;
		//save the product with previos varients
		await product.save();
		return product;
	} catch (error) {
		throw error;
	}
};
//Add Product
exports.addProduct = async (req) => {
	try {
		//check if store exist
		//check the id of the store

		const store = await Store.findById(req.body.storeId);
		if (!store) throw new Error('The store with the given ID was not found.');
		//check store owner
		if (store.sellerId != req.user.id) {
			throw new Error('You are not authorized to perform this action.');
		}
		//check if category exist
		const category = await Category.findById(req.body.categoryId);
		if (!category) throw new Error('The category with the given ID was not found.');

		//upload the images
		if (!req.files || Object.keys(req.files).length === 0) {
			throw new Error('No files were uploaded.');
		}
		let imagess = [];
		for (let i = 0; i < req.files.images.length; i++) {
			const image = req.files.images[i];
			//remove spaces from name
			image.name = image.name.replace(/\s/g, '');
			const fileName = `${uuid.v4()}${image.name}`;
			const uploadPath = path.resolve(__dirname, '..', '..', 'public', 'images', 'products', fileName);
			const storagePath = `images/products/${fileName}`;
			image.mv(uploadPath, function (err) {
				if (err) return console.log(err);
			});
			imagess.push(storagePath);
		}

		//upload the varients photos
		//loop through the varients
		let varientsImages = [];
		for (let i = 0; i < req.body.variantes.length; i++) {
			if (!req.files.varientsImages) {
				throw new Error('No files were uploaded.');
			}
			const image = req.files.varientsImages[i];
			//remove spaces from the name
			image.name = image.name.replace(/\s/g, '');
			const fileName = `${uuid.v4()}${image.name}`;
			const uploadPath = path.resolve(__dirname, '..', '..', 'public', 'images', 'variantes', fileName);
			const storagePath = `images/variantes/${fileName}`;
			image.mv(uploadPath, function (err) {
				if (err) return console.log(err);
			});
			req.body.variantes[i].img = storagePath;
			varientsImages.push(storagePath);
		}

		const newProduct = new Product({
			name: req.body.name,
			price: req.body.price,
			description: req.body.description,
			images: imagess,
			categoryId: category._id,
			subcategory: req.body.subcategory || '',
			sellerId: req.user.id,
			storeId: store._id,
			discount: req.body.discount,
			variants: req.body.variantes,
			priceMin: req.body.priceMin,
			priceMax: req.body.priceMax,
		});
		const savedProduct = await newProduct.save();
		//add the product to the store
		//store.products.push(savedProduct._id);
		//await store.save();
		//add the product to the category
		category.productIds.push(savedProduct._id);
		await category.save();
		return savedProduct;
	} catch (err) {
		throw err;
	}
};
//delete product
exports.deleteProduct = async (req) => {
	try {
		const product = await Product.findById(req.params.id);
		if (!product) {
			throw new Error('Product not found');
		}
		if (product.sellerId != req.user.id) {
			throw new Error('its not your product');
		}
		await Product.findByIdAndDelete(req.params.id);
		const category = await Category.findById(product.categoryId);
		if (category) {
			const index = category.productIds.indexOf(product._id);
			category.productIds.splice(index, 1);
			await category.save();
			if (category.productIds.length == 0) {
				await Category.findByIdAndDelete(category._id);
			}
		}
		return { message: 'Product deleted successfully' };
	} catch (err) {
		throw err;
	}
};
//get product by id
exports.getProduct = async (req) => {
	try {
		var sql = 'SELECT * FROM Products';
		var params = [];
		db.all(sql, params, (err, rows) => {
			if (err) {
				res.status(400).json({ error: err.message });
				return;
			}
			res.json({
				message: 'success',
				data: rows,
			});
		});
	} catch (err) {
		throw err;
	}
};
//get all products for a store
exports.getProducts = async (req) => {
	try {
		const store = await Store.findById(req.params.id);
		if (!store) {
			throw new Error('Store not found');
		}
		const products = await Product.find({ storeId: req.params.id });
		return products;
	} catch (err) {
		throw err;
	}
};
//get limit products for a store
exports.getProductsLimit = async (req) => {
	try {
		const store = await Store.findById(req.params.id);
		if (!store) {
			throw new Error('Store not found');
		}
		const products = await Product.find({ storeId: req.params.id })

			.limit(parseInt(req.params.limit))
			.sort({ createdAt: -1 });
		return products;
	} catch (err) {
		throw err;
	}
};

//search product by his name
exports.searchProduct = async (req) => {
	try {
		const products = await Product.find({ name: { $regex: req.params.name } });
		return products;
	} catch (err) {
		throw err;
	}
};
//search product by his name and store id
exports.searchProductStore = async (req) => {
	try {
		const products = await Product.find({
			name: { $regex: req.params.name },
			storeId: req.params.id,
		});
		return products;
	} catch (err) {
		throw err;
	}
};
exports.reportProduct = async (req) => {
	try {
		const product = await Product.findById(req.params.id);
		if (!product) {
			throw new Error('Product not found');
		}
		let idUser = req.user.id;
		product.reports.push({ idUser, message: req.body.message, date: Date.now() });
		await product.save();
		return product;
	} catch (err) {
		throw err;
	}
};
//get all reports for a product
exports.getReports = async (req) => {
	try {
		const product = await Product.findById(req.params.id);
		if (!product) {
			throw new Error('Product not found');
		}
		return product.reports;
	} catch (err) {
		throw err;
	}
};
//get all reported products
exports.getReportedProducts = async (req) => {
	try {
		const products = await Product.find({ reports: { $exists: true } });
		return products;
	} catch (err) {
		throw err;
	}
};
