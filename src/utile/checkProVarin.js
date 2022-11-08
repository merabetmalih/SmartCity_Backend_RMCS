const Product = require('../models/Product');
async function checkProVarin(productId, variantId) {
	console.log('checkProVarin start function');
	const product = await Product.findById(productId);
	//check the product
	if (!product) {
		return false;
	}
	//get the variant
	const variant = product.variants.find((variant) => variant._id.toString() === variantId.toString());
	console.log(variant);
	return true;
}
module.exports = { checkProVarin };
