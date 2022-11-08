const User = require('../models/User');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Offer = require('../models/Offer');
const Store = require('../models/Store');
//add to cart
exports.addToCart = async (req) => {
	try {
		const products = await Product.find();
		console.log('products' + products);
		console.log('req.body', req.body.productId);
		const product = await Product.findOne({ _id: req.body.productId }).populate('storeId');
		if (!product || product.deleted) throw new Error('Product does not exist 1');
		//check if the varient exist
		const variant = product.variants.find((variant) => variant.id === req.body.variantId);
		if (!variant || !variant.available || !variant.quantity) throw new Error('variant is not available any more ');

		//check the quantity of the variant
		if (variant.quantity <= req.body.quantity) {
			req.body.quantity = variant.quantity;
		}

		//update the variant price
		//get the price of varient
		let priceVariant = 0.0;
		priceVariant = variant.price;
		let discountvar = 0;
		let discountQuantity = 0;
		let offerExist = false;

		//update the price of varient

		//check if the product is an offer

		if (product.offer) {
			console.log('fih offer');
			const offer = await Offer.findOne({ _id: product.offer });
			if (offer) {
				offerContent = offer.toObject();
			}
			//check if offer still active
			if (offer && offer.active && offer.offerStock && !offer.offerDeleted) {
				//check the discount type of offer
				offerExist = true;
				if (offer.offerStock <= req.body.quantity) {
					discountQuantity = offer.offerStock;
				} else {
					discountQuantity = req.body.quantity;
				}
				//update discount

				//calculate the product number of offer
				if (offer.discountType == 'percentage') {
					console.log('percentage');
					discountvar = (offer.offerDiscount / 100) * variant.price;
					//update price variant
				} else {
					discountvar = offer.offerDiscount;
				}
			} else {
				discountvar = 0;
				priceVariant = variant.price;
				discountQuantity = 0;
			}
		} else {
			discountvar = 0;
			priceVariant = variant.price;
			discountQuantity = 0;
		}
		const cart = await Cart.findOne({ userId: req.user.id });
		if (!cart) {
			const newCart = new Cart({
				userId: req.user.id,
				items: [
					{
						productId: req.body.productId,
						variantId: req.body.variantId,
						quantity: req.body.quantity,
						discount: discountvar,
						discountQuantity: discountQuantity,
						price: priceVariant,
						totalPrice: priceVariant * req.body.quantity - discountQuantity * discountvar,
					},
				],
			});

			await newCart.save();
			return newCart;
		} else {
			console.log('cart exist');
			console.log(discountvar);
			console.log(priceVariant);
			console.log(discountQuantity);
			console.log('fffffffffffffffffffff');
			//check if the product variant is already in the cart
			const isProductInCart = cart.items.find((item) => item.variantId == req.body.variantId);
			if (isProductInCart) {
				const index = cart.items.findIndex((item) => item.variantId == req.body.variantId);
				cart.items[index].quantity = req.body.quantity;
				//update discountQuantity
				cart.items[index].discountQuantity = discountQuantity;
				cart.items[index].discount = discountvar;

				cart.items[index].totalPrice = variant.price * cart.items[index].quantity - cart.items[index].discountQuantity * cart.items[index].discount;

				//cart.items[index].totalDiscount = cart.items[index].totalDiscount + cart.items[index].discount * cart.items[index].quantity;
				//cart.items[index].totalPayable = cart.items[index].totalPriceAllProducts - cart.items[index].totalDiscount;
			} else {
				cart.items.push({
					productId: req.body.productId,
					quantity: req.body.quantity,
					discount: discountvar,
					variantId: req.body.variantId,
					discountQuantity: discountQuantity,
					price: priceVariant,
					totalPrice: priceVariant * req.body.quantity - discountQuantity * discountvar,
				});
			}
			await cart.save();
			return cart;
		}
	} catch (err) {
		throw err;
	}
};

//get cart
exports.getCart = async (req) => {
	try {
		const cart = await Cart.findOne({ userId: req.user.id });
		//check items in the cart
		if (!cart) throw new Error('Cart does not exist');
		else {
			//loop the item
			let totalDiscount = 0.0;
			let totalPayable = 0.0;
			let discountvar = 0.0;
			const result = {};
			for (let i = 0; i < cart.items.length; i++) {
				console.log('start looping the product in the cart');
				//get the product
				const product = await Product.findOne({ _id: cart.items[i].productId });

				//get the variant from product
				const variant = product.variants.find((variant) => variant._id == cart.items[i].variantId);

				//check if the product is not deleted
				if (product.deleted || !product || !variant || !variant.available) {
					//check if the variant is not deleted
					//deleted the item
					cart.items.splice(i, 1);
					i--;
				}

				//check the quantity of the variant
				if (variant.quantity <= cart.items[i].quantity) {
					//update the quantity
					cart.items[i].quantity = variant.quantity;
					//update the price
					cart.items[i].totalPrice = variant.price * variant.quantity;
				}
				//update the total price

				//check if the variant is not deleted
				//check if the product is an offer
				if (product.offer) {
					console.log('the product ' + i + ' is an offer');

					const offer = await Offer.findOne({
						_id: product.offer,
						active: true,
						offerStock: {
							$gt: 0,
						},
						offerDeleted: false,
					});
					//check if offer still active
					if (offer) {
						console.log('the offer is still active');
						//update the discount
						cart.items[i].discount = offer.offerDiscount;
						//update discountQuanity
						if (offer.offerStock <= cart.items[i].quantity) {
							console.log('offer stock is less than quantity' + offer.offerStock);
							cart.items[i].discountQuantity = offer.offerStock;
							console.log('update discountquantity');
						} else {
							cart.items[i].discountQuantity = cart.items[i].quantity;
						}
						//calculate the product number of offer
						if (offer.discountType == 'percentage') {
							cart.items[i].discount = variant.price * (offer.offerDiscount / 100);
							console.log(cart.items[i].discount);
							//update price variant
							//priceVariant = variant.price - variant.price * (discountvar / 100);
						} else {
							cart.items[i].discount = offer.offerDiscount; //	priceVariant = variant.price - discountvar;
						}
					} else {
						console.log('the offer is not active');
						cart.items[i].discountQuantity = 0;
						cart.items[i].discount = 0;
					}

					console.log('update total price');

					// update total Price
					cart.items[i].totalPrice = variant.price * cart.items[i].quantity - cart.items[i].discountQuantity * cart.items[i].discount;
					//update totalDiscount
					totalDiscount += cart.items[i].discount * cart.items[i].discountQuantity;
					//update totalPayable
					totalPayable += cart.items[i].totalPrice;
				} else {
					console.log('the product ' + i + ' is not an offer');
					//update total Price

					cart.items[i].discountQuantity = 0;
					cart.items[i].discount = 0;
					cart.items[i].totalPrice = cart.items[i].quantity * variant.price;
				}
				if (!result[product.storeId]) result[product.storeId] = { storeIdCart: product.storeId, products: [] };
				const productResult = { ...cart.items[i], storeId: product.storeId };
				result[product.storeId].products.push(productResult._doc);
			}

			cart.totalDiscount = totalDiscount;
			cart.totalPayable = totalPayable;

			await cart.save();
			return result;
		}
	} catch (err) {
		throw err;
	}
};

//update cart
exports.updateCart = async (req) => {
	try {
		//check if product exists
		const product = await Product.findById(req.body.productId);
		if (!product) throw new Error('The product with the given ID was not found.');

		//check if the cart is empty
		const cart = await Cart.findOne({ userId: req.user.id });
		if (!cart) throw new Error('The cart with the given ID was not found.');

		//check if the product is already in the cart
		const productInCart = cart.products.find((product) => product.productId.toString() === req.body.productId.toString());
		if (!productInCart) throw new Error('The product with the given ID was not found.');

		//update the product in the cart
		productInCart.quantity = req.body.quantity;
		productInCart.discount = req.body.discount;
		await cart.save();
		return cart;
	} catch (error) {
		throw error;
	}
};
//delete product from cart
exports.deleteProductFromCart = async (req) => {
	try {
		//check if the cart is empty
		const cart = await Cart.findOne({ userId: req.user.id });
		if (!cart) throw new Error('The cart with the given ID was not found.');
		//check if the product is already in the cart
		const productInCart = cart.products.find((product) => product.productId.toString() === req.params.id.toString());
		if (!productInCart) throw new Error('The product with the given ID was not found.');
		//delete the product from the cart

		cart.products = cart.products.filter((product) => product.productId.toString() !== req.params.id.toString());
		await cart.save();
		return cart;
	} catch (error) {
		throw error;
	}
};

//update the quantity of the product in the cart
exports.updateQuantityCart = async (req) => {
	try {
		const cart = await Cart.findOne({ user: req.user._id });
		const products = cart.products;
		const product = products.find((product) => product.productId.toString() === req.params.idProduct);
		const variant = products.find((item) => item.variantId.toString() === req.params.idVaraint);
		if (!variant) {
			throw new Error('Variant not found');
		}
		//call product
		const productCall = await Product.findById(req.params.idProduct);
		//find variant
		const varaintCall = product.variants.find((item) => item.variantId.toString() === req.params.idVaraint);

		//check if the quantity is valid
		if (req.body.quantity > varaintCall.quantity) {
			throw new Error('Quantity is not valid');
		}
		//check if the quantity is greater than 0
		if (req.body.quantity <= 0) {
			throw new Error('Quantity is not valid');
		}
		//check offer
		if (productCall.offer) {
			//check if the offer is active
			//get the offer
			const offer = await Offer.findById(product.offer);
			if (offer.active && offer.offerExpiration > Date.now() && offer.offerStock > 0 && offer.productId.toString() === product.productId.toString()) {
				//check if the quantity is greater than the offer stock
				if (req.body.quantity > offer.offerStock) {
					throw new Error('Quantity is not valid');
				}
			}
		}

		product.quantity = req.body.quantity;
		product.totalPrice = variant.price * product.quantity - (variant.price * product.quantity * product.discount) / 100;
		cart.products = products;
		await cart.save();
		return cart;
	} catch (error) {
		throw error;
	}
};
//delete the product from the cart

exports.deleteProductCart = async (req) => {
	try {
		const cart = await Cart.findOne({ user: req.user._id });
		const products = cart.products;
		const variant = products.find((product) => product.variantId.toString() === req.params.id);
		if (!variant) {
			throw new Error('Variant not found');
		}
		//delete the variant from the cart
		products.splice(products.indexOf(variant), 1);
		cart.products = products;
		await cart.save();
	} catch (error) {
		throw error;
	}
};
//delete the cart
exports.deleteCart = async (req) => {
	try {
		const cart = await Cart.findOne({ user: req.user._id });
		await cart.remove();
	} catch (error) {
		throw error;
	}
};
