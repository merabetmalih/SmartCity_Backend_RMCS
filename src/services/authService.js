const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
var User = require('../models/User');
const { sendMail } = require('../middleware/email');

exports.register = async (userInfo) => {
	try {
		const random = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

		const user = await User.findOne({ email: userInfo.email });
		if (user) {
			throw new Error('User already exists');
		}

		const newUser = new User({
			email: userInfo.email,
			password: userInfo.password,
			role: userInfo.role,
			verificationCode: random,
		});
		newUser.password = CryptoJS.AES.encrypt(newUser.password, process.env.ACCESS_TOKEN_SECRET).toString();
		try {
			sendMail(
				newUser.email,
				'Welcome to SmartCity',
				'Welcome ' +
					newUser.email.split('@')[0] +
					' You have successfully registered to the app your account is now active you can login to the app ' +
					'' +
					' your verification code is ' +
					random +
					' ' +
					' your email is ' +
					userInfo.email +
					' your password is ' +
					userInfo.password +
					' ' +
					''
			);
		} catch (err) {
			throw err;
		}
		const savedUser = await newUser.save();
		return savedUser;
	} catch (err) {
		throw err;
	}
};

//LOGIN
exports.login = async (userInfo) => {
	try {
		console.log(userInfo);
		console.log(userInfo.email);
		const user = await User.findOne({ email: userInfo.email });
		console.log(user);
		if (user) {
			if (user.isVerified) {
				console.log('pass1');
				const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.ACCESS_TOKEN_SECRET).toString(CryptoJS.enc.Utf8);
				const inputPassword = userInfo.password;
				if (hashedPassword === inputPassword) {
					const token = jwt.sign({ id: user._id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' });
					console.log('pass1');
					return {
						token,
						user: {
							id: user._id,
							email: user.email,
							role: user.role,
						},
					};
				} else {
					console.log('pass3');

					throw new Error('password is incorrect');
				}
			} else {
				console.log('pass4');

				throw new Error('please verify your email');
			}
		} else {
			console.log('pass5');

			throw new Error('email is not registered');
		}
	} catch (err) {
		throw err;
	}
};

//VERIFY
exports.verify = async (userInfo) => {
	try {
		const user = await User.findOne({ email: userInfo.email });
		if (!user) throw new Error('Wrong User Name');
		if (user.verificationCode == userInfo.verificationCode) {
			user.isVerified = true;
			user.save();
			try {
				sendMail(user.email, 'Registration Completed', 'Your email is Now Verified');
			} catch (err) {
				console.log(err);
			}
			return 'hello ' + user.email + ' your email is now verified';
		} else {
			throw Error('User code incorrect');
		}
	} catch (err) {
		console.log(err);
		throw err;
	}
};
