require("dotenv").config();

const jwt = require("jsonwebtoken");

class JWT_Object {
	constructor(access_token, refresh_token) {
		this.access_token = access_token;
		this.refresh_token = refresh_token;
	}
};

exports.JWT_Object = JWT_Object;

exports.gen_access_token = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1s' })
};

exports.regen_access_token = (refresh_token, callback) => {
	if (!refresh_token) {
		callback(true);
	}

	jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
		if (err) {
			callback(true);
		}

		var acc_token = gen_access_token(user);
		callback(false, acc_token);
	});
};
