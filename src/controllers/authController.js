var AuthService = require('../services/authService');
exports.register = async (req, res) => {
	try {
		const user = await AuthService.register(req.body);
		res.send(user);
	} catch (err) {
		res.status(500).send(err.message);
	}
};

exports.login = async (req, res) => {
	try {
		const user = await AuthService.login(req.body);
		res.send(user);
	} catch (err) {
		res.status(500).send(err.message);
	}
};
exports.verify = async (req, res) => {
	try {
		const user = await AuthService.verify(req.body);
		res.send(user);
	} catch (err) {
		res.status(500).send(err.message);
	}
};
