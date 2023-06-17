const url = require("url");
const express = require("express");
const router = express.Router();

const auth = require("../auth");

router.get("/", (req, res, next) => {
	let user_id = req.query.user_id;
	let username = req.query.username;
	res.render("token", { user_id: user_id, username: username });
});

router.post("/", (req, res, next) => {
	let user_id = req.body.user_id;
	let username = req.body.username;

	if (!user_id || !username) {
		return res.sendStatus(500);
	}

	let jwt_objects = req.app.get("jwt_objects");

	if (user_id in jwt_objects) {
		let jwt_obj = jwt_objects[user_id];

		res.header("Set-Cookie", [`jwt=${jwt_obj.access_token}`, "secure", "httpOnly", "sameSite=Lax", `user_id=${user_id}`]);
		return res.json({
			status: 200,
			link: "sucess"
		});
	}
	return res.sendStatus(500);
});

module.exports = router;
