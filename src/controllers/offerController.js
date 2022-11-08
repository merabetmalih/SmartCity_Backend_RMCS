var OfferService = require('../services/offerService');

exports.createOffer = async (req, res) => {
	try {
		const offer = await OfferService.createOffer(req);
		res.send(offer);
	} catch (err) {
		res.status(500).send(err.message);
	}
};
exports.getOffers = async (req, res) => {
	try {
		const offers = await OfferService.getOffers(req);
		res.send(offers);
	} catch (err) {
		res.status(500).send(err.message);
	}
};
exports.getOfferById = async (req, res) => {
	try {
		const offer = await OfferService.getOfferBy(req);
		res.send(offer);
	} catch (err) {
		res.status(500).send(err.message);
	}
};

exports.updateOffer = async (req, res) => {
	try {
		const offer = await OfferService.updateOffer(req);
		res.send(offer);
	} catch (err) {
		res.status(500).send(err.message);
	}
};
exports.deleteOffer = async (req, res) => {
	try {
		const offer = await OfferService.deleteOffer(req);
		res.send(offer);
	} catch (err) {
		res.status(500).send(err.message);
	}
};
