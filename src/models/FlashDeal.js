const { Timestamp } = require('mongodb');
const mongoose = require('mongoose');
const FlashDealSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		image: {
			type: String,
		},
		startDate: {
			type: Date,
			required: true,
			default: Date.now(),
		},
		endDate: {
			type: Date,
			required: true,
			default: Date.now() + 86400000,
		},
		discountType: {
			type: String,
			required: true,
			enum: ['percentage', 'amount'],
			default: 'percentage',
		},
		discount: {
			type: Number,
			required: true,
			default: 0,
		},
		productIds: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Product',
			},
		],
		discountCode: {
			type: String,
			required: true,
		},
		qauntiyFlashDeal: {
			type: Number,
			required: true,
			default: 0,
		},
		active: {
			type: Boolean,
			required: true,
			default: true,
		},
	},
	{
		timestamp: true,
	}
);

module.exports = mongoose.model('FlashDeal', FlashDealSchema);
