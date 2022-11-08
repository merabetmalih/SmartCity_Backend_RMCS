const router = require('express').Router();
const { verifyToken, verifyTokenAndAutherization } = require('../middleware');

const joi = require('joi');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const calculateOrderAmount = (items) => {
	// Replace this constant with a calculation of the order's amount
	// Calculate the order total on the server to prevent
	// people from directly manipulating the amount on the client
	return 1400;
};

//Joi validation Payment
const paymentSchema = joi.object({
	paymentMethodId: joi.string().required(),
	paymentIntentId: joi.string().required(),
	orderId: joi.string().required(),
	currency: joi.string().required(),
	amount: joi.number().required(),
	status: joi.string().required(),
	createdAt: joi.date().required(),
	updatedAt: joi.date().required(),
});

router.post('payments/create', verifyTokenAndAutherization, (req, res) => {
	try {
		const { error } = paymentSchema.validate(req.body);
		if (error) return res.status(400).send(error.details[0].message);

		stripe.charges.create(
			{
				source: req.user.id,
				amount: req.body.amount,
				currency: 'usd',
				payment_method_types: ['card'],
				receipt_email: req.user.email,
			},
			(stripeErr, stripeRes) => {
				if (stripeErr) {
					res.status(500).json(stripeErr);
				} else {
					res.status(200).json(stripeRes);
				}
			}
		);
	} catch (err) {
		console.log(err);
		res.status(500).send('Server Error');
	}
});

router.post('/create-payment-intent', async (req, res) => {
	const { items } = req.body;
	console.log('items', items);

	// Create a PaymentIntent with the order amount and currency
	const paymentIntent = await stripe.paymentIntents.create({
		amount: calculateOrderAmount(items),
		currency: 'eur',
		automatic_payment_methods: {
			enabled: true,
		},
	});

	res.send({
		clientSecret: paymentIntent.client_secret,
	});
});
//Schema stripe Customer
const customerSchema = joi
	.object({
		name: joi.string().required(),
		email: joi.string().required(),
	})
	.required();

//create Stripe Customer
router.post('/customers', verifyToken, async (req, res) => {
	try {
		const { error } = customerSchema.validate(req.body);
		if (error) return res.status(400).send(error.details[0].message);
		//create Stripe Customer
		const customer = await stripe.customers.create({
			name: req.body.name,
			email: req.body.email,
		});
		res.send(customer);
	} catch (err) {
		console.log(err);
		res.status(500).send('Server Error');
	}
});
//schema card
const cardSchema = joi
	.object({
		customerId: joi.string().required(),
		card_Name: joi.string().required(),
		card_Number: joi.string().required(),
		card_Exp_Month: joi.string().required(),
		card_Exp_Year: joi.string().required(),
		card_Cvc: joi.string().required(),
	})
	.required();
//create Stripe Card
router.post('/cards', verifyToken, async (req, res) => {
	try {
		const { error } = cardSchema.validate(req.body);
		if (error) return res.status(400).send(error.details[0].message);
		//create Stripe Card
		const card_Token = await stripe.tokens.create({
			card: {
				name: req.body.card_Name,
				number: req.body.card_Number,
				exp_month: req.body.card_Exp_Month,
				exp_year: req.body.card_Exp_Year,
				cvc: req.body.card_Cvc,
			},
		});
		console.log('card_Token', card_Token);
		console.log('customerId', req.body.customerId);
		const card = await stripe.customers.createSource(req.body.customerId, { source: card_Token.id });

		res.send(card);
	} catch (err) {
		console.log(err);
		res.status(500).send('Server Error');
	}
});
//charge schema
const chargeSchema = joi

	.object({
		customerId: joi.string().required(),
		cardId: joi.string().required(),
	})
	.required();

//create charge
router.post('/charges', verifyToken, async (req, res) => {
	try {
		const { error } = chargeSchema.validate(req.body);
		if (error) return res.status(400).send(error.details[0].message);
		//create Stripe Card
		const charge = await stripe.charges.create({
			customer: req.body.customerId,
			amount: 19000,
			currency: 'eur',
			source: req.body.source,
			card: req.body.cardId,
			receipt_email: 'hm_merabet@esi.dz',
		});
		res.send(charge);
	} catch (err) {
		console.log(err);
		res.status(500).send('Server Error');
	}
});

//schema for payment method
const paymentMethodSchema = joi.object({
	stripeCustomerId: joi.string().required(),
	paymentIntentId: joi.string().required(),
	cardToken: joi.string().required(),
	orderId: joi.string().required(),
	status: joi.string().required(),
	createdAt: joi.date().required(),
	updatedAt: joi.date().required(),
});

//creat a new payment method
router.post('/create-payment-method', async (req, res) => {
	try {
		const { error } = paymentSchema.validate(req.body);
		if (error) return res.status(400).send(error.details[0].message);
		const paymentMethod = await stripe.paymentMethods.create({
			type: 'card',
			card: {
				number: req.body.number,
				exp_month: req.body.exp_month,
				exp_year: req.body.exp_year,
				cvc: req.body.cvc,
			},
		});
		res.send({
			paymentMethodId: paymentMethod.id,
		});
	} catch (err) {
		console.log(err);
		res.status(500).send('Server Error');
	}
});

//create a new payment intent
router.post('/create-payment-intent', async (req, res) => {
	try {
		const { error } = paymentSchema.validate(req.body);
		if (error) return res.status(400).send(error.details[0].message);
		const paymentIntent = await stripe.paymentIntents.create({
			amount: req.body.amount,
			currency: 'eur',
			payment_method: req.body.paymentMethodId,
			receipt_email: req.user.email,
		});
		res.send({
			paymentIntentId: paymentIntent.id,
		});
	} catch (err) {
		console.log(err);
		res.status(500).send('Server Error');
	}
});

module.exports = router;
