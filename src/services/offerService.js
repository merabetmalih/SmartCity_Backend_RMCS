const Product = require('../models/Product');
const Offer = require('../models/Offer');
const Store = require('../models/Store');

//ceate offer
exports.createOffer = async (req) => {
	try {
		//check if he is the product owner
		const product = await Product.findOne({ _id: req.body.productId });
		if (!product || product.deleted || product.sellerId.toString() !== req.user.id.toString()) {
			throw Error('Product does not exist');
		}
		if (product.offer) {
			throw Error('Product already has an offer');
		}

		if (product.quantity < req.body.offerStock) {
			throw Error('Quantity is not available');
		}

		const offer = new Offer({
			sellerId: product.sellerId,
			storeId: product.storeId,
			productId: req.body.productId,
			//offerPrice: req.body.offerPrice,
			offerStock: req.body.offerStock,
			offerExpiration: req.body.offerExpiration,
			//offerStatus: req.body.offerStatus,
			discountType: req.body.discountType,
			offerImage: req.body.offerImage,
			offerName: req.body.offerName,
			offerDescription: req.body.offerDescription,
			offerDiscount: req.body.offerDiscount,
		});
		await offer.save();
		//assign offer to product
		await Product.findOneAndUpdate({ _id: req.body.productId }, { offer: offer._id });

		return offer;
	} catch (error) {
		throw Error(error);
	}
};

//get all offers for a store
exports.getOffers = async (req) => {
	try {
		const offers = await Offer.find({ storeId: req.body.storeId }).populate('productId');

		if (!offers) {
			throw Error('Offers not found');
		}
		return offers;
	} catch (error) {
		throw Error(error);
	}
};
//get offer by id
exports.getOfferById = async (req) => {
	try {
		console.log(req.params.id);
		const offer = await Offer.findOne({ _id: req.params.id }).populate('storeId');
		if (!offer) {
			throw Error('Offer not found');
		}
		return offer;
	} catch (error) {
		throw Error(error);
	}
};
//update offer
exports.updateOffer = async (req) => {
	try {
		const offer = await Offer.findOne({ _id: req.params.id });
		if (!offer) {
			throw Error('Offer not found');
		}
		if (offer.sellerId != req.user.id) {
			throw Error('You are not authorized to perform this action.');
		}
		await Offer.updateOne({ _id: req.params.id }, { $set: req.body });
		return 'Offer updated successfully';
	} catch (error) {
		throw Error(error);
	}
};
//delete offer
exports.deleteOffer = async (req) => {
	try {
		if (offer.sellerId != req.user.id) {
			throw Error('You are not authorized to perform this action.');
		}
		await Offer.updateOne({ _id: req.params.id }, { $set: { offerDeleted: true, offerStatus: 'expired' } });
		return 'Offer deleted successfully';
	} catch (error) {
		throw Error(error);
	}
};
