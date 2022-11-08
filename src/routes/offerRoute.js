const router = require('express').Router();
var OfferController = require('../controllers/offerController');
const {
	schemaOfferValidation,
	schemaGetOfferByIdValidation,
	schemaUpdateOfferValidation,
	schemaGetOffersValidation,
} = require('../middleware/dataValidation');

const { verifyToken, verifySeller } = require('../middleware/verifyToken');

//creat offer
router.post('/create', verifySeller, schemaOfferValidation, OfferController.createOffer);
//get all offers for a store

router.get('/all', verifyToken, schemaGetOffersValidation, OfferController.getOffers);

//get offer by id

router.get('/:id', verifyToken, schemaGetOfferByIdValidation, OfferController.getOfferById);

//update offer

router.put('/update/:id', verifyToken, schemaUpdateOfferValidation, OfferController.updateOffer);
//delete offer
router.delete('/delete/:id', verifySeller, OfferController.deleteOffer);

module.exports = router;
