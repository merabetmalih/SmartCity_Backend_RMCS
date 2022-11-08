const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
	const authHeader = req.headers.token;

	if (authHeader) {
		const token = authHeader.split(' ')[1];
		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
			if (err) {
				return res.status(401).json({ message: 'Invalid Token' });
			}
			req.user = user;
			next();
		});
	} else {
		return res.status(401).json({ message: 'Token is not provided' });
	}
};
//for updatin User information
const verifyTokenAndAutherization = (req, res, next) => {
	verifyToken(req, res, () => {
		console.log('checking if user is authorized');
		console.log(req.user.id, req.params.id);
		if (req.user.id === req.params.id || req.user.role === 'admin') {
			console.log('user is authorized');
			next();
		} else {
			console.log('called');
			res.status(403).json('You Are Not Authorized');
		}
	});
};

// for all access
const verifyAdmin = (req, res, next) => {
	verifyToken(req, res, () => {
		req.user.id == req.params.id || req.user.isAdmin == true ? next() : res.status(403).json('You Are Not admin');
	});
};
//for seller access
const verifySeller = (req, res, next) => {
	verifyToken(req, res, () => {
		req.user.id == req.params.id || req.user.role == 'seller' ? next() : res.status(403).json('You Are Not Authorized');
	});
};
// verifyProduct

module.exports = { verifyToken, verifySeller, verifyAdmin, verifyTokenAndAutherization };
