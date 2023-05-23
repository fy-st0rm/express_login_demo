const express = require("express");
const router = express.Router();
const url = require("url");

const db = require("../database");

router.get("/", (req, res, next) => {
	res.render("sign_up", { result: req.query.result });
});

router.post("/", (req, res, next) => {
	var username = req.body.username;
	var password = req.body.password;

	// Searching if the username already exists or not
	db.query("select * from details where username=?;", [username], (err, results) => {
		if (err) {
			res.send(500, "Server Error");
			return;
		}

		// If the username already exists, redirect again to the signup page with error msg.
		if (results.length > 0) {
			res.redirect(url.format({
				pathname: "sign_up",
				query: {
					"result": `Username ${username} already exists.`
				}
			}));
			return;
		}

		// If its a new username, Saving into the database
		db.query("insert into details values(?, ?);", [username, password], (err, results) => {
			if (err) {
				res.send(500, "Server Error");
				return;
			}

			res.redirect(url.format({
				pathname: "/sucess",
				query: {
					"username": username
				}
			}));
		});

	});
});

module.exports = router;
