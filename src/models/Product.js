const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: { type: String, required: true },
		price: { type: Number, required: true },
		categoryId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Category',
			required: true,
		},
		//customCategory: { type: String, required: true },
		//customCategoryId: { type: String, required: true },
		images: [{ type: String, required: true }],
		tags: [{ type: String, required: true }],
		variants: [
			{
				characterstics: {
					type: Object,
					required: true,
				},
				price: {
					type: Number,
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
					default: 1,
				},
				img: {
					type: String,
					//required: true,
				},
				available: {
					type: Boolean,
					required: true,
					default: true,
				},
			},
		],
		sellerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Seller',
			required: true,
		},
		storeId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Store',
			required: true,
		},
		deleted: {
			type: Boolean,
			required: true,
			default: false,
		},

		discountCode: {
			type: String,
		},
		discount: {
			type: Number,
			default: 0,
		},
		discountType: {
			type: String,
			enum: ['percentage', 'amount'],
		},
		discountExpiration: {
			type: Date,
			required: true,
			default: Date.now() + 86400000,
		},
		flashDeal: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'FlashDeal',
		},
		offer: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Offer',
		},
		reports: [
			{
				idUser: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User',
				},

				message: { type: String },

				date: {
					type: Date,
					required: true,
				},
			},
		],
	},
	{
		timestamp: true,
		toJSON: { virtuals: true },
	}
);
productSchema.virtual('quantity').get(function () {
	const variants = this.variants;
	return variants.reduce(function (total, currentValue) {
		return total + currentValue.quantity;
	}, 0);
});
productSchema.virtual('PriceMin').get(function () {
	const variants = this.variants;
	return variants.reduce(function (prev, curr) {
		return prev.price < curr.price ? prev : curr;
	}).price;
});

productSchema.virtual('PriceMax').get(function () {
	const variants = this.variants;
	return variants.reduce(function (prev, curr) {
		return prev.price > curr.price ? prev : curr;
	}).price;
});
//virtual array of all the images of the product
productSchema.virtual('imagesss').get(function () {
	if (this.images != null) {
		const images = this.images;
		console.log(images);
		console.log('images');
		return images.map(function (image) {
			return `${process.env.APP_URL}/${image}`;
		});
	}
});
//virtual array for all the images of the variants
productSchema.virtual('variantImages').get(function () {
	if (this.variants != null) {
		const variants = this.variants;
		console.log(variants);
		return variants.map(function (variant) {
			if (variant.img != null) {
				return `${process.env.APP_URL}/${variant.img}`;
			} else {
				return `${process.env.APP_URL}/images/default.png`;
			}
		});
	}
});

module.exports = mongoose.model('Product', productSchema);
