const express = require("express");
const url = require("url");
const router = express.Router();

const db = require("../database");

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
		var db_pass = results[0].password;
		if (password != db_pass) {
			res.redirect(url.format({
				pathname: "login",
				query: {
					"result": `Password for ${username} didnt match.`
				}
			}));
			return;
		}

		res.redirect(url.format({
			pathname: "sucess",
			query: {
				"username": username
			}
		}));
	});
});

module.exports = router;
