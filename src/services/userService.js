const User = require('../models/User');

const CryptoJS = require('crypto-js');

//Update User

exports.updateUser = async (req) => {
	try {
		if (req.body.password) {
			req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.ACCESS_TOKEN_SECRET).toString();
		}
		const updatedUser = await User.findByIdAndUpdate(
			req.params.id,
			{
				$set: req.body,
			},
			{ new: true }
		).select('-password');
		console.log(updatedUser);
		if (updatedUser) {
		}
		return updatedUser;
	} catch (err) {
		throw err;
	}
};
//delete user
exports.deleteUser = async (req) => {
	try {
		const deletedUser = await User.findByIdAndDelete(req.params.id);
		const { password, ...others } = deletedUser._doc;
		return others;
	} catch (err) {
		throw err;
	}
};
//get user by his id
exports.getUser = async (req) => {
	try {
		console.log('req.params.id', req.params.id);
		console.log('start');
		const user = await User.findById(req.params.id);
		const { password, ...others } = user._doc;

		return others;
	} catch (err) {
		throw err;
	}
};
//get all users
exports.getUsers = async (req) => {
	try {
		const users = await User.find();
		return users;
	} catch (err) {
		throw err;
	}
};
