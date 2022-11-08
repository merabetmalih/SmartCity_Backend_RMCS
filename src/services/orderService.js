const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Offer = require('../models/Offer');
const Store = require('../models/Store');
const Payment = require('../models/Payment');
const Bill = require('../models/Bill');
const Order = require('../models/Order');
const { check } = require('prettier');
//check product

//check if offre is valid
const checkOffer = async (offerId) => {
	try {
		//get the offer
		const offer = await Offer.findById(offerId);
		if (offer && offer.active && offer.offerStock && !offer.offerDeleted) {
			//offer is valid
			return offer;
		} else {
			return null;
		}
	} catch (err) {
		throw err;
	}
};
//check cart
const checkCart = async (userId) => {
	try {
		const cartExist = await Cart.findOne({ userId });
		if (!cartExist) {
			return null;
		}
		return cartExist;
	} catch (error) {
		throw error;
	}
};
const checkStore = async (storeId) => {
	try {
		const storeExist = await Store.findOne({ _id: storeId });
		if (!storeExist || !storeExist.isActive) {
			return null;
		}
		return storeExist;
	} catch (error) {
		throw error;
	}
};
//check product
const checkProduct = async (productId, variantId, quantity, storeId) => {
	try {
		const productExist = await Product.findOne({ _id: productId });
		const variantExist = await productExist.variants.find((variant) => variant._id == variantId);
		if (!productExist || productExist.storeId != storeId || productExist.deleted || !variantExist.available || variantExist.quantity < quantity) {
			return null;
		}
		return productExist;
	} catch (error) {
		throw error;
	}
};
//get product variant
const getProductVariant = async (product, variantId) => {
	try {
		const variantExist = await product.variants.find((variant) => variant._id == variantId);
		if (!variantExist || !variantExist.available || variantExist.quantity < 1) {
			return null;
		}
		return variantExist;
	} catch (error) {
		throw error;
	}
};
//upddate product offer to null
const updateProductOffer = async (productId) => {
	try {
		const product = await Product.findById(productId);
		product.offer = null;
		await product.save();
	} catch (error) {
		throw error;
	}
};

//create order
exports.createOrder = async (req) => {
	try {
		const cart = await checkCart(req.user.id);
		if (cart == null || cart.items.length == 0) {
			throw new Error('Cart not found');
		}
		console.log('check cart Passed');
		const store = await checkStore(req.body.storeId);
		if (store == null) {
			throw new Error('Store not found');
		}
		console.log('check store Passed');

		//get the product with the same storeID
		const products = cart.items;
		let variantPrice = 0.0;

		for (let i = 0; i < products.length; i++) {
			const product = await checkProduct(products[i].productId, products[i].variantId, products[i].quantity, req.body.storeId);

			console.log('check product' + i + ' in products Passed');
			//check if it's null

			if (!product == null) {
				//delete the product from the cart
				products.splice(i, 1);
				console.log('product' + i + ' in products deleted');
				i--;
				cart.items = products;
				await cart.save();
				throw new Error('Product not found');
			} else {
				//get the variant with the same productID
				console.log('product', product);
				console.log('variant', products[i].variantId);
				const variant = await getProductVariant(product, products[i].variantId);
				if (variant == null) {
					//delete the product from the cart
					products.splice(i, 1);
					cart.items = products;
					await cart.save();
					console.log('variant is null');
					i--;
					throw new Error('Variant not found');
				} else {
					//update the quantity of the variant and the unit price
					variantPrice = variant.price;
					if (variant.qauntity < products[i].quantity) {
						products[i].quantity = variant.qauntity;
					}

					// check offer
					if (product.offer) {
						//get the offer
						const offer = await checkOffer(product.offer);
						if (offer == null) {
							//delete the product from the cart
							products.splice(i, 1);
							i--;
							console.log('offer is null');
							console.log('product', product._id.toString());
							await updateProductOffer(product._id.toString());

							throw new Error('Offer not found');
						}
						//update discountQuanity
						if (offer.offerStock <= products[i].quantity) {
							console.log('offer stock is less than quantity' + offer.offerStock);
							products[i].discountQuantity = offer.offerStock;
							console.log('update discountquantity');
						} else {
							products[i].discountQuantity = products[i].quantity;
						}
						//update discount
						if (offer.discountType == 'percentage') {
							console.log('percentage');
							products[i].discount = variantPrice * (offer.offerDiscount / 100);
						} else {
							products[i].discount = offer.offerDiscount;
						}
						products[i].totalPrice = variantPrice * products[i].quantity - products[i].discount * products[i].discountQuantity;
					} else {
						products[i].discountQuantity = 0;
						variantPrice = variant.price;
						products[i].discount = 0;
						products[i].totalPrice = variantPrice * products[i].quantity;
					}
				}
			}
		}

		console.log('way: ' + req.body.way);
		if (req.body.way == 'delivery') {
			//cheack if the store has delivery
			if (!store.policies.delivery) {
				throw new Error('Store does not have delivery');
			}
			console.log('we are in delivery');
			//create an order

			console.log('pass3');
			//save the order
			//start the payment process
			let paymentMethod = await stripe.paymentMethods.create({
				type: 'card',
				card: {
					number: req.body.cardNumber,
					exp_month: req.body.expMonth,
					exp_year: req.body.expYear,
					cvc: req.body.cvc,
				},
			});
			const customer = await stripe.customers.create({
				email: req.body.email,
				name: req.body.name,
			});

			paymentIntent = await stripe.paymentIntents.create({
				payment_method: paymentMethod.id,
				amount: products.reduce((acc, cur) => acc + cur.totalPrice, 0) * 100,
				currency: 'usd',
				customer: customer.id,
				payment_method_types: ['card'],
				confirm: true,
			});

			clientSecret = paymentIntent.client_secret;

			const newBill = new Bill({
				userId: req.user.id,
				storeId: req.body.storeId,
				paymentMethod: req.body.paymentMethod,
				paymentId: paymentIntent.id,
				products: products,
				totalPrice: products.reduce((acc, cur) => acc + cur.totalPrice, 0),
				discount: products.reduce((acc, curr) => acc + curr.discount, 0),
				payable: products.reduce((acc, curr) => acc + curr.totalPrice, 0) - products.reduce((acc, curr) => acc + curr.discount, 0),
				shippingStatus: 'pending',
				billingAdress: req.body.billingAdress,
				origin: store.address,
				paymentStatus: paymentIntent.status,
			});
			await newBill.save();

			//update the order with the payment intent id

			console.log('pass5');
			//create the order
			const newOrder = new Order({
				userId: req.user.id,
				storeId: req.body.storeId,
				items: products,
				shippingMethod: req.body.shippingMethod,
				billingAdress: req.body.billingAdress,
				origin: store.address,
				status: paymentIntent.status,
				billId: newBill._id,
				shippingStatus: 'pending',
				total: newBill.total,
				paymentId: paymentIntent.id,
				clientSecret: clientSecret,
			});
			const savedOrder = await newOrder.save(); // thbet lta7t

			//update the product stock
			for (let i = 0; i < products.length; i++) {
				//get the product
				const product = await Product.findById(products[i].productId);
				//search for the variant
				const variant = product.variants.find((variant) => variant.id == products[i].variantId);
				//update the product variant stock
				product.variants.id(variant._id).quantity -= products[i].quantity;
				//save the product
				await product.save();
			}
			//update the cart items
			cart.items = [];
			await cart.save();
			console.log('pass7');
			//delete products bought from the cart

			console.log('pass8');
			return savedOrder;
		} else if (req.body.way == 'total') {
			if (!store.policies.pickup == 'total') {
				throw new Error('Store does not have pickup');
			}
			console.log('we are in total');
			let paymentMethod = await stripe.paymentMethods.create({
				type: 'card',
				card: {
					number: req.body.cardNumber,
					exp_month: req.body.expMonth,
					exp_year: req.body.expYear,
					cvc: req.body.cvc,
				},
			});
			const customer = await stripe.customers.create({
				email: req.body.email,
				name: req.body.name,
			});

			paymentIntent = await stripe.paymentIntents.create({
				payment_method: paymentMethod.id,
				amount: products.reduce((acc, cur) => acc + cur.totalPrice, 0) * 100,
				currency: 'usd',
				customer: customer.id,
				payment_method_types: ['card'],
				confirm: true,
			});

			clientSecret = paymentIntent.client_secret;

			const newBill = new Bill({
				userId: req.user.id,
				storeId: req.body.storeId,
				billingAdress: req.body.billingAdress,
				paymentMethod: req.body.paymentMethod,
				paymentId: paymentIntent.id,
				products: products,
				totalPrice: products.reduce((acc, cur) => acc + cur.totalPrice, 0),
				payed: products.reduce((acc, cur) => acc + cur.totalPrice, 0),
				discount: products.reduce((acc, curr) => acc + curr.discount, 0),
				payable: products.reduce((acc, curr) => acc + curr.totalPrice, 0) - products.reduce((acc, curr) => acc + curr.discount, 0),
				shippingStatus: 'none',
				origin: store.address,
				paymentStatus: paymentIntent.status,
			});
			await newBill.save();

			//update the order with the payment intent id

			console.log('pass5');
			//create the order
			const newOrder = new Order({
				userId: req.user.id,
				storeId: req.body.storeId,
				items: products,
				origin: store.address,
				status: paymentIntent.status,
				billId: newBill._id,
				shippingStatus: 'none',
				total: newBill.total,
				paymentId: paymentIntent.id,
				clientSecret: clientSecret,
				billingAdress: req.body.billingAdress,
			});
			const savedOrder = await newOrder.save(); // thbet lta7t

			//update the product stock
			for (let i = 0; i < products.length; i++) {
				//get the product
				const product = await Product.findById(products[i].productId);
				//search for the variant
				const variant = product.variants.find((variant) => variant.id == products[i].variantId);
				//update the product variant stock
				product.variants.id(variant._id).quantity -= products[i].quantity;
				//save the product
				await product.save();
			}
			//update the cart items
			cart.items = [];
			await cart.save();
			console.log('pass7');
			//delete products bought from the cart

			console.log('pass8');
			return savedOrder;
		} else if (req.body.way == 'partial') {
			if (!store.policies.pickup == 'partial') {
				throw new Error('Store does not have pickup');
			}
			console.log('we are in partial');
			let paymentMethod = await stripe.paymentMethods.create({
				type: 'card',
				card: {
					number: req.body.cardNumber,
					exp_month: req.body.expMonth,
					exp_year: req.body.expYear,
					cvc: req.body.cvc,
				},
			});
			const customer = await stripe.customers.create({
				email: req.body.email,
				name: req.body.name,
			});
			let totalos = products.reduce((acc, cur) => acc + cur.totalPrice, 0);
			console.log('totalos', totalos);
			console.log('pickUp', store.policies.selfPickUpPrice);
			paymentIntent = await stripe.paymentIntents.create({
				payment_method: paymentMethod.id,
				amount: (totalos * (100 * store.policies.selfPickUpPrice)) / 100,
				currency: 'usd',
				customer: customer.id,
				payment_method_types: ['card'],
				confirm: true,
			});

			clientSecret = paymentIntent.client_secret;

			const newBill = new Bill({
				userId: req.user.id,
				storeId: req.body.storeId,
				paymentMethod: req.body.paymentMethod,
				billingAdress: req.body.billingAdress,

				paymentId: paymentIntent.id,
				products: products,
				totalPrice: products.reduce((acc, cur) => acc + cur.totalPrice, 0),
				payed: (products.reduce((acc, cur) => acc + cur.totalPrice, 0) * store.policies.selfPickUpPrice) / 100,
				discount: products.reduce((acc, curr) => acc + curr.discount, 0),
				shippingStatus: 'none',
				origin: store.address,
				paymentStatus: paymentIntent.status,
			});
			await newBill.save();

			//update the order with the payment intent id

			console.log('pass5');
			//create the order
			const newOrder = new Order({
				userId: req.user.id,
				storeId: req.body.storeId,
				items: products,
				origin: store.address,
				status: paymentIntent.status,
				billingAdress: req.body.billingAdress,

				billId: newBill._id,
				shippingStatus: 'none',
				total: newBill.total,
				paymentId: paymentIntent.id,
				clientSecret: clientSecret,
			});
			const savedOrder = await newOrder.save(); // thbet lta7t

			//update the product stock
			for (let i = 0; i < products.length; i++) {
				//get the product
				const product = await Product.findById(products[i].productId);
				//search for the variant
				const variant = product.variants.find((variant) => variant.id == products[i].variantId);
				//update the product variant stock
				product.variants.id(variant._id).quantity -= products[i].quantity;
				//save the product
				await product.save();
			}
			//update the cart items
			cart.items = [];
			await cart.save();
			console.log('pass7');
			//delete products bought from the cart

			console.log('pass8');
			return savedOrder;
		} else if (req.body.way == 'free') {
			if (!store.policies.pickup == 'free') {
				throw new Error('Store does not have pickup');
			}
			console.log('we are in free');
			const newBill = new Bill({
				userId: req.user.id,
				storeId: req.body.storeId,
				billingAdress: req.body.billingAdress,
				products: products,
				totalPrice: products.reduce((acc, cur) => acc + cur.totalPrice, 0),
				discount: products.reduce((acc, curr) => acc + curr.discount, 0),
				shippingStatus: 'none',
				origin: store.address,
			});
			await newBill.save();

			//update the order with the payment intent id

			console.log('pass5');
			//create the order
			const newOrder = new Order({
				userId: req.user.id,
				billingAdress: req.body.billingAdress,
				storeId: req.body.storeId,
				items: products,
				origin: store.address,
				billId: newBill._id,
				shippingStatus: 'none',
				total: newBill.total,
			});
			const savedOrder = await newOrder.save(); // thbet lta7t

			//update the product stock
			for (let i = 0; i < products.length; i++) {
				//get the product
				const product = await Product.findById(products[i].productId);
				//search for the variant
				const variant = product.variants.find((variant) => variant.id == products[i].variantId);
				//update the product variant stock
				product.variants.id(variant._id).quantity -= products[i].quantity;
				//save the product
				await product.save();
			}
			//update the cart items
			cart.items = [];
			await cart.save();
			console.log('pass7');
			//delete products bought from the cart

			console.log('pass8');
			return savedOrder;
		} else {
			throw new Error({ message: 'invalid way' });
		}
	} catch (err) {
		throw err;
	}
};

//get the order by id
exports.getOrder = async (req) => {
	try {
		const order = await Order.findById(req.params.id);
		if (!order) {
			throw new Error('order not found');
		}
		return order;
	} catch (err) {
		throw err;
	}
};
//get order by user id
exports.getOrders = async (req) => {
	try {
		const order = await Order.find({ userId: req.params.id });
		if (!order) {
			throw new Error('order not found');
		}
		return order;
	} catch (err) {
		throw err;
	}
};
//get order by store id
exports.getOrdersByStore = async (req) => {
	try {
		const order = await Order.find({ storeId: req.params.id });
		if (!order) {
			throw new Error('order not found');
		}
		return order;
	} catch (err) {
		throw err;
	}
};
//get order by status
exports.getOrdersByStatus = async (req) => {
	try {
		const order = await Order.find({ status: req.params.status });
		if (!order) {
			throw new Error('order not found');
		}
		return order;
	} catch (err) {
		throw err;
	}
};
//get order by shipping status
exports.getOrdersByShippingStatus = async (req) => {
	try {
		const order = await Order.find({ shippingStatus: req.params.shippingStatus });
		if (!order) {
			throw new Error('order not found');
		}
		return order;
	} catch (err) {
		throw err;
	}
};
//get order by payment status
exports.getOrdersByPaymentStatus = async (req) => {
	try {
		const order = await Order.find({ paymentStatus: req.params.paymentStatus });
		if (!order) {
			throw new Error('order not found');
		}
		return order;
	} catch (err) {
		throw err;
	}
};
//get order by payment id
exports.getOrdersByPaymentId = async (req) => {
	try {
		const order = await Order.find({ paymentId: req.params.paymentId });
		if (!order) {
			throw new Error('order not found');
		}
		return order;
	} catch (err) {
		throw err;
	}
};
