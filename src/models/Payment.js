const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;

const paymentSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		sellerId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		gateway: {
			type: String,
			required: true,
		},

		paymentStatus: {
			type: String,
			required: true,
		},
		paymentAmount: {
			type: Number,
			required: true,
		},
		paymentCurrency: {
			type: String,
			required: true,
		},
		paymentMethod: {
			type: String,
			required: true,
		},
		paymentDate: {
			type: Date,
			required: true,
		},
		paymentTime: {
			type: Date,
			required: true,
		},
		paymentDetails: {
			type: Object,
			required: true,
		},
		totalPrice: {
			type: Number,
			required: true,
			default: 0,
		},
		card: {
			brand: {
				type: String,
				required: true,
			},
			last4: {
				type: String,
				required: true,
			},
			exp_month: {
				type: Number,
				required: true,
			},
			exp_year: {
				type: Number,
				required: true,
			},
			funding: {
				type: String,
				required: true,
			},
			country: {
				type: String,
				required: true,
			},
			name: {
				type: String,
				required: true,
			},
			address_line1: {
				type: String,
				required: true,
			},
			address_line2: {
				type: String,
				required: true,
			},
			address_city: {
				type: String,
				required: true,
			},
			ccvVerified: {
				type: Boolean,
				required: true,
				default: false,
			},
			ccv: {
				type: String,
				required: true,
			},
		},
		timestamp: {
			type: Date,
			required: true,
			default: Date.now(),
		},
		token: {
			type: String,
			required: true,
		},
	},
	{ timestamp: true }
);
module.exports = mongoose.model('Payment', paymentSchema);
