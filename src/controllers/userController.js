var UserService = require('../services/userService');
exports.updateUser = async (req, res) => {
	try {
		const user = await UserService.updateUser(req);
		res.send(user);
	} catch (err) {
		res.status(500).send(err.message);
	}
};

exports.deleteUser = async (req, res) => {
	try {
		const user = await UserService.deleteUser(req);
		res.send(user);
	} catch (err) {
		res.status(500).send(err.message);
	}
};

exports.getUser = async (req, res) => {
	try {
		const user = await UserService.getUser(req);
		res.send(user);
	} catch (err) {
		res.status(500).send(err.message);
	}
};

exports.getUsers = async (req, res) => {
	try {
		const users = await UserService.getUsers(req);
		res.send(users);
	} catch (err) {
		res.status(500).send(err.message);
	}
};
