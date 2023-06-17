require("dotenv").config();

const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");

router.get("/", (req, res, next) => {
	let access_token = req.query.token;

	console.log(access_token);
	jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) {
			return res.sendStatus(500);
		}
		res.render("sucess", { username: user.name });
	});
});

module.exports = router;
