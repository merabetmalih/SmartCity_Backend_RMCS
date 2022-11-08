const nodemailer = require('nodemailer');
require('dotenv').config();
const sendMail = (email, subject, message) => {
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.EMAIL,
			pass: process.env.EMAIL_PASSWORD,
		},
	});
	const mailOptions = {
		from: process.env.EMAIL,
		to: email,
		subject: subject,
		text: message,
	};
	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});
};
module.exports = { sendMail };
