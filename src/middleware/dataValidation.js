//this is the middelware for data validation
const joi = require('joi');

//auth validation data
const userSchema = joi.object({
	email: joi.string().email().required(),
	password: joi.string().min(6).max(20).required(),
	role: joi.string().valid('user', 'admin', 'seller').required(),
});
exports.userSchemaValidation = (req, res, next) => {
	const { error } = userSchema.validate(req.body);
	if (error) {
		console.log(error);
		return res.status(400).send(error.details[0].message);
	}
	next();
};

const userLoginSchema = joi.object({
	email: joi.string().email().required(),
	password: joi.string().min(6).max(20).required(),
});
exports.userLoginSchemaValidation = (req, res, next) => {
	const { error } = userLoginSchema.validate(req.body);
	if (error) {
		console.log(error);
		return res.status(400).send(error.details[0].message);
	}
	next();
};

const userVerificationSchema = joi.object({
	email: joi.string().email().required(),
	verificationCode: joi.string().min(3).max(5).required(),
});
//user registration data
exports.userVerificationSchemaValidation = (req, res, next) => {
	const { error } = userVerificationSchema.validate(req.body);
	if (error) {
		console.log(error);
		return res.status(400).send(error.details[0].message);
	}
	next();
};

const updateSchema = joi.object({
	email: joi.string().email(),
	password: joi.string().min(6).max(20),
	firstName: joi.string().min(3).max(20),
	lastName: joi.string().min(3).max(20),
	phone: joi.string().min(10).max(10),
	profileImage: joi.string().min(3).max(200),
	adresse: joi.object({
		latitude: joi.number().required(),
		longitude: joi.number().required(),
		countryCode: joi.string().min(3).max(20),
		country: joi.string().min(3).max(20),
		city: joi.string().min(3).max(20),
		streetName: joi.string().min(3).max(20),
		postalCode: joi.string().min(3).max(20),
		fullAdress: joi.string(),
		region: joi.string(),
		apartmentNumber: joi.string(),
	}),
	discountCode: joi.string().min(3).max(20),
	companyName: joi.string().min(3).max(20),
	shippingAdress: joi.object({
		countryCode: joi.string().min(3).max(20),
		country: joi.string().min(3).max(20),
		city: joi.string().min(3).max(20),
		streetName: joi.string().min(3).max(20),
		postalCode: joi.string().min(3).max(20),
		fullAdress: joi.string(),
		region: joi.string(),
		apartmentNumber: joi.string(),
	}),
	proximityRange: joi.number().min(0).max(1000),
});
exports.updateSchemaValidation = (req, res, next) => {
	const { error } = updateSchema.validate(req.body);
	if (error) {
		console.log(error);
		return res.status(400).send(error.details[0].message);
	}
	next();
};
//cart validation data

const itemSchema = joi.object({
	productId: joi.string().required(),
	quantity: joi.number().min(1),
	variantId: joi.string().required(),
});
exports.itemSchemaValidation = (req, res, next) => {
	const { error } = itemSchema.validate(req.body);
	if (error) {
		console.log(error);
		return res.status(400).send(error.details[0].message);
	}
	next();
};

//category validation data

const createCategorySchema = joi.object({
	name: joi.string().required(),
	description: joi.string().required(),
});
exports.createCategorySchemaValidation = (req, res, next) => {
	const { error } = createCategorySchema.validate(req.body);
	if (error) {
		console.log(error);
		return res.status(400).send(error.details[0].message);
	}
	next();
};
//offer validation data
const schemaOffer = joi.object({
	productId: joi.string().required(),
	offerExpiration: joi.date(),
	offerImage: joi.string(),
	offerName: joi.string(),
	offerDescription: joi.string(),
	offerDiscount: joi.number().required(),
	offerStock: joi.number().required(),
	discountType: joi.string().valid('percentage', 'amount'),
});
exports.schemaOfferValidation = (req, res, next) => {
	const { error } = schemaOffer.validate(req.body);
	if (error) {
		console.log(error);
		return res.status(400).send(error.details[0].message);
	}
	next();
};
const schemaGetOffers = joi.object({
	storeId: joi.string().required(),
});
exports.schemaGetOffersValidation = (req, res, next) => {
	const { error } = schemaGetOffers.validate(req.body);
	if (error) {
		console.log(error);
		return res.status(400).send(error.details[0].message);
	}
	next();
};

const schemaGetOfferById = joi.object({
	offerId: joi.string(),
});
exports.schemaGetOfferByIdValidation = (req, res, next) => {
	const { error } = schemaGetOfferById.validate(req.body);
	if (error) {
		console.log(error);
		return res.status(400).send(error.details[0].message);
	}
	next();
};

const schemaUpdateOffer = joi.object({
	offerExpiration: joi.date(),
	offerImage: joi.string(),
	offerName: joi.string(),
	offerDescription: joi.string(),
	offerDiscount: joi.number(),
});
exports.schemaUpdateOfferValidation = (req, res, next) => {
	const { error } = schemaUpdateOffer.validate(req.body);
	if (error) {
		console.log(error);
		return res.status(400).send(error.details[0].message);
	}
	next();
};
//order validation data
const orderSchema = joi.object({
	storeId: joi.string().required(),
	email: joi.string().required(),
	cardNumber: joi.string().required(),
	expMonth: joi.string().required(),
	expYear: joi.string().required(),
	cvc: joi.string().required(),
	way: joi.string().valid('total', 'partial', 'free', 'delivery'),
	billingAdress: joi.object({
		name: joi.string().min(3).max(40),
		address: joi.string().min(3).max(200),
		city: joi.string().min(3).max(20),
		state: joi.string().min(3).max(20),
		country: joi.string().min(3).max(20),
		postalCode: joi.string().min(5).max(5),
		phone: joi.string().min(3).max(20),
		street1: joi.string().min(3).max(60),
		street2: joi.string().min(3).max(60),
	}),

	shippingMethod: joi.string().min(3).max(20),
	shippingPrice: joi.number().min(1).max(1000000),
	shippingTax: joi.number().min(1).max(1000000),
	shippingDiscount: joi.number().min(1).max(1000000),
	shippingTotal: joi.number().min(1).max(1000000),
	shippingStatus: joi.string().min(3).max(20),
});
exports.orderSchemaValidation = (req, res, next) => {
	const { error } = orderSchema.validate(req.body);
	if (error) {
		console.log(error);
		return res.status(400).send(error.details[0].message);
	}
	next();
};
//product validation data
const updateProductSchema = joi.object({
	name: joi.string().min(3).max(20),
	sellerId: joi.string().required(),
	price: joi.number().min(1).max(1000000),
	description: joi.string().min(3).max(200),
	tags: joi.array().items(joi.string().min(3).max(20)),
	discount: joi.number().min(0).max(100),
	images: joi.array().items(joi.string().min(3).max(200)),
	storeId: joi.string().required(),
	categoryId: joi.string(),
	variantes: joi.array().items(
		joi.object({
			_id: joi.string(),
			name: joi.string().min(3).max(20),
			quantity: joi.number().min(1).max(1000000),
			price: joi.number().min(1).max(1000000),
			description: joi.string().min(3).max(200),
			image: joi.string().min(3).max(200),
			characterstics: joi.array().items(
				joi.object({
					name: joi.string().min(3).max(20),
					value: joi.string(),
				})
			),
		})
	),
});
exports.updateProductSchemaValidation = (req, res, next) => {
	if (typeof req.body.variantes === 'string') {
		req.body.variantes = JSON.parse(req.body.variantes);
	}
	const { error } = updateProductSchema.validate(req.body);
	if (error) {
		console.log(error);
		return res.status(400).send(error.details[0].message);
	}
	next();
};

//product validation data
const createProductSchema = joi.object({
	name: joi.string().min(3).max(20).required(),
	price: joi.number().min(1).required(),
	description: joi.string().min(3).max(200),
	image: joi.string().min(3).max(200),
	categoryId: joi.string(),
	subcategory: joi.string().min(3).max(20),
	discount: joi.number().min(1).max(100),
	tags: joi.array().items(joi.string().min(2).max(20)),
	sellerId: joi.string(),
	storeId: joi.string().required(),
	images: joi.array().items(joi.string().min(3).max(200)),
	variantes: joi.array().items(
		joi.object({
			price: joi.number().min(1).required(),
			quantity: joi.number().min(1).required(),
			characterstics: joi.array().items(
				joi.object({
					name: joi.string().min(3).max(20).required(),
					value: joi.string().required(),
				})
			),
		})
	),
});
exports.createProductSchemaValidation = (req, res, next) => {
	if (typeof req.body.variantes === 'string') {
		req.body.variantes = JSON.parse(req.body.variantes);
	}
	const { error } = createProductSchema.validate(req.body);
	if (error) {
		console.log(error);
		return res.status(400).send(error.details[0].message);
	}
	next();
};

//search validation data
const schemaSearchStore = joi.object({
	langitude: joi.number().required(),
	latitude: joi.number().required(),
	radius: joi.number().required(),
});
exports.schemaSearchStoreValidation = (req, res, next) => {
	const { error } = schemaSearchStore.validate(req.body);
	if (error) {
		console.log(error);
		return res.status(400).send(error.details[0].message);
	}
	next();
};

const schemaSearchProduct = joi.object({
	langitude: joi.number().required(),
	latitude: joi.number().required(),
	radius: joi.number().required(),
	name: joi.string().min(3).max(20),
	page: joi.number().min(0),
	limit: joi.number().min(0),
});
exports.schemaSearchProductValidation = (req, res, next) => {
	const { error } = schemaSearchProduct.validate(req.body);
	if (error) {
		console.log(error);
		return res.status(400).send(error.details[0].message);
	}
	next();
};

//store validation data

const schemaStore = joi.object({
	name: joi.string().min(2).required(),
	description: joi.string().min(3).max(200).required(),
	sellerId: joi.string().required(),
	policies: joi.object({
		delivery: joi.bool(),
		selfPickUp: joi.string().valid('total', 'partial', 'free').required(),
		selfPickUpPrice: joi.number(),
		tax: joi.number(),
		openWeekend: joi.bool(),
		openTime: joi.string(),
		closeTime: joi.string(),
	}),
	location: joi
		.object({
			type: joi.string().valid('Point').required(),
			coordinates: joi.array().items().length(2).required(),
		})
		.required(),
	address: joi.object({
		city: joi.string().min(3).max(20).required(),
		streetName: joi.string().min(3),
		postalCode: joi.string().min(2).max(5),
		fullAdress: joi.string().min(3),
		region: joi.string().min(3).max(20),
		country: joi.string().min(3).max(20),
		countryCode: joi.string().min(2),
	}),
	image: joi.string().min(3),
});
exports.schemaStoreValidation = (req, res, next) => {
	console.log('start store validation');

	if (typeof req.body.location === 'string') {
		req.body.location = JSON.parse(req.body.location);
	}
	if (typeof req.body.address === 'string') {
		req.body.address = JSON.parse(req.body.address);
	}
	if (typeof req.body.policies === 'string') {
		req.body.policies = JSON.parse(req.body.policies);
	}

	const { error } = schemaStore.validate(req.body);
	if (error) {
		console.log(error);
		return res.status(400).send(error.details[0].message);
	}
	next();
};
const schemaUpdateStore = joi.object({
	name: joi.string().min(3).max(20),
	description: joi.string().min(3).max(200),
	policies: joi.object({
		delivery: joi.bool(),
		selfPickUp: joi.string().valid('total', 'partial', 'free').required(),
		selfPickUpPrice: joi.number(),
		tax: joi.number(),
		openWeekend: joi.bool(),
		openTime: joi.string(),
		closeTime: joi.string(),
	}),
	isActive: joi.bool(),
	address: joi.object({
		city: joi.string().min(3).max(20),
		streetName: joi.string().min(3).max(40),
		postalCode: joi.string().min(3).max(20),
		country: joi.string().min(3).max(20),
		countryCode: joi.string().min(3).max(20),
		fullAdress: joi.string().min(3).max(40),
		region: joi.string().min(3).max(20),
		postalCode: joi.string().min(3).max(20),
	}),
	location: joi.object({
		type: joi.string().valid('Point'),
		coordinates: joi.array().items().length(2),
	}),

	image: joi.string().min(3).max(20),
});
exports.schemaUpdateStoreValidation = (req, res, next) => {
	if (typeof req.body.location === 'string') {
		req.body.location = JSON.parse(req.body.location);
	}
	if (typeof req.body.address === 'string') {
		req.body.address = JSON.parse(req.body.address);
	}
	if (typeof req.body.policies === 'string') {
		req.body.policies = JSON.parse(req.body.policies);
	}
	const { error } = schemaUpdateStore.validate(req.body);
	if (error) {
		console.log(error);
		return res.status(400).send(error.details[0].message);
	}
	next();
};
