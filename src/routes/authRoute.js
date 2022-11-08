const router = require('express').Router();

var AuthController = require('../controllers/authController');
const { userSchemaValidation, userLoginSchemaValidation, userVerificationSchemaValidation } = require('../middleware/dataValidation');

const { verifyToken, verifyTokenAndAutherization } = require('../middleware/verifyToken');

//REGISTER
router.post('/register', userSchemaValidation, AuthController.register);

//LOGIN

router.post('/login', userLoginSchemaValidation, AuthController.login);
//verification mail
router.post('/verify', userVerificationSchemaValidation, AuthController.verify);

module.exports = router;
