const mongoose = require('mongoose');
const Product = require('./Product');

const categorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
		},
		description: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			//	required: true,
		},
		productIds: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Product',
			},
		],
	},
	{ timestamp: true, toJSON: { virtuals: true } }
);

//virtual image url
categorySchema.virtual('imageUrl').get(function () {
	if (this.image != null) {
		return `${process.env.App_URL}/${this.image}`;
	}
	return `${process.env.App_URL}/images/default.jpg`;
});
module.exports = mongoose.model('Category', categorySchema);
