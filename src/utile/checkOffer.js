const Offer = require('../models/Offer');
const Product = require('../models/Product');
const cart = require('../models/Cart');
async function checkOffer(productId, variantId, offerId, quantity, discountQuantity) {
	console.log('checkOffer start function');
	let discount = 0.0;
	let discountPrice = 0.0;
	const product = await Product.findById(productId);
	//check the product
	if (!product) {
		return {
			status: false,
			message: 'Product not found',
		};
	}
	//get the variant

	const variant = product.variants.find((variant) => variant._id.toString() === variantId.toString());
	//get the offer
	const offer = await Offer.findOne({
		_id: offerId,
		active: true,
		offerStock: {
			$gt: 0,
		},
		offerDeleted: false,
	});
	if (offer) {
		console.log('offer found');
		discount = offer.offerDiscount;
		discountType = offer.discountType;
		//update discountQuanity

		if (offer.offerStock <= quantity + discountQuantity) {
			console.log('offer stock is less than quantity' + offer.offerStock);
			discountQuantity = offer.offerStock;
			console.log('update discountquantity');
		} else {
			discountQuantity = quantity;
		}

		//update discount
		if (offer.discountType == 'percentage') {
			console.log('percentage');

			discountPrice = variant.price * (offer.offerDiscount / 100);
			discountType = 'percentage';
		} else {
			discountPrice = variant.price - offer.offerDiscount;
			discountType = 'amount';
		}
	} else {
		console.log('offer not found');
		discount = 0;
		discountType = 'percentage';
		discountQuantity = 0;
		discountPrice = 0;
		price = variant.price;
	}

	return {
		discount: discount,
		discountType: discountType,
		discountQuantity: discountQuantity,
		price: price,
		discountPrice: discountPrice,
	};
}
module.exports = { checkOffer };
