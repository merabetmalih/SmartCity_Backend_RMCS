const { Schema, model } = require('mongoose');
const Product = require('./Product');
const User = require('./User');

const itemSchema = new Schema(
	{
		productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
		variantId: { type: String, required: true },
		discount: { type: Number, default: 0 },
		quantity: { type: Number, required: true, default: 1 },
		discountQuantity: { type: Number, default: 0 },
		//price: { type: Number, required: true },
		//name: { type: String, required: true },
		//image: { type: String, required: true, default: 'https://via.placeholder.com/150' },
		totalPrice: { type: Number, required: true, default: 0 },
	},
	{
		timestamp: true,
	}
);

const cartSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			unique: true,
		},
		items: [itemSchema],
		totalDiscount: {
			type: Number,
			required: true,
			default: 0,
		},
		totalPayable: {
			type: Number,
			required: true,
			default: 0,
		},
	},
	{ timestamp: true, toJSON: { virtuals: true } }
);
cartSchema.virtual('totaleQuantity').get(function () {
	const items = this.items;
	console.log(items);
	return items.reduce(function (total, currentValue) {
		return total + currentValue.quantity;
	}, 0);
});
cartSchema.virtual('totalPriceForAllProducts').get(function () {
	const items = this.items;
	return items.reduce(function (total, currentValue) {
		return total + currentValue.totalPrice;
	}, 0);
});

module.exports = model('Cart', cartSchema);
