const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;

const orderSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		storeId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Store',
		},
		billId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Bill',
		},

		clientSecret: {
			type: String,
		},
		paymentId: {
			type: String,
		},
		paymentMethod: {
			type: String,
		},

		items: [
			{
				productId: { type: String, required: true },
				variantId: { type: String, required: true },
				quantity: { type: Number, required: true, default: 1 },
				discountQuantity: { type: Number, required: true, default: 0 },
				totalPrice: { type: Number, required: true },
				discount: { type: Number, required: true },
			},
			{
				timestamp: true,
			},
		],

		origin: {
			city: { type: String },
			state: { type: String },
			country: { type: String },
			postalCode: { type: String },
			phone: { type: String },
			street1: { type: String },
			street2: { type: String },
			longitude: { type: Number },
			latitude: { type: Number },
		},
		billingAdress: {
			city: { type: String },
			state: { type: String },
			country: { type: String },
			postalCode: { type: String },
			phone: { type: String },
			street1: { type: String },
			street2: { type: String },
			longitude: { type: Number },
			latitude: { type: Number },
		},

		total: { type: Number, required: true, default: 0 },
		status: { type: String, required: true, enum: ['pending', 'succeeded', 'cancelled', 'delivered'], default: 'pending' },
	},
	{ timestamp: true }
);
module.exports = mongoose.model('Order', orderSchema);
