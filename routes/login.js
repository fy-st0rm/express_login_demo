require("dotenv").config();

const express = require("express");
const url = require("url");
const router = express.Router();

const db = require("../database");
const auth = require("../auth");
const jwt = require("jsonwebtoken");

const uuid = require("uuid");

router.get("/", (req, res, next) => {
	res.render("login", { result: req.query.result });
});

router.post("/", (req, res, next) => {
	var username = req.body.username;
	var password = req.body.password;

	// Quering all the details of given username
	db.query("select * from details where username=?;", [username], (err, results) => {
		if (err) {
			res.send(500, "Server Error!");
			return;
		}

		// If the username doesnt exists
		if (results.length == 0) {
			res.redirect(url.format({
				pathname: "login",
				query: {
					"result": `Username ${username} doesnt exists.`
				}
			}));
			return;
		}

		// If the password doesnt match
		let db_pass = results[0].password;
		if (password != db_pass) {
			res.redirect(url.format({
				pathname: "login",
				query: {
					"result": `Password for ${username} didnt match.`
				}
			}));
			return;
		}

		let user_id = uuid.v4();
		let user = {
			name: username,
			id: user_id
		};

		let access_token = auth.gen_access_token(user);
		let refresh_token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

		let jwt_obj = new auth.JWT_Object(access_token, refresh_token);
		req.app.get("jwt_objects")[user_id] = jwt_obj;

		res.redirect(url.format({
			pathname: "token",
			query: {
				"username": username,
				"user_id": user_id
			}
		}));
	});
});

module.exports = router;
