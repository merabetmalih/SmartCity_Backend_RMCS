const { Timestamp } = require('mongodb');
const mongoose = require('mongoose');
const BillSchema = new mongoose.Schema(
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

		paymentId: {
			type: String,
		},
		paymentMethod: {
			type: String,
		},
		products: [
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
			streetName: { type: String },
			country: { type: String },
			countryCode: { type: String },
			postalCode: { type: String },
			region: { type: String },
			phone: { type: String },
			fullAdress: { type: String },
			street1: { type: String },
			street2: { type: String },
		},
		billingAdress: {
			city: { type: String },
			streetName: { type: String },
			country: { type: String },
			countryCode: { type: String },
			postalCode: { type: String },
			region: { type: String },
			phone: { type: String },
			fullAdress: { type: String },
			street1: { type: String },
			street2: { type: String },
		},
		shippingStatus: {
			type: String,
			enum: ['none', 'pending', 'shipped', 'delivered'],
			default: 'pending',
		},
		totalPrice: {
			type: Number,
			required: true,
		},
		discount: {
			type: Number,
			required: true,
		},
		paymentStatus: {
			type: String,
			enum: ['none', 'pending', 'succeeded', 'cancelled'],
			default: 'pending',
		},
		refundStatus: {
			type: String,
			enum: ['none', 'pending', 'succeeded', 'cancelled'],
			default: 'none',
		},
		payed: {
			type: Number,
			required: true,
			default: 0,
		},
	},
	{
		timestamp: true,
		toJSON: { virtuals: true },
	}
);
BillSchema.virtual('needToBePay').get(function () {
	if (this.paymentStatus === 'pending') {
		return this.totalPrice;
	} else if (this.paymentStatus === 'succeeded') {
		return this.totalPrice - this.payed;
	} else {
		return 0;
	}
});
BillSchema.virtual('isPayed').get(function () {
	if (this.paymentStatus === 'succeeded') {
		return true;
	} else {
		return false;
	}
});

module.exports = mongoose.model('Bill', BillSchema);
